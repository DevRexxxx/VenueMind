# User Flow Document
## Multi-Agent Autonomous Operations Hub — FIFA World Cup 2026

This document describes the core end-to-end user flows across the platform's key personas.

---

## Flow 1: Operator Daily Monitoring Flow

**Actor:** Command Center Operator

1. Operator logs in and selects active shift/role.
2. Command Center Home loads with live KPIs, System Health, and Active Alerts.
3. Operator scans the Live Digital Twin for occupancy, safety score, and gate status.
4. Operator checks Crowd Intelligence heatmap for any sector trending toward "high" or "very high" density.
5. If all indicators are normal, operator continues routine monitoring with periodic checks of the Incident Timeline.
6. If an anomaly is visible (for example, a density spike), operator drills into the relevant module for detail and proceeds to Flow 2 if it becomes an incident.

## Flow 2: Incident Detection to Resolution Flow

**Actors:** Fan/Staff Reporter, Triage/Medical or Security Agent, Orchestrator, Shift Supervisor, Field Staff

1. A fan or staff member reports an issue via app, SMS, or radio.
2. The relevant specialized agent (Medical, Security, or Maintenance) classifies the incident type and severity using ground-truth data (nearest staff, equipment, gate status).
3. The agent sends its finding and recommended action to the Orchestrator.
4. The Orchestrator checks for conflicting priorities and determines the response plan.
5. **Decision point — severity/confidence check:**
   - If severity is low and confidence is high, the Orchestrator proposes an automatic dispatch, shown to the Supervisor for one-click approval.
   - If severity is high or confidence is low, the Orchestrator escalates directly to the Supervisor for manual decision before any dispatch occurs.
6. Supervisor approves (or modifies) the dispatch.
7. Field staff receive the instruction on their device and act.
8. The Incident Timeline updates in real time with status changes (dispatched → in progress → resolved).
9. On resolution, response time and outcome are logged to the ground-truth database for audit and analytics.

## Flow 3: Crowd Surge Prediction & Preventive Dispatch Flow

**Actors:** Crowd Management Agent, Traffic Agent, Orchestrator, Transport & Traffic Coordinator

1. The Crowd Management Agent and Traffic Agent continuously feed live density and congestion data into the Crowd Prediction model.
2. The Crowd Prediction module forecasts a peak density point within the next 60 minutes.
3. **Decision point — forecast exceeds safe threshold:**
   - If the forecasted peak stays within safe limits, no action is triggered; operators can view the forecast for awareness.
   - If the forecasted peak exceeds the safe threshold, the Orchestrator generates a preventive recommendation (for example, opening an additional gate or rerouting fans).
4. Recommendation is surfaced to the Transport & Traffic Coordinator or Supervisor for approval.
5. Upon approval, the action is dispatched to relevant gate/field staff.
6. The Crowd Prediction chart and Digital Twin update to reflect the corrective action taken.

## Flow 4: AI Command Assistant Query Flow

**Actor:** Command Center Operator or Supervisor

1. Operator opens the AI Command Assistant panel.
2. Operator types or selects a suggested query (for example, "Which gate is least crowded right now?").
3. The Assistant retrieves the answer by querying the ground-truth database and current agent state — never from unverified model memory.
4. The Assistant responds with the answer and, where relevant, a suggested follow-up action (for example, "Show me emergency exits in Sector 7").
5. Operator can act directly from the response (for example, jump to the relevant Digital Twin sector) or ask a follow-up question.

## Flow 5: Multilingual Fan Support Flow

**Actors:** Translation Agent, Multilingual Hub, Fan-facing broadcast system

1. An announcement or fan-facing message is generated (for example, a safety notice or gate change).
2. The Translation Agent translates the content into all currently "live" supported languages.
3. The Multilingual Hub displays live status per language.
4. **Decision point — translation confidence:**
   - If translation confidence is high, the message is broadcast automatically in that language.
   - If translation confidence is low for a given language, the message is flagged for human review before broadcast in that language.
5. Broadcast status is logged for audit.

## Flow 6: Shift Handover Flow

**Actors:** Outgoing Operator/Supervisor, Incoming Operator/Supervisor

1. Outgoing staff opens the Incident Timeline and System Health modules to compile a handover summary.
2. Outgoing staff annotates any open incidents or watch items for the incoming shift.
3. Incoming staff logs in and reviews the handover summary, open incidents, and current System Health status before assuming active monitoring duties.
4. Incoming staff acknowledges handover completion, which is logged in the audit trail.

## Flow 7: Asset Maintenance Flow

**Actors:** Facility staff, Sustainability/Asset module, Supervisor

1. An asset's status changes to "maintenance required" or "offline" (either via sensor data or manual flag).
2. The Asset / Facility Management module updates the relevant status and donut chart.
3. **Decision point — asset criticality:**
   - If the asset is non-critical, a maintenance ticket is queued for routine handling.
   - If the asset is safety- or operations-critical (for example, a gate scanner), an alert is raised to the Supervisor for immediate action.
4. Facility staff are dispatched to resolve the issue.
5. Asset status is updated back to "operational" upon resolution, closing the loop in the audit trail.
