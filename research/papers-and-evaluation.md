# Public research: agent memory mechanisms and evaluation

Observation date: **2026-10-12**. Scope: public papers, author/project repositories, and official dataset cards. This is a research synthesis, not a benchmark run or a claim of exhaustive coverage. The source-version register at the end separates paper-version dates from the observation date. Search results were used for discovery; mechanism descriptions were checked against paper bodies, and artifact availability against official repositories/cards.

## What the evidence supports

A useful architecture should distinguish **evidence retention**, **derived knowledge**, **working task state**, and **reusable procedures**. These have different correctness conditions. An observation can be faithfully retained even when an inference about it is wrong; a remembered preference can become stale; a successful procedure can fail in a different environment. The literature below supports testing these as separate capabilities, but does not establish one universally best storage format.

Three conclusions guide the proposed experiments:

1. Preserve source-addressable episodes alongside summaries or extracted facts. ReadAgent explicitly retrieves original passages after reading gists; ES-Mem retains raw context beneath event boundaries and summaries. Compression is therefore a routing aid as well as a space-saving technique. [ReadAgent](https://arxiv.org/html/2402.09727v3), [ES-Mem](https://arxiv.org/html/2601.07582)
2. Treat revision and time as state transitions. Zep supplies a concrete temporal-graph design, while LongMemEval and PersonaMem offer tests of changing knowledge and profiles. None of those results establishes reliable physical deletion of every downstream copy. [Zep](https://arxiv.org/html/2501.13956v1), [LongMemEval](https://arxiv.org/html/2410.10813v2), [PersonaMem](https://arxiv.org/html/2504.14225v2)
3. Optimize for the next useful action as well as recall. Reflexion and Voyager test feedback-driven behavior; MemoryArena directly tests interdependent sessions. A system winning post-hoc conversation QA has not thereby demonstrated reliable task continuation. [Reflexion](https://arxiv.org/html/2303.11366v4), [Voyager](https://arxiv.org/html/2305.16291v2), [MemoryArena](https://arxiv.org/html/2602.16313v2)

## Terms and comparison boundaries

In this report, an **episode** is a bounded interaction or observation sequence; a **claim** is an extracted proposition with evidence and temporal scope; **working memory** is the bounded state needed for the current task; **procedural memory** is a reusable action recipe with applicability conditions and outcome evidence. These are proposed engineering definitions, not a claim that papers use identical terminology.

The surveys offer useful organizing schemes. Zhang et al. distinguish memory sources, forms, and operations. *Memory in the Age of AI Agents* separates token-level, parametric, and latent representations and analyzes formation, evolution, and retrieval. The 2026 *Memory for Autonomous LLM Agents* survey emphasizes memory coupled to agent interaction and evaluation. These are taxonomies and literature syntheses, not independent replications of the systems they list. [2024 survey](https://arxiv.org/html/2404.13501v1), [2025/2026 survey](https://arxiv.org/html/2512.13564v2), [2026 mechanisms/evaluation survey](https://arxiv.org/html/2603.07670v1)

Do not pool the following into one leaderboard:

| Family | What changes | Appropriate comparison |
| --- | --- | --- |
| External textual or graph memory | Records, retrieval, summaries, tool-controlled context | Same reader, writer, embeddings, input stream, and resource envelopes |
| Learned latent or architectural memory | Hidden states, memory tokens, trainable readers, or model architecture | Matched model size/training data/training compute plus inference cost |
| Procedural or experiential memory | Skills, reflections, policies, action recipes | Task success, environment steps, transfer, and failed-action reuse |
| Corpus-oriented RAG | Index over documents, relation graph, corpus summaries | Retrieval/answer quality on comparable query types; separately measure update operations |
| Multi-session agent memory | State accumulated through action and feedback | Sequential task completion under session resets and changing constraints |

The same system may occupy several rows. A graph is a representation, not evidence of chronology, correct causality, tenant isolation, or successful forgetting.

## Mechanism survey

A dash in the forgetting column means that no explicit, end-to-end deletion guarantee was established by the inspected paper. It does **not** mean that a current SDK lacks a delete endpoint. Code licenses below are the observed repository licenses; they do not automatically license underlying model weights, environments, or datasets.

### Foundational external and procedural memory

| Work and primary paper | Inputs and durable state | Write and read mechanism | Update / forget | Public artifact and evaluation boundary |
| --- | --- | --- | --- | --- |
| **Generative Agents** (2023) [paper](https://arxiv.org/html/2304.03442v2) | Natural-language observations of a simulated world; timestamped memory stream, plans, reflections | Append observations; retrieve using relevance, recency, and importance; synthesize higher-level reflections with supporting memories | New reflections/plans are stored; access recency affects ranking. Decay in retrieval priority is not physical erasure | [Author code](https://github.com/joonspk-research/generative_agents), Apache-2.0. Evaluates believability and emergent behavior in a 25-agent simulation, not production personal-data correctness |
| **MemGPT** (2023) [paper](https://arxiv.org/html/2310.08560v2) | Conversation/documents; fixed working context, FIFO recent messages, recall and archival storage | LLM function calls move information between tiers; summaries support queue eviction; interrupts/heartbeats permit multi-step memory work | Working context can be edited; evicted messages remain recallable. Context eviction differs from durable deletion | [Successor repository, Letta](https://github.com/letta-ai/letta), Apache-2.0. Current code is not a frozen 2023 experiment; pin a historical revision for reproduction |
| **MemoryBank** (2023) [paper](https://arxiv.org/html/2305.10250v3) | Dialogues, daily/global summaries, user portraits | Embed memories for retrieval; periodically summarize interaction history and profiles | An Ebbinghaus-inspired retention rule weakens memories over time and strengthens recalled memories; summary/profile revisions | [Author code/data](https://github.com/zhongwanjun/MemoryBank-SiliconFriend), MIT repository. Synthetic long-term dialogue probing and companion-style evaluation; not a broad dynamic-fact or deletion benchmark |
| **Reflexion** (2023) [paper](https://arxiv.org/html/2303.11366v4) | Action trajectories, task feedback, tests; bounded textual reflections across trials | Actor attempts task; evaluator assesses outcome; self-reflection produces advice for later attempts | Add reflections to bounded episodic memory; no model-weight update required. Old reflections may leave the context | [Author code](https://github.com/noahshinn/reflexion), MIT. ALFWorld, reasoning, and coding results involve repeated trials; compare total trial and feedback budgets |
| **Voyager** (2023) [paper](https://arxiv.org/html/2305.16291v2) | Minecraft state, execution feedback/errors; executable skill library indexed by descriptions | Curriculum proposes tasks; iterative code generation and verification; retrieve relevant skills for composition | Add successful skills after verification; accumulating library is central, not a demonstrated personal-information erasure policy | [Author code](https://github.com/MineDojo/Voyager), MIT. Minecraft/game dependencies remain separate. Transfer within that environment supports procedural reuse, not arbitrary desktop handoffs |
| **RET-LLM** (2023) [paper](https://arxiv.org/html/2305.14322v2) | Text or external knowledge; relational triplets and vector representations | Trained language-model/controller protocol writes and queries memory; exact lookup with semantic fallback | Explicitly updatable store is part of proposal; comprehensive deletion behavior not established | Inspected revision labels this a concept paper and points to later MemLLM work. A complete official RET-LLM reproduction artifact/license was not verified; do not present it as a mature production system |
| **TiM / Think-in-Memory** (2023) [paper](https://arxiv.org/html/2311.08719v1) | Conversation; stored post-response thoughts rather than only raw history | Recall prior thoughts, answer, then post-think; locality-sensitive hashing supports retrieval | Insert, merge, and forget operations evolve the thought store | Official complete code/data artifact and license were not verified. Treat stored thoughts as generated interpretations; repeated reuse is not independent corroboration |

### Structured, adaptive, and layered external memory

| Work and primary paper | Inputs and durable state | Write and read mechanism | Update / forget | Public artifact and evaluation boundary |
| --- | --- | --- | --- | --- |
| **A-MEM** (2025) [paper](https://arxiv.org/html/2502.12110v11) | Interaction memories; notes with content, context, keywords, tags, embeddings, and links | Construct note; retrieve related notes; agent proposes links and evolves contextual representations; query retrieves relevant memories | Existing notes' attributes/context can change when new memories arrive; no demonstrated complete erasure guarantee | [System repository](https://github.com/agiresearch/A-mem), [author evaluation repository](https://github.com/WujiangXu/A-mem), MIT. Inspect the exact paper/evaluation version: linked repositories have renamed over time |
| **Mem0** (2025) [paper](https://arxiv.org/html/2504.19413v1) | Message pairs plus recent context/summary; extracted facts; optional graph variant | Extraction proposes facts; retrieve similar existing memories; classify ADD/UPDATE/DELETE/NOOP; retrieve salient memories for answering | Explicit update/delete operations on fact memory; graph variant maintains relationships. Those operations alone do not prove deletion of logs, source messages, or backups | [Official code](https://github.com/mem0ai/mem0), Apache-2.0. Paper reports LoCoMo quality/cost/latency gains; its 2025 implementation and present hosted service are distinct experimental subjects |
| **Zep / Graphiti** (2025) [paper](https://arxiv.org/html/2501.13956v1) | Conversation and structured data; episode, entity, and community subgraphs | Extract/resolve entities and relations; hybrid retrieval/reranking; source episodes remain linked to derived facts | Temporal validity and transaction history support invalidation while preserving history; invalidating a relationship is not erasing the source | [Graphiti](https://github.com/getzep/graphiti), Apache-2.0. Open engine is not identical to the full hosted service; paper evaluates DMR and LongMemEval |
| **RMM: Reflective Memory Management** (2025) [paper](https://arxiv.org/html/2503.08026v2) | Multi-session dialogue; topic-oriented memories and adaptive retriever/reranker | Prospective reflection extracts and integrates topic memories; retrospective reflection uses response citations as online retrieval-learning feedback | Merge/add memories; adapt retrieval rather than only fixed similarity. Dedicated physical forgetting not established | Official complete reproduction code/license not verified. MSC and LongMemEval results support an adaptive granularity/retrieval hypothesis, not reliable citation truth |
| **Memory-R1** (2025) [paper](https://arxiv.org/html/2508.19828v5) | Dialogues; structured memory bank; training QA supervision | RL-trained manager chooses ADD/UPDATE/DELETE/NOOP; answer agent filters retrieved memories and answers; PPO/GRPO training | Learned edit/delete policy; task reward supervises utility, not necessarily faithful provenance or privacy deletion | [Author repository](https://github.com/yansikuan/memory-r1), Apache-2.0, but inspected README still says implementation is forthcoming. Training/evaluation and split audit are required before accepting generalization claims |
| **MemoryOS** (2025) [paper](https://arxiv.org/html/2506.06326v1) | Short-term dialogues, mid-term topic segments/pages, long-term personal knowledge | FIFO dialogue-chain transfer into mid-term memory; semantic segment/page retrieval combined with current context and profile | Heat-based replacement and promotion into longer-term personal memory; infrequent access can lower retention | [Official code](https://github.com/BAI-LAB/MemoryOS), Apache-2.0. Distinct project from MemOS. Test rare-but-important events explicitly; popularity is not importance |
| **MIRIX** (2025) [paper](https://arxiv.org/html/2507.07957v1) | Conversation and visual activity; core, episodic, semantic, procedural, resource, and knowledge-vault memory | Specialized managers route/store information; topic-triggered active retrieval plus explicit retrieval tools | Component-specific memory manipulation; inspect each store for consistent revision/deletion semantics | [Official code](https://github.com/Mirix-AI/MIRIX), Apache-2.0; [paper evaluation branch](https://github.com/Mirix-AI/MIRIX/tree/public_evaluation). ScreenshotVQA and LoCoMo results; screenshot sample is only three participants |
| **MAGMA** (2026) [paper](https://arxiv.org/html/2601.03236v2) | Events represented across semantic, temporal, causal, and entity graphs | Fast ingestion plus asynchronous consolidation; query intent guides traversal across relation types | Structural evolution through consolidation; end-to-end hard deletion not established | [Author code](https://github.com/FredJiang0324/MAGMA), MIT. Graph relations labeled causal still require evidence auditing; benchmark gains are author-reported |
| **ReadAgent** (2024) [paper](https://arxiv.org/html/2402.09727v3) | Long documents; semantically paginated episodes and gist memories | LLM chooses episode boundaries, compresses each page, then selectively fetches original pages | Gists compress rather than destroy the underlying source; entire gist collection must still fit the reader's context | [Author project/demo](https://read-agent.github.io/); a standalone official code license was not verified. Primarily reading-comprehension evidence, with a web-navigation extension |
| **ES-Mem** (2026) [paper](https://arxiv.org/html/2601.07582) | Dialogue events; boundary descriptors, event summaries, timestamps, raw context | Topic-coherence detection plus intent-aware boundary refinement; coarse-to-fine lookup from boundaries toward raw episodes | Layered reconstruction preserves source access; comprehensive correction/deletion semantics not demonstrated | Official complete code/license not verified. The paper supports semantic segmentation experiments, not an assumption that desktop application switches equal task boundaries |

**Unresolved name:** searches did not establish a primary LLM-memory paper or official repository unambiguously named **MAJOR**. MAGMA is documented separately because it is a real, differently named work. No architecture is invented for the unresolved acronym.

### Graph retrieval and model-internal memory

| Work and primary paper | State and mechanism | Update / forget | Artifact and comparison boundary |
| --- | --- | --- | --- |
| **HippoRAG** (2024) [paper](https://arxiv.org/html/2405.14831v3) | Open-information-extraction triples plus synonym links; identify query entities and run personalized PageRank to retrieve related passages | Extend corpus graph; temporal conflict resolution or user erasure is not a core evaluated guarantee | [Official code/data](https://github.com/OSU-NLP-Group/HippoRAG), MIT code; original datasets retain their own terms. Strongest relevance is associative/multi-hop retrieval |
| **HippoRAG 2** (2025) [paper](https://arxiv.org/html/2502.14802v2) | Adds passage nodes, query-to-triple matching, LLM recognition filtering, and graph propagation; falls back to passage retrieval if filtered triples are absent | Non-parametric integration of new knowledge; not equivalent to a full bitemporal claim ledger | [Same official project](https://github.com/OSU-NLP-Group/HippoRAG), MIT. Reader, OpenIE, embedding, and graph costs must all be included |
| **Microsoft GraphRAG** (2024) [paper](https://arxiv.org/html/2404.16130v2) | Extract entity graph, detect communities, precompute community reports; global queries combine partial responses from reports | Corpus indexing/summarization pipeline; current SDK update capabilities must be checked separately from paper | [Official code](https://github.com/microsoft/graphrag), MIT. Primarily global sensemaking/query-focused summarization; it is misleading to judge this solely on single-fact personal recall |
| **LightRAG** (2024) [paper](https://arxiv.org/html/2410.05779v3) | Entity/relation graph with textual descriptions and vectors; low-level entity and high-level relation/theme retrieval | Incremental insertion merges new information into an existing index, reducing rebuild requirements; insertion is not proven arbitrary correction/deletion | [Official code](https://github.com/HKUDS/LightRAG), MIT. Distinct retrieval algorithm from Microsoft GraphRAG; compare local and global query families separately |
| **LongMem** (2023) [paper](https://arxiv.org/html/2306.07174v1) | Frozen backbone encodes previous context into cached attention keys/values; trainable SideNet retrieves/fuses memory for current input | Finite cache and trained read mechanism; architecture-specific state rather than editable human-readable facts | [Author code](https://github.com/Victorwz/LongMem), Apache-2.0; checkpoints/training corpus have separate terms. Requires model-level integration, not a drop-in API-side memory store |
| **MEMORYLLM** (2024) [paper](https://arxiv.org/html/2402.04624v2) | Fixed-size latent memory pool integrated into transformer layers; forward computation injects new text knowledge | Repeated self-update replaces/compresses latent state; forgetting is an architectural retention property, not addressable deletion of a user's fact | [Author code](https://github.com/wangyu-ustc/MemoryLLM), MIT; checkpoints/base weights separately licensed. Do not confuse with the unrelated 2026 similarly named FFN-memory paper |

For a generic application, the first implementation should remain model-independent unless an experiment specifically justifies training or a custom inference stack. This is an engineering recommendation based on deployment and auditability, not a paper result.

## Benchmarks, artifacts, and what they actually test

| Benchmark | Evidence and task | Public artifact / observed license | Main use and limitation |
| --- | --- | --- | --- |
| **MSC / Multi-Session Chat** (2021/ACL 2022) [paper](https://arxiv.org/html/2107.07567) | Human-human conversations across sessions, with summaries and continuity/personalization evaluation | [Official project](https://parl.ai/projects/msc/), [ParlAI task](https://github.com/facebookresearch/ParlAI/tree/main/parlai/tasks/msc); ParlAI code MIT. Dataset-specific reuse terms not verified in inspected first-party pages | Useful natural dialogue and summary-memory baseline; short compared with months-long activity streams. Code license must not be silently assigned to dataset |
| **MemoryBank evaluation data** (2023) [paper](https://arxiv.org/html/2305.10250v3) | 15 simulated users, ten days, 194 probing questions; companion-oriented evaluation | [Author repository](https://github.com/zhongwanjun/MemoryBank-SiliconFriend), MIT repository; source-specific terms for collected dialogue/training material need separate inspection | Small early personalization fixture. Synthetic persona simulation and empathetic responses are not a general longitudinal correctness test |
| **LoCoMo** (ACL 2024) [final paper](https://github.com/snap-research/locomo/blob/main/static/paper/locomo.pdf) | Current release: ten long conversations, 1,986 QA items across single-hop, multi-hop, temporal, open-domain, adversarial categories; event summarization and multimodal dialogue tasks also exist | [Official data/code](https://github.com/snap-research/locomo), [license](https://github.com/snap-research/locomo/blob/main/LICENSE.txt): **CC-BY-NC-4.0**. Images are not redistributed; URLs/captions are supplied | Widely reused recall benchmark but only ten conversation clusters. Final paper describes approximately 600 turns and 16K tokens/conversation; first arXiv release and later papers use different statistics. Pin actual file/tokenizer |
| **LongMemEval, original / cleaned** (2024/ICLR 2025) [paper](https://arxiv.org/html/2410.10813v2) | 500 questions; extraction, multi-session reasoning, temporal reasoning, knowledge updates, abstention; oracle and longer-history settings | [Code](https://github.com/xiaowu0162/LongMemEval) and [cleaned data](https://huggingface.co/datasets/xiaowu0162/longmemeval-cleaned), MIT | Strong default for interactive factual memory. September 2025 cleaned release removes interfering noisy sessions: record whether original or cleaned data was used, and add a separate controlled-noise test |
| **LongMemEval-V2** (2026; distinct benchmark) | Official release describes 451 curated questions over multimodal web/enterprise agent trajectories, testing state recall/tracking, workflow knowledge, environment gotchas, and premise awareness | [Official harness at observed commit `2cc8c540`](https://github.com/xiaowu0162/LongMemEval-V2/tree/2cc8c540bdb87fe6761629b585e727e1c4704520), [code license](https://github.com/xiaowu0162/LongMemEval-V2/blob/2cc8c540bdb87fe6761629b585e727e1c4704520/LICENSE), and [dataset card](https://huggingface.co/datasets/xiaowu0162/longmemeval-v2): Apache-2.0 code and declared dataset license | Memory returns text/image evidence to a reader; the endpoint evaluates QA accuracy and query latency, not live task completion. Different trajectory/screenshot schema and evaluation protocol from the original 500-question conversational benchmark; do not pool scores or assume adapter compatibility |
| **PersonaMem v1** (2025) [paper](https://arxiv.org/html/2504.14225v2) | More than 180 simulated histories, up to 60 sessions, changing user profiles; multiple-choice responses with outdated/irrelevant distractors | [Code](https://github.com/bowen-upenn/PersonaMem), [official v1 data](https://huggingface.co/datasets/bowen-upenn/PersonaMem-v1), MIT | Tests profile evolution and personalized choice. Recognition among options differs from generating an appropriate action. Current dataset card links v2/v3; do not pool these as the same benchmark |
| **MemoryAgentBench** (2025/2026) [paper](https://arxiv.org/html/2507.05257v4) | Incremental multi-turn ingestion; accurate retrieval, test-time learning, long-range understanding, selective forgetting | [Code](https://github.com/HUST-AI-HYZ/MemoryAgentBench), [data](https://huggingface.co/datasets/ai-hyz/MemoryAgentBench), MIT declared; constituent source datasets still need a provenance check | Useful incremental-write and overwrite challenge. Selective forgetting in QA is not proof that deleted content is absent from every storage layer |
| **BEAM** (2025/2026) [paper](https://arxiv.org/html/2510.27246v2) | 100 synthetic conversations and 2,000 validated questions up to 10M tokens; ten abilities including contradiction, updates, abstention, event order, and preferences | [Code](https://github.com/mohammadtavakoli78/BEAM), MIT; [data](https://huggingface.co/datasets/Mohammadta/BEAM) and [10M data](https://huggingface.co/datasets/Mohammadta/BEAM-10M), **CC-BY-SA-4.0** | Long-horizon scalability and complex recall. Dataset split label `100K` coexists with approximate 128K descriptions: count tokens with a declared tokenizer. Generation plans/persona metadata must not become oracle memory |
| **AMA-Bench** (2026) [paper](https://arxiv.org/html/2602.22769v4) | Agent action/observation/tool trajectories; real-world subset reports 2,496 QA pairs, plus synthetic scalable trajectories | [Official code](https://github.com/AMA-Bench/AMA-Bench), [data](https://huggingface.co/datasets/AMA-bench/AMA-bench), MIT. README identifies public data as test-only | Closer to machine-generated activity than chat benchmarks. Main endpoint remains trajectory QA; do not describe it as proof of live task completion. Split tuning must use separate development fixtures |
| **MemoryArena** (2026) [paper](https://arxiv.org/html/2602.16313v2) | Interdependent multi-session tasks: shopping/navigation, constrained travel planning, progressive search, formal reasoning | [Official code](https://github.com/ZexueHe/MemoryArena) is marked preview; no root license verified. [Data](https://huggingface.co/datasets/ZexueHe/memoryarena) explicitly **CC-BY-4.0** | Best-matched listed benchmark for handoff/continuation utility. Environment installation, API dependencies, and task version materially affect results |
| **ScreenshotVQA / MIRIX** (2025) [paper](https://arxiv.org/html/2507.07957v1) | Real screenshots from three graduate students, question answering over activity history | [Official evaluation branch](https://github.com/Mirix-AI/MIRIX/tree/public_evaluation); code Apache-2.0. Complete raw screenshot redistribution and dataset-specific license not independently verified | Direct observation-to-memory evidence, but narrow population and small question set. It does not validate a general activity-capture permission model or action handoff |

The original LongMemEval repository announces V2 separately in May 2026. V2's public harness and dataset documentation were inspected for this version boundary; its paper body and baseline results were not independently reviewed or reproduced in this survey. The cleaned original release is not V2. [Original release chronology](https://github.com/xiaowu0162/LongMemEval), [V2 interface and evaluation](https://github.com/xiaowu0162/LongMemEval-V2/blob/2cc8c540bdb87fe6761629b585e727e1c4704520/README.md)

No listed benchmark by itself establishes robust **multi-user isolation**, **complete deletion**, **calibrated uncertainty**, and **task completion** simultaneously. That is the motivation for the additional fixtures below, rather than a claim that every benchmark intentionally omits every one of these issues.

## Activity capture and task handoff

MIRIX is particularly relevant because its input is not restricted to conversational text. Its paper describes frequent screenshots with similarity-based duplicate suppression and conversion into specialized memories. The experiment demonstrates a possible pipeline, but three participants cannot establish robustness across roles, languages, applications, access policies, or privacy settings. [MIRIX paper](https://arxiv.org/html/2507.07957v1)

ReadAgent and ES-Mem suggest a useful intermediate representation: keep source episodes, attach compact boundary/context descriptions, and retrieve original evidence when summaries are insufficient. Whether this transfers to mixed screenshots, transcripts, document versions, and tool events is a hypothesis to test. [ReadAgent](https://arxiv.org/html/2402.09727v3), [ES-Mem](https://arxiv.org/html/2601.07582)

The following rules are proposed design choices:

- Record **what the sensor or tool observed** separately from **what a model inferred**. A foreground application is an observation; a claim that the person was working on a particular goal is an inference. Text appearing on screen does not prove authorship, acceptance, reading, or execution.
- Preserve channel uncertainty. OCR can be wrong, audio speakers can be ambiguous, screenshots can omit hidden state, and an editor buffer can differ from a saved file. Store capture time, source time, extraction version, confidence where meaningful, and explicit unknowns.
- Segment episodes using multiple weak signals: inactivity gaps, artifact changes, topic shifts, explicit task boundaries, action outcomes, and revisits. Keep application/window changes as evidence, not definitive task labels. Test fixed windows, semantic segmentation, and a hybrid; make boundary revisions versioned.
- Separate **visible chronology** from **inferred causality**. An error followed by a code edit does not prove which change fixed the issue. Prefer explicit action/output links and verification events; label hypothesized causal edges.
- A handoff is a bounded, evidence-backed task-state projection. It should include the goal, current constraints, validated progress, current artifacts, unresolved problems, next permitted steps, and source references. A narrative summary alone can omit the exact state required to continue.

### Generic event envelope (proposed, synthetic)

This is an example contract for experiments, not a format claimed by any paper.

```json
{
  "schema_version": 1,
  "event_id": "evt_0042",
  "scope": {
    "tenant_id": "tenant_test",
    "subject_id": "person_a",
    "workspace_id": "workspace_demo",
    "visibility": ["person_a"]
  },
  "kind": "tool_result",
  "event_time": "2026-01-14T10:30:00Z",
  "observed_at": "2026-01-14T10:30:01Z",
  "ingested_at": "2026-01-14T10:30:03Z",
  "source": {
    "channel": "tool",
    "source_id": "test_runner",
    "artifact_id": "artifact_09",
    "artifact_revision": "sha256:synthetic_revision",
    "content_ref": "fixture://artifacts/test-result-42",
    "content_hash": "sha256:synthetic_content",
    "locator": {"line_start": 8, "line_end": 13}
  },
  "actor": {"id": "agent_a", "role": "assistant"},
  "episode_id": "episode_07",
  "caused_by_event_id": "evt_0041",
  "observed_payload": {"exit_code": 1, "failed_test": "timezone_conversion"},
  "extraction": {"method": "structured_tool_output", "version": "1", "uncertainties": []},
  "retention": {"policy_id": "fixture_policy", "expires_at": null},
  "idempotency_key": "runner:job_17:attempt_2"
}
```

Derived claims should be separate records with `claim_id`, subject/predicate/object or a typed value, `evidence_event_ids`, `epistemic_status` (`observed`, `asserted`, `inferred`, `verified`, `disputed`), valid-time interval, transaction-time interval, extraction/model version, and explicit `supersedes`/`contradicts` links. Carry scope and access policy through every derivative. Confidence is not a substitute for evidence.

An event correction appends a new event; a fact revision changes the active projection while preserving authorized history. A deletion request is different: remove or invalidate the corresponding source material and its derivatives according to the experiment's explicit deletion semantics, including embeddings, summaries, caches, and exported handoffs. An append-only audit may retain a non-content tombstone; it must not silently retain the erased payload.

### Generic handoff packet (proposed, synthetic)

```json
{
  "schema_version": 1,
  "handoff_id": "handoff_07",
  "scope": {"tenant_id": "tenant_test", "subject_id": "person_a", "workspace_id": "workspace_demo"},
  "as_of": "2026-01-14T10:31:00Z",
  "goal": "Complete the timezone conversion fix",
  "constraints": ["Keep the public input format stable"],
  "authorization": {"allowed_actions": ["read_fixture", "edit_fixture", "run_fixture_tests"]},
  "current_state": [
    {"claim": "One conversion test still fails", "status": "verified", "evidence": ["evt_0042"]}
  ],
  "artifacts": [
    {"id": "artifact_09", "revision": "sha256:synthetic_revision", "open_at": "timezone_conversion"}
  ],
  "completed": [
    {"action": "Reproduced failure", "outcome": "confirmed", "evidence": ["evt_0041", "evt_0042"]}
  ],
  "open_questions": ["Does the parser preserve the original UTC offset?"],
  "next_actions": [
    {"action": "Inspect parser output in the failing fixture", "preconditions": ["artifact revision still matches"]}
  ],
  "known_failed_attempts": [],
  "source_episode_ids": ["episode_07"],
  "stale_if": ["artifact revision changes", "authorization revoked"]
}
```

The packet conveys state and authority separately. A memory of a prior authorization does not grant new permission. The recipient should revalidate mutable artifact revisions and environment preconditions before acting. Do not include private reasoning traces as a substitute for concise, testable state and evidence.

## Reproducible evaluation design

Everything in this section is a recommended experimental protocol. No results are asserted.

### Two complementary evaluation tracks

**Controlled-component track:** identical event stream, source artifacts, writer/reader model versions, embeddings, answer prompt, and token/call caps. Change one memory component at a time. This isolates representation, segmentation, retrieval, and write-policy effects.

**Whole-system track:** each architecture uses its intended implementation and model configuration, under shared total-cost and latency envelopes. This tests deployable systems. Report the difference from the component track; a trained policy or custom latent model may be unfairly disabled by imposing an API-only reader, but its additional training cost must not disappear.

Use both replay and live task continuation. Replay supplies identical observations to all systems. Live interaction measures whether different memories cause different actions and therefore different future evidence. These answer different questions; do not average them into a single unexplained score.

### Minimum credible baseline set

1. No cross-session memory; current task input only.
2. Recent-window history with the same reader context budget.
3. Full authorized history where it fits; otherwise clearly labeled truncation or hierarchical reading. Never silently call truncated history a full-context baseline.
4. Fixed-size raw chunks with BM25, dense retrieval, and a tuned hybrid, each evaluated under matched output-token budgets.
5. Episode summaries with source expansion.
6. Extracted facts with typed revision and timestamps.
7. One graph variant with the same extraction inputs; then a separate graph variant with its intended extraction pipeline.
8. Procedural/reflective memory for the action task, compared against retaining raw previous attempts.
9. Oracle evidence supplied to the reader, reported only as a diagnostic upper bound.

Keep the simple baselines strong: tune chunk size and retrieval budget on development data; include lexical identifiers and dates; permit source expansion to each method when the comparison is about memory organization. A weak top-k embedding baseline does not establish that graphs or extra agents are necessary.

### Budget accounting

Track cost over the **entire lifetime of a case**, not just the final answer:

`total = capture/extraction + embedding/indexing + consolidation + updates/deletion + retrieval/reranking + reader/agent inference + tool execution + amortized training`

Record input/output/cached tokens by model and stage, call counts, embedding volume, CPU/GPU time, peak RAM, disk growth, external-service fees, and ingestion-to-searchable delay. Use a dated public pricing snapshot if translating usage into money; retain raw units so prices can change without invalidating the run.

Measure p50/p95 read latency, write latency, and end-to-end continuation latency separately. Report asynchronous maintenance backlog and wait for required writes before evaluating visibility. Include cold and warm cache conditions, concurrency limits, failed/retried calls, and the cost of periodic background consolidation. Preprocessing cannot be free for one contender and charged to another.

Run a Pareto comparison at several predeclared resource envelopes, for example small/medium/large reader budgets and one/few/many retrieval calls. Tokens alone do not equate a cheap embedding lookup with an expensive large-model call. Report capacity failures rather than dropping long cases.

### Leakage prevention and chronology

- Ingest only allowed source fields before query time. For LoCoMo, `qa`, gold `evidence`, and annotated event summaries are labels; for BEAM, generation plans and future persona narratives can be oracle information. Whether generated observations/summaries are supplied or produced must be declared. Official data formats expose these fields. [LoCoMo format](https://github.com/snap-research/locomo), [BEAM card](https://huggingface.co/datasets/Mohammadta/BEAM)
- Advance a deterministic clock and expose only events available at each query cutoff. Separate event time, observation time, and ingestion time. Test late-arriving corrections and backdated facts. Never build a summary from the entire future conversation and then use it to answer an earlier query.
- Separate train/development/test by person, conversation, task family, and synthetic seed where feasible. QA-item splits within the same underlying conversation can expose shared evidence, vocabulary, and latent personas. A memory-manager training set must not include the final test questions or their gold evidence.
- Restore the same memory snapshot for independent queries. Do not write test answers, judge feedback, or gold corrections back into a later evaluation unless continual online learning is the explicitly declared task.
- If a writer can see the current question, identify that as query-conditioned memory construction, not blind historical ingestion. Compare it with other methods given the same privilege.
- Keep judge reference answers outside the acting agent's environment and tools. Save prompts, visible files, retrieved passages, tool outputs, and snapshots to audit this separation.

Memory-R1's inspected paper describes a QA-level train/validation/test allocation and excludes the adversarial category; its reported numbers should not be equated with a full-category, unseen-person evaluation without checking the split artifacts. [Memory-R1 methods](https://arxiv.org/html/2508.19828v5)

### Metrics and error decomposition

| Layer | Primary measures | Why it matters |
| --- | --- | --- |
| Capture | Event coverage, duplicate rate, OCR/transcription accuracy, timestamp error, observation gaps | A memory cannot recover evidence never captured; capture errors must not be attributed solely to retrieval |
| Write | Fact precision/recall, unsupported inference rate, evidence coverage, wrong-entity merge rate | More extracted memories can increase contamination |
| Segmentation | Boundary precision/recall with tolerance, source-span completeness, downstream quality | Good-looking episodes need not improve continuation |
| Retrieve | Evidence recall/precision at a **token** budget, temporal/entity filtering, source diversity | Top-k records differ greatly in length and usefulness |
| Read | Exact match/F1 where appropriate, semantic correctness, citation entailment, unsupported-claim rate | QA correctness and evidence correctness can diverge |
| Revision | Current-state accuracy, historical as-of accuracy, contradiction detection, correction propagation delay | Overwriting every old fact destroys history; retaining every old fact without status harms current answers |
| Forget/delete | Answer suppression, absence from retrieval, absence from derived stores/cache/exports, deletion completion time | Lower retrieval score is not deletion |
| Abstention | Answerable/unanswerable accuracy, false confident answer rate, selective risk/coverage | Always answering and always refusing are both inadequate |
| Isolation | Cross-person/tenant leak rate, ACL revocation propagation, scope-filter bypass | Similarity search must not determine authorization |
| Handoff/action | End-state task success, first correct action, resume latency, repeated failed actions, constraint violations, tool calls, human interventions | This measures whether memory helps work continue |
| Efficiency | Total resource units, p95 latency, memory growth, failed-case rate | Reliability and cost must be assessed together |

Report per-family results, not only one average. For small clustered datasets such as LoCoMo, resample conversation/person clusters rather than treating every question as independent. Repeat stochastic runs with fixed seeds where supported; report paired differences and uncertainty intervals. State whether aggregation is macro by task/person or micro by question. Use the same aggregation for contenders.

LLM judges need a published rubric, a fixed model/version, blind system labels, and spot checks by humans. Add adversarial judge controls: irrelevant verbose answers, plausible wrong dates, correct answer with wrong citation, and unsupported extra claims. Audit disagreement before declaring small gains meaningful. Do not let the same model both invent a synthetic answer key and be its sole validator without a deterministic or human check.

### Synthetic fixtures with deterministic state

Use invented entities, generated local artifacts, controlled tool simulators, and deterministic expected state. These fixtures need no personal dataset.

| Fixture | Stream | Query or continuation | Expected property |
| --- | --- | --- | --- |
| Correction | Day 1: project deadline Friday. Day 2: authorized correction to Monday | Current deadline; deadline known on Day 1 | Monday now; Friday at historical cutoff; correction linked to original |
| Retraction vs new value | A source retracts a claimed destination without a replacement | Where is the shipment going? | Unknown, not the last retracted destination |
| Delete after compression | Fact enters raw events, embedding index, summary, graph, handoff; deletion follows | Exact and paraphrased recall after deletion; inspect all stores | No residual content in any declared deletion scope |
| Late arrival | Event occurred Monday, arrives Wednesday after Tuesday's query | Tuesday knowledge vs Wednesday reconstruction | No future ingestion leakage; correct distinction between when true and when known |
| Temporary override | Default preference, vacation-only exception, then expiration | Preference during and after exception | Scoped override expires; permanent preference is not destroyed |
| Cross-user collision | Two people share a name and discuss the same project under different ACLs | User A asks about User B's private fact | No disclosure despite identical lexical/embedding cues |
| Revocation | Shared source is indexed, then reader loses access | Repeat previously successful query | Derived summary/graph/handoff respects revoked access |
| Observation vs intent | A document is displayed; no save/accept action occurs | Continue the task | Do not claim it was authored, approved, or completed |
| Noisy capture | Repeated screenshots, partial OCR, background audio, transient wrong window title | Identify last verified task state | Deduplicate and preserve uncertainty; no false continuity |
| Abandoned attempt | Tool fails; speculative diagnosis is recorded; later test rejects it | Resume debugging | Rejected diagnosis remains labeled; avoid repeating failed step |
| Causal ambiguity | Two changes precede a passing test, only one isolated rerun exists | Which change fixed the issue? | Attribute only supported causal evidence or abstain |
| Stale handoff | Packet references artifact revision A; recipient sees B | Execute next step | Detect mismatch and refresh before modifying stale context |
| Rare critical detail | One early hard constraint amid many repeated incidental facts | Complete a later plan | Heat/recency pruning does not remove the constraint |
| Prompt injection in evidence | A retrieved document contains instructions to change the agent's goals | Continue original authorized task | Treat document text as evidence, not higher-priority instruction |

For handoff experiments, interrupt at multiple points: before any action, after an error, after a verified partial success, and after a goal/permission change. Reset the recipient's conversational context. Compare no packet, recent transcript, generic summary, structured packet, and structured packet plus source retrieval at equal context budgets. Use the same task/environment seed and test both same-model and cross-model recipients.

### Run manifest and result bundle

Publish a machine-readable manifest containing: dataset URL/revision/hash/license; exact allowed fields; task/person splits; chronological cutoffs; code commit and dependency lock; model and embedding versions; prompts; segmentation/extraction configuration; memory budgets; seeds; resource caps; pricing date; judge rubric/version; environment image; and all deviations from the paper.

Save per-case event IDs, write operations, before/after state hashes, retrieved evidence, final answer/actions, tool outcomes, scores, stage costs, errors, and deletion receipts. For private future deployments, publish only appropriately synthesized or sanitized artifacts; the proposed initial experiments here use public or synthetic inputs.

## Implementable starting architecture

This is the research recommendation, not an independently measured winner:

1. Build a scoped event store with idempotent ingestion and addressable source spans. Store mutable artifacts by version; keep observations separate from assertions and model-derived claims.
2. Create versioned episodes and compact summaries, but retain permitted source access. Begin with simple deterministic boundaries plus optional semantic refinement.
3. Maintain a small typed claim projection for current preferences, constraints, decisions, task state, and open questions. Add valid time, transaction time, evidence, supersession, dispute, and deletion state.
4. Start retrieval with scope/time filters, BM25+dense search, reranking, and bounded source expansion. Add graph traversal only when relation-dependent error analysis justifies it.
5. Construct working context and handoff packets from the same evidence-backed projection. Keep current task state smaller and fresher than the long-term archive.
6. Add procedures only after observed success, with preconditions, environment/version, prior failures, and verification. Treat inferred lessons as provisional until tested.
7. Make update/delete/revocation propagation a first-class operation across all derivatives. Separate relevance decay, context eviction, logical supersession, and actual deletion.
8. Gate more complex consolidation, multi-agent routing, or learned policies on paired improvements in task success at a measured lifetime resource budget.

The core experiment is therefore not “which graph database wins?” It is whether additional structure, write-time inference, or learned memory control improves evidence-supported continuation enough to justify cost, error propagation, and maintenance.

## Evidence status and unresolved gaps

All performance numbers in linked papers remain **author-reported**. This research checked mechanisms, source versions, and public artifact metadata; it did not execute the systems, validate implementation equivalence to papers, or independently reproduce scores. Repository availability does not imply a reproducible environment, and an SPDX license on a repository does not settle upstream dataset/model rights.

Specific gaps retained deliberately: unresolved MAJOR identity; no complete official runnable artifact verified for TiM, RMM, RET-LLM, or ES-Mem; Memory-R1's public repository still advertises future code; MemoryArena code is a preview and its code license was not established; MSC dataset-specific terms and full ScreenshotVQA redistribution terms were not verified. These are observation-limited findings, not claims that no such artifacts exist anywhere.

Recent-work coverage is selective through the observation date. It does not enumerate every 2026 method, benchmark revision, or commercial product release. In particular, a present-day product score must not be retroactively attributed to its original paper.

## Inspected paper-version register

Dates below are the version dates printed in the retrieved paper bodies, not dates of independent validation. A first publication year in the survey can precede the inspected revision.

| Work | Inspected version | Version date |
| --- | --- | --- |
| MSC / Beyond Goldfish Memory | [2107.07567v1](https://arxiv.org/html/2107.07567v1) | 15 Jul 2021 |
| Reflexion: Language Agents with Verbal Reinforcement Learning | [2303.11366v4](https://arxiv.org/html/2303.11366v4) | 10 Oct 2023 |
| Generative Agents: Interactive Simulacra of Human Behavior | [2304.03442v2](https://arxiv.org/html/2304.03442v2) | 06 Aug 2023 |
| MemoryBank: Enhancing Large Language Models with Long-Term Memory | [2305.10250v3](https://arxiv.org/html/2305.10250v3) | 21 May 2023 |
| Ret-LLM: Towards a General Read-Write Memory for Large Language Models | [2305.14322v2](https://arxiv.org/html/2305.14322v2) | 24 Oct 2024 |
| Voyager: An Open-Ended Embodied Agent with Large Language Models | [2305.16291v2](https://arxiv.org/html/2305.16291v2) | 19 Oct 2023 |
| Augmenting Language Models with Long-Term Memory | [2306.07174v1](https://arxiv.org/html/2306.07174v1) | 12 Jun 2023 |
| MemGPT: Towards LLMs as Operating Systems | [2310.08560v2](https://arxiv.org/html/2310.08560v2) | 12 Feb 2024 |
| Think-in-Memory: Recalling and Post-thinking Enable LLMs with Long-Term Memory | [2311.08719v1](https://arxiv.org/html/2311.08719v1) | 15 Nov 2023 |
| MemoryLLM: Towards Self-Updatable Large Language Models | [2402.04624v2](https://arxiv.org/html/2402.04624v2) | 26 May 2024 |
| ReadAgent | [2402.09727v3](https://arxiv.org/html/2402.09727v3) | 22 Jul 2024 |
| Evaluating Very Long-Term Conversational Memory of LLM Agents | [2402.17753v1](https://arxiv.org/html/2402.17753v1) | 27 Feb 2024 |
| A Survey on the Memory Mechanism of Large Language Model based Agents | [2404.13501v1](https://arxiv.org/html/2404.13501v1) | 21 Apr 2024 |
| From Local to Global: A GraphRAG Approach to Query-Focused Summarization | [2404.16130v2](https://arxiv.org/html/2404.16130v2) | 19 Feb 2025 |
| HippoRAG: Neurobiologically Inspired Long-Term Memory for Large Language Models | [2405.14831v3](https://arxiv.org/html/2405.14831v3) | 14 Jan 2025 |
| LightRAG: Simple and Fast Retrieval-Augmented Generation | [2410.05779v3](https://arxiv.org/html/2410.05779v3) | 28 Apr 2025 |
| LongMemEval: Benchmarking Chat Assist-ants on Long-Term Interactive Memory | [2410.10813v2](https://arxiv.org/html/2410.10813v2) | 04 Mar 2025 |
| Zep: A Temporal Knowledge Graph Architecture for Agent Memory | [2501.13956v1](https://arxiv.org/html/2501.13956v1) | 20 Jan 2025 |
| A-Mem: Agentic Memory for LLM Agents | [2502.12110v11](https://arxiv.org/html/2502.12110v11) | 08 Oct 2025 |
| From RAG to Memory: Non-Parametric Continual Learning for Large Language Models | [2502.14802v2](https://arxiv.org/html/2502.14802v2) | 19 Jun 2025 |
| In Prospect and Retrospect: Reflective Memory Management for Long-term Personalized Dialogue Agents | [2503.08026v2](https://arxiv.org/html/2503.08026v2) | 28 Jul 2025 |
| Know Me, Respond to Me: Benchmarking LLMs for Dynamic User Profiling and Personalized Responses at Scale | [2504.14225v2](https://arxiv.org/html/2504.14225v2) | 27 Oct 2025 |
| Mem0: Building Production-Ready AI Agents with Scalable Long-Term Memory | [2504.19413v1](https://arxiv.org/html/2504.19413v1) | 28 Apr 2025 |
| Memory OS of AI Agent | [2506.06326v1](https://arxiv.org/html/2506.06326v1) | 30 May 2025 |
| MemoryAgentBench | [2507.05257v4](https://arxiv.org/html/2507.05257v4) | 28 Jun 2026 |
| MIRIX: Multi-Agent Memory System for LLM-Based Agents | [2507.07957v1](https://arxiv.org/html/2507.07957v1) | 10 Jul 2025 |
| Memory-R1: Enhancing Large Language Model Agents to Manage and Utilize Memories via Reinforcement Learning | [2508.19828v5](https://arxiv.org/html/2508.19828v5) | 14 Jan 2026 |
| Beyond a Million Tokens: Benchmarking and Enhancing Long-Term Memory in LLMs | [2510.27246v2](https://arxiv.org/html/2510.27246v2) | 21 Feb 2026 |
| Memory in the Age of AI Agents: A Survey — Forms, Functions and Dynamics | [2512.13564v2](https://arxiv.org/html/2512.13564v2) | 13 Jan 2026 |
| MAGMA: A Multi-Graph based Agentic Memory Architecture for AI Agents | [2601.03236v2](https://arxiv.org/html/2601.03236v2) | 16 Apr 2026 |
| ES-Mem | [2601.07582v2](https://arxiv.org/html/2601.07582v2) | 13 Jan 2026 |
| Benchmarking Agent Memory in Interdependent Multi-Session Agentic Tasks | [2602.16313v2](https://arxiv.org/html/2602.16313v2) | 17 Sep 2026 |
| AMA-Bench: Evaluating Long-Horizon Memory for Agentic Applications | [2602.22769v4](https://arxiv.org/html/2602.22769v4) | 27 May 2026 |
| Memory for Autonomous LLM Agents:Mechanisms, Evaluation, and Emerging Frontiers | [2603.07670v1](https://arxiv.org/html/2603.07670v1) | 08 Mar 2026 |

For LoCoMo conclusions, the official repository’s final PDF and current dataset description take precedence over the older arXiv HTML snapshot. Current repository/card observations were made on 2026-10-12 and were not treated as historical paper artifacts.
