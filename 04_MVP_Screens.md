# MVP Screens Specification
## Multi-Agent Autonomous Operations Hub — FIFA World Cup 2026

This document defines the screen set for the Command Center Dashboard, derived from the reference design, with MVP prioritization (P0 = must-have for pilot launch, P1 = near-term follow-up, P2 = later phase).

---

### 1. Login & Role Selection — P0
- **Purpose:** Authenticate staff and route them to a role-appropriate view.
- **Key elements:** SSO/MFA login, role selector (Operator, Supervisor, Security, Medical, Traffic, Sustainability, Volunteer).
- **Data displayed:** N/A (authentication only).
- **Primary actions:** Log in; select active role/shift.

### 2. Command Center Home / Overview Dashboard — P0
- **Purpose:** Single-glance operational overview, matching the reference layout.
- **Key elements:** Top status bar (event name, date/time, venue, operation status), Operational KPI tiles (prediction accuracy, incidents prevented, average response time), System Health summary, Active Alerts panel.
- **Data displayed:** Live occupancy, safety score, weather, top active alerts.
- **Primary actions:** Drill into any module; acknowledge top alerts.

### 3. Live Digital Twin — P0
- **Purpose:** Visual representation of the stadium's real-time state.
- **Key elements:** Stadium render with sector markers, capacity/occupancy readout, safety score, weather, entry gate status, crowd density, queue status, incident count, response time.
- **Data displayed:** Real-time occupancy percentage, per-gate open/closed status, per-sector density banding.
- **Primary actions:** Click a gate/sector marker to see detail; jump to related incident.

### 4. AI Agent Network View — P1
- **Purpose:** Show which specialized agents are active and their current status.
- **Key elements:** Hub-and-spoke node graph with the Orchestrator at center and spoke agents (Crowd, Traffic, Security, Medical, VIP Services, Sustainability, Translation).
- **Data displayed:** Per-agent status (active/degraded/offline), last decision timestamp.
- **Primary actions:** Click an agent node to see its recent findings and tool calls.

### 5. Crowd Intelligence Heatmap — P0
- **Purpose:** Live visualization of crowd density across the venue.
- **Key elements:** Stadium heatmap colored by density band (low/medium/high/very high).
- **Data displayed:** Real-time density per sector.
- **Primary actions:** Filter by sector; open related alert if density exceeds threshold.

### 6. Crowd Prediction — P1
- **Purpose:** Forward-looking crowd forecast to enable preventive action.
- **Key elements:** 60-minute forecast chart (actual vs. predicted), predicted peak marker.
- **Data displayed:** Historical trend line, predicted peak time and volume.
- **Primary actions:** Trigger preventive dispatch recommendation from a forecasted peak.

### 7. Transport & Traffic Overview — P1
- **Purpose:** Monitor surrounding transit and road conditions affecting ingress/egress.
- **Key elements:** Map view with congestion-level color coding (smooth/moderate/heavy/blocked).
- **Data displayed:** Live transit and road status feeding the Traffic Agent.
- **Primary actions:** Escalate a congestion event to the Orchestrator.

### 8. Safety & Security Panel — P0
- **Purpose:** Consolidated security agent output and response coordination.
- **Key elements:** Active security alerts, camera cross-reference, assigned responder status.
- **Data displayed:** Alert severity, location, confidence, assigned staff.
- **Primary actions:** Approve/dispatch a recommended response; escalate to human supervisor.

### 9. Incident Timeline & Alerts — P0
- **Purpose:** Chronological record of all incidents and resolutions.
- **Key elements:** Time-stamped feed with severity tags (medium/low/resolved), incident description, assigned action.
- **Data displayed:** All incidents across modules with current status.
- **Primary actions:** Filter by severity/module; mark resolved; export for audit.

### 10. AI Command Assistant — P1
- **Purpose:** Natural-language query interface for operators.
- **Key elements:** Chat panel with suggested prompts (for example, "Which gate is least crowded right now?").
- **Data displayed:** Responses grounded in live ground-truth data, with source references.
- **Primary actions:** Ask a question; act on a suggested follow-up.

### 11. Sustainability Monitor — P2
- **Purpose:** Live environmental impact tracking.
- **Key elements:** Carbon saved, plastic saved, water saved, energy usage (with renewable share).
- **Data displayed:** Live sustainability metrics by category.
- **Primary actions:** Export metrics for reporting.

### 12. Multilingual Hub — P2
- **Purpose:** Monitor live translation/broadcast coverage.
- **Key elements:** Per-language live status indicators (for example, English, Arabic, Spanish, French, Hindi).
- **Data displayed:** Active/inactive status per supported language.
- **Primary actions:** Enable/disable a language channel.

### 13. Live Camera Grid — P1
- **Purpose:** AI-assisted surveillance overview.
- **Key elements:** Grid of camera thumbnails labeled by zone, with status tags (normal/high density/full/low density).
- **Data displayed:** Live feed thumbnails, anomaly flags from the Security Agent.
- **Primary actions:** Expand a feed; jump to related alert.

### 14. Asset / Facility Management — P2
- **Purpose:** Track operational status of stadium assets and equipment.
- **Key elements:** Donut chart of asset status (operational/maintenance/offline), asset list.
- **Data displayed:** Total assets and status breakdown.
- **Primary actions:** Flag an asset for maintenance; view asset detail.

### 15. Analytics & BI — P2
- **Purpose:** Historical and cross-event reporting.
- **Key elements:** Configurable reports and trend charts.
- **Data displayed:** Historical incident, crowd, and sustainability data.
- **Primary actions:** Generate and export reports.

### 16. System Health — P1
- **Purpose:** Monitor the platform's own infrastructure and agent uptime.
- **Key elements:** Uptime percentage, service status list, degradation-mode indicator.
- **Data displayed:** Infrastructure health metrics defined in the Architecture document.
- **Primary actions:** Acknowledge a degraded-mode warning.

### 17. Settings & User Management — P1
- **Purpose:** Administer roles, permissions, and configuration.
- **Key elements:** User list, role assignment, threshold configuration for alerts.
- **Data displayed:** Current user roles and system configuration.
- **Primary actions:** Add/remove users; adjust alert thresholds (admin only).
