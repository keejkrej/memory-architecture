# Memory architectures in consumer assistants, coding agents, and personal agents

Observation date: **2026-10-12**. This is a public-source research report, not an account-level product test. Public documentation was opened, and selected public repositories were cloned and read at the commits listed below. Product pages are mutable; a source snapshot and a deployed account can differ. “Unknown” means the inspected primary sources do not establish the mechanism. It does not mean the capability is absent.

The research and OpenAI Docs skills informed source selection. No proprietary implementation is reproduced or inferred from access to a private system. The comparison is deliberately broad, not an exhaustive market census.

**Expansion, 2026-10-13:** the dedicated [Hermes source audit](hermes-agent.md),
[Muse/Grok Bot and counterparts](muse-and-grok-bot.md), and
[open-source implementation survey](open-source-implementations.md) extend this
map with current code. Closed backend details do not prevent studying independent
open implementations; their affiliation, source license and fidelity are separate
questions.

## 1. The distinctions that make comparisons meaningful

“Memory” is an overloaded product word. This report separates six operations:

1. **Capture:** admitting evidence into the system—messages, tool results, recordings, files, repository changes, browser activity, or connected-app records.
2. **Session continuity:** retaining or compressing the current conversation so a task can continue. A saved transcript, resume command, or compaction summary is not automatically a cross-session learned memory.
3. **Persistent instructions:** explicitly maintained rules, persona, project policy, or skills. `AGENTS.md`, `CLAUDE.md`, and editor rules can persist without any extraction pipeline.
4. **Learned memory:** extracting durable facts, preferences, procedures, failures, or decisions from experience, with some update/forget policy.
5. **Recall and application:** selecting relevant evidence and injecting it into a later model invocation. Search, bounded always-present summaries, and a recall subagent are distinct designs.
6. **Handoff:** packaging selected context for another task, agent, human, or execution environment. A useful handoff includes scope, evidence, remaining work, and authority—not just a summary of facts.

These are analytical categories, not claims that every product implements six separate services. They prevent misleading equivalences such as “has a vector index, therefore remembers the user” or “has Markdown instructions, therefore learns automatically.”

Evidence labels used below:

| Label | Meaning | What a reproduction can claim |
|---|---|---|
| **D — documented** | First-party product documentation states behavior. | A behaviorally similar design; not proprietary internals. |
| **S — source-verified** | The relevant public code or prompt was inspected at a commit. | Fidelity to the inspected component and configuration. |
| **I — inferred** | Explicit engineering synthesis from observed contracts. | A hypothesis or proposed experiment. |
| **U — unknown** | Extraction, representation, ranking, timing, or policy not publicly established here. | No exact replication claim. |

Openness is a separate axis. An open client does not open its model weights or hosted service; an editable memory file does not imply offline processing; a public GitHub repository does not automatically have an open-source license.

## 2. Breadth map: product, inputs, memory role, and outputs

Details and limits are developed in the sections that follow; the source column identifies the primary evidence for each row.

| Product / surface | Main observed input boundary | Memory role and representation | Downstream output / handoff | Evidence and openness |
|---|---|---|---|---|
| ChatGPT | Conversations and enabled personal context sources | Personalization feature; saved facts, history-derived context, background synthesis | New-chat answers; project context | D; hosted internals U. [Memory][chat-memory], [Dreaming][chat-dreaming] |
| ChatGPT Record | User-initiated audio capture | Transcript and generated notes retained as conversation artifacts | Later recall, plans, email, code | D; closed service. [Record][chat-record] |
| Codex | Agent rollouts, user corrections, tool evidence | Optional learned memory; versioned extraction/consolidation and file routing | Later task context and reusable procedural knowledge | S; Apache-2.0 harness. [Source][cx-start], [license][cx-license] |
| Claude chat / cloud Cowork | Conversations and task interactions | Topic memories; separate project context; past-chat RAG | Chat-to-cloud-Cowork continuity | D; proprietary implementation. [Claude memory][claude-chat] |
| Claude Code | Coding interactions, corrections, project files | Local learned topic files plus separately maintained instructions | New sessions and configurable subagent memory | D; product code not established as open source. [Memory][cc-memory], [license][cc-license] |
| Gemini Apps | Chats, explicit instructions, enabled connected Google data | Personal Intelligence feature | Personalized answers and suggested next steps | D; internal representation U. [History][gem-history], [apps][gem-apps] |
| NotebookLM / current Gemini Notebook documentation | User-selected source library, notes, conversation | Source-grounded research workspace | Cited answers and generated study/research artifacts | D; retrieval internals U. [Source/context contract][notebook-faq], [cross-app boundary][notebook-apps] |
| Cursor rules | Developer-authored instructions | Persistent scoped prompt material | Agent context | D; proprietary application. [Rules][cursor-rules] |
| Cursor Automations | Scheduled and event-triggered work | Per-automation persistent named notes | Subsequent runs, PRs, messages | D; hosted note implementation U. [Automations][cursor-auto] |
| Windsurf / legacy Cascade | Workspace conversations | Local automatically generated memories and explicit rules | Later conversations in the workspace | D; current docs distinguish legacy Cascade from Devin Local. [Cascade][windsurf] |
| GitHub Copilot Memory | Eligible agent activity and user preferences | Repository facts with code citations; personal preferences | Cross-surface cloud-agent/CLI/review reuse | D; hosted store U. [Copilot][copilot] |
| Cline Memory Bank | Project work captured through a configured documentation method | Project Markdown documents | Fresh-task continuation | D; Apache-2.0 client. [Method][cline-bank], [license][cline-license] |
| Roo Code | Editor task history, rules, tools | Task condensation and instructions; do not assume a built-in personal-memory service | Parent-to-child task delegation | S; Apache-2.0 archived project. [Condense][roo-condense], [handoff][roo-task] |
| Aider | Selected code, repository structure, chat | Code map, explicit conventions, chat summarization | Coding context and resumed history | S; Apache-2.0. [Map][aider-map-src], [history][aider-history] |
| Gemini CLI | Coding sessions and explicit instructions | Hierarchical Markdown plus experimental review-inbox extraction | Later sessions and promoted skills | D; Apache-2.0 harness. [Files][gemcli-files], [inbox][gemcli-auto], [license][gemcli-license] |
| Rovo Dev CLI | Project analysis and current conversation | User/project Markdown; explicit reflection command | Subsequent coding context | D; implementation not audited. [Memory][rovo-memory] |
| OpenClaw, formerly Clawdbot/Moltbot | Messaging and interactive agent work; notes and eligible transcripts | File-backed memory plus indexed provenance, consolidation, and recall | Personal-agent continuity, tools, tasks | S/D; MIT. [Architecture][oc-arch], [history][oc-lore], [license][oc-license] |
| Grok | Chats and permitted personalization data | Consumer personalization; detailed storage mechanism U | Personalized answers | D; no product memory source verified. [X documentation][grok] |
| Grok Bot | Messages, tools, computer work, demonstrations | Persistent role context, preferences, work summaries; team/private scopes | Bot-to-Bot messages, group handoffs, skills | D; proprietary product. [Overview][gb-overview], [team][gb-team] |
| Hermes Agent | Conversations, tool outcomes and transcript review | Bounded user/general notes, searchable episodes, procedural skills and background review | Later agent sessions, delegated tasks and skill reuse | S; MIT harness. [Pinned source audit](hermes-agent.md) |
| Meta Muse | Conversations, connected services and agent actions | Persistent personal-agent workspace; detailed writer/retrieval internals not established | Plans, actions, recurring work and device interaction | D; official contracts and independent nanoMuse/OpenMuse counterparts in the [Muse report](muse-and-grok-bot.md) |
| Instinct, likely instinct.com | Text/calls and connected action context | Personal assistant; actual memory machinery U | Life-administration actions | Identity likely, not user-confirmed. [Official site][instinct] |
| Open Instinct | Owner/contact messages, agent work | Editable durable notes plus daily journals | Textable personal agent and tier-scoped context | S; independent MIT project, not Instinct internals. [Memory][oi-memory], [license][oi-license] |
| Nell | Personal-agent interactions | Named as a related source-available implementation; not audited deeply here | Personal-agent tasks | Source-available FSL plus commercial portions; not presently Apache/MIT throughout. [License][nell-license] |
| Letta agents / Letta Code | Agent conversations and tool interactions | Persistent memory is a central product abstraction; block and filesystem variants | Shared blocks and future runs | D here; see the companion infrastructure survey for implementation/licensing depth. [Blocks][letta-blocks], [dreaming][letta-memory] |

## 3. ChatGPT: consumer personalization is not Codex memory

### 3.1 What the current sources establish

ChatGPT memory can draw on past chats, separately saved memories, custom instructions, Library files, and enabled connected apps. A displayed summary is only a view of remembered context, not a complete export of every factor used. Relevant sources may be shown beneath an answer. Saved memories can survive deletion of the originating chat; removing information completely can require deleting the memory and the underlying sources. Retrieval is selective, not a guaranteed scan of every past conversation on every response. These are product contracts; the vector schema, extraction prompts, ranking function, and conflict resolver remain undisclosed in the inspected documentation. **D/U.** [Memory in ChatGPT][chat-memory]

The June 4, 2026 announcement gives a more specific historical model: 2024 saved memories were written during conversations; the first “dreaming” system added background synthesis from history in 2025; the 2026 release identifies Dreaming V3. Its goals include factual continuity, preference adherence, and temporal freshness. The article reports efficiency improvements and provides behavioral examples, but does **not** publish the production store, scheduler, prompts, or full retrieval algorithm. It supports “background consolidation exists,” not “ChatGPT is this particular open-source vector database plus extractor.” **D.** [Dreaming announcement, June 4, 2026][chat-dreaming]

### 3.2 Scope and forgetting

Project-only memory excludes external personal memories and conversations and permits context from within that project. Shared projects automatically use this boundary. Current documentation permits changing a private project's memory setting; older advice that project-only mode must always be chosen at creation is stale. Project memory does not expose a simple list equivalent to saved personal memories. Removing a source conversation is part of controlling its use. Default project behavior differs by plan, so a benchmark must record both project mode and account/workspace settings. **D.** [Projects in ChatGPT][chat-projects]

Storage, personalization, and model training are separate controls. Current temporary-chat documentation distinguishes using existing personal context from creating new memories: personalized temporary chats can use existing memories; temporary chats do not create or update them while temporary. Consumer model-improvement settings and business defaults differ. A reproduction should record read-enabled, write-enabled, source-retention, and training-consent states independently. **D for controls; I for the experimental representation.** [Consumer data handling][chat-data]

### 3.3 Capture and handoff surfaces

Record mode transcribes audio, produces notes, and can make earlier recordings available for cross-conversation recall. Audio is deleted after transcription; notes and transcripts have their own retention. Generated material can become a project plan, email, or code scaffold. This is an explicit capture→artifact→recall→action path, not evidence of continuous desktop recording. **D.** [ChatGPT Record][chat-record]

Do not use old Atlas pages as evidence of an active browser-memory product. On the observation date, the prior privacy URL redirects to an official retirement article. That article also distinguishes Atlas browser memories from ChatGPT memories and says deleting ChatGPT chats does not delete Atlas-specific data. **D.** [Atlas retirement][atlas-retired]

### 3.4 Reproducible analogue

An honest `chatgpt-inspired` experiment can combine explicit durable facts, a history store, periodic synthesis, and query-conditioned recall. The background interval, fact schema, embedding model, priority rules, and prompt are **experimental choices**, not recovered ChatGPT internals. Compare synchronous extraction with delayed background consolidation and test whether temporary plans become stale. Do not label a local implementation “ChatGPT memory replicated.” **I.**

## 4. Codex: a publicly inspectable learned-memory pipeline

### 4.1 Pin, availability, and the four mechanisms

The public `openai/codex` checkout inspected here is **`0c329ad2c9d5a2592128a1d536c66e16f9397e46`**, committed 2026-10-12. Its harness is Apache-2.0; that license is not a license to hosted models or a claim that every Codex surface deploys this exact commit. [Pinned license][cx-license]

Keep these mechanisms distinct:

| Mechanism | Writer | Lifetime and purpose | Evidence |
|---|---|---|---|
| `AGENTS.md` discovery | Human or an explicitly directed agent | Persistent instructions assembled from global/project directory scopes | [Official guide][cx-agents] |
| Saved rollout / session resume | Harness | Recover one conversation and execution history | Source rollout handling; not equivalent to learned memory. [Extraction input][cx-input] |
| Context compaction | Harness/model | Compress the active context to continue a long task | Separate public component. [Compaction][cx-compact] |
| Learned memories | Background extraction and consolidation workers | Reuse selected experience in later sessions | [Startup][cx-start], [phase one][cx-p1], [phase two][cx-p2] |

The inspected feature registry names `memories` as stable but sets `default_enabled: false`. Effective memory configuration defaults to V1, with independent generation and use settings, optional dedicated tools, and optional dual writing. An implementation existing in source therefore does not establish that a particular user account has it enabled. **S.** [Feature registry][cx-features], [memory configuration][cx-config]

### 4.2 Capture boundary and extraction cadence

At eligible root-session startup, the harness spawns the memory pipeline asynchronously. It skips ephemeral sessions, disabled memory features, and non-root agents, and requires the memory/state store. It prepares a memory root, prunes stale raw records, checks rate limits, then runs extraction before consolidation. It can execute this separately for both supported memory versions. This is a concrete **later-session startup trigger**, not proof that every completed assistant message immediately becomes a memory. **S.** [Startup implementation][cx-start]

Phase one claims recent, eligible, sufficiently idle interactive rollouts with bounded startup work and leases. Each selected rollout is filtered into memory-relevant response items and sent to an extraction model. The pipeline distinguishes useful output, successful no-op, and failure; job ownership and retries coordinate concurrent startups. The input is a transcript of user instructions and the agent's observed work, not arbitrary screen activity outside the harness. **S.** [Phase-one implementation][cx-p1], [rollout sanitization][cx-input]

V1 extraction yields `raw_memory`, `rollout_summary`, and an optional slug. The prompt prioritizes user corrections and preferences, observed verification, reusable procedures, and failure avoidance; it explicitly permits no output for low-signal activity. It distinguishes success, partial, uncertain, and failed tasks, and warns against treating brainstorming or assistant suggestions as adopted decisions. Secrets are redacted from generated fields in code. Prompt instructions are evidence of intended behavior, not a guarantee that extraction will always make the right judgment. **S.** [V1 extraction prompt][cx-prompt1], [output parsing and redaction][cx-output]

### 4.3 V1 representation and consolidation

The public pipeline combines database-backed per-rollout outputs with inspectable Markdown artifacts:

```text
memories/
  raw_memories.md                 mechanically assembled phase-one input
  rollout_summaries/*.md          per-rollout evidence and outcome summaries
  MEMORY.md                      searchable task/workflow handbook
  memory_summary.md              small injected index and user context
  skills/*/SKILL.md               optional reusable procedures
  extensions/ad_hoc/notes/*.md    explicit user correction/remember/forget requests
```

The exact workspace includes additional coordination and diff artifacts. `MEMORY.md` is not a dump of the transcript: the consolidation prompt requires task groups, scope/applicability, evidence links, retrieval keywords, and reusable lessons. This is a **routing hierarchy**, with detailed evidence left outside the initial prompt. **S.** [V1 consolidation prompt][cx-prompt2]

Phase two obtains a global lock, selects a bounded set of stage-one records, syncs current inputs into the memory workspace, computes a Git-based diff against its previous successful baseline, and skips model work when nothing changed and outputs are valid. An internal consolidation agent updates higher-level memory with restricted local permissions. The documented selection favors usage and recency and excludes records beyond an unused-retention window; these are separately configurable from rollout age and extraction cadence. **S, with the selection description also documented in the repository.** [Phase two][cx-p2], [pipeline README][cx-readme]

This separation has practical consequences. Parallel extraction can scale independently; global consolidation needs serialized writes; source deletion must propagate from raw records to the registry and injected summary; no-op detection avoids paying for identical consolidation. A prototype that merely calls “summarize this chat” once implements only a small part of this design. **I from the inspected pipeline.**

### 4.4 V1 read path, correction, and forgetting

The read integration injects a bounded `memory_summary.md` into developer instructions. The inspected limit is 2,500 tokens. The V1 prompt directs a lightweight search of `MEMORY.md`, then relevant rollout summaries or skills, and eventually original rollout evidence when precision requires it. A local dedicated search backend implements text matching with scope, normalization, line context, and pagination; it is not a vector-only retrieval design. The default configuration does not enable those dedicated tools, so prompt-directed ordinary file tools are another path. **S.** [Prompt construction][cx-read-build], [limit and extension][cx-ext], [read prompt][cx-read1], [search implementation][cx-search]

The read prompt treats historical memory as potentially stale and instructs verification of consequential or changeable claims. User-requested additions, corrections, and deletions become small ad-hoc note files; the foreground agent is told not to rewrite generated memory directly. The consolidation prompt then applies changes, removes facts supported only by deleted sources, preserves facts with remaining support, and updates stale indexes. This is provenance-aware forgetting at the prompt/workspace layer, not demonstrated cryptographic erasure of every retained copy. **S.** [Read/update instructions][cx-read1], [consolidation and source deletion][cx-prompt2]

The scope is a Codex home memory workspace, with task/project applicability encoded in the content. It is not correct to assume one hard isolated memory database for every repository. Source instructions specifically preserve working-directory and checkout boundaries to reduce accidental reuse. The model may still misapply a scoped fact, so cross-project leakage belongs in evaluation. **S/I.** [V1 handbook format][cx-prompt2]

### 4.5 V2 is a materially different experimental target

The same commit supports a second memory version. V2 phase-one output contains **only** `rollout_summary` and `rollout_slug`; the parser never decodes a V1 raw-memory field and caps its summary to 9,000 bytes. Its prompt emphasizes faithful task history, chronology, authorization, incomplete work, and user corrections without overgeneralizing one-off requests into global preferences. **S.** [Version-specific output schema][cx-output], [V2 extraction prompt][cx-prompt1v2]

V2 consolidation writes a single compact `memory_summary.md`, instructed to stay comfortably below 10,000 UTF-8 bytes, with profile/preferences/tips and task-scoped routes to rollout summaries. It does not instruct generation of V1's separate handbook or learned skill directory. The V2 read prompt encourages using useful injected pointers directly and opening a rollout only when its additional evidence could change the answer; it discourages speculative retrieval. **S.** [V2 consolidation][cx-prompt2v2], [V2 read prompt][cx-read2]

This gives a valuable controlled comparison: **V1 richer intermediate handbook versus V2 direct summary-to-episode routing**, while keeping the same replay stream, model, and query set. Measure answer quality, preference overgeneralization, forgotten constraints, writing tokens, lookup count, and retrieved context size. Neither variant should be described as “the only current Codex memory architecture.” **I.**

### 4.6 Fidelity limits

Public source enables a high-fidelity reproduction of data flow, prompt contracts, eligibility, and file layout. It does not guarantee the same model, rollout distribution, deployment flags, quotas, or product integration. This study read the code; it did not compile the harness or run a live Codex memory benchmark. “Source-verified” in this report means inspected, not empirically proven correct under all failures.

## 5. Claude chat and Claude Code are separate memory products

### 5.1 Claude chat and cloud Cowork

The current help page describes **individual topic memories saved during chat**, including explicit “remember” requests, separate project memory, and continuity between chat and cloud Cowork. It separately labels daily synthesized summaries as a legacy experience for a remaining subset of Team/Enterprise organizations. Past-chat search is RAG with visible tool calls and project boundaries. Pausing retains memories without using/updating them; resetting deletes them. Turning memory off for one chat does not remove that chat from history search, whereas incognito is a separate control. Detailed topic schema, retrieval ranking, and conflict resolution are U. **D.** [Claude chat search and memory][claude-chat]

An experimental analogue should therefore separate a synchronous topic writer from a history-search tool, then implement the legacy daily-summary design as a separate variant. Do not use the same “Claude memory” label for both. Test a moved deadline before the next scheduled synthesis and test whether a non-memory chat remains searchable. **I.**

### 5.2 Claude Code

Claude Code documents authored instructions and auto memory as distinct. Auto memory is local to a repository, shared across its worktrees, under `~/.claude/projects/<project>/memory/`, with an index and topic files. The first 200 lines or 25 KB of `MEMORY.md` load at conversation start; topic files are read as needed. The agent writes notes during work. Memory survives the session-transcript cleanup period until edited/deleted; it is not automatically shared across machines. `/memory` provides controls, and an environment variable can disable auto memory. The document warns that conflicting instructions are not a deterministic policy engine. **D.** [Claude Code memory][cc-memory]

Session continuity has a different mechanism: messages/tool use/results are saved locally as JSONL; resume appends to an existing session, while a fork copies history into a new one. Compaction clears older tool outputs and summarizes history as context fills. Subagents normally receive separate contexts; a fork is an explicit exception. This is important for handoff evaluation: a successful resumed task may demonstrate transcript continuity rather than learned cross-session memory. **D.** [How Claude Code works][cc-how]

A configured subagent can maintain memory in `user`, `project`, or `local` scope. This is a role-specific learning channel, rather than an assumption that every helper sees all parent memory. **D.** [Subagent configuration][cc-subagents]

The public Claude Code repository's license is proprietary/commercial rather than an Apache/MIT release of the full product. Published docs and plugin examples enable behavioral analogues; they do not establish source parity with the shipping memory harness. **D.** [Claude Code license][cc-license]

## 6. Gemini: distinguish instructions, chat recall, and connected-data personalization

Gemini documents memory of earlier chats, with requirements tied to personal accounts and saved activity. Correct a fact in chat; deleting remembered information requires removing all source chats. If the same information remains in a connected app, disconnecting it and removing copied chat context are distinct operations. Changes to connected sources may take days to affect personalization. The inspected sources do not specify whether each response uses a synthesized profile, a search index, cached facts, or some mixture. **D/U.** [Past-chat memory][gem-history]

Explicit instructions and in-chat “remember” requests are another surface. Current documentation says support for remembered details is rolling out and has account/region restrictions, while instructions have broader availability. These controls should not be collapsed into “all Gemini users have the same memory.” **D.** [Remembered details and instructions][gem-explicit]

Personal Intelligence can use enabled Google services, rather than only prior conversation text. Turning personalization off in a chat changes use of those sources but does not necessarily stop the chat being saved and influencing future chats. A temporary chat is a separate capture/retention choice. **D.** [Connected-app personalization][gem-apps]

With activity enabled, Google describes retention and improvement uses for chats and shared media, with distinct defaults for audio/video/screenshares and separate rules for human-reviewed data. Therefore “local file uploaded,” “connected Gmail retrieved,” and “memory saved” cannot be treated as identical privacy events. **D for the controls; I for the modeling lesson.** [Gemini Privacy Hub][gem-privacy]

An implementable analogue is a permission-aware source federation: manual instructions plus historical chats plus separately scoped app-source retrieval. Exact Gemini extraction cadence, source ranking, and persistent representation remain U. Evaluate source freshness and deletion propagation, not merely whether the model can repeat a personal fact. **I.**

### 6.1 NotebookLM is a useful boundary case

The current Google documentation reached through this product family is labeled **Gemini Notebook**. Its FAQ distinguishes selected sources, conversation history, and notes selected by the user; source retrieval grounds the response in the notebook's materials. This is a research workspace with persistent source context, not evidence of an automatic global user-profile extractor. Its internal chunking/index/reranking machinery remains U here. **D/U.** [Notebook source and context contract][notebook-faq]

Cross-app access does not imply identical grounding. Google's current integration page says Gemini Notebook uses the notebook's sources exclusively, while Gemini Apps and Search AI Mode may also use web search and other tools. Sources, instructions, and deletions can synchronize while AI Mode chat histories remain separate. Generated audio/video overviews and other Studio artifacts are another output surface. **D.** [Notebook integration boundaries][notebook-apps]

For evaluation, keep a `curated-library-rag` baseline separate from learned personal memory. Give it only intentionally selected sources and measure citation support and task artifacts. A user adding a note is an explicit curation event; do not count it as the same extraction workload as remembering an incidental preference from noisy activity. **I.**

## 7. Coding assistants beyond Codex and Claude Code

### 7.1 Cursor: separate rules, historical Memories beta, and Automation memory

Current rules documentation supports versioned project `.mdc` files, user rules, team rules, and `AGENTS.md`, with automatic/path/relevance/manual application. This is persistent prompt context; it need not involve automatic learning. **D.** [Cursor rules][cursor-rules]

The June 4, 2025 launch described a per-project, individual Memories beta. The older dedicated memories documentation URL now redirects to the general docs. Consequently, an old indexed sidecar-extraction description is insufficient evidence for the current editor. Preserve that feature as **historical documented behavior**, not a present-day default. **D/U.** [Cursor 1.0 changelog][cursor-old], [former memory URL][cursor-old-url]

Automation memory is independently documented today: persistent named entries, `MEMORIES.md` by default, exist outside the working filesystem and survive runs of the same automation. The agent can read/write/delete them; users can edit or disable them. Inputs can arrive from schedules, repository events, Slack, webhooks, and other integrations. These notes bridge repeated tasks even when each run has a different execution workspace. **D.** [Cursor Automations][cursor-auto]

Experimental target: a namespaced key/document store per automation, with explicit memory tools and event replay. Keep repository rules and automation notes separate; test poisoning through webhook inputs and accidental sharing between two automations. Exact background extraction and conflict algorithms are U. **I.**

### 7.2 Windsurf / Cascade / Devin Desktop

The old Windsurf URL currently redirects to Devin Desktop documentation. It states that autogenerated memories apply to **legacy Cascade only**; the new default Devin Local agent does not persist them. Cascade saves workspace-specific memories locally under `~/.codeium/windsurf/memories/`, can create them during conversation or on request, and retrieves them when considered relevant. They do not transfer automatically to other workspaces or source control. Rules and `AGENTS.md` are the recommended explicit durable/team-shared channel. Editing is exposed in the UI; exact retrieval and automatic reconciliation remain U. **D.** [Cascade memories and rules][windsurf]

A faithful comparison must identify the agent mode and product version. “Windsurf has automatic memory” without that qualification now combines two different behaviors. An analogue of legacy Cascade can use workspace-scoped notes and relevance retrieval, but the underlying decision policy is not publicly recovered here. **I.**

### 7.3 GitHub Copilot Memory

Copilot distinguishes repository facts from user preferences. Repository facts carry code citations and are validated against the current branch before use; only substantiated facts should be applied. Repository facts are scoped to that repository, while user preferences follow that user and, in managed plans, the active billing entity. Cloud agent, review, CLI, and agentic autofix can share learned context with feature-specific limits; review does not use personal preferences. Unused entries expire after 28 days, with successful validation/use potentially resetting the timer. Creation requires eligible user activity, not unrestricted passive repository scraping. Owners/users/admins have scoped review and deletion controls. **D.** [Copilot Memory][copilot]

This is a particularly useful experiment: store `{claim, source_path, source_span, source_revision, scope, last_validated_at}` and validate evidence against the current checkout before injection. Add a preference store with separate identity rules. The cited fields are a **proposed schema**, not GitHub's disclosed database schema. Compare citation-validation versus unverified semantic retrieval under renamed APIs, abandoned PRs, and changed build commands. **I.**

### 7.4 Cline Memory Bank

Cline describes Memory Bank as a **documentation methodology** configured through instructions, rather than a hidden background service. Its standard project files cover brief, product context, active context, system patterns, technical context, and progress. The agent reads those files and updates them on explicit requests or meaningful milestones; active context changes frequently. This supports “document state, start a fresh task, read state,” and can be inspected/versioned with the project. The method itself does not specify embeddings, deterministic conflict resolution, or automatic expiry. **D.** [Cline Memory Bank][cline-bank]

Cline's code is Apache-2.0, but the source license does not turn a configured Memory Bank prompt into a guaranteed built-in learning policy. **S for inspected license; D for method.** [Pinned Cline license][cline-license]

This is a useful low-complexity baseline: a small set of purpose-specific files, explicit update checkpoints, and startup reads. Evaluate token cost of reading all documents versus an index-and-on-demand variant; separately score whether handoff state preserves unfinished work rather than promoting it into settled architecture. **I.**

### 7.5 Roo Code

Roo Code's public repository was archived and its extension shut down on May 15, 2026; treat it as a historical, forkable implementation. Its Apache-2.0 source remains inspectable at `b867ec9145750d0ae1ff7f02d35406e9bf2a0b16`. [Repository status][roo-repo], [license][roo-license]

The inspected condensation module transforms tool activity into summarizable text and uses a continuation-oriented summary prompt. Custom instructions load from files/scopes. `new_task` passes an explicit mode, message, and optional checklist to a child task through a delegation operation. These establish **session compression, durable instructions, and a handoff packet**. They do not establish an automatically maintained global personal memory system; a Memory Bank extension should be identified as an added workflow. **S.** [Condensation][roo-condense], [instructions][roo-rules], [new task][roo-task]

### 7.6 Aider

Aider's repository map is derived from code: tree-sitter extracts symbols and graph ranking chooses useful definitions within a token budget. It represents the codebase, not learned autobiographical facts about the user. Explicit conventions can be supplied as read-only context. **S/D.** [Pinned map implementation][aider-map-src], [conventions][aider-conventions]

The inspected `ChatSummary` compresses older messages while retaining a recent tail and recursively summarizes when needed. Chat-history restoration is a separately configurable option. These are conversation-budget and continuity mechanisms. They do not by themselves create a cross-project preference store with write/retract semantics. **S.** [History implementation][aider-history], [options][aider-options]

Aider is a useful Apache-2.0 baseline for **code-derived context plus history compression**, allowing learned-memory benefits to be measured against a capable context system rather than an artificially empty assistant. Pin: `5dc9490bb35f9729ef2c95d00a19ccd30c26339c`, 2026-05-22. [License][aider-license]

### 7.7 Gemini CLI: inferred memory as a reviewable proposal

Direct memory writes use ordinary file-edit tools. Shared project instructions go to repository `GEMINI.md`, private project notes to a separate project memory folder, and global preferences to `~/.gemini/GEMINI.md`. These locations express different audiences; a private preference should not be silently committed as a team instruction. **D/I.** [Memory files][gemcli-files]

Instruction loading concatenates global and workspace/ancestor files, with just-in-time discovery when tools access a more specific directory. `/memory show` exposes the loaded context and `/memory reload` rescans it. This is contextual loading, not evidence of a hidden vector store. **D.** [Context hierarchy][gemcli-context]

Experimental Auto Memory is disabled by default. At startup, a background service examines local sessions idle for at least three hours with at least ten user messages, excluding active, trivial, and subagent sessions. Locks, processed-version state, and throttling coordinate extraction. The extractor may produce nothing, or propose memory patches and skill drafts in a project inbox. It cannot directly change active memory or shared project instructions. The user reviews, applies, promotes, or discards candidates; allowed memory patches are applied atomically and context is reloaded. Model analysis can transmit selected transcript content despite local storage. Disabling extraction leaves existing inbox artifacts on disk. **D, not source-verified end-to-end.** [Auto Memory][gemcli-auto]

The public harness license is Apache-2.0, checked at observed HEAD `51617c1bcbcb038291125b092501b4342f4e7f77`. A `reviewed-extraction-inspired` variant would measure proposal quality, acceptance cost, patch conflicts, and downstream gains separately. Its distinction is the promotion boundary: inferred candidates are not yet active knowledge. **S for license; I for experiment.** [License][gemcli-license]

### 7.8 Rovo Dev CLI: deliberate reflection into instruction files

Rovo Dev CLI documents user memory in `~/.rovodev/AGENTS.md` and project memory in `AGENTS.md` / `AGENTS.local.md`. `/memory init` analyzes the project; `/memory reflect` analyzes the current conversation and integrates insights into memory. Edit commands expose user and current-directory files. Documented priority is user memory, current directory, then progressively more distant parents. This is an explicit reflection-to-Markdown workflow, useful as a low-complexity comparator for automatic extraction. The inspected page does not establish an independent fact database, automatic expiry, or a semantic conflict resolver. **D/U.** [Rovo Dev CLI memory][rovo-memory]

## 8. OpenClaw: inspectable personal-agent memory with trust-aware consolidation

### 8.1 Identity and version

Clawdbot, Moltbot, and OpenClaw are historical names in the same project's documented lineage, not three independent memory architectures. The inspected OpenClaw commit is **`45d731e39715aabaf8665f63ca86d7031b3a0b1e`**, 2026-10-12, under MIT. This is a large evolving system; its current design is substantially richer than early descriptions of a few Markdown files and vector lookup. [Project history][oc-lore], [license][oc-license]

### 8.2 Product boundary and representations

OpenClaw is a personal-agent runtime. Memory supports its continuing operation; the product is not merely a memory database. The default Memory Core has several distinct surfaces:

| Surface | Role | Typical admission / read behavior |
|---|---|---|
| `AGENTS.md` and related instruction files | Standing instructions | Kept distinct from learned facts |
| `USER.md` | Compact user model | Budgeted bootstrap; preference status/supersession semantics |
| `MEMORY.md` | Curated durable non-profile facts and decisions | Budgeted bootstrap and recall |
| `memory/YYYY-MM-DD.md` | Episodic observations / working context | Append-oriented capture and indexed retrieval |
| Session transcripts | Original interaction evidence | Eligible ingestion and controlled session lookup |
| SQLite index/state | Search, provenance, ranking, ingestion, locks, lineage | Machine metadata outside prose |
| `DREAMS.md` and phase reports | Human review trail | Not ordinary prompt injection |
| Standing intents / scheduled jobs | Future conditions and timed work | Triggered execution, distinct from passive fact recall |

This table synthesizes the pinned public docs. “Plain files” describes inspectable content, not an absence of database state or optional plugins. **D at pinned source.** [Memory overview][oc-overview], [architecture][oc-arch]

### 8.3 Write/extraction cadence

During work, episodic notes can collect observations. A pre-compaction flush creates a dedicated turn that appends useful facts to the canonical daily note and treats curated/bootstrap files as read-only. This gives long-running sessions a chance to persist evidence before history compression. The inspected implementation has an explicit no-content response and configurable enablement/threshold behavior. **S.** [Flush plan][oc-flush]

A background dreaming sweep stages and consolidates evidence. Its documented phase order is light→REM→deep: staging/deduplication, theme/reflection work, then gated durable promotion. Interactive session transcripts can feed the process; cron, heartbeat, subagent, and unknown session types do not become durable candidates through that route. Daily notes and session ingestion accommodate both one long conversation and many short ones. **D/S where the gate was inspected.** [Dreaming specification][oc-dreaming], [eligibility gate][oc-gate]

The phase names are implementation labels, not evidence of biological equivalence or evidence that all software called “dreaming” uses this algorithm. ChatGPT's public dreaming announcement does not establish shared implementation with OpenClaw. **I.**

### 8.4 Promotion, conflicts, and concurrency

The crucial inspectable rule is structural: `isPromotionOriginBlocked` excludes `untrusted` and `system`; consolidation requires `owner` or `agent` provenance and interactive origin for session-derived candidates. High similarity or repeated recall cannot override that gate. Source provenance is machine metadata, not a sentence inside a note claiming to be trusted. **S.** [Consolidation candidate code][oc-gate]

The architecture documents additional bounds: weighted candidate ranking, live-source rehydration, deduplication/supersession, output validation, a cap on prior-entry loss, bootstrap-size limits, rewrite preimages, and an append fallback. It uses content-hash checks before replacement to avoid blindly overwriting an intervening edit. These mechanisms address both over-aggressive forgetting and concurrent agent/human writes. Their full implementation was not audited line by line here; classify the full contract as **D**, with selected source verification, not an end-to-end safety proof. [Dreaming][oc-dreaming], [architecture][oc-arch]

### 8.5 Retrieval and injection

The inspected hybrid search code merges vector and keyword candidates, retaining source path/line information, provenance, importance, and project metadata. It supports temporal and diversity reranking and active-project weighting. That is materially different from treating the embedding score as the only relevance signal. **S.** [Hybrid merge implementation][oc-hybrid]

The documented recall design has a cheap lane—budgeted bootstrap plus trusted trigger matches—and an optional escalation lane. Active Memory can run a restricted recall subagent when a message has recall intent and the cheap lane lacks a strong hit. A `NONE` result, skip, or unavailable recall is distinguished from a useful retrieved summary. Other modes allow always-on or disabled deep recall. The agent may still use explicit search/read tools; tool retrieval and automatic hidden injection are not the same operation. **D.** [Recall architecture][oc-arch], [Active Memory flow][oc-active]

Project identity is a relevance/eligibility signal, while conversation visibility controls define which historical sessions may be searched. Private cross-conversation recall is not automatically permission to read group conversations or another agent's private sessions. A handoff or child-completion delivery does not itself run the conversational Active Memory lane. **D.** [Active Memory scope][oc-active]

### 8.6 Forgetting and privacy boundaries

Memory provenance tracks sources through staged/promoted entries so a session-targeted forget operation can remove attributable derivatives and prevent re-ingestion. Admission exclusions affect future ingestion; they are not retroactive deletion. The docs explicitly call out incomplete coverage: handwritten notes, direct edits, older untracked entries, raw transcripts, and retained copies can require separate treatment. Thus “forget” must be tested at source, note, index, bootstrap, diary, backup, and re-ingestion levels. **D for coverage; I for test requirement.** [Provenance and deletion][oc-provenance]

The architecture also records a limitation in taint propagation: network results participate only when tools declare their origin. Local reads of previously untrusted material may not receive the same classification automatically. Open source makes this boundary inspectable; it does not eliminate it. **D.** [Trust-boundary discussion][oc-arch]

### 8.7 Reproducible variants

Use explicit names and component boundaries:

| Variant | What to implement | What the name must not imply |
|---|---|---|
| `openclaw-files-inspired` | Daily notes, compact durable notes, explicit search/read, pre-compaction flush | Full current provenance/dreaming/Active Memory parity |
| `openclaw-gated-consolidation-inspired` | Add origin/session gates, staged candidates, merge/supersede, versioned durable rewrite | Proven secrecy for every source and retained copy |
| `openclaw-recall-escalation-inspired` | Cheap trusted retrieval, recall-intent gate, bounded recall agent | The same model, ranking calibration, or latency as a deployed installation |

These are implementable from public mechanisms. A full-fidelity run would need the exact commit, plugin selection, effective configuration, model and embedding providers, clock, workspace state, source audience labels, and network conditions. **I.**

## 9. Grok, Grok Bot, and the ambiguous “grokbot” name

Grok's consumer personalization controls and history deletion are documented by X, but that source does not publish a memory extraction/storage architecture. Do not infer that the consumer assistant uses Grok Bot's memory or a same-named community GitHub repository. **D/U.** [About Grok][grok]

There is now an official **Grok Bot**, announced August 11, 2026. It is the strongest match to the user's “grokbot” reference, though the exact intended product was not explicitly confirmed. It provides persistent agents with computer access and continuing work. **D.** [Official launch][gb-launch]

The current product describes Bots that retain preferences, facts, and work summaries; keep role descriptions separate from task-specific messages; and share context via direct messages, group conversations, and files. Duplicating a Bot copies setup but not its learned memory/history. Removing a Bot is not equivalent to deleting shared computer state. The precise memory store, extraction cadence, ranking, and conflict algorithm remain U. **D/U.** [Create and manage Bots][gb-bots]

The input/output loop goes beyond chat: Bots can use connectors or their browser/terminal, learn a demonstrated workflow as a skill, rerun work, and pass ownership between agents. This is an explicit memory-to-handoff product surface. **D.** [Grok Bot overview][gb-overview]

Team Bots separate team memory from notes private to each person. The docs say team facts are saved when someone specifies they are for the team; private notes follow that person between app chat and Slack DMs. A shared template is another mechanism and should not be equated with one continuously shared agent. **D.** [Team Bots][gb-team]

Isolation is at a different layer: each user gets a dedicated microVM, while that user's personal Bots share the computer and sign-ins. Separate role/conversation memories are therefore **not** a computer or credential isolation boundary. **D.** [Security FAQ][gb-security]

A safe experimental analogue has separate stores for bot role, person-private notes, explicitly shared team facts, task state, and reusable skills. Handoffs carry selected context and source identities rather than cloning every memory. This schema is an architectural proposal, not a recovered Grok Bot database. **I.**

## 10. Instinct identity and genuinely inspectable alternatives

### 10.1 Instinct itself

The likely intended product is **Instinct at instinct.com**, whose official site describes a textable/callable personal assistant that can operate a phone/computer and perform life-administration tasks. The minimal public page does not establish its memory representation, extraction cadence, retrieval, conflict handling, deletion semantics, or code license. Those fields remain **U**. A third-party teardown may motivate questions, but it cannot serve as verified production source code. [Instinct official site][instinct]

Names matter: an unrelated creative product also uses “Instinct AI”; independent implementations market themselves as open Instinct alternatives. They should not be silently substituted for the original assistant.

### 10.2 Open Instinct: small enough to understand end to end

`mariagorskikh/open-instinct` is an **independent MIT-licensed project**, inspected at `79a144a0629833f92f027a8049ab5578cc2f9b39`, 2026-10-12 UTC. Its public architecture explicitly positions itself as an alternative and distinguishes itself from another similarly named project. **S/D.** [License][oi-license], [architecture][oi-arch]

The actual memory code is straightforward. `memory/MEMORY.md` stores durable notes; `memory/journal/YYYY-MM-DD.md` stores daily observations. Writes expose append and replace operations. The prompt digest uses a 4,000-character default budget, split 60% durable head, 25% today's journal tail, and 15% yesterday's tail. This is deterministic **bounded concatenation**, not semantic retrieval. Session compaction is delegated separately to the underlying agent session machinery. **S.** [MemoryStore implementation][oi-memory]

The runtime rebuilds the prompt around current state. An owner in the owner's thread receives the full digest. A non-owner receives only a parsed Preferences section if policy allows it, capped to a smaller budget; otherwise no memory digest is supplied. Group or contact identity changes therefore alter what memory reaches the model. There is no need to rely solely on a prompt saying “please do not disclose the rest.” **S for digest selection, not a full security audit.** [Runtime selection][oi-runtime], [prompt composition][oi-prompt]

Agent tools write durable notes or journals; the store code itself has no semantic deduplication or automatic contradiction resolver. `replaceDurable` permits rewriting, but a caller must decide what to supersede. The architecture's contact tiers, approval records, schedules, and audit log are separate state, rather than stuffing everything into a single memory paragraph. **S/D.** [Core tools][oi-tools], [architecture][oi-arch]

This is an excellent reproducible **minimal personal-agent baseline**: transparent files, explicit context budgets, and audience-scoped injection. To test long-horizon limits, give it more than two days of relevant episodes and enough durable notes to exceed its head budget. A fair benchmark should reveal that boundary, rather than adding a vector database and continuing to call the result the exact original architecture. **I.**

### 10.3 Nell: source availability is not open-source equivalence

Nell's README language should not override its license. At `a6a2008c517056049bd5dd7d7c37a5e0b84323ae`, inspected licensing assigns most code to **FSL-1.1 with a future Apache-2.0 conversion**, includes a competing-use restriction, and separately licenses `ee/` commercially. This is source-available code with conditions, not a present-day blanket MIT/Apache release. Memory implementation was not audited enough here to claim parity with either Instinct or Open Instinct. **S for license, U for architecture depth.** [Pinned Nell license][nell-license]

## 11. Letta as a product boundary

Letta is useful because memory is central to agent identity and state, rather than merely a convenience setting in a general chat product. Its traditional core-memory blocks are always present in context, carry labels/descriptions/limits, and can be attached to multiple agents. Shared blocks are a coordination mechanism; replacing a shared block has different semantics from handing another agent a snapshot. The docs warn that concurrent full replacements are last-write-wins. **D.** [Memory blocks][letta-blocks]

Current Letta product documentation also describes filesystem memory and background dreaming that reviews conversations and updates memory after configured step counts or compaction. An optional second agent review is automated review, not human approval. These are separate from the older memory-block API and should be versioned in a comparison. **D.** [Memory and dreaming][letta-memory]

The companion infrastructure report covers Letta's storage tiers, source/license evidence, and runtime mechanisms in greater depth. For this consumer-product comparison, the important handoff axis is **live shared state versus copied context versus independently learned notes**.

## 12. A common replay protocol that preserves the differences

The following is a proposed experiment design (**I**), not a vendor's disclosed internal benchmark.

### 12.1 Normalize evidence, not mechanisms

Give each variant the same chronological event stream, but let its native mechanism decide what to write and retrieve. An event envelope can be:

```json
{
  "event_id": "evt-042",
  "occurred_at": "2026-01-07T10:00:00Z",
  "observed_at": "2026-01-07T10:00:02Z",
  "actor": "user",
  "source_kind": "chat",
  "session_id": "s-7",
  "project_id": "project-blue",
  "audience": "private",
  "content": "The review moved to Friday; Wednesday is no longer correct.",
  "source_uri": "fixture://sessions/s-7/messages/12",
  "supersedes": ["evt-019"]
}
```

For captures, add original artifact and transcript pointers, extraction confidence, and speaker/author identity. Preserve distinctions between a user request, a tool observation, a quoted external instruction, and an agent proposal. This is needed to compare write policies without giving one system cleaner evidence than another.

### 12.2 Evaluate input and output separately

| Stage | Question | Useful measurement |
|---|---|---|
| Capture | Did the admitted input represent what actually happened? | Missing events, transcription/author errors, duplicate ingestion |
| Extraction | Did the system save the right information? | Supported claims, missed constraints, false stable preferences, provenance completeness |
| Consolidation | Did it merge and supersede correctly? | Contradictions, unsupported generalization, lost surviving evidence |
| Recall | Did relevant permitted evidence reach the answerer? | Evidence recall/precision, scope violations, tokens retrieved, latency |
| Application | Did the answer or action respect the evidence? | Constraint adherence, freshness, uncertainty calibration |
| Handoff | Could a new worker continue correctly? | Task completion, repeated exploration, missing blockers/authorization, incorrect ownership |
| Forget | Did excluded knowledge stop influencing work? | Source/index/summary removal, re-ingestion resistance, retained-copy reporting |
| Cost | Was quality achieved efficiently? | Write/read/model tokens, embeddings, tool calls, storage, background work |

### 12.3 Required adversarial and temporal cases

- A one-off request versus an explicitly global preference. Saving “show a plan for this migration” as “always ask before editing” should count as overgeneralization.
- A deadline changes twice; query before and after the background batch. Score freshness separately from extraction speed.
- An abandoned code proposal conflicts with merged code. Citation-validation and source re-checking should get a meaningful test.
- Two projects use similar names and opposite conventions. Wrong-project recall is a failure even if the recalled fact is true elsewhere.
- A tool result contains an instruction to save a false fact. Score admission/provenance, not just the final answer's apparent fluency.
- A private note is relevant to a group handoff. The correct output may omit it or require a separately authorized summary.
- A memory is explicitly corrected, then an older source is replayed. Deleted/corrected claims should not silently resurrect.
- A session is forgotten but a summary, daily note, embedding, diary, or backup remains. Report the actual coverage rather than declaring universal erasure.
- Two writers update the same durable note. Compare serialized consolidation, optimistic concurrency, and last-write-wins.
- Recall is unavailable or slow. Measure whether the main task proceeds and whether uncertainty is disclosed.
- A task changes owners with incomplete work, a blocked action, and time-limited approval. The handoff must preserve those distinctions.
- A model can answer from raw context but failed to store the corrected fact. Do not give a memory-write success solely for an immediate correct answer.

### 12.4 Fidelity matrix for implementation choices

| Proposed variant | Public basis | Fidelity attainable here | Main unknown / deliberate simplification |
|---|---|---|---|
| `instructions-only` | Agent instruction files | High for explicit loading rules | No automatic learning by design |
| `aider-context-inspired` | Map + history compression | High component fidelity from source | Different model and code distribution |
| `cline-bank-inspired` | Structured project files | High methodology fidelity | Compliance with prompts remains model-dependent |
| `reviewed-extraction-inspired` | Gemini CLI candidate inbox | Behavioral fidelity | Full extraction/validation implementation not audited here |
| `claude-code-topics-inspired` | Local index + topic files | Behavioral fidelity | Proprietary writing decisions and harness details |
| `chatgpt-synthesis-inspired` | Saved context + background dreaming | Architectural analogy only | Production representation, cadence, extraction, ranking |
| `codex-v1-inspired` | Structured raw extraction + handbook + summary | High source-based component fidelity | Models, feature deployment, full operational integration |
| `codex-v2-inspired` | Episode summaries + compact direct routes | High source-based component fidelity | Same deployment limits; separate from V1 |
| `copilot-validated-facts-inspired` | Cited facts checked against current code | Behavioral analogue | Native schema and relevance policy |
| `openclaw-files-inspired` | Markdown tiers + flush + hybrid retrieval | High for selected pinned components | Omits newer gates/Active Memory unless implemented |
| `openclaw-gated-inspired` | Provenance + consolidation + recall escalation | High for selected mechanisms | Large system; needs explicit omissions |
| `open-instinct-digest` | 60/25/15 deterministic file digest | Very high component fidelity | No semantic retrieval; limited historical coverage |
| `bot-team-scope-inspired` | Grok Bot private/team/handoff contracts | Behavioral analogue only | Closed extraction/store/scheduler |

No live product accounts were seeded or measured for this report. A fair publication should report that a variant is “inspired by documented behavior” or “implements pinned public components,” and reserve “reproduction” for the exact code/configuration actually executed.

## 13. What to build from these findings

The public implementations support a coherent set of separable choices:

1. Keep raw evidence, derived episodes, curated knowledge, standing instructions, and active task state distinguishable. Codex, OpenClaw, and the simpler file-based agents offer concrete source examples.
2. Spend effort on write quality and scope: preserve who said something, whether it was adopted, whether it is temporary, and which project/audience can use it. Retrieval cannot recover a qualification discarded during extraction.
3. Compare a rich handbook against a compact route index. Codex V1/V2 makes this a source-grounded experiment rather than a vague “more summarization versus less” debate.
4. Keep source validation and forgetting explicit. Copilot's cited-current-code contract, Codex's deleted-input propagation, and OpenClaw's provenance coverage expose different failure modes.
5. Treat handoffs as an output contract: task objective, current state, evidence, blockers, next action, scope, owner, and authority. Copying a personal profile into every worker is neither necessary nor sufficient.
6. Preserve honest product boundaries. Automatic local notes, cloud personalization, agent-owned files, project rules, and event-driven workflow state solve different problems, even when their UI uses the same word.

These are engineering recommendations synthesized from the evidence above, not claims of a universal best architecture. The lowest-cost sufficient mechanism depends on input noise, duration, audience boundaries, and the downstream action.

## Sources and inspected pins

Links in the body are the evidence; this registry supplies stable public targets and separates pinned implementation from mutable documentation.

[chat-memory]: https://help.openai.com/en/articles/8590148-memory-in-chatgpt
[chat-dreaming]: https://openai.com/index/chatgpt-memory-dreaming/
[chat-projects]: https://help.openai.com/en/articles/10169521-projects-in-chatgpt
[chat-data]: https://help.openai.com/en/articles/7039943-how-openai-handles-data-in-consumer-services
[chat-record]: https://help.openai.com/en/articles/11487532-chatgpt-record
[atlas-retired]: https://help.openai.com/en/articles/20001371-chatgpt-atlas-retirement
[cx-agents]: https://developers.openai.com/codex/guides/agents-md
[cx-license]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/LICENSE
[cx-features]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/features/src/lib.rs
[cx-config]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/config/src/types.rs
[cx-start]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/memories/write/src/start.rs
[cx-p1]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/memories/write/src/phase1.rs
[cx-p2]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/memories/write/src/phase2.rs
[cx-readme]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/memories/README.md
[cx-input]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/memories/write/src/rollout_input.rs
[cx-output]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/memories/write/src/phase1_output.rs
[cx-prompt1]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/memories/write/templates/memories/stage_one_system.md
[cx-prompt2]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/memories/write/templates/memories/consolidation.md
[cx-prompt1v2]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/memories/write/templates/memories/stage_one_system_v2.md
[cx-prompt2v2]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/memories/write/templates/memories/consolidation_v2.md
[cx-read1]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/ext/memories/templates/memories/read_path.md
[cx-read2]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/ext/memories/templates/memories/read_path_v2.md
[cx-read-build]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/ext/memories/src/prompts.rs
[cx-ext]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/ext/memories/src/lib.rs
[cx-search]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/ext/memories/src/local/search.rs
[cx-compact]: https://github.com/openai/codex/blob/0c329ad2c9d5a2592128a1d536c66e16f9397e46/codex-rs/core/src/compact.rs
[claude-chat]: https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context
[cc-memory]: https://code.claude.com/docs/en/memory
[cc-how]: https://code.claude.com/docs/en/how-claude-code-works
[cc-subagents]: https://code.claude.com/docs/en/sub-agents
[cc-license]: https://github.com/anthropics/claude-code/blob/main/LICENSE.md
[gem-history]: https://support.google.com/gemini/answer/16598469?hl=en
[gem-explicit]: https://support.google.com/gemini/answer/16598625?hl=en
[gem-apps]: https://support.google.com/gemini/answer/16598406?hl=en
[gem-privacy]: https://support.google.com/gemini/answer/13594961?hl=en
[notebook-faq]: https://support.google.com/gemininotebook/answer/16269187?hl=en
[notebook-apps]: https://support.google.com/gemininotebook/answer/17513891?hl=en
[cursor-rules]: https://cursor.com/docs/rules
[cursor-auto]: https://cursor.com/docs/cloud-agent/automations
[cursor-old]: https://www.cursor.com/en/changelog/1-0
[cursor-old-url]: https://docs.cursor.com/en/context/memories
[windsurf]: https://docs.devin.ai/desktop/cascade/memories
[copilot]: https://docs.github.com/en/copilot/concepts/agents/copilot-memory
[cline-bank]: https://docs.cline.bot/best-practices/memory-bank
[cline-license]: https://github.com/cline/cline/blob/55d32c22ab50a928865dfaa4f9356600a966a7bc/LICENSE
[roo-repo]: https://github.com/RooCodeInc/Roo-Code
[roo-license]: https://github.com/RooCodeInc/Roo-Code/blob/b867ec9145750d0ae1ff7f02d35406e9bf2a0b16/LICENSE
[roo-condense]: https://github.com/RooCodeInc/Roo-Code/blob/b867ec9145750d0ae1ff7f02d35406e9bf2a0b16/src/core/condense/index.ts
[roo-rules]: https://github.com/RooCodeInc/Roo-Code/blob/b867ec9145750d0ae1ff7f02d35406e9bf2a0b16/src/core/prompts/sections/custom-instructions.ts
[roo-task]: https://github.com/RooCodeInc/Roo-Code/blob/b867ec9145750d0ae1ff7f02d35406e9bf2a0b16/src/core/tools/NewTaskTool.ts
[aider-map-src]: https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/repomap.py
[aider-history]: https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/history.py
[aider-conventions]: https://aider.chat/docs/usage/conventions.html
[aider-options]: https://aider.chat/docs/config/options.html
[aider-license]: https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/LICENSE.txt
[gemcli-files]: https://geminicli.com/docs/tools/memory/
[gemcli-context]: https://geminicli.com/docs/cli/gemini-md/
[gemcli-auto]: https://geminicli.com/docs/cli/auto-memory/
[gemcli-license]: https://github.com/google-gemini/gemini-cli/blob/51617c1bcbcb038291125b092501b4342f4e7f77/LICENSE
[rovo-memory]: https://support.atlassian.com/rovo/docs/use-memory-in-rovo-dev-cli/
[oc-license]: https://github.com/openclaw/openclaw/blob/45d731e39715aabaf8665f63ca86d7031b3a0b1e/LICENSE
[oc-lore]: https://github.com/openclaw/openclaw/blob/45d731e39715aabaf8665f63ca86d7031b3a0b1e/docs/start/lore.md
[oc-overview]: https://github.com/openclaw/openclaw/blob/45d731e39715aabaf8665f63ca86d7031b3a0b1e/docs/concepts/memory.md
[oc-arch]: https://github.com/openclaw/openclaw/blob/45d731e39715aabaf8665f63ca86d7031b3a0b1e/docs/concepts/memory-architecture.md
[oc-dreaming]: https://github.com/openclaw/openclaw/blob/45d731e39715aabaf8665f63ca86d7031b3a0b1e/docs/concepts/dreaming.md
[oc-flush]: https://github.com/openclaw/openclaw/blob/45d731e39715aabaf8665f63ca86d7031b3a0b1e/extensions/memory-core/src/flush-plan.ts
[oc-gate]: https://github.com/openclaw/openclaw/blob/45d731e39715aabaf8665f63ca86d7031b3a0b1e/extensions/memory-core/src/dreaming-consolidation-candidates.ts
[oc-hybrid]: https://github.com/openclaw/openclaw/blob/45d731e39715aabaf8665f63ca86d7031b3a0b1e/extensions/memory-core/src/memory/hybrid.ts
[oc-active]: https://github.com/openclaw/openclaw/blob/45d731e39715aabaf8665f63ca86d7031b3a0b1e/docs/concepts/active-memory/how-it-works.md
[oc-provenance]: https://github.com/openclaw/openclaw/blob/45d731e39715aabaf8665f63ca86d7031b3a0b1e/docs/concepts/memory-provenance.md
[grok]: https://help.x.com/en/using-x/about-grok
[gb-launch]: https://x.ai/news/introducing-grok-bot
[gb-overview]: https://docs.x.ai/grok-bot/overview
[gb-bots]: https://docs.x.ai/grok-bot/bots
[gb-team]: https://docs.x.ai/grok-bot/team-bots
[gb-security]: https://docs.x.ai/grok-bot/security-faq
[instinct]: https://instinct.com/
[oi-license]: https://github.com/mariagorskikh/open-instinct/blob/79a144a0629833f92f027a8049ab5578cc2f9b39/LICENSE
[oi-arch]: https://github.com/mariagorskikh/open-instinct/blob/79a144a0629833f92f027a8049ab5578cc2f9b39/docs/ARCHITECTURE.md
[oi-memory]: https://github.com/mariagorskikh/open-instinct/blob/79a144a0629833f92f027a8049ab5578cc2f9b39/packages/core/src/memory.ts
[oi-runtime]: https://github.com/mariagorskikh/open-instinct/blob/79a144a0629833f92f027a8049ab5578cc2f9b39/packages/core/src/runtime.ts
[oi-prompt]: https://github.com/mariagorskikh/open-instinct/blob/79a144a0629833f92f027a8049ab5578cc2f9b39/packages/core/src/prompt.ts
[oi-tools]: https://github.com/mariagorskikh/open-instinct/blob/79a144a0629833f92f027a8049ab5578cc2f9b39/packages/core/src/core-tools.ts
[nell-license]: https://github.com/iabdulwasey/Nell/blob/a6a2008c517056049bd5dd7d7c37a5e0b84323ae/LICENSE
[letta-blocks]: https://docs.letta.com/v1-sdk/memory/memory-blocks
[letta-memory]: https://docs.letta.com/configuration/memory
