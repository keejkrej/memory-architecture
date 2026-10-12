# Memory architecture landscape

Public research on how assistants and agents retain experience, select context, and carry work between sessions. **Observed 2026-10-12–13.** This is a deliberately nonexhaustive landscape covering consumer assistants, coding agents, memory infrastructure, activity capture, research mechanisms, and evaluation datasets.

The central comparison is the whole path: **inputs → memory writing → durable state → retrieval → task context → observed outcome**. A saved transcript, a personal profile, a temporal graph, a learned procedure, and a handoff packet have different purposes. “Has memory” is too broad to predict useful behavior.

The reports distinguish inspected public code, documented product behavior, paper mechanisms, proposed experiments, and unknown internals. They contain no independent performance results. Vendor and author benchmark claims are not treated as a common leaderboard, and representative algorithms are not presented as replicas of closed services.

## Reading order

| Start here | What it answers |
| --- | --- |
| [Architecture taxonomy](research/architecture-taxonomy.md) | Which mechanisms fit which workloads, and how inputs, write cadence, state, lifecycle, and outputs compare |
| [Consumer, coding, and personal agents](research/consumer-and-coding-agents.md) | What ChatGPT, Codex, Claude, Gemini, coding tools, OpenClaw, and personal agents actually document or expose |
| [Hermes Agent](research/hermes-agent.md) | Bounded notes, atomic edits, frozen context, transcript recall, background review and procedural skills in current source |
| [Muse, Grok Bot and counterparts](research/muse-and-grok-bot.md) | Official product contracts; nanoMuse, OpenBot and Firstmate source mechanisms; scope, recall, lifecycle and handoff differences |
| [Open-source implementations](research/open-source-implementations.md) | Twelve additional projects, including OpenMuse, Eidon, nanobot, NanoClaw, ZeroClaw, Moltis and QwenPaw; audited code and dependency boundaries |
| [Memory infrastructure](research/memory-infrastructure.md) | Mem0, Graphiti/Zep, Letta, Hindsight, Supermemory, Cognee, MemOS, Memobase, ReMe, frameworks, cloud services, and enterprise context |
| [Activity capture and handoffs](research/capture-and-handoffs.md) | How screen/audio/tool observations become evidence and how context reaches another task or agent |
| [Papers and evaluation](research/papers-and-evaluation.md) | Research mechanisms, benchmark boundaries, public artifacts, reproducible comparisons, and proposed test fixtures |

For implementation, begin with the taxonomy's workload table, then use the relevant report's pinned source and representative algorithms. For evaluation, use the paper report's two tracks: controlled component comparisons and whole-system comparisons under declared resource budgets.

## Corrections that change the comparison

- **Mem0's historical CRUD algorithm is not its current source design.** The inspected repository describes additive extraction and a different retrieval path; hosted optimizations remain a separate boundary. [Versioned analysis](research/memory-infrastructure.md#mem0-current-additive-memory-versus-the-historical-crud-algorithm)
- **MemGPT, Letta V1, and current Letta are different targets.** Current Letta documentation describes Git-backed file memory and dreaming. [Letta analysis](research/memory-infrastructure.md#letta--memgpt-from-virtual-context-tiers-to-git-backed-agent-memory)
- **Codex has distinct V1/V2 memory pipelines and configuration gates.** Source availability does not establish account-level enablement. [Codex analysis](research/consumer-and-coding-agents.md#4-codex-a-publicly-inspectable-learned-memory-pipeline)
- **Consumer memory changes over time.** Current Claude topic memory is distinct from its legacy daily-summary experience; editor rules, historical Cursor Memories, and current Automation notes are separate surfaces. [Consumer report](research/consumer-and-coding-agents.md)
- **Public repositories do not imply open engines.** Supermemory's public MIT repository does not contain its local server engine; current Screenpipe and Nell have source-available licensing boundaries. [Infrastructure licensing](research/memory-infrastructure.md#evidence-and-version-ledger), [capture licensing](research/capture-and-handoffs.md#product-map), [Nell](research/consumer-and-coding-agents.md#103-nell-source-availability-is-not-open-source-equivalence)
- **Enterprise search and personal memory can coexist.** Glean, Rovo, and Salesforce document explicit memory surfaces alongside organizational retrieval. They require separate ownership, permission, and lifecycle analysis. [Enterprise comparison](research/memory-infrastructure.md#enterprise-context-and-personal-memory-are-separate-capabilities)
- **Closed products have useful open counterparts.** nanoMuse explicitly targets the personal-agent use case associated with Muse; OpenBot and Firstmate expose comparable or complementary Grok Bot workflows. Compare the actual open component without treating it as the vendor's private implementation. [Counterpart analysis](research/muse-and-grok-bot.md), [broader implementations](research/open-source-implementations.md)
- **A successful memory write need not refresh the active prompt.** Current Hermes separates bounded durable notes from frozen context and reloads at context rebuild boundaries; background review adds another admission boundary. [Hermes source audit](research/hermes-agent.md)

## Source collection

[source-index.json](source-index.json) inventories public citations with document locations and collection outcomes. A successful HTTP fetch means a body was retrieved; it does not verify the claims, prove the body is substantive, or grant redistribution rights. Failed, oversized and unsupported responses remain visible.

The dependency-free collector requires Node.js 22 or newer:

```sh
node scripts/collect-sources.mjs                         # refresh the citation inventory
node scripts/collect-sources.mjs --fetch-new             # collect newly discovered citations
node scripts/collect-sources.mjs --fetch --concurrency 4 # refresh all cited sources
node --test scripts/collect-sources.test.mjs
```

Collection follows cited URLs, including pinned repository files; it does not crawl entire domains. Responses are size-limited, and HTTP access failures are recorded without bypassing access controls. Bodies stay under git-ignored `.cache/source-pages/`, named by content hash. Only citation metadata belongs in the public index; original analysis and short quotations belong in the reports. Binary PDFs are inventoried but not archived by this text collector.

## Using and extending the research

Treat every observation as versioned. Follow primary citations next to specific claims, preserve code commits and paper revisions, and recheck mutable product documentation before operational decisions. An unknown implementation detail is left unknown; a source license is not automatically a dataset, model, or hosted-service license.

The [inventory extension method](research/architecture-taxonomy.md#extending-the-inventory) defines the fields needed for another system. Coverage gaps and unresolved identities are recorded in the individual reports. Contributions should add evidence and clarify scope, rather than infer mechanisms from product names or marketing terminology.
