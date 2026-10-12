# Muse, Grok Bot, and inspectable personal-agent memory implementations

Observation window: **2026-10-12 UTC** (completed October 13 in Europe/Berlin). Public-source, static research only: first-party pages were opened and public repositories were cloned into `/tmp` and read. No downloaded project code was executed, no account-level product test was performed, and nothing was published. This extends [the consumer-agent survey](consumer-and-coding-agents.md#9-grok-grok-bot-and-the-ambiguous-grokbot-name); [the independent implementation survey](open-source-implementations.md) covers additional OpenMuse/Eidon candidates.

The useful result is not a recovered proprietary algorithm. **Meta Muse has a directly relevant independent implementation, nanoMuse; Grok Bot has inspectable community memory add-ons and comparable bot-team runtimes.** These let us reproduce specific public mechanisms while keeping claims about the closed products bounded.

Evidence: **D** = first-party documented behavior; **S** = inspected public source; **I** = explicitly proposed experiment; **U** = not established by these sources. A public prompt is evidence of instructions, not proof that a model always follows them.

## 1. Identity, affiliation, and what is actually open

| Name | Identity and relationship | Inspectable component | Claim boundary |
|---|---|---|---|
| **Muse** | Meta's personal agent, launched September 8, 2026, at `muse.ai` | Official product, design, and security descriptions | No official product-memory runtime located in this audit. Do not confuse the agent with Muse Spark, image models, music applications, or similarly named older repositories. [Meta launch][meta-launch] |
| **nanoMuse** | Independent project explicitly positioning itself as an alternative to Meta Muse | GPL-3.0 project; Python agent, memory, tools, clients, relay | A concrete independent implementation, not Meta source or private implementation parity. Its own roadmap records missing capabilities. [Roadmap][nm-roadmap], [license][nm-license] |
| **Grok Bot** | Official product documented on `docs.x.ai/grok-bot`; distinct from consumer Grok chat | Product contracts for persistent Bots, team/private memory, computers, skills | No official Grok Bot memory implementation located here. Current docs also refer to Cursor-operated computers/accounts; preserve that observed product boundary rather than infer backend ownership from the name. [Overview][gb-overview], [security FAQ][gb-security] |
| **OpenBot, `regnull/openbot`** | Independent bot-team runtime | MIT Python service, LangMem integration, persistent inboxes, thread context, handoffs | Behaviorally comparable to Grok Bot. The inspected README does not establish direct Grok lineage. This is not every project called OpenBot. [README][ob-readme], [license][ob-license] |
| **Firstmate, `matteoantoci/firstmate`** | Independent prompt package intended to run *inside* Grok Bot | MIT instructions for Git-backed crew memory | Open memory-management policy on a closed host, not an independent runtime or API replacement. [Prompt][fm-prompt], [license][fm-license] |
| **CopilotKit/OpenMuse; Quack6765/Eidon-AI** | Additional independent personal-agent candidates | Covered separately | Names are discovery leads, not evidence of Meta/xAI affiliation; see the [source and license audit](open-source-implementations.md). |

An API client accepting an xAI or Meta-compatible model endpoint does not inherit either product's learned-memory service. Likewise, source for a memory add-on or a public system prompt does not open the host's extraction, retrieval, credential, or scheduling infrastructure. **I: classification rule for the survey.**

### Inspected pins

| Repository | Commit | Commit time | License evidence |
|---|---|---|---|
| `nano-muse/nanoMuse` | `36ba867d516b05058e28df8fbffa0ac888179d69` | 2026-10-12 18:09:31 UTC; displayed by Git as October 13 at UTC+08 | Root GPL version 3 text; inspect component notices separately when redistributing. [LICENSE][nm-license] |
| `regnull/openbot` | `30d4a6c607fd0aa7f7e90354f516af29b3366747` | 2026-10-11 18:56:52 UTC | MIT. [LICENSE][ob-license] |
| `matteoantoci/firstmate` | `dc26ad39f5584f23c8408478c6799c2bd69b0a1f` | 2026-08-31 21:23:38 UTC | MIT, with upstream prompt attribution. [LICENSE][fm-license], [NOTICE][fm-notice] |

The nanoMuse paper is a useful first-party project description and explicitly presents an independent counterpart. Its descriptions of Meta internals also draw on a purported production prompt. This report relies on Meta's own pages for Meta behavior and on the pinned nanoMuse code for nanoMuse algorithms; it does not promote a copied prompt to verified production architecture. [Paper][nm-paper]

## 2. Meta Muse: established behavior and remaining unknowns

Muse accepts conversation, enabled app data, browser work, and task/goal requests. It can continue after the app closes and act on details learned earlier. The launch announcement explicitly permits asking it to forget learned information. These are product promises; they do not specify extraction prompts, memory schema, semantic index, ranking, refresh frequency, or a deletion propagation algorithm. **D/U.** [Launch][meta-launch]

The design describes one ongoing main conversation, optional side chats, cross-conversation memory, scheduled/event-driven work, and user-editable memory files. It separates goals, activity history, and generated artifacts in the UI. Consequently, a durable task record, memory file, and current model transcript should be separate experimental objects. File names, injection budgets, side-chat memory isolation, and the exact order of prompt assembly are **U** in this official description. **D/I.** [Design][meta-design]

Meta's security account says files and memory can be inspected, edited, and downloaded from the user's VM, whose data is continuously backed up. It describes a browser subagent and an independent Sentinel as the action-permission authority, with credentials outside the main runtime. This makes action authorization a separate state system from learned preferences. The same page describes Confidential VM as forthcoming, with selected testers/auditors; it should not be reported as a generally deployed guarantee that Meta cannot access current VM data. Memory deletion from live files is not, on these sources, proven erasure from backups or every trajectory. **D/U.** [Security architecture and data policy][meta-security]

The [action-permission followup](capture-and-handoffs.md#action-permissions-and-delegated-authorization), checked October 13, distinguishes documented scoped grants, per-use sensitive-action approvals, and remaining implementation unknowns. It separates these product controls from proposed evaluation hypotheses.

**D/U — adoption evidence.** Meta's September 29 small-business announcement (updated October 8) supplies connectors, use cases, and testimonials, but no quantitative Muse adoption measure. Its stated approval boundary covers publishing, sending, and spending. This supports researching the workflow; it does not establish small-business popularity or its causes. Stripe's figures of over one million accepting businesses and 300 million global users describe **Link's network**, not Muse adoption. No Muse adoption estimate follows from those counts. [Small-business announcement](https://about.fb.com/news/2026/09/introducing-muse-small-business/), [Stripe integration](https://stripe.com/newsroom/news/stripe-helps-meta-muse-shop-with-link)

For a lab, the defensible `muse-inspired` contract is therefore: persistent personal context, distinct main/side conversations, goal/event triggers, editable memory, and delegated tools behind separate permission state. Implementing a vector database plus a summarizer is one possible design choice, not a reconstruction of Meta's system. **I.**

## 3. Grok Bot: the additional boundaries an analogue must preserve

The official overview establishes messages/voice, connected tools, computer work, demonstrated skills, continuing tasks, and Bot-to-Bot handoffs. A user's personal Bots have separate conversations and learned context but share computer files and sign-ins. The product distinguishes stable learned context from current authoritative sources. **D.** [Overview][gb-overview]

Duplication copies role/configuration, skills, and routines, but excludes learned memory, history, and chat attachments. Deleting a Bot removes its active profile, conversation, and routines; shared computer files/sign-ins can remain. Thus **duplicate, hide, delete Bot, delete file, and forget fact are different operations**. The extractor schedule, store layout, recall scorer, memory-size budget, prompt positions, and conflict rules remain **U**. **D/U.** [Bot management][gb-bots]

Team Bots add a different scope model: team facts are shared only when someone explicitly says they are for the team; person-specific notes remain private and follow that person between the app and Slack DMs. Publishing a personal Bot to a team includes a selection step for memories; ordinary duplication and team publication are not the same transfer operation. Owners/managers control shared skills; a teammate's taught procedure can remain private notes. Team facts can be inspected, corrected, or removed conversationally. **D.** [Team Bots][gb-team]

Two operational details matter for memory experiments. The security FAQ says action Auto Review does not cover every memory write. It also distinguishes terminating a computer from deleting its durable disk. Neither tool approval nor a compute restart is a substitute for memory admission or erasure controls. **D.** [Security FAQ][gb-security]

**U:** whether privately stored memory is selected before or after tool authorization, whether all correction requests remove downstream summaries, whether memory writers retain source-message identifiers, how duplicated facts are reconciled, and how team/private retrieval is mechanically enforced. Public product documentation supplies useful acceptance tests without supplying these algorithms.

## 4. nanoMuse: a source-readable personal memory loop

This section audits the **Python runtime**, not every mobile client's implementation. Its application creates one `MemoryStore` at the configured `memory.db`; the server's conversation agents share that store. It is personal-runtime memory across side chats, not one fact table per conversation. Android/iOS contain additional system-file mechanisms, and the project's roadmap explicitly says shared memory across every device is unfinished. Do not equate conversation synchronization with completed fact-store synchronization. **S/D.** [Application composition][nm-app], [architecture][nm-architecture], [roadmap][nm-roadmap]

### 4.1 Admission and writes

The foreground system prompt tells the model to save durable personal facts, preferences, contacts, constraints, and routines with `remember`, update changed facts with an existing ID, and use `forget` when asked. This is a **model-selected tool write during a turn**; no universal every-message extraction worker is established by this path. The current turn can include user text, attachments, and tool observations, but whether an observation becomes memory is a model decision. **S.** [Prompt][nm-prompts], [memory tools][nm-tools]

`remember` implements three distinct operations:

1. An explicit `replaces` ID produces a logged rewrite into a new ID.
2. Without `replaces`, token-set Jaccard similarity at least `0.8` can automatically replace a near-duplicate; an exact text repeat returns the existing row.
3. Otherwise it inserts the fact. Nearby records at threshold `0.4` can be returned to the model as suggestions for an explicit replacement.

These thresholds compare lexical overlap, not temporal truth or entity identity. Contradictions with high lexical overlap are an important test. Records contain ID, text, category, creation/update times, and a source label such as `agent` or `user`. This is not yet a full source-transcript/model/confidence provenance graph. **S.** [Memory tools][nm-tools], [store schema][nm-store], [provenance roadmap][nm-roadmap]

### 4.2 Persistence and retrieval

The SQLite tables hold facts, mutation history, metadata, and optional model-specific vectors. `all()` defaults to the **newest 1,000** facts; normal retrieval builds its candidate set from that method. Unicode word tokens are case-folded and require length greater than one; Chinese ideographs are combined into adjacent character bigrams, with a special case for a single character. Token sets discard term frequency. **S.** [Store][nm-store]

For query token set `Q` and candidate text token set `T`, lexical scoring is:

```text
score(q, item) = sum(log((N + 1) / df(token)) for token in Q ∩ T)
if stripped lower-case query occurs inside lower-case item text:
    score += log(N + 1) + 1
retain positive scores; sort descending score, then ascending creation time
```

This is an IDF-weighted overlap scorer, **not BM25**: no term-frequency or document-length normalization. An un-tokenizable query takes the recent-record path. `relevant()` returns all candidates when there are at most `k`; otherwise it ranks matches and fills empty positions with newest unmatched facts. Default `k = 20`. Consequently, irrelevant recent facts can intentionally appear even when search has no match. **S.** [Retrieval][nm-store], [defaults][nm-config]

With embeddings enabled and usable, a cached vector is keyed by memory ID, embedding model, and content hash. The search recomputes missing/changed vectors, embeds the query, and scores cosine similarity. Semantic candidates must reach the mean cosine, or mean plus one standard deviation when there are at least eight scores. It fuses up to `2k` lexical and semantic candidates by reciprocal rank, then applies the same recency fill. Endpoint failure falls back to lexical retrieval. **S.** [Embedding implementation][nm-embeddings]

Representative algorithm, independently expressed from the inspected source:

```text
recall_for_prompt(query, k=20):
    candidates = latest_facts(limit=1000)
    if len(candidates) <= k:
        return candidates

    lexical = rank_by_idf_overlap(query, candidates)
    if embeddings_work:
        cosine_scores = score_embeddings(query, candidates)
        cutoff = mean(cosine_scores)
        if len(cosine_scores) >= 8:
            cutoff += population_stddev(cosine_scores)
        semantic = highest_scores_at_or_above(cutoff)[:2*k]
        ranked = sort_by_sum_of_reciprocal_ranks(
            [lexical[:2*k], semantic], denominator_offset=60
        )[:k]
    else:
        ranked = lexical[:k]

    return ranked + newest_unselected_until_full(candidates, ranked, k)
```

The reciprocal contribution is `1 / (60 + rank)` with one-based ranks. The cutoff is relative to the current candidate corpus; it is not a calibrated relevance probability. These details make a small, distinguishable retrieval policy suitable for a controlled benchmark. **S/I.** [Fusion and semantic gate][nm-embeddings]

### 4.3 Consolidation cadence and constraints

The server checks for tidying during an eligible goal-scheduler tick: proactivity is on, quiet hours are off, and the main chat is idle without queued messages. At least 12 facts must exist. A pass becomes due initially, after eight net additional facts since the previous pass, after seven days, or when a prior pass left valid operations over budget. Housekeeping consumes that tick; it is not an unconditional nightly job. CLI/UI entry points can also request a pass. **S.** [Scheduler and tidy trigger][nm-service]

The model sees at most the newest 150 facts and proposes JSON merges/drops. Code validates known IDs, rejects reuse of a fact in two operations, caps replacement text at 300 characters, blocks direct drops of `source=user` records, and limits net removals to `max(4, floor(0.2*N))` per pass. A merge inherits the oldest creation timestamp and user provenance when any source was user-written. Accepted changes retain before/after text for undo. **S.** [Planner][nm-consolidate], [logged mutations][nm-store]

Important limits: the lexical merge guard permits numbers, short words, a connective allowlist, and selected inflections. Therefore its comment that no fact can be invented is stronger than the actual guarantee; recombination, changed numbers, or incorrect negation can pass. Also, user-origin facts cannot be directly dropped by this planner but can participate in merges. The newest-150 cap is not proof that every old record eventually receives review. **S/I.** [Guard and planner][nm-consolidate]

### 4.4 Forgetting, prompt assembly, and handoff

`forget(id)` deletes a live fact. Phrase-based forgetting deletes matching live rows **and logs their former text**, so the operation can be restored. `clear()` deletes live facts but does not itself erase the mutation log or vector table. Vector cleanup occurs when the embedding index next reconciles candidates for that model. Thus live recall exclusion, undo, and physical erasure are different guarantees here. **S.** [Forget, restore, and clear][nm-store], [vector reconciliation][nm-embeddings]

The prompt combines configured identity/instructions and profile, recalled facts with IDs/categories, active goals, calendar, device/tool descriptions, skills, and conversation-specific additions. The active transcript is separately clipped to a default 80 messages and four image-bearing messages; trimming tries to avoid beginning inside a tool exchange. This is a bounded transcript window, not a verified learned-summary compactor. **S.** [Agent prompt/window code][nm-core], [defaults][nm-config]

Device delegation sends a plain-language task and caller device name over the hub, waits for a result, forwards approval requests to the initiating UI, and returns evidence/tool notes. The sender is instructed to include required detail. This handoff does not automatically clone the local memory database; the receiver acts with its own environment/context. **S.** [Delegate tool][nm-delegate]

**Documentation/source reconciliation:** broad descriptions of readable memory files cover a family of mechanisms; the Python facts examined here reside in SQLite. The roadmap simultaneously acknowledges missing cross-device memory and richer provenance. A reproduction should label its runtime and version rather than collapse mobile files, desktop facts, synced chats, and roadmap ambitions into one implemented memory system. [Architecture][nm-architecture], [roadmap][nm-roadmap]

## 5. OpenBot: bot-wide lessons, thread-local history, and delayed reflection

OpenBot treats humans, bots, and external systems as actors with persistent inboxes. Incoming thread messages wake bot runs. A run rebuilds its prompt from stored thread messages, profile, and selected durable memories. The foreground can search/manage memories, while completed runs can schedule a background extraction pass. This is a complete inspectable integration around LangMem, not the source of Grok Bot. **S.** [Architecture][ob-architecture], [runtime][ob-runner]

### 5.1 Scope, data, and cadence

Long-term memory uses namespace `("bots", bot_id, "memories")`; searchable message history uses `("threads", thread_id, "messages")`. Both foreground write instructions and reflection ask for reusable working methods, team conventions, standing preferences, and lessons. They explicitly exclude single-thread status, issue/PR IDs, file names, branches, and task-specific decisions. This is an admission prompt, not a deterministic classifier enforcing scope. **S.** [Memory implementation][ob-memory]

After a successful completed run with background memory enabled, the runner passes the agent state's messages to a reflector. A pending batch and timer are keyed by **bot and thread**. Additional runs in that same thread append messages and reset the default 30-second timer; separate threads never share one extraction batch. The manager writes into the bot-wide namespace. It permits inserts and explicitly disables deletes; a lower-cost model is tried first when configured, with fallback to the main model. Detailed update behavior within the LangMem dependency was not independently audited here. **S/U.** [Reflector][ob-memory], [completion trigger][ob-runner], [configuration][ob-config]

The default persistent backend is a separate `.langgraph.db` beside the application database, with SQLite WAL. PostgreSQL adapters also exist; in-memory configuration uses volatile store/checkpoint implementations. Indexed content is configured through LangGraph, optionally with embeddings. Pending reflection batches/timers themselves are in-process, so a crash can lose deferred extraction despite persisted conversation data. **S.** [Persistence][ob-persistence], [architecture limitations][ob-architecture]

### 5.2 Read path and prompt construction

The initial memory query concatenates messages that woke the run, retrieves up to eight bot memories, and injects their readable content into the dynamic portion of the system prompt. Stable role/policy material is assembled separately. Foreground `search_memory` can retrieve more. Thread-message recall is a separate tool/namespace and does not imply promotion into long-term facts. When embeddings are off, calling a store's search method does not prove that semantic similarity ranking remains available. **S.** [Memory lookup][ob-memory], [prompt assembly][ob-prompt], [runner][ob-runner]

Delegates in a multi-bot thread normally see messages mentioning them, their own prior replies, and trigger messages; the coordinating/default bot receives broader thread history. Missing history can be fetched explicitly. The handoff therefore needs enough task context, while durable bot lessons are recalled independently. The router/delivery layer also holds a handoff while newer messages for the sender remain pending, then releases it automatically. This is persistent coordination logic rather than relying on the model to remember to re-send. **S.** [Scoped context][ob-runner], [delivery][ob-delivery], [actor wake/release][ob-actors]

Representative scheduling policy:

```text
on_completed_run(bot, thread, messages):
    if not bot.background_memory_enabled: return
    pending[(bot, thread)] += messages
    reset_timer((bot, thread), 30 seconds)

when_timer_fires(bot, thread):
    transcript = pop_pending(bot, thread)
    extract_durable_bot_lessons(
        transcript,
        destination=("bots", bot.id, "memories"),
        allow_insert=True,
        allow_delete=False,
        exclude_task_specific_facts_in_prompt=True
    )

before_run(bot, trigger_messages):
    query = concatenate(trigger_messages)
    inject(search(bot_memory_namespace, query, limit=8))
    supply_bounded_thread_history_and_recall_tools()
```

This reproduces the **integration policy**, not LangMem's entire extraction internals or an xAI backend. For a fair experiment, record the actual LangMem/model/embedding versions and whether the synthetic transcript preserves thread identity. **S/I.** [Memory integration][ob-memory]

### 5.3 Forgetting and important source/document distinctions

- Background reflection disables deletes, but foreground `manage_memory` is instructed to update/delete incorrect memories, and the operator path exposes direct deletion. The README's broad no-purge wording should not be interpreted as the absence of all delete operations. [README][ob-readme], [memory operations][ob-memory]
- The inspected `memory_enabled` branch controls reflection scheduling. Prompt memory lookup and foreground tool registration occur independently in this runner; it is not a complete read/write privacy toggle. [Runner][ob-runner]
- Bot-level namespaces prevent accidental cross-bot lookup in these tools, but same-bot cross-thread facts are visible by design. The prompt-only admission rule can still wrongly globalize a one-off decision. [Scope rules][ob-memory]
- A delayed batch is not a durable job queue. Exactly-once extraction, deduplication across repeated transcript segments, robust retry after crash, and provenance-aware derived-memory erasure are not established by this integration. [Reflector][ob-memory], [architecture gaps][ob-architecture]

These differences make OpenBot most valuable for **scope/cadence/handoff experiments**, rather than as another unexplained vector-search benchmark.

## 6. Firstmate: an explicit memory overlay for Grok Bot

Firstmate is a prompt-only community project. The inspected tree consists of the main prompt, README, attribution/license, and a research note. It does not implement a daemon, database, or independent model loop. Its operating instructions can nevertheless be translated into a reproducible experimental policy. **S.** [Repository at pin][fm-readme]

The policy separates a compact current-state index and standing-preference file from dated decision history, task state, and each bot's daily log. A coordinator owns shared current-state files; workers write only their own folders. Writers record decisions, completed work, reusable preferences, and lessons promptly, name superseded entries, and reconcile periodically. The current-state view resolves present-day questions; historical entries preserve what changed. **S, prompt policy.** [Prompt][fm-prompt]

Recall is agent-directed file retrieval: read the current index/preferences when missing a known fact and before crossing into another worker's domain, then consult relevant daily history. Delegation carries task IDs and expected completion evidence; results are checked before being recorded as shipped. This couples factual memory to handoff state and verification instead of treating every assistant assertion as an accomplished event. **S, prompt policy.** [Prompt][fm-prompt]

Representative policy:

```text
on_observed_decision_or_verified_outcome(event):
    append_to_writer_daily_log(event, supersedes=event.previous_fact)

on_periodic_reconcile_or_next_wake():
    coordinator_updates_current_index_and_preferences()
    coordinator_keeps_history_separate()
    coordinator_checks_overdue_task_ids()

before_cross_domain_action(task):
    read_current_index_and_preferences()
    read_relevant_owner_history_if_needed()
    delegate(task_id, task_context, expected_evidence)
```

The enforcement remains prompt-based. The README itself marks some host capabilities as field-observed and a cloud-agent path as unverified. Its August platform/plan information is older than the currently opened October official docs and should not be reused as current product guidance. Git history also retains prior text: pruning a current preference file is **supersession, not erasure**. **S/I.** [README caveats][fm-readme], [current Grok Bot overview][gb-overview]

## 7. What to reproduce first, and what to leave as research

These priorities are an experimental recommendation, not measured superiority:

| Candidate policy | Expected value | Smallest honest experiment | Main failure case |
|---|---|---|---|
| **nanoMuse lexical ranking + recent fill** | High: cheap, deterministic, distinct from pure top-k search | Feed a fixed set of facts; preserve tokenization, newest-1,000 cap, scoring, tie order, and injection budget | Irrelevant recent fill; old fact falling beyond candidate cap; multilingual token boundaries |
| **OpenBot separation of bot lessons and thread state** | High when the harness supports multiple tasks | Same experiences under task-scoped versus global admission; preserve `(bot, thread)` batches | A one-off instruction becomes a universal rule; task IDs leak into future work |
| **Firstmate current truth versus dated history** | High for supersession/handoffs | Shared current-state view plus immutable dated evidence; use explicit task IDs | Stale history overrides present facts; unverified completion enters durable state |
| nanoMuse hybrid semantic fusion | Medium; incremental infrastructure/cost | Add cached embeddings and relative standout gate to the same corpus | Corpus-dependent cutoff, weak embeddings, fallback changing ranking |
| nanoMuse model-planned tidy with deterministic limits | Research first | Score proposal validity, factual changes, user-origin preservation, undo, and deletion separately | Lexical guard passes semantic corruption; undo retains forgotten text |
| Entire Muse or Grok Bot “clone” | Poorly specified as a memory benchmark | Keep as documented behavior and a compatibility target | Architecture parity claim without proprietary writer/retriever evidence |

At minimum, benchmark **admission quality, stale-fact correction, source scope, retrieval coverage, prompt tokens, extraction tokens, write delay, crash loss, and forgetting semantics** independently. A result that answers one query correctly while retaining supposedly forgotten text in a change log has succeeded at recall and failed at that stronger deletion contract. A source-derived policy can be useful without importing an entire application or claiming to duplicate the closed product. **I.**

## Sources

Code citations above use the inspected commits. Official product pages are mutable snapshots of the observation window; the linked primary source controls each claim.

[meta-launch]: https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/
[meta-design]: https://introducing.muse.ai/
[meta-security]: https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse
[gb-overview]: https://docs.x.ai/grok-bot/overview
[gb-bots]: https://docs.x.ai/grok-bot/bots
[gb-team]: https://docs.x.ai/grok-bot/team-bots
[gb-security]: https://docs.x.ai/grok-bot/security-faq
[nm-paper]: https://arxiv.org/abs/2610.08699
[nm-license]: https://github.com/nano-muse/nanoMuse/blob/36ba867d516b05058e28df8fbffa0ac888179d69/LICENSE
[nm-roadmap]: https://github.com/nano-muse/nanoMuse/blob/36ba867d516b05058e28df8fbffa0ac888179d69/docs/roadmap.md
[nm-architecture]: https://github.com/nano-muse/nanoMuse/blob/36ba867d516b05058e28df8fbffa0ac888179d69/docs/architecture.md
[nm-app]: https://github.com/nano-muse/nanoMuse/blob/36ba867d516b05058e28df8fbffa0ac888179d69/nanomuse/app.py#L83
[nm-config]: https://github.com/nano-muse/nanoMuse/blob/36ba867d516b05058e28df8fbffa0ac888179d69/nanomuse/config.py#L271
[nm-prompts]: https://github.com/nano-muse/nanoMuse/blob/36ba867d516b05058e28df8fbffa0ac888179d69/nanomuse/prompts.py#L19
[nm-tools]: https://github.com/nano-muse/nanoMuse/blob/36ba867d516b05058e28df8fbffa0ac888179d69/nanomuse/tools/memory_tools.py
[nm-store]: https://github.com/nano-muse/nanoMuse/blob/36ba867d516b05058e28df8fbffa0ac888179d69/nanomuse/memory/store.py
[nm-embeddings]: https://github.com/nano-muse/nanoMuse/blob/36ba867d516b05058e28df8fbffa0ac888179d69/nanomuse/memory/embeddings.py
[nm-consolidate]: https://github.com/nano-muse/nanoMuse/blob/36ba867d516b05058e28df8fbffa0ac888179d69/nanomuse/memory/consolidate.py
[nm-service]: https://github.com/nano-muse/nanoMuse/blob/36ba867d516b05058e28df8fbffa0ac888179d69/nanomuse/server/service.py#L1918
[nm-core]: https://github.com/nano-muse/nanoMuse/blob/36ba867d516b05058e28df8fbffa0ac888179d69/nanomuse/agent/core.py#L257
[nm-delegate]: https://github.com/nano-muse/nanoMuse/blob/36ba867d516b05058e28df8fbffa0ac888179d69/nanomuse/tools/devices.py#L424
[ob-license]: https://github.com/regnull/openbot/blob/30d4a6c607fd0aa7f7e90354f516af29b3366747/LICENSE
[ob-readme]: https://github.com/regnull/openbot/blob/30d4a6c607fd0aa7f7e90354f516af29b3366747/README.md
[ob-architecture]: https://github.com/regnull/openbot/blob/30d4a6c607fd0aa7f7e90354f516af29b3366747/docs/architecture.md
[ob-memory]: https://github.com/regnull/openbot/blob/30d4a6c607fd0aa7f7e90354f516af29b3366747/backend/openbot/runtime/memory.py
[ob-runner]: https://github.com/regnull/openbot/blob/30d4a6c607fd0aa7f7e90354f516af29b3366747/backend/openbot/runtime/runner.py
[ob-prompt]: https://github.com/regnull/openbot/blob/30d4a6c607fd0aa7f7e90354f516af29b3366747/backend/openbot/runtime/prompt.py
[ob-persistence]: https://github.com/regnull/openbot/blob/30d4a6c607fd0aa7f7e90354f516af29b3366747/backend/openbot/runtime/persistence.py
[ob-config]: https://github.com/regnull/openbot/blob/30d4a6c607fd0aa7f7e90354f516af29b3366747/backend/openbot/config.py#L87
[ob-delivery]: https://github.com/regnull/openbot/blob/30d4a6c607fd0aa7f7e90354f516af29b3366747/backend/openbot/runtime/delivery.py
[ob-actors]: https://github.com/regnull/openbot/blob/30d4a6c607fd0aa7f7e90354f516af29b3366747/backend/openbot/runtime/actors.py#L228
[fm-license]: https://github.com/matteoantoci/firstmate/blob/dc26ad39f5584f23c8408478c6799c2bd69b0a1f/LICENSE
[fm-notice]: https://github.com/matteoantoci/firstmate/blob/dc26ad39f5584f23c8408478c6799c2bd69b0a1f/NOTICE.md
[fm-readme]: https://github.com/matteoantoci/firstmate/blob/dc26ad39f5584f23c8408478c6799c2bd69b0a1f/README.md
[fm-prompt]: https://github.com/matteoantoci/firstmate/blob/dc26ad39f5584f23c8408478c6799c2bd69b0a1f/PROMPT.md
