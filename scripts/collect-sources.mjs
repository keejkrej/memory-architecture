import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MAX_BYTES = 2_000_000;

/** Inventory citations, not claims: linking a source does not establish that it was reviewed. */
export function citations(markdown, document) {
  const result = [];
  for (const match of markdown.matchAll(/https?:\/\/[^\s<>\])"`]+/g)) {
    const raw = match[0].replace(/[.,;]+$/, "");
    let url;
    try { url = new URL(raw); } catch { continue; }
    if (!publicUrl(url)) continue;
    url.hash = "";
    result.push({ url: url.href, document, line: markdown.slice(0, match.index).split("\n").length });
  }
  return result;
}

function publicUrl(url) {
  // This collector needs no authentication or access to local services.
  return url.protocol === "https:" && !url.username && !url.password && !url.port &&
    !/^(localhost|.*\.(?:local|internal)|[\d.]+|\[.*\])$/i.test(url.hostname);
}

export function fetchTarget(source) {
  const url = new URL(source);
  if (url.hostname === "github.com") {
    const parts = url.pathname.split("/");
    if (parts[3] === "blob") {
      url.hostname = "raw.githubusercontent.com";
      parts.splice(3, 1);
      url.pathname = parts.join("/");
      url.search = "";
    }
  }
  return url.href;
}

async function markdownFiles(dir) {
  const result = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    if (item.name.startsWith(".")) continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) result.push(...await markdownFiles(full));
    else if (item.name.endsWith(".md")) result.push(full);
  }
  return result.sort();
}

export async function collectOne(source, fetcher = fetch) {
  const fetchedAt = new Date().toISOString();
  const target = fetchTarget(source);
  let response;
  let url = new URL(target);
  try {
    for (let redirects = 0; redirects <= 5; redirects++) {
      if (!publicUrl(url)) return { fetchedAt, fetchUrl: target, status: "disallowed-redirect" };
      response = await fetcher(url.href, {
        redirect: "manual", signal: AbortSignal.timeout(15_000),
        headers: { "user-agent": "memory-architecture-public-source-collector/1", accept: "text/html,text/plain,application/json;q=0.9,*/*;q=0.1" },
      });
      if (response.status < 300 || response.status >= 400) break;
      const location = response.headers.get("location");
      await response.body?.cancel();
      if (!location || redirects === 5) return { fetchedAt, fetchUrl: target, status: "redirect-error", httpStatus: response.status };
      url = new URL(location, url);
    }
    const base = { fetchedAt, fetchUrl: target, finalUrl: url.href, httpStatus: response.status };
    if (!response.ok) { await response.body?.cancel(); return { ...base, status: "http-error" }; }
    const contentType = (response.headers.get("content-type") ?? "").split(";")[0];
    if (!/^(text\/|application\/(?:json|xml|xhtml\+xml))/.test(contentType)) {
      await response.body?.cancel();
      return { ...base, status: "unsupported-media", contentType };
    }
    const reader = response.body?.getReader();
    const chunks = [];
    let bytes = 0;
    if (reader) {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > MAX_BYTES) { await reader.cancel(); return { ...base, status: "too-large", contentType, limitBytes: MAX_BYTES }; }
        chunks.push(value);
      }
    }
    const body = Buffer.concat(chunks);
    return { ...base, status: "retrieved", contentType, bytes,
      sha256: createHash("sha256").update(body).digest("hex"), body };
  } catch (error) {
    // Error strings can contain host-local details; keep only an error category in public metadata.
    return { fetchedAt, fetchUrl: target, status: "fetch-error", errorKind: error?.name === "TimeoutError" ? "timeout" : "transport" };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const doFetch = args.includes("--fetch");
  const fetchNew = args.includes("--fetch-new");
  const concurrencyIndex = args.indexOf("--concurrency");
  const concurrency = concurrencyIndex < 0 ? 4 : Number(args[concurrencyIndex + 1]);
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 8) throw new Error("--concurrency must be 1..8");
  if (args.some((arg, index) => !["--fetch", "--fetch-new", "--concurrency"].includes(arg) && !(concurrencyIndex >= 0 && index === concurrencyIndex + 1))) throw new Error("Usage: node scripts/collect-sources.mjs [--fetch|--fetch-new] [--concurrency 1..8]");
  const previous = new Map();
  try {
    const old = JSON.parse(await readFile(path.join(ROOT, "source-index.json"), "utf8"));
    for (const row of old.sources ?? []) if (row.collection) previous.set(row.url, row.collection);
  } catch (error) { if (error?.code !== "ENOENT") throw error; }
  const sources = new Map();
  for (const file of await markdownFiles(ROOT)) {
    const document = path.relative(ROOT, file).split(path.sep).join("/");
    for (const citation of citations(await readFile(file, "utf8"), document)) {
      const entry = sources.get(citation.url) ?? { url: citation.url, citedBy: [] };
      if (!entry.citedBy.some((site) => site.document === document && site.line === citation.line)) entry.citedBy.push({ document, line: citation.line });
      sources.set(citation.url, entry);
    }
  }
  const entries = [...sources.values()].sort((a, b) => a.url.localeCompare(b.url));
  for (const entry of entries) if (previous.has(entry.url)) entry.collection = previous.get(entry.url);
  if (doFetch || fetchNew) {
    const cache = path.join(ROOT, ".cache", "source-pages");
    await mkdir(cache, { recursive: true });
    let next = 0, completed = 0;
    const pending = doFetch ? entries : entries.filter((entry) => !entry.collection);
    await Promise.all(Array.from({ length: concurrency }, async () => {
      while (next < pending.length) {
        const entry = pending[next++];
        const { body, ...collection } = await collectOne(entry.url);
        entry.collection = collection;
        if (body) await writeFile(path.join(cache, `${collection.sha256}.body`), body);
        completed++;
        if (completed % 25 === 0 || completed === pending.length) process.stderr.write(`Collected ${completed}/${pending.length} sources\n`);
      }
    }));
  }
  const counts = {};
  for (const entry of entries) { const status = entry.collection?.status ?? "not-fetched"; counts[status] = (counts[status] ?? 0) + 1; }
  await writeFile(path.join(ROOT, "source-index.json"), `${JSON.stringify({
    schemaVersion: 1, generatedAt: new Date().toISOString(),
    scope: "Public citation inventory. Retrieval success does not verify claims, grant redistribution rights, or imply that a page is substantive rather than a challenge/login response. Cached bodies remain local and git-ignored.",
    counts, sources: entries,
  }, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ sources: entries.length, counts })}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await main();
