import assert from "node:assert/strict";
import test from "node:test";
import { citations, collectOne, fetchTarget } from "./collect-sources.mjs";

test("citation inventory preserves source locations and excludes credentials/local endpoints", () => {
  const rows = citations("[a](https://example.com/a#L2)\nhttps://example.org/b.\nhttps://user:secret@example.com/private https://127.0.0.1/x https://host.local/x", "research/test.md");
  assert.deepEqual(rows, [{ url: "https://example.com/a", document: "research/test.md", line: 1 }, { url: "https://example.org/b", document: "research/test.md", line: 2 }]);
  assert.equal(fetchTarget("https://github.com/org/repo/blob/abc/src/memory.py"), "https://raw.githubusercontent.com/org/repo/abc/src/memory.py");
});

test("successful text retains a content hash but transport errors do not expose local paths", async () => {
  const result = await collectOne("https://example.org/doc", async () => new Response("public content", { headers: { "content-type": "text/plain" } }));
  assert.equal(result.status, "retrieved");
  assert.equal(result.bytes, 14);
  assert.equal(result.sha256.length, 64);
  const failed = await collectOne("https://example.org/doc", async () => { throw new Error("LOCAL_SECRET"); });
  assert.equal(failed.status, "fetch-error");
  assert.ok(!JSON.stringify(failed).includes("LOCAL_SECRET"));
});

test("blocked HTTP, binary bodies and excessive text are explicit collection outcomes", async () => {
  assert.equal((await collectOne("https://example.org/doc", async () => new Response("blocked", { status: 403 }))).status, "http-error");
  assert.equal((await collectOne("https://example.org/doc", async () => new Response("pdf", { headers: { "content-type": "application/pdf" } }))).status, "unsupported-media");
  assert.equal((await collectOne("https://example.org/doc", async () => new Response("x".repeat(2_000_001), { headers: { "content-type": "text/plain" } }))).status, "too-large");
});

test("redirects cannot send the collector to a local or authenticated endpoint", async () => {
  let calls = 0;
  const result = await collectOne("https://example.org/doc", async () => { calls++; return new Response(null, { status: 302, headers: { location: "http://localhost/private" } }); });
  assert.equal(calls, 1);
  assert.equal(result.status, "disallowed-redirect");
});
