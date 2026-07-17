# Design System & Visual Guidelines
## Multi-Agent Autonomous Operations Hub — FIFA World Cup 2026

This design system is derived directly from the reference command center dashboard image and extended into a consistent, reusable visual language for the full MVP screen set.

---

## 1. Design Philosophy

The interface is built as a **mission-control / command-center system**, meant to run continuously on large displays in a low-light operations room, with supplementary use on operator workstations. The guiding principles are:

- **Glanceability first.** Critical status (occupancy, safety score, active alerts) must be readable from a distance in under two seconds.
- **Dark, low-strain theme.** A near-black background reduces eye strain during long shifts and long tournament days.
- **High information density without clutter.** Many live modules are visible simultaneously, organized into a clean card grid rather than crowded free-form panels.
- **Status through color and shape, not decoration.** Every color used (green/amber/red, cyan/purple) maps to a specific operational meaning, never purely decorative.
- **Confidence and calm under pressure.** Even during an active incident, the interface should feel controlled and precise, not alarming or chaotic — consistent with a life-safety operations tool.

## 2. Color Palette

| Role | Description | Usage |
| --- | --- | --- |
| Background — primary | Near-black navy | Overall app background |
| Background — panel | Slightly lighter navy with a subtle glowing border | Card and module containers |
| Accent — primary (cyan/blue) | Bright cyan-blue | Primary interactive elements, active agent nodes, live data lines |
| Accent — secondary (purple) | Vivid purple | Secondary agent nodes, digital twin highlight elements, prediction markers |
| Status — optimal/live (green) | Bright green | "Optimal" status, resolved incidents, low crowd density, live indicators |
| Status — caution (amber/yellow) | Amber/yellow | Medium alerts, moderate density, in-progress items |
| Status — critical (red/orange) | Red-orange | High/very-high density, critical alerts, offline assets |
| Text — primary | Off-white / light gray | Headlines, key values |
| Text — secondary | Muted gray-blue | Labels, timestamps, supporting text |

Color is always paired with a text label or icon so meaning is never conveyed by color alone (see Accessibility, section 8).

## 3. Typography

- **Headings / module titles:** A geometric, technical-feeling sans-serif, set in uppercase with slight letter-spacing for labels (for example, "LIVE DIGITAL TWIN," "AI AGENT NETWORK") to reinforce the command-center tone.
- **Body and data values:** A clean, highly legible sans-serif for numeric readouts and descriptive text, sized larger for primary KPI numbers (for example, occupancy percentage, safety score) and smaller for supporting labels.
- **Timestamps and identifiers:** A monospaced or tabular-figure treatment for time stamps and IDs so columns of numbers align cleanly in feeds like the Incident Timeline.

## 4. Layout & Grid

- **Persistent left sidebar** with icon-plus-label navigation for every major module (Command Center, Digital Twin, Agent Network, Situation Room, Crowd Intelligence, Transport & Traffic, Safety & Security, Volunteer Ops, Sustainability, Asset Management, Multilingual Hub, Analytics & BI, System Health, Settings), with the active item clearly highlighted.
- **Top status bar** spanning the width of the screen: event branding, dashboard title, live clock/date, venue name and location, and an overall operation status badge (for example, "OPTIMAL").
- **Main content area** organized as a responsive card grid: a large primary card (Digital Twin) paired with a secondary large card (Agent Network) in the top row; a row of small KPI/status cards; then a row of mid-sized analytical cards (Crowd Intelligence, Crowd Prediction, Transport & Traffic, Sustainability); then a bottom row combining the AI Command Assistant, Incident Timeline, and Live Camera Grid.
- **Consistent spacing:** even gutters between cards, consistent internal card padding, and a shared corner radius across all cards for visual cohesion.
- **A slim footer/ticker bar** at the very bottom for scrolling live-update text, reinforcing the "always current" feel.

## 5. Core Components

- **KPI ring / gauge:** a circular progress indicator with a bold central number (used for prediction accuracy, safety score, system uptime).
- **Status badge / pill:** small colored label (for example, "LIVE," "ACTIVE," "RESOLVED," "OPTIMAL") using the status color palette.
- **Agent network node:** a hexagonal icon-plus-label element representing each agent, connected by thin lines to a central Orchestrator node, with a colored status dot per agent.
- **Digital twin render card:** a stylized top-down or isometric venue visualization with glowing sector markers and a supporting metrics strip beneath it (capacity, occupancy, safety score, weather).
- **Heatmap card:** a venue-shaped density map using a green-to-red gradient legend.
- **Prediction chart:** a combined actual/predicted line or area chart with a clearly marked forecast peak.
- **Traffic/transit map card:** a stylized map with color-coded route segments (smooth/moderate/heavy/blocked).
- **Metric tile:** a small card pairing an icon, a bold value, and a short label (used throughout Sustainability, KPI, and Asset modules).
- **Incident/alert list item:** a timestamp, short description, and a severity badge, in a vertically scrolling feed.
- **Chat assistant panel:** an avatar/icon representing the assistant, a scrollable suggestion list, and a text input with a send action.
- **Camera grid thumbnail:** a labeled video thumbnail with a status tag (for example, "Normal," "High Density," "Full," "Low Density") and a highlighted border for any thumbnail currently flagged.
- **Donut/ring breakdown chart:** used for asset status (operational/maintenance/offline) with a bold central total.

## 6. Iconography

- Outline-style icons throughout, with a subtle glow applied only to active/live elements to draw attention without overwhelming the dark background.
- Consistent stroke weight across all icons for visual harmony.
- Icons are color-coded to match their module's accent (for example, a shield icon in the security accent color, a leaf icon in the sustainability green).

## 7. Data Visualization Guidelines

- Use a consistent four-step color scale for density and congestion everywhere it appears: green (low/smooth) → yellow/amber (moderate) → orange (high) → red (critical/blocked).
- Reserve motion (pulsing, glowing) strictly for "live" indicators and truly time-sensitive alerts — not for decorative emphasis.
- Avoid 3D or skeuomorphic styling except for the stadium digital twin render, which is the one intentionally illustrative element in an otherwise flat, data-forward interface.
- Keep chart axes and gridlines low-contrast so the data itself remains the visual focus.

## 8. Accessibility

- Maintain sufficient contrast between text and the dark background across all status colors.
- Never rely on color alone to convey status — always pair color with a text label or icon (for example, a red badge always also reads "Critical," not just a color swatch).
- Support scalable text sizing for operator workstations without breaking the card layout.
- Ensure all critical alert actions (acknowledge, dispatch, escalate) are reachable via keyboard navigation, not pointer-only.

## 9. Interaction & Motion

- A subtle pulse animation is reserved for "LIVE" badges and truly active/streaming elements (camera feeds, live translation status).
- Panel and value updates transition smoothly rather than snapping abruptly, so operators can perceive what changed.
- Flashing or high-frequency animation is reserved exclusively for the highest-severity, currently-unacknowledged alert, to avoid alarm fatigue from lower-priority events.

## 10. Responsive Considerations

- **Primary target:** large command-center wall displays and desktop monitors, where the full card grid is shown.
- **Secondary target:** tablet view for field supervisors, showing a condensed card set prioritized around Incident Timeline, Alerts, and the module relevant to their role.
- **Mobile (field/volunteer staff):** a minimal, task-focused view showing only assigned dispatch instructions and a way to report status — not the full dashboard.
