# Public implementations of personal-assistant memory

Observation date: **2026-10-12 UTC**. This extension separates actual public implementations from resemblance to closed assistants. It adds twelve implementations to the landscape; OpenClaw is the comparison anchor already examined in the [consumer and coding report](consumer-and-coding-agents.md#8-openclaw-inspectable-personal-agent-memory-with-trust-aware-consolidation). Six implementations receive focused source audits below, one receives a smaller source check, and five are explicitly documentation-only for memory mechanics. Public repositories were downloaded and read; their application code was **not executed**. No benchmark results or end-to-end security guarantees are claimed.

The useful result is a small set of distinct mechanisms: approval-gated fact updates, chronological archive-to-profile consolidation, linked-file navigation, scoped retrieval with decay/diversity, snapshot-versus-live prompt memory, and durable task handoffs. Implementing every similarly named assistant would mostly duplicate these mechanisms.

## What “open implementation” means here

- **Official project source:** maintained by the named project's own organization or author. This establishes its own implementation, not affiliation with another vendor.
- **Community-inspired alternative:** the project explicitly names another product as an inspiration or reference. This is evidence of intent, not proof of architectural equivalence.
- **Wrapper/orchestrator:** it supplies UI, storage, tools, or task management around another harness or model service. Inspect that boundary before attributing the underlying agent's memory to the wrapper.
- **No proven clone relationship:** useful behavioral overlap exists, but the inspected sources do not establish a faithful clone or shared internals.

The closed-product behaviors in the next table come from the [consumer report](consumer-and-coding-agents.md); the public implementation mechanics come from the pinned evidence below. The mapping is an engineering comparison, **not a claim that ChatGPT, Claude, Gemini, Muse, or Grok Bot uses these algorithms**.

| Closed/product behavior to study | Public implementation | Ownership / relationship | Mechanism worth comparing |
|---|---|---|---|
| Editable personal facts reused in later work; visible autonomous tasks | **OpenMuse** | Official CopilotKit project source; independent application with service dependencies. No closed Muse implementation relationship proven. | Explicit fact records plus whole-list task injection; separate durable task state, evidence, approvals, and receipts. [Source][om-readme], [writer][om-conversation], [reader][om-model] |
| User-reviewed saved memories; bots with shared personal context and separate local facts | **Eidon-AI** | Official author repository; its computer design explicitly references Grok Bot. Community-inspired application, not xAI source. | Proposed CRUD with approval and stale-target checks; pinned + recent + semantic selection; global and bot-local scopes. [Reference design][ei-design], [proposals][ei-proposals], [recall][ei-recall] |
| Background consolidation resembling a consumer assistant's “dreaming” behavior | **nanobot** | Official HKUDS project; describes itself as lightweight OpenClaw. No ChatGPT internals relationship. | Session checkpoint → cursor journal → scheduled focused edits of profile, facts, and skills → Git history. [Overview][nb-readme], [implementation][nb-memory] |
| Persistent coding/personal-agent context across compaction and provider changes | **NanoClaw** | Official NanoClaw repository; an OpenClaw alternative that integrates provider harnesses. Not Anthropic memory source. | Two bootstrap files plus a linked Markdown concept tree; providers invoke a shared fresh-context hook. [Project lineage][nc-readme], [memory contract][nc-doc], [hook][nc-hook] |
| Selective cross-session recall with scope and freshness controls | **ZeroClaw** | Official ZeroClaw Labs source; independent assistant infrastructure. No closed-service clone established. | Keyed durable entries; hybrid store; origin-sensitive recall, category filters, decay or optional diversity reranking, hard context budgets. [Store][zc-sqlite], [injection][zc-inject] |
| Prompt memory plus searchable notes, and continuous versus stable session views | **Moltis** | Official Moltis source; OpenClaw-related implementation, not a closed assistant disclosure. | Independent read/write/export controls; live or frozen prompt memory; pre-compaction writes and recoverable file mutations. [Surfaces][mo-surfaces], [flush][mo-flush], [writer][mo-tools] |
| Searchable personal workspace retained across sessions | **IronClaw** | Official NEAR AI source; README explicitly calls it OpenClaw-inspired. Memory depth here is **docs-only**. | Path-addressed documents, write/read/tree tools, documented hybrid full-text/vector search. [Overview][ic-readme], [memory docs][ic-memory] |
| Small always-available assistant with file-backed continuity | **PicoClaw** | Official Sipeed source; explicitly inspired by nanobot. Memory depth here is **docs-only**. | Durable `MEMORY.md` separate from sessions; mtime-based refresh; per-turn history and system-context switches. [Lineage][pc-readme], [configuration][pc-config] |
| Background personal knowledge-base evolution | **QwenPaw, formerly CoPaw** | Official AgentScope project; current CoPaw URL redirects to QwenPaw. Memory depth here is **docs-only**. | Current README describes working context, verbatim history, and ReMe-backed linked Markdown knowledge. This is the 2.0 rewrite, not proof of an old CoPaw mechanism. [Pinned overview][qp-readme] |
| Cowork-style GUI around multiple coding/personal agents | **AionUi** | Official project source; explicitly marketed as a Claude Cowork alternative, with a built-in agent and external-agent adapters. **Wrapper/orchestrator**, docs-only here. | Per-conversation history and conversation-bound schedules; external harness memories must be inventoried separately. [Overview][ai-readme] |
| Chat assistant combining personal facts and document retrieval | **Khoj** | Official Khoj project source; independent “second brain,” no closed clone relationship proven. **Limited source check** here. | Recent facts union semantic facts; embedded database records; turn-pair backfill with model-directed create/delete. [Overview][kh-readme], [adapters][kh-adapters], [backfill][kh-backfill] |
| ChatGPT-style personalization with editable memory tools | **Open WebUI** | Official project source, but current license has a branding condition; **source-available with additional terms**, not presented here as unqualified permissive OSS. Memory depth is **docs-only**. | `user`/`context` types, path-organized memory tools, independent prompt injection, optional background review. [Memory documentation][ow-memory], [license][ow-license] |

OpenClaw itself is an **official OSS implementation of OpenClaw**. Its successors and alternatives mostly derive from an already public assistant, rather than independently recovering a closed product. Its inspected provenance gates, consolidation stages, and recall escalation are described [in the existing audit](consumer-and-coding-agents.md#8-openclaw-inspectable-personal-agent-memory-with-trust-aware-consolidation). NanoClaw and nanobot are distinct projects, despite similar names.

## Version and license ledger

The hash identifies the exact inspected code or documentation snapshot. A repository license does not license a hosted model, hosted thread service, third-party content, or every optional dependency. These are observed license labels and boundaries, not legal advice.

| Project | Inspected commit | Inspection depth | License at that snapshot |
|---|---|---|---|
| OpenMuse | `1ac68f3909f2478ab6280883f1ab5ea65eb5719d` | Memory writer, reader, routes, schema; deployment boundary | [MIT][om-license]; CopilotKit Intelligence separately licensed/service-operated. [Boundary][om-threads] |
| Eidon-AI | `1388ffb85739ae4f396ac98703427b1b478752ec` | Memory CRUD, proposals, selector, prompt builder, semantic scope | [AGPL-3.0-only declaration][ei-readme], [license][ei-license] |
| nanobot | `cd2a863710ed4be21ba5426e71321fef6c05ad3d` | Archive/store, Dream prompt/tools, scheduler, context loading | [MIT][nb-license] |
| NanoClaw | `ab09973a8037a2bff568bc169128bfc2104c51ad` | File reader, session hook, scaffold and format documentation | [MIT][nc-license] |
| ZeroClaw | `6c0b1f9eeace7b40b410c0be95b96f8a09faf1ee` | Store tool, selected SQLite paths, injection, decay, reranking | [MIT][zc-license] or [Apache-2.0][zc-apache] |
| Moltis | `1f6d28ea750d6654d52d5899b8be67727ebf7a19` | Memory writer/deletion, silent turn, hybrid merge; policy docs | [MIT][mo-license] |
| IronClaw | `b0b999d96781516ee05e6ba961d6f3ead900da96` | Documentation and license; no implementation audit claimed | [MIT or Apache-2.0][ic-readme] |
| PicoClaw | `bbf6893ca7afad27f1d00a0f5a45982a549c6ed6` | README/configuration/license only | [MIT][pc-license] |
| QwenPaw | `02b6a6d088e37192934645cbc0876114bb9e98ae` | README/license only | [Apache-2.0][qp-license] |
| AionUi | `6744099b279b991c17e31c243f0920477bd31cb6` | README/license only | [Apache-2.0][ai-license] |
| Khoj | `ae229ca894c0b80ad84664afcfdde523b5e87057` | Memory adapters and backfill command; not all runtime paths | [AGPL-3.0][kh-license] |
| Open WebUI | `f8ae8a6c328946dc62cd0712961a0632574581bf` | Pinned README/license; mutable official memory docs | [Open WebUI License][ow-license] plus historical component terms; branding condition has exceptions |

The nanobot commit's local timestamp is October 13 in UTC+08; its UTC timestamp is October 12. Snapshot dates are not release-version equivalence.

## Six focused source audits

### 1. OpenMuse: explicit facts and task continuity are different stores

**Input/write.** The chat runtime exposes `remember_fact(text)` with a 2,000-character input limit. Its tool description asks for a preference explicitly supplied or confirmed by the user. The implementation stores `{id, text, source, createdAt}` using owner-scoped `insertIfAbsent`; the source label is a fixed chat-confirmation string, not a citation back to the originating message. The UI/API path can create, change, and forget records, with a separate 4,000-character text limit. The inspected tool path does not itself open a human approval proposal for a fact write: the natural-language consent criterion is a model instruction. **Source-verified.** [Chat tool][om-conversation], [routes][om-routes], [type][om-domain]

**Read.** At delegated-task model construction, the code lists that owner's memories and serializes every record's text and source into personal context alongside task state, evidence, and artifact IDs. No semantic ranking or query-conditioned selection appears in this inspected reader. Conversational `agent_status` can also return the owner's workspace snapshot. This is a transparent explicit-fact baseline; it should not be labeled a vector-memory algorithm. **Source-verified.** [Task prompt][om-model], [workspace snapshot][om-service]

**Lifecycle/handoff.** The application keeps plans, task status, evidence, artifacts, input requests, and external-action reviews separately. Its README documents SQL task leases and recovery, while the inspected task prompt distinguishes approved prior results from unfinished work. This separation makes it useful for studying handoffs: a worker can carry memory plus current task state without treating a saved preference as authorization to send an email. The complete task scheduler was not audited here. **Source-verified prompt; documented scheduler.** [Task prompt][om-model], [application contract][om-readme]

**Openness/privacy boundary.** The application is MIT, but the current thread path requires a CopilotKit Intelligence project key, and the documentation explicitly says Intelligence is not included in that license. Owner-scoped application records, hosted thread retention, persistent browser profiles, model requests, and optional search therefore have separate data lifecycles. Deleting a fact record does not establish deletion of chat history or earlier task copies. A provider-independent replay of the small fact reader is achievable; a fully self-contained reproduction of every advertised surface is not established by this repository alone. **Documented boundary; inference about replay scope.** [Rich Threads][om-threads], [deployment/data flow][om-readme]

### 2. Eidon-AI: reviewed CRUD plus pinned/recent/semantic retrieval

**Input/write.** Agent memory calls create pending message actions containing proposed create/update/delete payloads. They do not directly mutate durable memory. Approval can include user-edited content/category; update/delete approval verifies that the live target still has the content and category captured in the proposal. A stale or deleted target is rejected. Dismissal completes the proposal without applying the change. These checks are visible in code, but this audit does not claim serializable isolation across every concurrent request. **Source-verified.** [Tool execution][ei-tools], [approval application][ei-proposals]

**Representation/scope.** SQLite `user_memories` records have content, category, pin status, timestamps, owner, and optional bot scope. Prompt collection combines user-global records with the current bot's records. A bot-local record is not automatically visible to every other bot; global personal facts are intentionally shared within the user's bot context. Creates/content updates enqueue semantic indexing. The memory guidance asks the model to save durable information about the user and avoid current task state, secrets, and duplicate instructions; those are prompt rules, distinct from the approval code. **Source-verified.** [CRUD/scope][ei-memories], [guidance][ei-guidance]

**Read algorithm.** If semantic recall is available and the eligible corpus has at most 35 records, all are selected. Otherwise selection is the union of:

1. Every pinned record.
2. The ten most recently updated records.
3. Up to 25 additional distinct records from semantic chunk scoring, with up to 100 scored chunks requested and IDs checked against the live eligible records.

The final list follows the existing memory ordering, not semantic rank order. The semantic query uses the latest visible user message. The prompt builder inserts the selected facts and the memory policy. If semantic selection is unavailable or fails, this path falls back to the full eligible memory list; therefore “25 nearest facts” is an inaccurate description of the default failure behavior, and the selection size is not strictly bounded by 35 because all pins are kept. A later emergency context-budget fallback can omit the personal-memory block entirely. **Source-verified.** [Selector][ei-recall], [prompt construction/fallback][ei-compaction], [semantic scope/scoring][ei-semantic]

**Lifecycle/privacy.** Delete removes the scoped durable row; earlier messages, proposals, compaction summaries, and backups are separate surfaces whose complete erasure was not audited. The fact scope is not a browser/computer isolation proof. The project's Grok Bot reference concerns its computer design and does not establish that its memory pipeline matches Grok Bot. **Source-verified deletion; explicit audit limit.** [CRUD][ei-memories], [reference design][ei-design]

**Replay value.** This is the strongest additional candidate for comparing human-reviewed learning with autonomous extraction. Record approval delay, rejection/edit rate, staleness rejections, and how long a correction takes to become retrievable. Reproduce the full-list fallback as its own configuration rather than silently substituting a different bounded retriever. **Proposed experiment.**

### 3. nanobot: compaction archive, incremental Dream, and auditable edits

**Input/write stages.** Session compaction creates a replacement checkpoint and stores a history summary with a monotonic cursor, timestamp, content, and optional session key. The archive prompt preserves a working handoff and distinguishes permanent, durable, ephemeral, and correction candidates. These marks are model-produced routing hints. Full saved session history and the prompt-visible checkpoint remain distinct from cross-session durable files. **Source-verified.** [Archiver/store][nb-memory], [archive prompt][nb-archive]

Dream consumes unprocessed history after its saved cursor. The inspected default builder selects at most 20 records and truncates each record's content to 1,000 characters before assembling its prompt. The normal agent context supplies existing durable files. Its restricted tools can read the workspace and edit `SOUL.md`, `USER.md`, `memory/MEMORY.md`, and workspace skills. The prompt routes personality/workflow to `SOUL.md`, user facts to `USER.md`, project knowledge to `MEMORY.md`, and sufficiently repeated concrete procedures to skills. It asks for corrections in place, duplicate merging, and selective stale-item removal. **Source-verified implementation and prompts, not proof of model compliance.** [Batch/tools][nb-memory], [Dream instructions][nb-dream], [context reader][nb-context]

**Lifecycle.** The gateway's scheduled Dream branch advances the cursor only for a normally completed run; it may advance even when no durable content changes. In a `finally` block it attempts to commit working-tree changes, compacts the history journal, and prunes ephemeral Dream sessions. Thus partial edits are not automatically rolled back merely because the run did not complete; unfinished input remains eligible for retry. Git review/restore is a different operation from transactional rollback. **Source-verified.** [Scheduled runner][nb-gateway]

The journal's default retention target is 1,000 entries. Pruning removes old processed entries but preserves all pending Dream input even when it exceeds the target. It is therefore **not a permanent append-only archive**. The old `HISTORY.md` + immediate `MEMORY.md` descriptions are historical and should not be used for this commit. The gateway scheduler and a standalone SDK instance also have different scheduling behavior. **Source-verified retention; documented deployment behavior.** [Retention code][nb-memory], [memory contract][nb-doc]

**Read/scope/privacy.** `MEMORY.md` is directly included when memory context is enabled; the user/persona files enter bootstrap context. A new chat or selected project does not create a separate durable-memory namespace. The documentation requires separate agent workspaces/instances when identity and memory must be isolated. Git versions, raw saved sessions, and journal summaries create additional retention locations. **Source-verified reader; documented scope.** [Context][nb-context], [scope/restore documentation][nb-doc]

**Replay value.** Implement two stages with independent clocks and costs: checkpoint extraction followed by delayed consolidation. Test a query between those stages, a correction outside the 1,000-character summary prefix, an incomplete edit followed by retry, and whether a repeated workflow becomes a skill while a one-off repair remains episodic. Preserve the batch and cursor rules when claiming component fidelity. **Proposed experiment.**

### 4. NanoClaw: navigation over portable concept files

**Storage/write.** Each agent group has a Markdown memory tree. `index.md` contains core facts and links; `system/definition.md` describes how the agent should maintain memory. Durable concepts are intended to occupy separate Markdown files with type frontmatter under Open Knowledge Format v0.1. The docs explicitly describe this as a convention, not an admission validator. Ordinary agent file tools and human edits perform the writes; the scaffold only creates missing files. **Documented format; selected loader/scaffold source inspected.** [Memory contract][nc-doc], [scaffold][nc-scaffold]

**Read.** The shared session-start hook injects exactly the top-level index and the memory-system definition when the source is startup, clear, or compact. It injects nothing on resume because that context already contains them. Each file is capped at 16,000 characters, with a truncation notice; deeper recall requires following links and reading files. This loader does not perform embedding search or automatic semantic fact extraction. The documented provider integration uses the shared hook and on-disk format. **Source-verified hook and reader; documented provider integration.** [Hook][nc-hook], [reader][nc-context], [contract][nc-doc]

**Lifecycle/privacy.** Fixing a durable fact means editing/deleting text and maintaining its index links; a fresh context sees the revised bootstrap. An existing resumed context can still contain an older copy. Group storage and container mounts define the documented scope; this inspection did not audit every provider's cross-group access. The editable `system/definition.md` is itself behavioral guidance, so a contaminated memory tree can affect future write policy as well as facts. That is a useful test case, not a demonstrated exploit. **Documented scope; inference from injection mechanism.** [Contract][nc-doc], [reader][nc-context]

**Replay value.** A small linked-file baseline tests whether good organization can compete with retrieval infrastructure. Charge the agent for index reading and follow-up file reads. Test stale index links, a relevant concept absent from the bootstrap prefix, and a provider switch. Do not add a vector search layer and keep calling the result the exact NanoClaw reader. **Proposed experiment.**

### 5. ZeroClaw: keyed facts and an explicit retrieval policy

**Write/store.** `memory_store` takes a key, content, and category (`core`, `daily`, `conversation`, or custom), defaults to `core`, and passes through a tool-operation policy check. The inspected SQLite store maintains text and vector retrieval structures and uses an `(agent_id, key)` conflict target for updates. An embedding failure can still persist the durable row without a vector. Selected store paths, rather than every plugin backend, were inspected. **Source-verified.** [Store tool][zc-tool], [SQLite][zc-sqlite]

**Read/injection.** The turn-engine reader queries the configured memory backend using the raw user message and eligible session scopes, deduplicates results by key, and applies origin rules. Nested subturns skip this injection. Scheduled origins exclude conversation-category entries; unscoped interactive/direct turns also exclude them. The renderer filters autosaved transcript/history/tool-payload forms and caps the default block to four entries, 800 characters per entry, and 4,000 characters overall. Recall failures do not fail the main turn. **Source-verified.** [Unified injection][zc-inject]

There are two distinct scoring arms. The default arm applies `score × exp(-ln(2) × age_days / 7)` to non-core entries, with core entries exempt. This modifies relevance scores; it is not storage deletion, and this renderer does not re-sort on that arm after decay. The optional rerank arm overfetches a bounded pool, blends retrieval/importance/recency, applies eligibility before duplicate removal, collapses exact and near duplicates using order-sensitive shingles, optionally diversifies with MMR, then thresholds and trims. Reranking is disabled in the inspected default injection config. **Source-verified.** [Decay][zc-decay], [reranker][zc-rerank], [wiring/defaults][zc-inject]

**Lifecycle caveat.** The repository contains an ADR separating conversation history, curated memory, and derivative enrichment, but that ADR is explicitly **proposed** with acceptance gates. Its desired absence of duplicate transcript authority must not be reported as universally implemented. Actual origin/category filters are a narrower verified property. Agent/session scoping also remains dependent on backend/wrapper configuration; this was not a comprehensive multitenancy audit. [Proposed ADR][zc-adr], [implemented reader][zc-inject]

**Replay value.** Compare the unchanged default decay arm with the optional rerank arm, including candidate overfetch and order-sensitive deduplication. Use temporal events, conflicting directional facts, repeated transcript text, and scheduled versus interactive queries. A generic vector top-k baseline misses the distinctive policy. **Proposed experiment.**

### 6. Moltis: separate read, write, export, and snapshot lifecycles

**Memory surfaces.** Documentation distinguishes per-session structured state, managed user profile, agent prompt memory, searchable memory, managed files, attachments, and sandbox files. Managed files are not automatically ingested into memory. Config controls four independent concerns: prompt/search style, agent write targets, session export, and managed-profile writes. Prompt memory can reload each turn or be frozen into session state at the first load. The latter intentionally allows a session to keep an older memory snapshot until refreshed. **Documented behavior.** [Surface contract][mo-surfaces]

**Write.** The source provides silent memory extraction turns, including a pre-compaction flush, with restricted memory-file writing. The agent-scoped writer validates permitted targets and size, creates a checkpoint, appends or overwrites the file, and asks the memory runtime to re-index it. A re-index failure logs a warning while the file write remains durable. This gives a concrete separation between source-of-truth success and derivative-index freshness. **Source-verified.** [Silent turns][mo-flush], [writer][mo-tools]

**Read.** Search results carry file and line provenance. The built-in backend can fuse vector and keyword results by weighted scores or reciprocal-rank fusion, deduplicated by chunk ID. The latter computes `sum(weight / (k + rank + 1))` using zero-based source ranks. Keyword-only search remains available without embeddings. Optional QMD/zvec backends and LLM reranking are documented but were not fully audited here. **Source-verified merge; documented optional backends.** [Merge implementation][mo-search], [backend docs][mo-doc]

**Delete/recovery.** The scoped delete path checkpoints first and either deletes a file or removes exact text. It then removes the file from the index or resynchronizes the changed content. That is stronger than deleting only a retrieval hit, but the checkpoint intentionally retains a preimage. Frozen prompt snapshots, saved sessions, exported transcripts, and backups remain separate retention surfaces. **Source-verified file/index mutation; documented snapshots/export.** [Deletion code][mo-tools], [surface contract][mo-surfaces]

**Replay value.** Treat `live-reload` versus `frozen-at-session-start` as an explicit experimental factor. Test the same correction in two concurrently active sessions, source-write success with index failure, and deletion while an older snapshot exists. These are lifecycle experiments; simply running another Markdown RAG assistant would not expose them. **Proposed experiment.**

## Additional coverage and what remains unverified

**Khoj has more than document RAG.** The inspected adapter stores embedded user memories. Its recent-memory lane defaults to ten records updated within seven days, ordered by creation time; its semantic lane uses cosine distance and a configured threshold. A memory-generation command walks user/assistant turn pairs, unions recent and semantic results by ID, then applies model-generated create/delete decisions. This verifies a runnable backfill path, not the cadence of every live runtime path. For non-default agents, these adapter reads filter by that agent; the default/general branch filters only by user, so it should not be described as strict isolation from every custom-agent memory. [Adapters][kh-adapters], [backfill][kh-backfill]

**IronClaw is a documented database-backed workspace candidate.** The product docs expose search/write/read/tree operations and durable path-addressed documents. The internal Reborn memory contract describes tenant/user/agent/project scope and provider interfaces, but is marked a contract-freeze draft. This report therefore does not promote all its scope and storage targets to verified live guarantees. It is a strong next audit if database-backed document memory and host-controlled capability boundaries matter. [Product memory][ic-memory], [draft contract][ic-contract]

**PicoClaw is a lighter file-memory comparator, not evidence of a novel memory algorithm.** The pinned configuration docs establish separate session history and durable memory, automatic mtime detection for prompt files, and independently disabling history or default system context for a turn. The README's hardware/RAM claims are vendor statements and are intentionally not used as memory-quality evidence. The implementation of long-term extraction, optional backends, and deletion was not inspected here. [Configuration][pc-config], [README][pc-readme]

**QwenPaw is the current CoPaw lineage.** Its pinned README identifies a July 2026 AgentScope 2.0 rewrite, ReMe v0.4 personal knowledge base, and three memory layers. Agent memory and skills are described as independent per agent, with shared runtime surfaces across console/TUI/channels. The runtime's exact write schedule, conflict semantics, provenance, and forget coverage remain unverified here; do not import behavior from an older CoPaw article or from every ReMe mode. [Pinned README][qp-readme]

**AionUi is primarily useful as a harness-boundary case.** Its own documentation establishes separate conversation histories and scheduling into an existing conversation, while it can run a built-in agent or connect external CLIs. “Independent memory” on that page does not establish an automatically learned user profile or one common cross-provider memory engine. Its comparison table contains mutable claims about Claude Cowork; those claims are not adopted here as current facts about Claude. Local SQLite storage also does not imply that model requests remain local. [Pinned README][ai-readme]

**Open WebUI's current memory docs are richer than its older “experimental memory” descriptions.** They describe `user` and `context` records, optional paths, model-managed add/replace/move/remove tools, separately controlled system-context injection, and optional background review every ten turns by default when enabled. Background review is off by default; injection budgets default to 2,000 characters for each type. Permission removal blocks memory endpoints, tools, and injection. These are first-party documentation claims, not a source audit or permission test. Its current license preserves prior component licenses and imposes a branding condition with stated exceptions. [Memory docs][ow-memory], [configuration][ow-config], [license][ow-license]

Dify, LibreChat, Leon, and Open Interpreter remain sensible breadth candidates, but are not given superficial algorithm rows here. Distinguishing conversation buffers, document RAG, tool execution, and learned personal memory would require their own pinned audit. Hermes, nanoMuse, and OpenBot are handled by the companion research; repeating them here would obscure the additional mechanisms.

## Selective replay implementation plan

These are proposed adapters, not completed benchmarks. Use the existing [common replay protocol](consumer-and-coding-agents.md#12-a-common-replay-protocol-that-preserves-the-differences), with public or synthetic events and the same source stream across variants. Preserve source ownership and current-input precedence. A human-review variant needs a declared approval policy; supplying perfect approvals for free would give it an unfair information advantage.

| Priority / candidate | Minimal runnable mechanism | Why it adds a distinct comparison | Fidelity limit |
|---|---|---|---|
| **1 — `reviewed-facts-eidon-inspired`** | Proposal queue; optional user edits/dismissal; stale-target content/category check; global + bot facts; pinned/recent/semantic union and full-list fallback | Tests write authority and review delay, not just extraction quality | Keep human response policy explicit; database concurrency and UI are simplified |
| **1 — `archive-dream-nanobot-inspired`** | Checkpoint prompt; cursor journal; 20-entry/1,000-character Dream batch; restricted file edits; normal-completion cursor advance; version log | Tests delayed consolidation, correction routing, and procedural promotion | Actual models, gateway scheduling, file tools, and Git behavior must be pinned for full component reproduction |
| **1 — `linked-files-nanoclaw-inspired`** | Core index + editable definition; 16k-character cap per bootstrap file; fresh-window-only injection; linked concept reads | Low-infrastructure baseline for navigation and portable memory | Agent tool-use quality and provider session hooks differ |
| **2 — `scoped-recall-zeroclaw-inspired`** | Keyed facts; origin/category filters; default decay arm versus optional overfetch/blend/shingle-dedup/MMR; render caps | Isolates retrieval policy, temporal freshness, and duplicate contamination | Backend retrieval and lifecycle wrappers are separately declared |
| **2 — `memory-snapshot-moltis-inspired`** | Same source/index state with live reload versus session snapshot; checkpoint-before-mutation; index-failure flag | Tests stale context, derivative index lag, and recoverable deletion | Snapshot persistence and recovery internals are simplified |
| **3 — `explicit-facts-task-handoff-openmuse-inspired`** | Explicit facts plus separately persisted task state/evidence/approvals/receipts; all eligible facts in task context | Measures memory-to-work handoff rather than personal recall alone | Does not reproduce CopilotKit Intelligence or the full task/computer runtime |

Implement the first three before adding another similar vector store. Add ZeroClaw when retrieval policy is the question, Moltis when lifecycle and concurrent sessions are the question, and OpenMuse when interrupted work/handoffs are the question. This ordering is an engineering recommendation based on distinctness and implementation scope, not an empirical ranking.

For every run retain: source commit, effective settings, writer/reader model, embedding model, event and observation time, memory scope, proposal decisions, write/read token counts, retrieved IDs, version changes, failed tool/index operations, and final answers. Score unsupported durable claims, correction latency, scope leakage, missed evidence, stale snapshot use, re-ingestion after forgetting, review effort, and downstream task success separately. No project in this report has been tested under that protocol yet.

## Privacy and ownership checks for the experiment

Local storage, local inference, and isolated audiences are independent properties. A local file can still be sent to an external model or embedding endpoint; an externally hosted thread service can retain context separately from an application's local database. The observed project-specific boundaries are recorded above. The experiment should separately record each derivative copy—raw session, checkpoint, durable fact/file, index, version preimage, session snapshot, and handoff artifact—so a delete assertion names what was actually removed.

Likewise, a relevance score does not grant authority. A quoted web instruction, a private user fact, a task approval, and an agent-generated summary should retain different source labels. The replay must not repair a project's missing provenance by silently adding labels it never stores: report native behavior and an explicitly named hardened variant separately. These are experimental design requirements, not claims that the inspected projects all implement the same security model.

## Primary source links

[om-readme]: https://github.com/CopilotKit/openmuse/blob/1ac68f3909f2478ab6280883f1ab5ea65eb5719d/README.md
[om-license]: https://github.com/CopilotKit/openmuse/blob/1ac68f3909f2478ab6280883f1ab5ea65eb5719d/LICENSE
[om-threads]: https://github.com/CopilotKit/openmuse/blob/1ac68f3909f2478ab6280883f1ab5ea65eb5719d/docs/RICH-THREADS.md
[om-conversation]: https://github.com/CopilotKit/openmuse/blob/1ac68f3909f2478ab6280883f1ab5ea65eb5719d/apps/server/src/engine/conversation.ts
[om-model]: https://github.com/CopilotKit/openmuse/blob/1ac68f3909f2478ab6280883f1ab5ea65eb5719d/apps/server/src/engine/model.ts
[om-routes]: https://github.com/CopilotKit/openmuse/blob/1ac68f3909f2478ab6280883f1ab5ea65eb5719d/apps/server/src/engine/routes.ts
[om-domain]: https://github.com/CopilotKit/openmuse/blob/1ac68f3909f2478ab6280883f1ab5ea65eb5719d/packages/domain/src/agent.ts
[om-service]: https://github.com/CopilotKit/openmuse/blob/1ac68f3909f2478ab6280883f1ab5ea65eb5719d/apps/server/src/engine/service.ts
[ei-readme]: https://github.com/Quack6765/Eidon-AI/blob/1388ffb85739ae4f396ac98703427b1b478752ec/README.md
[ei-license]: https://github.com/Quack6765/Eidon-AI/blob/1388ffb85739ae4f396ac98703427b1b478752ec/LICENSE
[ei-design]: https://github.com/Quack6765/Eidon-AI/blob/1388ffb85739ae4f396ac98703427b1b478752ec/docs/plans/agent-computer-analysis.md
[ei-proposals]: https://github.com/Quack6765/Eidon-AI/blob/1388ffb85739ae4f396ac98703427b1b478752ec/lib/memory-proposals.ts
[ei-recall]: https://github.com/Quack6765/Eidon-AI/blob/1388ffb85739ae4f396ac98703427b1b478752ec/lib/memory-recall.ts
[ei-tools]: https://github.com/Quack6765/Eidon-AI/blob/1388ffb85739ae4f396ac98703427b1b478752ec/lib/tool-executors.ts
[ei-memories]: https://github.com/Quack6765/Eidon-AI/blob/1388ffb85739ae4f396ac98703427b1b478752ec/lib/memories.ts
[ei-guidance]: https://github.com/Quack6765/Eidon-AI/blob/1388ffb85739ae4f396ac98703427b1b478752ec/lib/memory-guidance.ts
[ei-compaction]: https://github.com/Quack6765/Eidon-AI/blob/1388ffb85739ae4f396ac98703427b1b478752ec/lib/compaction.ts
[ei-semantic]: https://github.com/Quack6765/Eidon-AI/blob/1388ffb85739ae4f396ac98703427b1b478752ec/lib/semantic-index.ts
[nb-readme]: https://github.com/HKUDS/nanobot/blob/cd2a863710ed4be21ba5426e71321fef6c05ad3d/README.md
[nb-license]: https://github.com/HKUDS/nanobot/blob/cd2a863710ed4be21ba5426e71321fef6c05ad3d/LICENSE
[nb-memory]: https://github.com/HKUDS/nanobot/blob/cd2a863710ed4be21ba5426e71321fef6c05ad3d/nanobot/agent/memory.py
[nb-archive]: https://github.com/HKUDS/nanobot/blob/cd2a863710ed4be21ba5426e71321fef6c05ad3d/nanobot/templates/agent/consolidator_archive.md
[nb-dream]: https://github.com/HKUDS/nanobot/blob/cd2a863710ed4be21ba5426e71321fef6c05ad3d/nanobot/templates/agent/dream.md
[nb-context]: https://github.com/HKUDS/nanobot/blob/cd2a863710ed4be21ba5426e71321fef6c05ad3d/nanobot/agent/context.py
[nb-gateway]: https://github.com/HKUDS/nanobot/blob/cd2a863710ed4be21ba5426e71321fef6c05ad3d/nanobot/cli/gateway_runtime.py
[nb-doc]: https://github.com/HKUDS/nanobot/blob/cd2a863710ed4be21ba5426e71321fef6c05ad3d/docs/memory.md
[nc-license]: https://github.com/nanocoai/nanoclaw/blob/ab09973a8037a2bff568bc169128bfc2104c51ad/LICENSE
[nc-doc]: https://github.com/nanocoai/nanoclaw/blob/ab09973a8037a2bff568bc169128bfc2104c51ad/docs/memory.md
[nc-scaffold]: https://github.com/nanocoai/nanoclaw/blob/ab09973a8037a2bff568bc169128bfc2104c51ad/container/agent-runner/src/memory/scaffold.ts
[nc-hook]: https://github.com/nanocoai/nanoclaw/blob/ab09973a8037a2bff568bc169128bfc2104c51ad/container/agent-runner/src/memory/session-hook.ts
[nc-context]: https://github.com/nanocoai/nanoclaw/blob/ab09973a8037a2bff568bc169128bfc2104c51ad/container/agent-runner/src/memory/context.ts
[zc-license]: https://github.com/zeroclaw-labs/zeroclaw/blob/6c0b1f9eeace7b40b410c0be95b96f8a09faf1ee/LICENSE-MIT
[zc-apache]: https://github.com/zeroclaw-labs/zeroclaw/blob/6c0b1f9eeace7b40b410c0be95b96f8a09faf1ee/LICENSE-APACHE
[zc-tool]: https://github.com/zeroclaw-labs/zeroclaw/blob/6c0b1f9eeace7b40b410c0be95b96f8a09faf1ee/crates/zeroclaw-tools/src/memory_store.rs
[zc-sqlite]: https://github.com/zeroclaw-labs/zeroclaw/blob/6c0b1f9eeace7b40b410c0be95b96f8a09faf1ee/crates/zeroclaw-memory/src/sqlite.rs
[zc-inject]: https://github.com/zeroclaw-labs/zeroclaw/blob/6c0b1f9eeace7b40b410c0be95b96f8a09faf1ee/crates/zeroclaw-runtime/src/agent/memory_inject.rs
[zc-decay]: https://github.com/zeroclaw-labs/zeroclaw/blob/6c0b1f9eeace7b40b410c0be95b96f8a09faf1ee/crates/zeroclaw-memory/src/decay.rs
[zc-rerank]: https://github.com/zeroclaw-labs/zeroclaw/blob/6c0b1f9eeace7b40b410c0be95b96f8a09faf1ee/crates/zeroclaw-memory/src/rerank.rs
[zc-adr]: https://github.com/zeroclaw-labs/zeroclaw/blob/6c0b1f9eeace7b40b410c0be95b96f8a09faf1ee/docs/book/src/architecture/decisions/ADR-010-memory-authority-boundaries.md
[mo-license]: https://github.com/moltis-org/moltis/blob/1f6d28ea750d6654d52d5899b8be67727ebf7a19/LICENSE.md
[mo-surfaces]: https://github.com/moltis-org/moltis/blob/1f6d28ea750d6654d52d5899b8be67727ebf7a19/docs/src/memory-surfaces.md
[mo-flush]: https://github.com/moltis-org/moltis/blob/1f6d28ea750d6654d52d5899b8be67727ebf7a19/crates/agents/src/silent_turn.rs
[mo-tools]: https://github.com/moltis-org/moltis/blob/1f6d28ea750d6654d52d5899b8be67727ebf7a19/crates/chat/src/memory_tools.rs
[mo-search]: https://github.com/moltis-org/moltis/blob/1f6d28ea750d6654d52d5899b8be67727ebf7a19/crates/memory/src/search.rs
[mo-doc]: https://github.com/moltis-org/moltis/blob/1f6d28ea750d6654d52d5899b8be67727ebf7a19/docs/src/memory.md
[ic-readme]: https://github.com/nearai/ironclaw/blob/b0b999d96781516ee05e6ba961d6f3ead900da96/README.md
[ic-memory]: https://github.com/nearai/ironclaw/blob/b0b999d96781516ee05e6ba961d6f3ead900da96/docs/capabilities/memory/memory.mdx
[ic-contract]: https://github.com/nearai/ironclaw/blob/b0b999d96781516ee05e6ba961d6f3ead900da96/docs/internal/reborn/contracts/memory.md
[kh-readme]: https://github.com/khoj-ai/khoj/blob/ae229ca894c0b80ad84664afcfdde523b5e87057/README.md
[kh-license]: https://github.com/khoj-ai/khoj/blob/ae229ca894c0b80ad84664afcfdde523b5e87057/LICENSE
[kh-adapters]: https://github.com/khoj-ai/khoj/blob/ae229ca894c0b80ad84664afcfdde523b5e87057/src/khoj/database/adapters/__init__.py
[kh-backfill]: https://github.com/khoj-ai/khoj/blob/ae229ca894c0b80ad84664afcfdde523b5e87057/src/khoj/database/management/commands/manage_memories.py
[pc-readme]: https://github.com/sipeed/picoclaw/blob/bbf6893ca7afad27f1d00a0f5a45982a549c6ed6/README.md
[pc-license]: https://github.com/sipeed/picoclaw/blob/bbf6893ca7afad27f1d00a0f5a45982a549c6ed6/LICENSE
[pc-config]: https://github.com/sipeed/picoclaw/blob/bbf6893ca7afad27f1d00a0f5a45982a549c6ed6/docs/guides/configuration.md
[qp-readme]: https://github.com/agentscope-ai/QwenPaw/blob/02b6a6d088e37192934645cbc0876114bb9e98ae/README.md
[qp-license]: https://github.com/agentscope-ai/QwenPaw/blob/02b6a6d088e37192934645cbc0876114bb9e98ae/LICENSE
[ai-readme]: https://github.com/iOfficeAI/AionUi/blob/6744099b279b991c17e31c243f0920477bd31cb6/readme.md
[ai-license]: https://github.com/iOfficeAI/AionUi/blob/6744099b279b991c17e31c243f0920477bd31cb6/LICENSE
[ow-license]: https://github.com/open-webui/open-webui/blob/f8ae8a6c328946dc62cd0712961a0632574581bf/LICENSE
[ow-memory]: https://docs.openwebui.com/features/chat-conversations/memory/
[ow-config]: https://docs.openwebui.com/reference/env-configuration/
[nc-readme]: https://github.com/nanocoai/nanoclaw/blob/ab09973a8037a2bff568bc169128bfc2104c51ad/README.md
