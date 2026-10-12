# Hermes Agent: bounded notes, searchable episodes, and learned procedures

Research window: **2026-10-12–13** (Europe/Berlin). Source snapshot: **2026-10-12 UTC**. This report identifies Hermes as **Nous Research's `NousResearch/hermes-agent`**, not the Hermes model family or an unrelated similarly named agent. It extends the [consumer and coding agents survey](consumer-and-coding-agents.md) with a deeper public-source trace. **S** means inspected source; **D** means first-party documentation; **I** means an implementation proposal or inference. No runtime benchmark was performed, no third-party code was executed, and no private project was inspected. [Official repository][repo]

The most useful distinction is that Hermes has **several independent memory mechanisms**. Small editable notes are injected into prompts; complete sessions support lexical recall; a post-turn fork can revise notes and skills; a separate curator retires unused skills and optionally consolidates them; context compression creates a continuation checkpoint. A vector database is optional. Calling all of this “agent memory” obscures the writer, retrieval cost, and failure modes. **S.** [Memory store][store], [session search][search-tool], [background review][review], [curator][curator], [compressor][compressor]

## Evidence and version boundary

| Item | Inspected evidence | Boundary |
| --- | --- | --- |
| Repository | `NousResearch/hermes-agent` | Official Nous Research repository; repository README and product documentation cross-identify the agent. [Repository][repo] |
| Immutable source pin | `ee36aed5adc737db49c94316ffeb97d3fb8dc099` | Commit timestamp `2026-10-13T03:19:50+05:30`, equivalent to `2026-10-12T21:49:50Z`; all code links below use this pin. [Commit][commit] |
| License | MIT, copyright Nous Research | Covers the inspected main repository code under its license; does not establish licensing of every optional skill, dependency, model, or external memory service. [License][license] |
| Version naming | `pyproject.toml` says `0.0.0`; CLI version resolves an installation stamp | The placeholder is not a meaningful release comparison. Use the commit, not an invented release version. [Package metadata][package], [CLI identity][version] |
| Documentation | Official memory, skills, curator, delegation, and provider pages; pinned in-repository developer docs | Mutable hosted documentation sometimes disagrees with the inspected source. Specific discrepancies are listed below. [Memory documentation][memory-doc], [skills guide][skills-doc], [curator documentation][curator-doc], [delegation documentation][delegation-doc], [provider documentation][providers-doc] |

## Mechanism map: input to later behavior

| Mechanism | Input and writer | Cadence | Durable state | How it reaches an answer or handoff |
| --- | --- | --- | --- | --- |
| Core notes | Model-chosen declarative facts, preferences, and environment knowledge through `memory` | Foreground calls; periodic eligible review forks | `memories/MEMORY.md`, `memories/USER.md` | All enabled entries enter a frozen system-prompt block; no query ranking. [Store][store], [prompt assembly][system-prompt] |
| Session history | User/assistant messages, tool calls/results, session metadata | Incremental persistence and exit-path flush | Profile-local SQLite `state.db`; searchable derived indexes | Model calls `session_search`; receives message IDs, snippets, bounded windows, and session references. [Persistence][persistence], [schema][schema], [search][search-tool] |
| Procedural skills | Successful workflows and user corrections selected by foreground agent or review fork | Foreground write or periodic post-turn review | `skills/<name>/SKILL.md`, optional supporting files | Skills catalog in prompt; model selects and loads body through `skill_view`. [Index][prompt-builder], [skill tool][skills-tool], [review prompts][review-prompts] |
| Skill maintenance | Skill activity/provenance records and library contents | Inactivity/interval checks; defaults weekly and two-hour idle gate when measured | `.usage.json`, `.curator_state`, `.archive/`, mutation ledger | Stale/archive transitions reduce the active catalog; optional LLM merges packages. [Curator][curator], [usage][skill-usage], [ledger][skill-ledger] |
| Active-context checkpoint | Current transcript, previous summary, recent user turns, tool evidence | Context-pressure, manual, or configured maintenance boundaries | Compacted active transcript plus archived earlier rows | Structured reference checkpoint and protected recent tail continue the same work. [Compressor][compressor], [archive operation][archive] |
| External memory provider | Completed turn, original user text, optional transcript/tool evidence and lifecycle events | Query prefetch before a turn; serialized background write after completion | Provider-specific | Fenced recall added to the current user message; optional provider tools. [Provider interface][provider-interface], [manager][manager], [turn context][turn-context] |
| Subagent handoff | Parent-authored goal/context and optional output schema | Explicit delegation | Child session linked to parent; live progress/result records | Focused child context; final result envelope, validation status, usage, and tool trace return to parent. [Delegate construction][delegate], [child prompt][child-prompt], [result builder][child-run] |

The core unit of collection is **agent interaction**, not an automatic screen-and-audio timeline. Inputs can arrive through CLI, desktop or messaging sessions, explicit file/document reads, browser and other tool results, and voice transcription. Voice documentation describes microphone/voice-channel input becoming a transcript sent to the agent. The persistence code makes a text projection of multimodal content, including screenshot placeholders, rather than establishing an OCR or visual-embedding memory index. This audit does not establish continuous passive desktop capture. **D/S.** [Voice input][voice-doc], [multimodal persistence][persistence], [tool registry overview][tools-doc]

## 1. Core memory is a tiny editable prompt, not a retrieval database

### Representation and context assembly

The default home is `~/.hermes`; profiles have their own home and stores. The two core files default to **2,200 characters for `MEMORY.md` and 1,375 for `USER.md`**. These are character budgets, not exact tokenizer budgets. Entries are free text separated by `\n§\n`, with no mandatory entity IDs, source IDs, confidence, timestamps, or expiry fields. Loading deduplicates identical entries while retaining first occurrence order. The prompt block includes a store label and usage counter. A hand-edited oversized store is warned about and retained on load; the write cap is not a guaranteed hard bound on every externally edited input. **S.** [MemoryStore initialization/loading/rendering][store], [defaults][defaults]

The main prompt has stable, project-context, and more variable components. Core memory and the skills index occupy the latter part, but their assembled bytes remain cached during ordinary turns. `memory` writes change the live file immediately after a successful operation. **They do not mutate the already-rendered system block.** Source `invalidate_system_prompt()` reloads memory when the context is rebuilt, including after compaction. Thus a new session is the common refresh point, but not the only one in this revision. **S.** [System-prompt construction and invalidation][system-prompt], [frozen versus live store][store]

The current prompt explicitly routes task-specific procedures, pitfalls, and task-specific user preferences toward skills. Core notes are the exception for information useful across essentially every session. It asks for declarative statements about the user/environment, rather than commands that might acquire inappropriate authority later. A fact expected to become stale within a week belongs in history. These are **prompt rules**, not an extractor with a semantic validator enforcing those categories. **S.** [Memory guidance][memory-guidance]

### Exact mutation path

There is no core-memory retrieval query or general `read` action. The principal mutations are `add`, `replace`, and `remove`, plus an `operations` batch for one target. A replacement selects an entry and replaces the **entire entry**, not the matching substring. Full-entry equality wins; otherwise the code tries substring matching, then typography/whitespace normalization. Distinct multiple matches fail. A miss can return up to three nearby entries scored by shared words. This is target-resolution assistance, not semantic memory retrieval. **S.** [Store matcher and mutations][store], [tool handler/schema][memory-tool]

Writes take a file lock, re-read current disk state, validate, and atomically replace the file. Unreadable files are refused rather than treated as empty. Exact duplicate additions succeed without appending another copy. `add` and `replace` scan content for configured threat patterns. Load-time scanning also prevents a poisoned raw entry from entering the prompt, while preserving it on disk for inspection/removal. Pattern scanning is a guardrail; it is not evidence of comprehensive protection from memory poisoning. **S/I.** [Store persistence and scanning][store], [threat pattern definitions][threats]

Capacity does **not** trigger an automatic semantic compaction job. The error gives the required space reduction and live entries. The model can submit one atomic batch that shortens/removes entries and adds the new entry; capacity is checked on the final state. Any failed operation aborts the entire batch. A batch cannot silently empty a previously nonempty store. After more than three consecutive consolidation failures in a turn, the response tells the agent to stop retrying. Successful writes return a compact terminal receipt with usage/count, and expose removed or replaced entry text when relevant; they do not echo the entire current store. **S.** [Atomic batch, retry cap, receipts][store]

```text
mutate_core(target, proposed_operations, origin):
    validate target is enabled and scan new content
    if unattended review includes replace/remove:
        resolve exact current target entries; stage proposal; return pending receipt
    if write approval requires review:
        approve inline where supported, otherwise stage proposal
    acquire target file lock
    read latest disk contents; refuse unreadable or unsafe external drift
    apply operations to a working copy; require unambiguous target selection
    reject whole batch on any error, forbidden emptying, or final budget overflow
    atomically save working copy
    return terminal receipt; leave frozen system-prompt snapshot unchanged
```

This pseudocode summarizes the inspected control flow, not a complete drop-in implementation. Approval and destructive-operation checks must also be applied when pending proposals are replayed. **S.** [Memory tool gates][memory-tool], [MemoryStore][store], [pending write store][write-approval]

`memory.write_approval` defaults off. Enabling it can prompt for foreground interactive CLI writes or stage proposals under `pending/memory/`. Independently, an **unattended** review's `replace`/`remove`, including those inside a batch, is always staged. A staged destructive operation pins the full selected entry; later approval fails if that exact entry has changed. A manual attended review uses a different destructive-operation allowance. This makes “background memory consolidation” materially different from an unconditional unattended rewrite. **S.** [Approval policy][write-approval], [background destructive-operation gate and replay][memory-tool], [attended review flag][review-run]

## 2. Session history is the evidence store; recall is on demand

Persistence and learning have different success conditions. The database can preserve an interaction even when no `memory` call occurred; saying a fact was remembered does not create a core entry. The persistence layer filters synthetic recovery prompts, separates clean displayed user content from API-specific content when needed, and has explicit multimodal text projection. Compaction archives earlier rows with `active=0, compacted=1`; they remain discoverable. Rewound rows have different visibility semantics and are excluded from normal recall. **S.** [Persistence][persistence], [message schema][schema], [archive implementation][archive], [search visibility][search-engine]

The default `session_search` behavior is **lexical SQLite FTS5**, with no model summarizer or embedding call in the search tool. It searches user and assistant roles unless tool output is explicitly requested. The derived index includes content, tool name, and serialized tool calls; oversized tool-result text has an indexed-prefix bound. An explicit tool-role search takes a canonical-row `LIKE` route to search full tool content. Non-CJK retrieval normally uses FTS rank/BM25; optional temporal ordering sorts by timestamp before rank. Specialized CJK/trigram/substring fallbacks and a zero-hit OR relaxation exist, so “just BM25” is also an incomplete implementation description. **S.** [FTS schema][schema], [search engine][search-engine], [tool interface][search-tool]

Four shapes expose progressively more evidence:

| Shape | Request | Current response policy |
| --- | --- | --- |
| Discover | `query`, optional time bounds/roles/sort | Default three sessions, maximum ten; scan up to 300 candidate rows, demote cron relative to interactive sessions, deduplicate by conversation lineage. An exact session-title resolution can also contribute a hit. |
| Adaptive detail | Default discovery mode | Hydrate the first result with an anchored window and beginning/end bookends; later results carry only the matching anchor. |
| Scroll | `session_id`, `around_message_id`, optional `window` | Neighboring actual rows; window defaults five on each side and clamps to 1–20. |
| Read/browse | `session_id` alone, or no arguments | Read shows first 20 and last 10 messages for longer sessions; browse lists recent sessions. |

Discovery windows cap individual content at **4,000 characters**, bookends at **1,200**, and read-mode messages at **2,000**. Truncation is marked and pointers permit further navigation. Explicit scroll bounds the message count but calls the message formatter **without a character cap**, so it can recover a long message in full and can also produce a large tool response. `kanban`, `subagent`, and integration `tool` session sources are hidden from ordinary discovery/browse. Live current-lineage content is excluded unless it has left active context through compaction or a reset boundary. Explicit cross-profile reads require a named profile; a bare miss does not search other homes. **S.** [Search shapes, limits, lineage and profile rules][search-tool]

```text
recall_sessions(query, current_session, detail="adaptive", limit=3):
    candidates = lexical_search(query, roles=[user, assistant], limit=300)
    optionally add a session-title hit
    exclude hidden sources, explicit exclusions, and still-live current context
    order interactive sessions ahead of cron; preserve ranking within each class
    retain first surviving match for each conversation lineage, up to limit
    for each retained hit:
        if first hit or detail == "full":
            include bounded neighboring messages and bounded start/end bookends
        else:
            include bounded anchor message only
        include source/session metadata, message anchor, and session link
    return records; let agent explicitly scroll if more evidence is needed
```

**Design implication:** This is a particularly small, useful baseline for evidence-based recall. Separate *finding the episode* from *loading enough of the episode*. Its limitations should be measured: paraphrases without overlapping terms, result crowding before lineage dedup, evidence cut off by content caps, and incorrect conclusions from absence of a hit. Retrieval tool calls avoid an additional summarizer call, but returned text still consumes the actor's prompt budget. **I, grounded in S.** [Search implementation][search-tool], [fallback query routes][search-engine]

## 3. The learning loop is a detached tool-using review, not model training

### Trigger and evidence

Current Hermes checks for review after a completed noninterrupted turn. The default memory interval is **ten user turns**; the default skill interval is **ten model/tool-loop iterations**. These are separate counters. In the ordinary conversation loop, the skill counter increments in iteration preparation, so it is not simply “every ten tool calls” or “every ten sessions.” The corresponding foreground tool invocation resets its counter, and a fired interval resets before the review is dispatched. Automatic review can be disabled; callers such as scheduled work can explicitly skip it. **S.** [Initialization][init], [memory tick][turn-context], [iteration tick][iteration], [counter resets][executor], [post-turn dispatch][finalizer]

A daemon worker forks the parent agent with the conversation snapshot and a memory-only, skills-only, or combined review instruction. The memory prompt routes user facts and environment facts to different stores. The skill prompt favors updating a currently loaded skill, then an existing task-class skill, then supporting material, then a new task-class skill. It asks to capture mechanisms and repeatable steps, consolidate duplicate lessons, and avoid turning unresolved failures or temporary missing tools into permanent restrictions. The current combined prompt routes a task-specific preference to one owning skill; only cross-cutting preferences without a skill owner belong in `USER.md`. **S.** [Review instructions][review-prompts]

These prompts strongly encourage skill updates. They are not an independently verified success detector. The evidence includes assistant-produced explanations as well as user corrections and tool results; there is no general proof that every stored workflow succeeded. The source's explicit instructions against recording unsuccessful workflows show that this risk is recognized, but prompt instructions are not equivalent to a validated outcome gate. **I/S.** [Review instructions][review-prompts]

### Same-model replay versus a routed digest

When review uses the parent's model, the fork inherits the existing system prompt, tool schemas, reasoning configuration, and resolved cache identity. It replays the full available conversation snapshot so a provider can reuse the parent's prefix. The fork detaches transcript persistence and external memory providers, shares the core memory store, disables recursive review triggers, and cannot close the parent session. Its own compaction is isolated. This is a concrete cache-aware architecture; actual cache hit rate and billed savings remain provider-dependent and were not measured here. **S/I.** [Fork construction][review-fork]

When an auxiliary setting selects a **different model**, Hermes constructs a different prompt and uses `_digest_history()`. The digest is **deterministic truncation**, not an extra LLM summary: retain the most recent **24 messages**, extend the tail to avoid starting with a tool-result message, and flatten older user text to 300 characters each and older assistant text to 200 characters each. Older assistant tool calls preserve tool names; older tool-result bodies are omitted. All older qualifying messages can contribute a line, so this is smaller replay rather than a universal fixed total-byte ceiling. **S.** [Digest implementation][review-digest]

The review permits up to **16 iterations** and applies an aggregate input-token budget across its requests. The default budget is 75% of the resolved review context window, capped at 600,000; unresolved windows use 120,000. A positive explicit value overrides it; nonpositive disables that budget. Same-model review inherits reasoning effort to preserve request parity; a different-model route can use its own effort. A new live turn cancels an in-flight review with a bounded acknowledgment wait. Managed local runtime reviews can instead coalesce by session in an idle queue, with newest snapshot winning while original queue age is retained. This queue is in-memory best effort, not a durable guaranteed learning job. **S.** [Budget and cancellation][review], [reasoning/fork][review-fork], [idle queue][review-idle]

### Capabilities and writes

The same-model fork keeps the parent's advertised tools for cache compatibility, but enforces a **dispatch-time allowlist**: skill management, read-only file inspection, and core memory only when the memory review trigger permits it. Additional already-available tools require explicit review configuration. Do not reproduce this as “give a background agent all foreground permissions.” Skill writes require a fresh read of the exact existing target in that review; stale content inherited in a transcript does not satisfy that guard. **S.** [Review allowlist][review-run], [skill mutation guards][skill-guards]

```text
after_successful_turn(snapshot):
    memory_due = enabled_memory_counter_reached_interval
    skills_due = enabled_iteration_counter_reached_interval
    if neither_due or reviews_disabled or caller_skips_review: return
    fork = detached_agent_with_parent_runtime()
    if fork.model == parent.model:
        pin exact parent system prompt, schemas, reasoning and cache identity
        history = copy(snapshot)
    else:
        history = deterministic_older_turn_digest_plus_recent_tail(snapshot)
    allow only permitted review tools at execution time
    ask fork to route declarative facts versus reusable procedures
    run within iteration/input budgets; preempt for live work
    apply guarded writes or stage proposals
    report applied operations from tool receipts, not the fork's claims
```

This distills the public implementation. It does not claim Hermes fine-tunes its weights after conversations or evaluates each learned skill against held-out tasks. The observable “self-improvement” is **artifact mutation and later prompt reuse**. **S/I.** [Review execution and action extraction][review], [skill tools][skills-tool]

## 4. Skills are procedural memory with an explicit lifecycle

A skill is a Markdown entrypoint plus optional `references/`, `templates/`, `scripts/`, and other supported assets. The system prompt lists eligible names/descriptions, filtered by platform/environment/tools and configuration; some unrelated categories can appear as names only. The agent selects a skill by calling `skill_view`, then loads supporting files when needed. This is prompt-mediated routing, not a learned vector ranker. The catalog itself costs tokens even when no body is loaded. Repeated unchanged views can return a short stub; compaction clears that view cache. A successful view counts as both view and use in telemetry, so usage is not evidence of task success. **S.** [Skills index rendering][prompt-builder], [view and usage behavior][skills-tool], [usage sidecar][skill-usage]

Explicit `skills.auto_load` is a separate opt-in path: configured bodies are resolved once per agent lifecycle and included in the stable prompt portion. Its default is an empty list. This should remain distinct from the normal catalog-and-select behavior, and from the curator's pin flag, which governs lifecycle/deletion behavior rather than automatically loading every pinned body. **S.** [Auto-load prompt path][system-prompt], [auto-load default][skill-defaults]

Skills can be learned in the foreground or review and patched in place. A separate mutation ledger records actor and before/after content through content-addressed blobs and permits rollback. That gives artifact-level provenance and reversibility; it does not create source citations for every instruction within a skill. The usage sidecar records creator, counts, timestamps, state, and pin status. **S/I.** [Skill ledger][skill-ledger], [usage schema][skill-usage]

The **curator** is a separate mechanism with defaults `enabled=true`, `interval_hours=168`, `min_idle_hours=2`, stale after 14 days, archive after 30 days, and **`consolidate=false`**. A first observation seeds the run clock instead of pruning immediately. Deterministic transitions use latest view/use/patch activity or creation time; pinned and cron-referenced skills are protected. Automatic ownership rules primarily target agent-created/adopted skills; optional built-in pruning is a separate switch. Archival moves a package to `.archive/` and is reversible. The idle-duration gate is enforced only when the caller supplies an idle measurement. **S.** [Curator scheduler and transitions][curator], [eligible-skill classification][skill-usage]

Opt-in semantic consolidation forks another model to merge overlapping skills into broader task classes. It must preserve the package's supporting material and requires an existing destination when archiving an absorbed skill. This is materially more expensive and changes more state than the default deterministic pass. A local experiment should keep it separate from post-turn extraction. A pinned skill is not universally immutable: current `skill_manage` permits patches/edits while blocking deletion; curator scheduling rules are a different restriction. **S/I.** [Curator consolidation][curator], [mutation guards][skill-guards]

## 5. Compression and handoffs preserve work, not just facts

The built-in context engine is a lossy compressor; optional context-engine plugins have an explicit selection boundary. Current compression defaults use a nominal 0.50 threshold, with a 0.75 floor for models below a 512K window and additional provider/model overrides. An optional absolute token cap can bind earlier. Therefore “compresses at 50%” is not a universally correct reproduction. Lean-tail mode is the current default: a clamped recent tail plus structured summary, mechanically recovered anchors, verbatim user messages, and history-recovery pointers. Earlier full context is archived rather than becoming the sole surviving summary. **S/D.** [Compression configuration][compression-defaults], [compressor][compressor], [developer context-engine contract][compression-doc], [archival][archive]

The summary prompt maintains a checkpoint containing historical task state, goal, constraints, completed actions and their tool outcomes, active state, blockers, decisions, errors/fixes, resolved questions, relevant files, and critical context. Repeated compaction updates the previous checkpoint. Completed actions should be represented as completed, dated facts, while user corrections and concrete identifiers are preserved. Secret values are excluded/redacted. The wrapper explicitly makes the checkpoint **reference material**, preserves the authority of the latest real user request, and treats in-flight tool exchanges as a special continuation case. This is an important handoff design: a plan in old memory must not reactivate work the user canceled. **S.** [Summary prompt/template][summary-prompt], [checkpoint authority wrapper][summary-wrapper]

Explicit delegation takes a different path. A child starts a separate conversation with a supplied goal and context; it does not inherit the parent's entire chat or core-memory store. Construction sets `skip_memory=True`; the shared memory-writing tool is blocked. Project context can still be deliberately loaded from the selected workspace into the focused child prompt, excluding the parent's personality file. The parent must pass facts needed for the subtask. Tools are restricted to permitted subsets, with nested delegation dependent on role/depth. **S.** [Child construction][delegate], [child prompt][child-prompt], [child tool restrictions][child-tools]

The result is more than an untyped summary: the parent receives status, final text, exit reason, truncation/budget-exhaustion flag, API calls, elapsed time, token usage, model, and a tool trace. Optional JSON Schema contracts are added before execution; one correction turn is allowed after validation failure. An invalid result can still be delivered as useful raw text with `schema_valid=false`, instead of silently being treated as structured success. If the `jsonschema` dependency is unavailable, the helper accepts parseable JSON without schema validation—a fidelity detail for a test harness. **S.** [Result envelope][child-run], [schema helper][output-schema]

## 6. External backends are a pluggable boundary, not the default algorithm

The standard configuration chooses **one external provider** alongside built-in memory; `MemoryManager` itself can coordinate a provider list. At this revision only ByteRover and RetainDB implementations remain under the bundled `plugins/memory/` tree. Other familiar integrations are catalog-installed. A reproduction should pin the selected provider separately instead of treating an old list of bundled backends as the source tree's current contents. **S.** [Provider initialization][init], [plugin loader/tree][plugins], [memory configuration][defaults]

Before a nontrivial user turn, the manager strips skill scaffolding, redacts provider-bound text, and asks for prefetch context. External calls have an eight-second default timeout; a still-running provider is skipped on later turns until it returns. The returned material is sanitized and fenced as recalled context and added to the current user-message path, leaving the system prefix stable. Image-only input with no text provides no semantic query through this path. Provider recall budget/ranking is not defined by the interface. **S.** [Prefetch manager][manager], [query and injection][turn-context], [provider contract][provider-interface]

After a completed noninterrupted turn, original user text and assistant output, plus optional transcript/tool evidence and author metadata, are passed to a serialized background sync worker. The manager strips scaffolding and scrubs egress values. It also exposes session-boundary, pre-compression checkpoint, memory-write, and delegation hooks. These seams let a provider implement its own extraction or consolidation; the Hermes hook alone does not establish that implementation. Provider writes are best effort and shutdown has a bounded drain, so an external-memory deployment needs explicit write-completion evidence. **S/I.** [Turn sync][turn-sync], [manager lifecycle][manager], [provider interface][provider-interface]

## Documentation and implementation gaps that matter

| Simplified claim | What the inspected revision actually establishes | Consequence |
| --- | --- | --- |
| Memory is frozen until the next session | Ordinary writes preserve the prompt snapshot, but compaction invalidation reloads it. | Test both session reset and in-session compaction visibility. [Docs][memory-doc], [source][system-prompt] |
| Session search returns untruncated messages | Discovery and read truncate message content; explicit scroll bounds count but has no content-character cap. | A missing discovery suffix is not evidence the fact was absent; scrolling can recover it at additional context cost. [Docs][memory-doc], [source][search-tool] |
| Search is free | Search itself makes no LLM call; its text still enters subsequent actor requests. | Count returned/replayed tokens and search calls. [Tool source][search-tool] |
| Skills cost zero tokens before loading | The index contains names and often descriptions in the system prompt. | Account for catalog size separately from loaded-body size. [Guide][skills-doc], [index source][prompt-builder] |
| Review summarizes older history on a cheaper model | The routed digest uses deterministic character slices and drops older tool-result bodies. | Evaluate lost evidence and correction fidelity; do not label it an LLM summarizer. [Digest source][review-digest] |
| The curator periodically runs model consolidation by default | Deterministic inactivity pruning is on; semantic consolidation is off by default. | Separate pruning, extraction, and consolidation experiments. [Docs][curator-doc], [source][curator] |
| Pinning prevents all skill changes | The mutation guard blocks deletion but permits patches/edits. | Pinning is not immutable policy protection. [Docs][curator-doc], [source][skill-guards] |
| “Self-improving” proves better future performance | Code demonstrates artifact-writing, routing, and reuse mechanisms. | Measure improvement under equal budgets; no outcome claim follows from the label. [Review][review], [usage semantics][skills-tool] |

## High-return mechanisms to isolate in a small experimental lab

These are **proposed experiments**, not benchmark results or claims that the full Hermes runtime should be duplicated. Implement against a shared event stream and one actor model so each mechanism has a clear counterfactual. Prefer the first three before reproducing provider integrations or full curator scheduling. **I.**

| Priority | Small mechanism | Main comparison | Minimal discriminating fixture |
| --- | --- | --- | --- |
| 1 | Bounded core notes with explicit mutations and prompt snapshots | History only versus fixed always-present facts; same budget | Save a cross-cutting preference, correct it, overflow the store, batch shorten+add, and begin a fresh task. Require actual write receipt, no duplicate, retained unrelated facts, and correct prompt visibility. |
| 1 | Lexical episode discovery with adaptive hydration and scroll | Full top-k transcript stuffing versus staged evidence access | Two similarly named projects, one old resolved failure, a later fix, and noisy cron repeats. Require the right lineage, exact supporting message, final-state answer, and bounded returned bytes. |
| 1 | Declarative facts versus task-class procedures | Put all lessons in core memory versus route workflow lessons into skills | A user corrects test workflow for one task class but later asks an unrelated task. Require the workflow correction to recur when relevant without becoming a global restriction. |
| 2 | Detached review fork with deterministic digest alternative | Same-model full replay versus different-model recent-tail digest | Put decisive success/failure evidence in an old tool result, a correction in a recent user turn, and a misleading assistant claim. Compare artifact precision and future task success alongside total input/output/cache tokens. |
| 2 | Handoff authority and typed result envelope | Plain summary versus checkpoint plus explicit latest-task authority and result validity | Issue “stop that; only inspect” after earlier unfinished work; exhaust a child budget; return schema-invalid JSON. Require no stale action, honest partial-result flags, and no invalid structured consumption. |
| 3 | Reversible deterministic skill aging | Keep all skills versus activity-based archival | An infrequent cron skill, a pinned skill, an unused new skill, and an obsolete duplicate. Verify protected items survive, archival is reversible, and catalog reduction does not erase the only needed procedure. |

Useful **component assertions**, independent of model quality:

1. **No pretend write:** prose saying “remembered” changes no durable state. A staged proposal is distinct from an applied receipt.
2. **Atomic capacity handling:** a failing operation leaves the file byte-identical; a valid remove/shorten+add batch fits the final budget without intermediate loss.
3. **Stale-target rejection:** change an entry after a proposal is staged; approval must refuse rather than overwrite a newer fact.
4. **Prompt snapshot consistency:** same-session ordinary writes do not alter frozen system bytes; explicit reload/compaction does. Never count live tool output as proof of next-session injection.
5. **Transcript preservation:** compact an episode, then retrieve its original evidence; hide rewound rows and avoid duplicate carried-tail hits.
6. **Review isolation:** the review cannot append synthetic user instructions to the main transcript, invoke an unapproved tool, or recursively spawn its own automatic review.
7. **Source identity:** assistant assertions, user corrections, and tool outcomes retain distinguishable roles through recall and evaluation.
8. **Handoff honesty:** `completed`, budget exhaustion, interrupted partial output, applied writes, and schema validity remain separate observable fields.

Useful **outcome metrics** are correct fact recall, citation-to-message validity, correction adoption, stale instruction activation, unsupported fact/skill creation, relevant-skill selection, and downstream task completion. Report costs for writes/reviews, catalog injection, retrieval, compaction, and actor replay separately. A cheaper review route can lose decisive evidence; a bigger memory store can increase irrelevant instructions. These are hypotheses to test rather than presumed improvements. **I.**

For an inexpensive first implementation, keep the core file store, SQLite episode search, and skill loading as independent adapters. Then add review as a separately budgeted writer whose output passes through the same mutation API. Defer a semantic consolidation worker until the experiment demonstrates real skill-library growth and retrieval clutter; the inspected Hermes defaults make the same distinction between routine aging and optional broad rewriting. **I/S.** [Core store][store], [search][search-tool], [curator defaults][curator]

## Source index

All GitHub code links below are immutable to the inspected commit. Hosted documentation links are mutable and were read during the research window.

[repo]: https://github.com/NousResearch/hermes-agent
[commit]: https://github.com/NousResearch/hermes-agent/commit/ee36aed5adc737db49c94316ffeb97d3fb8dc099
[license]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/LICENSE
[package]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/pyproject.toml
[version]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/hermes_cli/__init__.py#L5-L42
[memory-doc]: https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
[skills-doc]: https://hermes-agent.nousresearch.com/docs/guides/work-with-skills
[curator-doc]: https://hermes-agent.nousresearch.com/docs/user-guide/features/curator
[delegation-doc]: https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation
[providers-doc]: https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers
[tools-doc]: https://hermes-agent.nousresearch.com/docs/user-guide/features/tools
[store]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/tools/memory_tool_store.py
[memory-tool]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/tools/memory_tool.py
[write-approval]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/tools/write_approval.py
[threats]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/tools/threat_patterns.py
[defaults]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/hermes_cli/config_defaults.py#L1311-L1327
[system-prompt]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/system_prompt.py
[memory-guidance]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/prompt_builder.py#L192-L234
[prompt-builder]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/prompt_builder.py#L1424-L1525
[persistence]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/session_persistence.py
[schema]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/hermes_state_common.py
[archive]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/hermes_state_messages.py#L984-L1070
[search-tool]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/tools/session_search_tool.py
[search-engine]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/hermes_state_search.py#L1063-L1204
[review]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/background_review.py
[review-prompts]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/background_review.py#L360-L562
[review-digest]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/background_review.py#L324-L357
[review-fork]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/background_review.py#L823-L1040
[review-run]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/background_review.py#L1079-L1200
[review-idle]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/review_idle_queue.py
[init]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/agent_init.py#L1290-L1384
[turn-context]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/turn_context.py
[iteration]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/turn_iteration_prep.py#L145-L169
[executor]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/tool_executor.py#L740-L751
[finalizer]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/turn_finalizer.py#L757-L804
[skills-tool]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/tools/skills_tool.py
[skill-defaults]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/hermes_cli/config_defaults.py#L1456-L1467
[skill-guards]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/tools/skill_manager_guards.py#L133-L253
[skill-usage]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/tools/skill_usage.py
[skill-ledger]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/tools/skill_ledger.py
[curator]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/curator.py
[compressor]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/context_compressor.py
[compression-defaults]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/hermes_cli/config_defaults.py#L577-L611
[compression-doc]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/website/docs/developer-guide/context-compression-and-caching.md
[summary-prompt]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/context_compressor.py#L4010-L4188
[summary-wrapper]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/context_compressor.py#L248-L294
[delegate]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/tools/delegate_tool.py
[child-prompt]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/tools/delegate_tool_progress.py#L140-L219
[child-tools]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/tools/delegate_tool_toolsets.py
[child-run]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/tools/delegate_tool_child_run.py#L478-L639
[output-schema]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/tools/delegation_output_schema.py
[provider-interface]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/memory_provider.py
[manager]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/agent/memory_manager.py
[plugins]: https://github.com/NousResearch/hermes-agent/tree/ee36aed5adc737db49c94316ffeb97d3fb8dc099/plugins/memory
[turn-sync]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/run_agent.py#L887-L918
[voice-doc]: https://github.com/NousResearch/hermes-agent/blob/ee36aed5adc737db49c94316ffeb97d3fb8dc099/website/docs/user-guide/features/voice-mode.md
