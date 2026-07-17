# Architecture Document
## Multi-Agent Autonomous Operations Hub — FIFA World Cup 2026

**Document type:** System Architecture
**Companion documents:** PRD, TRD, System Design Rules

---

## 1. Architectural Principles

- **Decentralized reasoning over a monolithic model.** Specialized agents each own a narrow domain (crowd, traffic, security, medical, VIP, sustainability, translation), keeping context small, auditable, and independently scalable.
- **Ground truth first.** Agents source venue-specific facts from a deterministic database via tool calls; a fabricated gate number or medical alert is treated as a safety hazard, not an acceptable model error.
- **Human-in-the-loop for safety-critical action.** Automated dispatch of consequential actions requires human confirmation in the current phase.
- **Async-first backend.** LLM reasoning latency must never block the staff-facing API or dashboard.
- **Real-time push, not polling.** Command center staff see updates the moment they occur.
- **Modularity for phased rollout.** Each agent and dashboard module can be enabled independently as the platform moves from MVP to full deployment.
- **Explainability by Default (XAI).** Every agent decision outputs a reasoning trace; black-box decisions are rejected.
- **Federated Learning for Scale.** Cross-stadium learning happens by sharing model weight updates, never raw PII or fan data.

## 2. High-Level Layered View

1. **Data Source Layer** — turnstiles/access control, public transit APIs, weather feeds, CCTV/computer-vision analytics, SMS/app fan and staff reports, staff radio/dispatch, POS/inventory systems.
2. **Ingestion & Normalization Layer** — collectors and API gateways that normalize heterogeneous feeds into a consistent internal event format, buffered through a message queue.
3. **Ground-Truth Data Layer (MySQL)** — the authoritative store of stadium blueprints, staff rosters, inventory logs, incident history, and crowd-flow history, described in the TRD's data model.
4. **Agent & Orchestration Layer** — the specialized agents plus the Orchestrator, coordinated as a state graph (LangGraph/CrewAI pattern), each equipped with tools to query the ground-truth layer.
5. **Backend Application Layer** — Django + DRF exposing the API surface; Celery workers executing agent tasks asynchronously; Redis as broker and cache.
6. **Real-Time Communication Layer** — WebSocket/Channels layer pushing live state changes to connected dashboard clients.
7. **Presentation Layer** — the Command Center Dashboard, Fan Companion App, City-Wide Aggregator, and their modules (Digital Twin, Simulation Mode, Agent Network, Crowd Intelligence, Transport & Traffic, Safety & Security, Sustainability Monitor, Multilingual Hub, AI Command Assistant, Incident Timeline, Camera Grid, Asset Management, Analytics & BI, System Health, Business Viability/ROI).
8. **Cross-Cutting Concerns** — identity and access management, observability/logging, the immutable audit trail (including Bias Auditing and Human Feedback loops), and Model Versioning/Rollback, spanning all layers.

## 3. Agent Network Architecture

The agent layer follows a **hub-and-spoke orchestration pattern**, matching the reference design's Agent Network view:

- The **Orchestrator Agent** sits at the center and is the only agent with authority to issue a final dispatch action.
- Specialized spoke agents (Crowd Management, Traffic, Security, Medical/Triage, VIP Services, Sustainability, Translation, **Weather/Climate, Accessibility, Fraud/Ticketing, Evacuation Planning, Vendor Demand**) each operate on their own slice of state and their own tool set, reasoning independently.
- Each spoke agent reports findings, recommended actions, and **reasoning traces (XAI)** to the Orchestrator rather than acting directly on the world.
- The Orchestrator resolves conflicts (for example, a security lockdown recommendation colliding with an evacuation routing plan), ranks urgency, and either dispatches an approved action or escalates to a human supervisor when confidence is low or severity is high.
- This structure allows new agents to be added without changing the reasoning logic of existing agents.

## 4. Data Flow Narrative — Example: Gate B Heatstroke Incident

1. A fan or staff member reports a medical issue via the app or radio; the ingestion layer normalizes this into a structured event.
2. The Triage/Medical Agent classifies severity and queries the ground-truth database for the nearest available medical staff and equipment.
3. The Medical Agent posts its finding and recommendation to the Orchestrator.
4. The Orchestrator checks for conflicting or concurrent priorities (for example, a simultaneous crowd bottleneck reported by the Crowd Management Agent) and determines the combined response plan.
5. The Orchestrator issues the dispatch instruction through the Django API; a Celery task executes the notification to field staff devices asynchronously so the API remains responsive.
6. The dashboard updates in real time via the WebSocket layer — the incident appears in the Incident Timeline and an alert badge appears on the relevant Digital Twin gate marker.
7. On resolution, the outcome and response time are written back to the ground-truth database for audit and later analytics.

## 5. Deployment Architecture

A hybrid **edge + cloud** deployment is used to balance latency-sensitive operations against centralized intelligence and reporting:

- **Edge node (on-site at the stadium):** runs latency-critical services — turnstile ingestion, local camera analytics preprocessing, and a local MySQL read replica — so core safety monitoring keeps functioning even if the link to the cloud region degrades.
- **Cloud region:** runs the agent orchestration layer, LLM reasoning, aggregation, analytics/BI, and the primary dashboard backend, connected to the edge node via a secure, dedicated link.
- **Containerized microservices** behind a load balancer, with auto-scaling configured for match-day peak load.
- **Multi-availability-zone database replication** for the primary ground-truth store, with a standby disaster-recovery site capable of takeover within defined recovery objectives.

## 6. Resilience & Failure Handling

- If a specialized agent fails or times out, its function falls back to simple rule-based thresholds (for example, static gate-capacity alerts) or is queued for direct human review.
- If the edge-to-cloud link is degraded, the dashboard falls back to the last-known cached state with a clearly displayed staleness indicator, rather than showing blank or frozen data silently.
- Circuit breakers wrap every external API integration so one failing feed cannot cascade into a full system outage.
- A defined degradation ladder governs behavior under partial failure: **Full AI-assisted mode → Rule-based assisted mode → Manual mode**, with the current mode always visible on the System Health module.

## 7. Observability

- Every agent decision, tool call, and human override is logged centrally to support post-event review and continuous improvement of agent accuracy.
- System-level metrics (latency, uptime, queue depth, error rates) feed the System Health dashboard module.
- Distributed tracing links an incident from its originating event through every agent hop to its final dispatch, supporting the audit and traceability requirements defined in the TRD.
