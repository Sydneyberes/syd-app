# Route Planner Metrics Dashboard — Product & Design Specification

**Version:** 1.0
**Date:** 2026-03-26
**Status:** Production-Ready Draft
**Audience:** Product, Design, Engineering

---

## Table of Contents

1. [Title & Purpose](#1-title--purpose)
2. [Design Principles](#2-design-principles)
3. [Page Architecture](#3-page-architecture)
4. [Section-by-Section Spec](#4-section-by-section-spec)
   - 4.1 [Fleet Overview — "How Did the Fleet Perform?"](#41-fleet-overview--how-did-the-fleet-perform)
   - 4.2 [Driver Utilization — "Who's Carrying the Load?"](#42-driver-utilization--whos-carrying-the-load)
   - 4.3 [Vehicle Utilization — "Are Our Assets Working?"](#43-vehicle-utilization--are-our-assets-working)
   - 4.4 [Route Efficiency — "Are Our Routes Actually Efficient?"](#44-route-efficiency--are-our-routes-actually-efficient)
   - 4.5 [POD Compliance — "Do We Have Proof It Happened?"](#45-pod-compliance--do-we-have-proof-it-happened)
   - 4.6 [Trends Over Time — "What's the Shape of the Business?"](#46-trends-over-time--whats-the-shape-of-the-business)
5. [Vehicle Utilization Deep Dive](#5-vehicle-utilization-deep-dive)
6. [Color & Visual Language](#6-color--visual-language)
7. [Component Glossary](#7-component-glossary)
8. [Data Notes & Caveats](#8-data-notes--caveats)

---

## 1. Title & Purpose

### Dashboard Name
**Route Planner Metrics Dashboard**

### One-Line Description
A performance intelligence layer on top of route planning operations — translating raw delivery data into ranked, scored, and insight-driven views that tell operators not just what happened, but who's winning, where costs are hiding, and what to fix first.

### Who It's For

| Persona | Primary Need | Primary Section |
|---|---|---|
| Fleet Manager / Operations Lead | Whole-fleet health at a glance, liability surface, cost allocation | Fleet Overview, Vehicle Utilization, POD Compliance |
| Dispatcher | Driver workload balance, route quality, scheduling | Driver Utilization, Route Efficiency |
| Safety / Compliance Officer | Proof of delivery audit trail, task failure reasons | POD Compliance (detail tab) |
| Executive / Owner | Trends, subscription delivery, cost per route | Trends, Fleet Score |
| Driver (read-only, optional) | Personal performance vs fleet | Driver Leaderboard (own row) |

### What It Does

The dashboard has three jobs, in order of priority:

1. **Score and rank** — Surface the composite Fleet Score and per-driver rankings so the competitive context is immediately visible.
2. **Expose cost and risk** — Identify underutilized vehicles (capital waste), overworked drivers (burnout/liability), and missed POD tasks (dispute exposure).
3. **Provide a clean data layer** — Every chart has a corresponding exportable pure-data table for audits, disputes, and billing reconciliation.

---

## 2. Design Principles

### 2.1 The Three Registers

Every element in the dashboard belongs to exactly one of three registers. Assign the register before designing the component — never after.

---

#### Register 1: Pure Data

> "The number, clean."

The unedited record. No interpretation, no color-coding, no ranking. This register exists because someone might export it, dispute it, or look up a specific value.

**When to use:** Audit trails, exportable tables, field-level detail, anything that might appear in a billing dispute or compliance review.

**Visual grammar:**
- White background
- Dense layout, maximized information per pixel
- Monospace figures (tabular numeric font)
- Sortable columns with directional indicators
- Export button (CSV/XLSX) always present
- Zero color accent — not even zebra striping with brand color
- No iconography beyond sort arrows

---

#### Register 2: Business Insight

> "The number + the so what."

A synthesized callout that names the pattern and points toward an action. Sits adjacent to a chart — never standalone, never in a table row.

**When to use:** When a manager needs to know what to do about a pattern without having to derive it themselves.

**Visual grammar:**
- Tinted callout card (light tint of the relevant zone color, or neutral blue-gray)
- Icon prefix (warning, info, trend-up, trend-down)
- 1–2 sentences maximum — pattern + implication
- Adjacent to the chart it references, never embedded in it
- No interactivity — static text with dynamic values interpolated

**Callout copy format:**
```
[Icon] [Metric name] is [value/state]. [One sentence on implication or recommended action.]
```

---

#### Register 3: Leaderboard

> "The number in competitive context."

The number sorted, color-encoded, ranked, and made visceral. This register is designed to be felt, not just read.

**When to use:** Driver rankings, vehicle utilization comparison, POD tier badges, Fleet Score display. Any time the goal is to make someone feel the pattern of who's ahead and who's behind.

**Visual grammar:**
- Color-encoded by zone (red/yellow/green or Hi-Vis scale — see Section 6)
- Sorted descending (winner at top) by default
- Hi-Vis accent colors at full saturation for top and bottom performers
- Rank delta indicators (↑2, ↓1, NEW) on driver/vehicle rows
- Hero position — top of section or top of page
- Sparklines where time series is available
- Badge/tier overlays for milestone recognition

---

#### The Decision Rule

```
Is the data something someone might export, dispute, or look up?
  → Pure Data

Does the data reveal a pattern someone needs to act on?
  → Business Insight callout (adjacent to a chart)

Does the data rank or compare entities and need to be felt?
  → Leaderboard
```

---

### 2.2 The Fleet Score

The Fleet Score is the single composite hero number at the top of the dashboard. It answers: "Is the fleet performing well, overall, right now?"

**Range:** 0–100

**Component Weights:**

| Component | Weight | Source |
|---|---|---|
| On-Time Arrival Rate | 35% | stops.arrived_at vs stops.estimated_arrival_at_stop |
| POD Completion Rate | 30% | stop_tasks where is_required = true, completed_at IS NOT NULL |
| Planned vs Actual Duration Variance | 20% | itineraries.total_estimated_time vs actual duration |
| Stop Completion Rate | 15% | stops completed / stops assigned |

**Normalization:** Each component is normalized 0–100 before weighting. A perfect score on all components = 100. The weighted sum is the Fleet Score.

**Score Zones:**

| Zone | Range | Color |
|---|---|---|
| Excellent | 85–100 | Green (#22C55E) |
| Good | 70–84 | Blue (#3B82F6) |
| Needs Attention | 50–69 | Amber (#F59E0B) |
| At Risk | 0–49 | Red (#EF4444) |

**Display:** Large numeric display (48px+), zone-colored, with a thin arc gauge beneath it. The score updates based on the active date range filter.

---

### 2.3 Leaderboard Psychology Rationale

Raw metrics report what happened. Leaderboard mechanics make people care about what happened.

The psychological hooks applied across this dashboard:

| Hook | Implementation | Location |
|---|---|---|
| Streak indicator | Consecutive days above performance threshold, shown as 🔥 N days | Driver Leaderboard rows |
| Most Improved badge | Driver with highest positive rank delta over period | Driver Leaderboard, section header |
| Rank delta | ↑N or ↓N movement vs prior period | Driver and Vehicle rows |
| Personal Best flag | Green star when a driver's metric is their highest recorded | Driver row hover state |
| Fleet Record flag | Purple crown when a value is the all-time fleet best | Stat cards, driver rows |
| Performance flags / ⚠ callout | Named callout of what specific metric dropped | Insight card beneath driver row |
| POD Tier badge | Gold / Silver / Bronze / At Risk by POD completion range | Driver rows, POD section |
| Perfect Route callout | Route where 100% required tasks completed on time | Route detail, trends section |
| Bench Warmer callout | Vehicle with lowest utilization vs fleet average | Vehicle Utilization section |

The goal is not gamification for its own sake. It is **salience** — making the patterns impossible to ignore so that managers act on them faster.

---

## 3. Page Architecture

### 3.1 Global Header

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Logo / App Name]          Route Planner Metrics Dashboard                  │
│                                                                              │
│  Date Range: [Last 30 Days ▾]   Drivers: [All ▾]   Vehicles: [All ▾]        │
│  [Apply Filters]                                              [Export All]   │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Filter Behavior:**
- Date range: preset options (Today, Last 7D, Last 30D, This Month, Last Month, Custom) + date picker
- Driver filter: multi-select, sourced from freeform_drivers active in range
- Vehicle filter: multi-select, sourced from freeform_vehicles active in range
- All sections respond to all filters simultaneously
- Filter state persists in URL parameters for shareability

---

### 3.2 Fleet Score Hero Band

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│         FLEET SCORE                                                          │
│                                                                              │
│              ╭────────╮                                                      │
│              │   83   │   ← Arc gauge, zone-colored                         │
│              ╰────────╯                                                      │
│               GOOD ↑4 vs prior period                                        │
│                                                                              │
│   On-Time: 87%  │  POD: 91%  │  Duration Var: -6%  │  Stop Completion: 98%  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Full-width band, light neutral background (#F8FAFC)
- Fleet Score centered with arc gauge
- Four component scores shown as secondary metrics in a row beneath
- Delta vs prior equivalent period (same length, immediately preceding)
- Zone label text (EXCELLENT / GOOD / NEEDS ATTENTION / AT RISK) in zone color

---

### 3.3 Stat Cards Row

Sits beneath the Fleet Score hero band. Six cards in a responsive grid (3-up on tablet, 6-up on desktop).

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  Routes  │ │  Stops   │ │ Distance │ │  Route   │ │  Avg     │ │  Avg     │
│Completed │ │ Served   │ │  (mi)    │ │  Hours   │ │ Duration │ │Stops/Rte │
│   342    │ │  4,891   │ │ 12,440   │ │  1,026   │ │  3h 01m  │ │   14.3   │
│  ↑12%    │ │  ↑9%     │ │  ↑7%     │ │  ↑11%    │ │  −2%     │ │  ↓0.4   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

Register: **Pure Data** (no color encoding, delta shown in neutral gray)

---

### 3.4 Section Layout Pattern

Each of the six sections follows this repeating layout:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  SECTION N: [Section Name]                              [Expand] [Export]    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────┐  ┌────────────────────────────────┐    │
│  │                                 │  │                                │    │
│  │   PRIMARY CHART / LEADERBOARD   │  │   INSIGHT CALLOUT CARD(S)      │    │
│  │   [Register: Leaderboard]       │  │   [Register: Business Insight] │    │
│  │                                 │  │                                │    │
│  └─────────────────────────────────┘  └────────────────────────────────┘    │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  DETAIL TABLE  [Register: Pure Data]                         [Export CSV]    │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │  Col 1 ↕  │  Col 2 ↕  │  Col 3 ↕  │  Col 4 ↕  │  Col 5 ↕         │    │
│  │  ────────────────────────────────────────────────────────────────   │    │
│  │  row data ...                                                        │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Section header: section name, expand/collapse toggle, section-level export
- Left column (60–65% width): primary chart or leaderboard
- Right column (35–40% width): insight callout cards stacked vertically
- Below the fold: collapsible pure data table with export

---

## 4. Section-by-Section Spec

---

### 4.1 Fleet Overview — "How Did the Fleet Perform?"

#### Purpose
Answers: **How much did the fleet do, and is that number up or down?**

This section establishes the baseline volume of activity. It is the first thing a manager reads in the morning to understand whether the day/week/month is on track.

#### Primary Register
**Pure Data** — these are facts. The goal is accuracy and quick comparison to prior period, not ranking or insight derivation.

---

#### Components

| Component | Register | Type |
|---|---|---|
| Total Routes Completed | Pure Data | Stat card |
| Total Stops Served | Pure Data | Stat card |
| Total Distance (miles) | Pure Data | Stat card |
| Total Route Hours | Pure Data | Stat card |
| Average Route Duration | Pure Data | Stat card |
| Average Stops Per Route | Pure Data | Stat card |

---

#### Data Sources & Fields

**Primary tables:** `itineraries`, `itinerary_stops`, `stops`

| Metric | Calculation | Fields |
|---|---|---|
| Total Routes Completed | `COUNT(itineraries.id)` WHERE `status = 'finished'` OR `completed_at IS NOT NULL` AND `completed_at` within date range | `itineraries.status`, `itineraries.completed_at` |
| Total Stops Served | `COUNT(stops.id)` WHERE `stops.deleted_at IS NULL` across completed itineraries | `stops.id`, `stops.deleted_at`, `itinerary_stops.itinerary_id` |
| Total Distance (miles) | `SUM(stops.distance_from_previous_stop)` across stops in completed itineraries | `stops.distance_from_previous_stop` |
| Total Route Hours | `SUM(actual_duration)` per route — see cascading logic in Section 8 | `itineraries.completed_at`, `itineraries.started_at`, `stops.departed_at`, `stops.arrived_at` |
| Average Route Duration | `AVG(actual_duration)` for routes where duration is computable | Same as above |
| Average Stops Per Route | `AVG(stop_count_per_itinerary)` | `itinerary_stops.itinerary_id` |

---

#### Business Insight Callout Copy

No insight callouts in this section. Fleet Overview is pure data only — context for the rest of the dashboard, not actionable in isolation.

Exception: if total routes completed is more than 20% below the prior period, surface a system-level flag:

> ⚠ Route volume is down 22% vs the prior period. Check subscription adherence in the Trends section.

---

#### Leaderboard Hooks

None applied in this section. Fleet Overview is aggregate-only.

---

#### Pure Data Table Spec

**Table: Route Summary by Date**

| Column | Sort | Notes |
|---|---|---|
| Date | Default descending | ISO date |
| Routes Completed | Sortable | Integer |
| Stops Served | Sortable | Integer |
| Distance (mi) | Sortable | Decimal, 1 place |
| Total Route Hours | Sortable | Decimal, 2 places |
| Avg Duration | Sortable | HH:MM format |
| Avg Stops/Route | Sortable | Decimal, 1 place |

Export: CSV and XLSX. Filename: `fleet-overview-[date-range].csv`

---

#### Visual Notes

- All six stat cards use identical visual treatment: white bg, large figure in Inter/system-ui tabular numeric, label above, delta below in neutral gray
- Delta direction arrows use neutral dark for up (not green) and neutral dark for down (not red) — this section is not judgmental, just factual
- Cards are responsive: 2-up on mobile, 3-up on tablet, 6-up on desktop

---

### 4.2 Driver Utilization — "Who's Carrying the Load?"

#### Purpose
Answers: **Which drivers are doing the most work, and is the distribution healthy?**

Uneven driver utilization is a dual problem: overloaded drivers face burnout and safety risk; underloaded drivers represent payroll waste. This section makes the distribution pattern impossible to miss.

#### Primary Register
**Leaderboard** — drivers ranked by composite utilization score, with Business Insight callout for distribution warnings.

---

#### Components

| Component | Register | Type |
|---|---|---|
| Driver Leaderboard | Leaderboard | Ranked table with sparklines |
| Route Hours per Driver | Leaderboard | Horizontal bar chart, sorted descending |
| Routes per Driver | Leaderboard | Horizontal bar chart, sorted descending |
| Avg Stops per Driver per Route | Pure Data | Stat card or column in table |
| Driver Route Frequency | Business Insight | Callout card |
| Insight: Distribution Warning | Business Insight | Callout card |

---

#### Driver Score Composition

The Driver Score (0–100) is the composite ranking input for the Driver Leaderboard.

| Input | Weight | Source Field |
|---|---|---|
| Routes Completed (volume) | 20% | `COUNT(itinerary_drivers.itinerary_id)` per driver |
| POD Task Completion Rate (compliance) | 30% | Required stop_tasks completed / assigned |
| On-Time Arrival Rate (efficiency) | 25% | stops where arrived_at <= estimated_arrival_at_stop |
| Average Dwell Time (throughput) | 10% | `AVG(stops.departed_at - stops.arrived_at)` — lower = better |
| Route Hours (utilization) | 15% | SUM of actual duration |

Each input is normalized to 0–100 relative to the fleet for that period, then weighted. The final score is displayed as a whole number.

---

#### Data Sources & Fields

**Primary tables:** `itinerary_drivers`, `freeform_drivers`, `itinerary_stops`, `stops`

| Metric | Calculation |
|---|---|
| Route Hours per Driver | `SUM(actual_duration)` grouped by `freeform_drivers.id` via `itinerary_drivers` |
| Routes per Driver | `COUNT(itineraries.id)` grouped by `freeform_drivers.id` |
| Avg Stops per Driver per Route | `AVG(stop_count)` per driver per itinerary |
| Driver Route Frequency | `COUNT(DISTINCT DATE(itinerary.completed_at))` / calendar days in date range |

---

#### Business Insight Callout Copy

**Distribution warning (triggers when top driver has >2x the routes of median driver):**
> ⚠ [Driver Name] has completed [N] routes — [X]x the fleet median of [M]. Uneven distribution increases burnout risk and may affect route quality.

**Underutilization warning (triggers when ≥2 drivers have <30% of fleet-average routes):**
> ⚠ [N] drivers have fewer than [X] routes this period — well below the fleet average of [Y]. Review scheduling or reduce active driver count.

**Most Improved callout:**
> ⬆ [Driver Name] is this period's Most Improved driver — up [N] spots in the ranking.

---

#### Leaderboard Hooks Applied

| Hook | Trigger | Display |
|---|---|---|
| 🔥 Streak | Driver above their personal performance median for N consecutive days | "🔥 [N] days" badge on driver row |
| ⬆ Most Improved | Largest positive rank delta vs prior period | Green badge on driver name |
| ↑↓ Rank Delta | Change in rank position vs prior equivalent period | Small indicator next to rank number |
| ⚠ Flag | Driver with largest negative movement gets named callout | Insight card beneath leaderboard |
| POD Tier Badge | Based on driver's POD completion rate (see Section 4.5) | Gold/Silver/Bronze/At Risk badge |
| Personal Best | Driver's metric exceeds their own prior-period record | Green star on metric value, hover tooltip |
| Fleet Record | Driver's metric is the all-time fleet best for that metric | Purple crown icon |

---

#### Pure Data Table Spec

**Table: Driver Detail**

| Column | Sort | Notes |
|---|---|---|
| Rank | Default ascending | Current period rank |
| Rank Delta | Sortable | ↑N / ↓N / = / NEW |
| Driver Name | Sortable | freeform_drivers.name |
| Routes Completed | Sortable | Integer |
| Total Route Hours | Sortable | Decimal, 2 places |
| Total Stops | Sortable | Integer |
| Avg Stops/Route | Sortable | Decimal, 1 place |
| POD Completion % | Sortable | Percentage, 1 decimal |
| On-Time Rate % | Sortable | Percentage, 1 decimal |
| Driver Score | Sortable | Integer 0–100 |
| Active Days | Sortable | Integer |
| Route Frequency | Sortable | Active days / calendar days, % |

Export: CSV and XLSX. Filename: `driver-utilization-[date-range].csv`

---

#### Visual Notes

- Horizontal bar chart: bars sorted descending by hours/routes, benchmark line at fleet average (dashed, labeled)
- Color encoding on bars: Red (>130% fleet avg), Green (80–130%), Yellow (<80%)
- Leaderboard table: rank column is fixed-width, left-aligned; Driver Score is displayed as a pill badge in zone color
- Sparkline column (7-day routes completed): small inline area chart, 60x24px, no axis labels
- On mobile: leaderboard table collapses to card list, sparklines hidden

---

### 4.3 Vehicle Utilization — "Are Our Assets Working?"

#### Purpose
Answers: **Are capital assets being used efficiently, or are we paying for vehicles that sit idle?**

This is the highest-stakes section from a cost perspective. Every vehicle represents depreciation, insurance, maintenance, and financing costs whether it moves or not. The spread between the most and least used vehicles is a direct capital allocation problem.

#### Primary Register
**Leaderboard** for the primary bar chart; **Business Insight** for the cost callout; **Pure Data** for the detail table.

---

#### Components

| Component | Register | Type |
|---|---|---|
| Routes per Vehicle (sorted bar) | Leaderboard | Horizontal bar chart |
| Miles per Vehicle (sorted bar) | Leaderboard | Horizontal bar chart |
| Vehicle Type Distribution | Business Insight | Donut chart |
| Capacity Utilization | Pure Data | Table column (conditional) |
| Cost Allocation Insight Card | Business Insight | Callout card |
| Bench Warmer Callout | Business Insight | Callout card |
| Vehicle Detail Table | Pure Data | Sortable table |

See **Section 5** for full deep dive on the primary bar chart.

---

#### Data Sources & Fields

**Primary tables:** `itinerary_vehicles`, `freeform_vehicles`, `vehicle_specs`, `itinerary_stops`, `stops`, `stop_tasks`, `payloads`, `payload_items`

| Metric | Calculation |
|---|---|
| Routes per Vehicle | `COUNT(itinerary_vehicles.itinerary_id)` grouped by `freeform_vehicles.id` |
| Miles per Vehicle | `SUM(stops.distance_from_previous_stop)` grouped by vehicle via itinerary chain |
| Vehicle Type Distribution | `COUNT(itineraries)` grouped by `freeform_vehicles.type` |
| Capacity Utilization | `SUM(payload_items.quantity * payload_items.weight)` / `vehicle_specs.max_payload_weight` — conditional on data availability |

---

#### Business Insight Callout Copy

**Bench Warmer (triggers when a vehicle is below 50% of fleet-average routes):**
> ⚠ [Vehicle Name/ID] has completed only [N] routes — [X]% of the fleet average of [Y]. This vehicle is generating carrying costs without proportional utilization.

**Overworked Vehicle (triggers when a vehicle exceeds 130% of fleet-average routes):**
> 🔴 [Vehicle Name/ID] is running [N]% above fleet average. Accelerated wear may increase maintenance costs. Consider redistributing load.

**Type Distribution insight (triggers when one type dominates >70%):**
> ℹ [Vehicle type] accounts for [X]% of all routes. Verify this aligns with your route mix and payload requirements.

---

#### Leaderboard Hooks Applied

| Hook | Trigger | Display |
|---|---|---|
| Bench Warmer | Vehicle <50% of fleet-average routes | Named callout card + red bar |
| ↑↓ Rank Delta | Change in vehicle rank vs prior period | Indicator on vehicle row |
| Fleet Record | Highest single-period mileage ever recorded for a vehicle | Purple crown on miles column |
| Color Zone Encoding | Position relative to fleet average | Red / Green / Yellow bars |

---

#### Pure Data Table Spec

**Table: Vehicle Detail**

| Column | Sort | Notes |
|---|---|---|
| Vehicle Name / ID | Sortable | freeform_vehicles.name or identifier |
| Vehicle Type | Sortable | freeform_vehicles.type |
| Routes Completed | Default descending | Integer |
| Total Miles | Sortable | Decimal, 1 place |
| Total Route Hours | Sortable | Decimal, 2 places |
| Avg Miles/Route | Sortable | Decimal, 1 place |
| Capacity Utilization % | Sortable | Conditional — shown only if data available |
| Utilization Zone | Sortable | Overworked / Optimal / Underutilized |

Export: CSV. Filename: `vehicle-utilization-[date-range].csv`

---

#### Visual Notes

- Two tab toggle above charts: "Routes" / "Miles" — switches the primary bar chart metric
- Donut chart uses vehicle type as segments; tooltip shows route count and percentage on hover
- Bar chart and donut chart sit side by side; insight cards stack vertically in right column
- Capacity Utilization column is hidden with a visible "Data unavailable" state if vehicle_specs or payload_items tables are not populated for the filtered vehicles

---

### 4.4 Route Efficiency — "Are Our Routes Actually Efficient?"

#### Purpose
Answers: **Are routes completing on time and on plan, and where are the recurring delays?**

Planned vs. actual variance reveals whether the routing software's estimates are calibrated to real-world conditions or are systematically optimistic/pessimistic. On-time arrival and dwell time data pinpoint where time is being lost.

#### Primary Register
**Business Insight** (variance patterns require interpretation) with **Leaderboard** for per-route comparison and **Pure Data** for the detail table.

---

#### Components

| Component | Register | Type |
|---|---|---|
| Planned vs Actual Duration (grouped bar) | Business Insight | Grouped bar chart |
| On-Time Arrival Rate | Leaderboard | Gauge + ranked list by driver |
| Average Dwell Time per Stop | Business Insight | Distribution histogram or box plot |
| Duration Variance Insight Card | Business Insight | Callout card |
| On-Time Rate Trend | Business Insight | Small area sparkline |
| Route Efficiency Detail Table | Pure Data | Sortable table |

---

#### Data Sources & Fields

**Primary tables:** `itineraries`, `itinerary_stops`, `stops`

| Metric | Calculation |
|---|---|
| Planned Duration | `itineraries.total_estimated_time` |
| Actual Duration | Cascading end-time logic (see Section 8) |
| Duration Variance | `(actual - planned) / planned * 100` — positive = over plan |
| On-Time Arrival Rate | `COUNT(stops WHERE arrived_at <= estimated_arrival_at_stop)` / `COUNT(total stops)` * 100 |
| Average Dwell Time | `AVG(stops.departed_at - stops.arrived_at)` in minutes |

---

#### Business Insight Callout Copy

**Systematic overrun (triggers when median route runs >110% of planned):**
> ⚠ Routes are running [X]% over planned duration on average. Routing estimates may be systematically optimistic — consider recalibrating time buffers.

**Systematic underrun (triggers when median route runs <90% of planned):**
> ℹ Routes are completing [X]% under planned duration. Either estimates are conservative, or stops are being skipped. Cross-check stop completion rate.

**On-time rate warning:**
> ⚠ On-time arrival rate is [X]%. [N] stops per route arrive late on average. Late arrivals correlate with high dwell times at earlier stops in the sequence.

**Dwell time outlier:**
> ℹ Average dwell time is [X] minutes, but [N]% of stops exceed [Y] minutes. Long dwell outliers may indicate POD task delays — check POD Compliance.

---

#### Leaderboard Hooks Applied

| Hook | Trigger | Display |
|---|---|---|
| On-Time Rate Ranking | Per-driver on-time rate sorted descending | Ranked list, color-encoded |
| Perfect Route callout | Route where 100% of stops arrived on time | Star badge on route in detail table |
| Fleet Record | Highest on-time rate ever recorded for a driver | Purple crown |

---

#### Pure Data Table Spec

**Table: Route Efficiency Detail**

| Column | Sort | Notes |
|---|---|---|
| Date | Default descending | ISO date |
| Route ID / Name | Sortable | itineraries.name or id |
| Driver | Sortable | freeform_drivers.name |
| Vehicle | Sortable | freeform_vehicles.name |
| Planned Duration | Sortable | HH:MM |
| Actual Duration | Sortable | HH:MM |
| Variance | Sortable | +/-% |
| Total Stops | Sortable | Integer |
| On-Time Stops | Sortable | Integer |
| On-Time Rate | Sortable | Percentage |
| Avg Dwell Time | Sortable | Minutes, 1 decimal |
| Perfect Route | Sortable | Yes / No |

Export: CSV. Filename: `route-efficiency-[date-range].csv`

---

#### Visual Notes

- Grouped bar chart: one group per route (or per day/week if aggregated), two bars per group (planned = blue, actual = teal/green), bars stacked or side-by-side (side-by-side preferred for readability)
- X-axis: date or route name; Y-axis: hours; benchmark line at planned average
- On-Time Rate is displayed as a large gauge (arc style, 0–100%) in the upper right of the section
- Dwell time histogram: x-axis in 5-minute buckets, y-axis count of stops; color highlight for stops >20 minutes (configurable threshold)

---

### 4.5 POD Compliance — "Do We Have Proof It Happened?"

#### Purpose
Answers: **Can we prove delivery occurred, and where are the gaps in our documentation?**

Failed required POD tasks represent liability exposure, customer disputes, and — for billing-on-delivery models — direct revenue risk. This section surfaces both the rate and the reason for failures.

#### Primary Register
**Leaderboard** (POD tier badges, task completion ranking) and **Business Insight** (liability callout) with **Pure Data** for audit-ready tables.

---

#### Components

| Component | Register | Type |
|---|---|---|
| Overall POD Completion Rate | Leaderboard | Large gauge with tier badge |
| Completion Rate by Task Type | Leaderboard | Horizontal bar chart |
| Photo Capture Rate | Pure Data | Stat card |
| Signature Capture Rate | Pure Data | Stat card |
| Recipient Name Capture Rate | Pure Data | Stat card |
| Task Failure Rate by Reason | Business Insight | Bar chart with reasons |
| Liability Exposure Callout | Business Insight | Callout card |
| Average POD Tasks per Stop | Pure Data | Stat card |
| POD Detail Table | Pure Data | Sortable table |

---

#### POD Tier System

| Tier | Range | Badge Color | Badge Label |
|---|---|---|---|
| Gold | 95–100% | #F59E0B (Amber/Gold) | GOLD |
| Silver | 85–94% | #9CA3AF (Gray) | SILVER |
| Bronze | 70–84% | #92400E (Brown) | BRONZE |
| At Risk | <70% | #EF4444 (Red) | AT RISK |

Tier is applied both at fleet level (overall POD completion) and at driver level (driver's POD completion rate).

---

#### Data Sources & Fields

**Primary tables:** `stop_tasks`, `stop_task_inputs`, `stop_task_failure_reasons`, `stop_task_images`

| Metric | Calculation |
|---|---|
| Overall POD Completion Rate | `COUNT(stop_tasks WHERE is_required = true AND completed_at IS NOT NULL)` / `COUNT(stop_tasks WHERE is_required = true)` * 100 |
| Completion Rate by Task Type | Same calculation, grouped by `stop_tasks.type` (PHOTO, SIGNATURE, NAME, PICKUP, DROPOFF) |
| Photo Capture Rate | Completion rate for tasks of type = PHOTO |
| Signature Capture Rate | Completion rate for tasks of type = SIGNATURE |
| Recipient Name Capture Rate | `COUNT(stop_task_inputs WHERE response IS NOT NULL)` / total required name tasks |
| Task Failure Rate by Reason | `COUNT(stop_task_failure_reasons.id)` grouped by `stop_task_failure_reasons.display_name` |
| Average POD Tasks per Stop | `AVG(task_count_per_stop)` |

---

#### Business Insight Callout Copy

**At Risk tier callout:**
> 🔴 POD completion is at [X]% — At Risk. [N] required tasks were incomplete this period. Incomplete required tasks create liability exposure and may invalidate delivery proof for billing.

**High failure reason callout (triggers when one reason accounts for >30% of failures):**
> ⚠ "[Failure Reason]" accounts for [X]% of all task failures. Investigate whether this is a training gap, a UX issue, or a connectivity problem at specific stop locations.

**Signature-specific callout:**
> ℹ Signature capture rate is [X]%. Missing signatures on required stops may not satisfy customer contracts or insurance requirements.

---

#### Leaderboard Hooks Applied

| Hook | Trigger | Display |
|---|---|---|
| POD Tier Badge | Per-driver POD rate mapped to tier | Gold/Silver/Bronze/At Risk badge on driver row |
| Perfect Route (POD) | Route where all required tasks completed | Star in route detail table |
| Rank Delta | Driver's POD rank vs prior period | ↑↓ indicator |
| Fleet Record | Best-ever fleet POD rate | Purple crown on gauge |
| ⚠ Flag | Driver with largest POD rate decline | Named callout beneath leaderboard |

---

#### Pure Data Table Spec

**Table: POD Detail by Stop**

| Column | Sort | Notes |
|---|---|---|
| Date | Default descending | ISO date |
| Route ID | Sortable | |
| Stop ID / Address | Sortable | |
| Driver | Sortable | |
| Required Tasks | — | Integer |
| Completed Tasks | Sortable | Integer |
| POD Completion % | Sortable | Percentage |
| Missing Task Types | — | Comma-separated list (PHOTO, SIGNATURE, etc.) |
| Failure Reasons | — | From stop_task_failure_reasons.display_name |
| Has Photo | — | Yes / No |
| Has Signature | — | Yes / No |
| Has Recipient Name | — | Yes / No |

Export: CSV. Filename: `pod-compliance-[date-range].csv`
Note: This table is the primary audit export. It must be available even when the section is collapsed.

---

#### Visual Notes

- Fleet-level POD gauge is the hero of this section — large arc gauge with tier badge overlaid
- Horizontal bar chart (completion by task type): bars sorted descending, color-encoded by tier threshold (green ≥95%, amber 70–94%, red <70%)
- Failure reason bar chart: sorted descending by count, no color encoding (pure data register), x-axis is count of failures, y-axis is reason labels (full display_name text)
- Three stat cards (Photo, Signature, Name) shown in a mini row beneath the horizontal bar chart

---

### 4.6 Trends Over Time — "What's the Shape of the Business?"

#### Purpose
Answers: **Is the business growing, contracting, or erratic — and are subscriptions being fulfilled?**

Time-series views reveal seasonality, growth trajectories, and adherence to scheduled delivery commitments. Subscription adherence is contractual — gaps here directly affect client relationships and potentially revenue recognition.

#### Primary Register
**Business Insight** for trend interpretation; **Pure Data** for the underlying time series data.

---

#### Components

| Component | Register | Type |
|---|---|---|
| Routes Over Time | Business Insight | Area chart, granularity toggle |
| Peak Days Analysis | Business Insight | Weekday bar chart |
| Subscription Adherence | Business Insight | Bar chart (expected vs actual) |
| Consecutive Streak Records | Leaderboard | Callout card |
| Trends Detail Table | Pure Data | Sortable table |

---

#### Data Sources & Fields

**Primary tables:** `itineraries`, `itinerary_subscriptions`

| Metric | Calculation |
|---|---|
| Routes Over Time | `COUNT(itineraries.id)` grouped by day/week/month (user-selectable granularity) |
| Peak Days Analysis | `AVG(routes_per_day)` grouped by `DAYOFWEEK(itineraries.completed_at)` |
| Subscription Adherence | `itinerary_subscriptions.frequency` (expected) vs `COUNT(itineraries per subscription per period)` (actual) |

---

#### Business Insight Callout Copy

**Subscription gap (triggers when any subscription has <80% adherence):**
> ⚠ Subscription "[Sub Name]" has delivered [N] of [M] scheduled routes this period — [X]% adherence. Clients may be entitled to remedies under service agreements.

**Peak day insight:**
> ℹ [Day of week] is your busiest day, averaging [N] routes. [Other day] is lightest at [M]. Consider shifting maintenance windows or scheduling flexibility around this pattern.

**Growth trend:**
> ⬆ Route volume has grown [X]% over the last [N] weeks. At current trajectory, monthly volume will exceed [Y] routes by [date].

**Decline trend:**
> ⬇ Route volume has declined [X]% over the last [N] weeks. Investigate subscription cancellations or seasonal factors.

---

#### Leaderboard Hooks Applied

| Hook | Trigger | Display |
|---|---|---|
| Consecutive Streak (fleet) | N consecutive days/weeks above prior-period average | Callout card at top of section |
| Perfect Route streak | N consecutive routes with all required tasks on time | Named in Perfect Route callout |
| Fleet Record | Highest single-day or single-week route count ever | Purple crown in chart |

---

#### Granularity Toggle

| Option | Bucket | Use case |
|---|---|---|
| Daily | 1-day buckets | Short date ranges (≤30 days) |
| Weekly | Mon–Sun buckets | Medium ranges (31–90 days) |
| Monthly | Calendar month | Long ranges (>90 days) |

System auto-selects granularity based on date range, but user can override.

---

#### Pure Data Table Spec

**Table: Routes Over Time**

| Column | Sort | Notes |
|---|---|---|
| Period | Default ascending | Day, Week, or Month label |
| Routes Completed | Sortable | Integer |
| Stops Served | Sortable | Integer |
| Total Distance (mi) | Sortable | Decimal, 1 place |
| Route Hours | Sortable | Decimal, 2 places |
| Subscriptions Active | — | Integer |
| Subscriptions On Track | — | Integer |
| Adherence Rate | Sortable | Percentage |

Export: CSV. Filename: `trends-[date-range]-[granularity].csv`

---

#### Visual Notes

- Area chart: smooth curve, light fill beneath line, no hard grid lines (soft dotted), x-axis tick marks at granularity intervals
- Weekday bar chart: 7 bars (Mon–Sun), colored by relative volume (darkest = highest avg), neutral palette not zone-color (this is informational, not evaluative)
- Subscription adherence: grouped bars per subscription, planned = outlined/hollow bar, actual = filled bar; color fill by adherence (green ≥80%, red <80%)
- Fleet streak callout renders at top of section when streak ≥5 days: "🔥 [N]-day streak — fleet above prior-period average for [N] consecutive days"

---

## 5. Vehicle Utilization Deep Dive

### The Capital Asset Story

Vehicle utilization is the highest-leverage chart in the dashboard because every bar represents a depreciating asset with compounding carrying costs:

- Depreciation (straight-line or accelerated)
- Insurance premium (typically per-vehicle per year)
- Maintenance reserves
- Financing costs (lease or loan)

The spread between the most-used and least-used vehicle in the fleet is not an operational curiosity — it is a **capital allocation problem** with a calculable dollar value.

### The Four-Layer Bar Chart

The vehicle utilization bar chart is built in four explicit layers:

---

**Layer 1: Sorted Descending (Leaderboard)**

Bars are always sorted from most-used to least-used. This is a deliberate choice: the eye naturally reads left-to-right, and the leaderboard sort makes the ranking legible instantly. Never sort alphabetically by vehicle name in this chart.

```
Routes per Vehicle (sorted descending)
│
│  Van 03   ████████████████████████  47
│  Truck 01 ███████████████████       38
│  Van 01   ██████████████            31
│  Truck 02 ████████                  18
│  Van 02   █████                     12
│  Van 04   ██                         5
│
└──────────────────────────────────────
           Fleet avg: 25.2 routes
```

---

**Layer 2: Benchmark Line**

A horizontal dashed line at the fleet average cuts across all bars. The line is labeled with the average value. This is the visual anchor that makes the color zones legible.

- Line style: dashed, 1px, neutral gray (#6B7280)
- Label: "Fleet avg: [N]" positioned at the right end of the line, above the dashes
- The benchmark applies to both the Routes and Miles views

---

**Layer 3: Color Zone Encoding**

Each bar is colored based on its position relative to the fleet average benchmark line:

| Zone | Threshold | Color | Hex | Label |
|---|---|---|---|---|
| Overworked | > 130% of fleet average | Red | #EF4444 | Overworked |
| Optimal | 80–130% of fleet average | Green | #22C55E | Optimal |
| Underutilized | < 80% of fleet average | Amber/Yellow | #F59E0B | Underutilized |

Color is applied to the full bar fill. No partial color. The bar's zone membership is re-evaluated every time the date range or filter changes.

A small color legend renders beneath the chart:
```
● Overworked (>130% avg)   ● Optimal (80–130%)   ● Underutilized (<80%)
```

---

**Layer 4: Auto-Generated Business Callout Card**

Renders immediately beneath the chart. Generated fresh on every filter change. Not manually written — it is a template interpolated with live data.

**Template:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ⚠ VEHICLE UTILIZATION INSIGHT                                              │
│                                                                             │
│  [Vehicle A] is running [X]% above fleet average ([N] routes vs avg [M]).  │
│  [Vehicle B] and [Vehicle C] are significantly underutilized at [P]% and   │
│  [Q]% of fleet average. These [2] vehicles are generating carrying costs   │
│  without proportional output. Consider load balancing or reviewing fleet   │
│  composition if this pattern persists.                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Callout card triggers:**
- Renders whenever any vehicle is in the Overworked or Underutilized zone
- Does not render if all vehicles are in the Optimal zone (replaces with: ✅ All vehicles are within the optimal utilization range.)
- Lists up to 3 vehicles by name; if more are out of zone, appends "+ [N] more"

---

### Dual Metric Toggle

The chart supports two modes, toggled with a pill selector above the chart:

| Mode | Y-Axis | Business Question |
|---|---|---|
| Routes | Routes completed per vehicle | How evenly is work distributed? |
| Miles | Total miles driven per vehicle | Which vehicles are doing the most physical work? |

Switching modes re-renders the bars and re-evaluates zone thresholds against the new metric's fleet average. The insight callout card also updates.

---

### Capacity Utilization Layer (Conditional)

When `vehicle_specs` and `payload_items` data is populated for the vehicles in the filtered set, a third chart option appears: **Capacity Utilization**.

| Mode | Calculation | Display |
|---|---|---|
| Capacity | `SUM(payload_items.quantity * payload_items.weight)` / `vehicle_specs.max_payload_weight` per route, averaged per vehicle | Percentage bar chart |

When this data is not available:
- The "Capacity" toggle option is grayed out
- A tooltip reads: "Capacity data requires vehicle_specs and payload_items records for all vehicles in the selected range."

---

## 6. Color & Visual Language

### 6.1 Zone Color System

Used wherever a metric is compared to a threshold (fleet average, target, benchmark). Applied consistently across Driver Utilization, Vehicle Utilization, and POD Compliance.

| Zone | Meaning | Color Name | Hex | Usage |
|---|---|---|---|---|
| Overworked / At Risk | Exceeds safe/target range on high end | Red | #EF4444 | Vehicle bar, driver load warning |
| Optimal / Good | Within target range | Green | #22C55E | Vehicle bar, on-time indicator |
| Underutilized / Caution | Below target, inefficient | Amber | #F59E0B | Vehicle bar, low-activity driver |
| Info / Neutral trend | No judgment, just context | Blue | #3B82F6 | Trend lines, Fleet Score "Good" zone |
| At Risk (POD) | Below acceptable compliance | Red | #EF4444 | POD tier badge |

### 6.2 Hi-Vis Accent Scale

Used in leaderboard contexts where rank position must be immediately perceptible. Applied to the top and bottom performers only — not to all rows.

| Position | Treatment | Color |
|---|---|---|
| Rank 1 (top) | Full saturation fill + bold text | #22C55E (Green) |
| Rank 2–3 | Reduced opacity fill | #86EFAC (Light green) |
| Mid-rank | No color accent | White bg, standard text |
| Bottom-2 | Reduced opacity fill | #FCA5A5 (Light red) |
| Bottom-1 (worst) | Full saturation fill + bold text | #EF4444 (Red) |

### 6.3 Fleet Score Zone Colors

| Zone | Range | Color | Hex |
|---|---|---|---|
| Excellent | 85–100 | Green | #22C55E |
| Good | 70–84 | Blue | #3B82F6 |
| Needs Attention | 50–69 | Amber | #F59E0B |
| At Risk | 0–49 | Red | #EF4444 |

### 6.4 Register Visual Grammar (Summary)

| Register | Background | Typography | Color | Export | Interactivity |
|---|---|---|---|---|---|
| Pure Data | White (#FFFFFF) | Monospace figures, standard weight | None — no accent color | Always present | Sort columns only |
| Business Insight | Tinted card (light zone color or #F1F5F9) | Regular weight, sentence case | Icon in zone color, tinted card | None | None (static) |
| Leaderboard | White or zone-fill per row | Bold figures, prominent rank | Full zone color encoding | Optional | Sort, hover tooltip, expand row |

### 6.5 Typography

| Element | Font | Size | Weight |
|---|---|---|---|
| Fleet Score number | Inter (tabular numerals) | 48px | 700 |
| Stat card figure | Inter (tabular numerals) | 32px | 600 |
| Section header | Inter | 18px | 600 |
| Chart axis labels | Inter | 12px | 400 |
| Insight callout body | Inter | 14px | 400 |
| Table figures | Inter (tabular numerals) | 14px | 400 |
| Table column headers | Inter | 12px | 600, uppercase |

### 6.6 Spacing & Layout

- Section padding: 24px
- Card gap: 16px
- Chart minimum height: 240px (primary), 160px (secondary/sparkline)
- Insight callout card padding: 16px
- Table row height: 40px (standard), 32px (compact mode)

---

## 7. Component Glossary

### Stat Card

A single-metric summary display.

**Structure:**
```
┌──────────────────┐
│  Label           │
│  [Large Figure]  │
│  ↑ X% vs prior   │
└──────────────────┘
```

**Spec:**
- Width: 1/6 of grid (desktop), 1/3 (tablet), 1/2 (mobile)
- Background: white
- Label: 12px, uppercase, gray (#6B7280)
- Figure: 32px, tabular numerals, dark (#111827)
- Delta: 12px, directional arrow + percentage, neutral gray (no red/green in pure data sections)
- Border: 1px solid #E5E7EB, border-radius 8px

---

### Leaderboard Row

A ranked entity row in a leaderboard table.

**Structure:**
```
┌───┬──────────────────┬──────────────────────────────────────┬───────────┐
│ # │ Driver Name      │ ██████████████████░░░░░ Score: 84    │ 🔥 7 days │
│↑2 │ [Tier badge]     │ Routes: 32  POD: 93%  OT: 88%        │           │
└───┴──────────────────┴──────────────────────────────────────┴───────────┘
```

**Spec:**
- Rank number: 24px, bold, fixed-width left column
- Rank delta: 12px, ↑N green / ↓N red / = neutral / NEW blue
- Name: 14px, medium weight
- Tier badge: pill shape, 12px, tier-appropriate background color
- Score bar: inline progress bar, zone-colored fill
- Secondary metrics: 12px, gray, inline row
- Streak indicator: right-aligned, emoji + count
- Background: zone-color fill at 10% opacity for top/bottom performers; white for mid-rank

---

### Insight Callout Card

A contextualized interpretation of a pattern.

**Structure:**
```
┌─────────────────────────────────────────────┐
│  [Icon]  INSIGHT LABEL                       │
│                                              │
│  Dynamic sentence 1. Dynamic sentence 2.    │
└─────────────────────────────────────────────┘
```

**Spec:**
- Width: fills right column (~35% of section width)
- Background: tinted (10% opacity of relevant zone color, or #F1F5F9 neutral)
- Border-left: 3px solid zone color
- Icon: 16px, zone color, Heroicons outline style
- Label: 11px, uppercase, zone color, bold
- Body: 14px, regular weight, #374151
- Max 2 sentences. No links, no CTAs, no additional controls.
- Multiple callout cards stack vertically with 12px gap

---

### Benchmark Line

A reference line drawn across a bar or area chart at the fleet average.

**Spec:**
- Style: dashed (4px dash, 4px gap)
- Stroke width: 1.5px
- Color: #6B7280 (neutral gray)
- Label: positioned at right end of line, above dash, 11px, same gray
- Label text: "Fleet avg: [value]"
- Tooltip on hover: "Fleet average for this metric in the selected date range: [value]"

---

### Tier Badge

A POD compliance tier indicator rendered as a pill badge.

**Spec:**

| Tier | Background | Text Color | Text |
|---|---|---|---|
| Gold | #FEF3C7 | #92400E | GOLD |
| Silver | #F3F4F6 | #374151 | SILVER |
| Bronze | #FEF9C3 | #92400E | BRONZE |
| At Risk | #FEE2E2 | #991B1B | AT RISK |

- Size: 20px height, auto-width, 6px padding horizontal
- Font: 11px, 700 weight, letter-spacing 0.05em
- Border-radius: 4px (rectangular pill, not round)
- Used in: Driver Leaderboard rows, POD section header, POD detail table

---

### Streak Indicator

A consecutive-days-above-threshold counter.

**Spec:**
- Format: 🔥 [N] days
- Font: 13px, medium weight
- Color: #F59E0B (amber — fire-adjacent, not zone-encoding)
- Renders on Driver Leaderboard rows when N ≥ 3
- Tooltip on hover: "Active above personal performance median for [N] consecutive days"
- Resets to 0 on first day below threshold; does not resume counting from prior streak total

---

### Rank Delta Indicator

Shows movement in rank position vs prior equivalent period.

**Spec:**
- Up: ↑N in #22C55E (green), bold
- Down: ↓N in #EF4444 (red), bold
- Unchanged: = in #9CA3AF (gray), regular weight
- New entry: NEW in #3B82F6 (blue), bold
- Position: immediately left of rank number, or in a dedicated delta column
- Tooltip: "Moved [up/down] [N] position(s) vs [prior period label]"

---

### Fleet Record Flag

Marks an all-time fleet best for a metric.

**Spec:**
- Icon: crown symbol (👑 or SVG crown icon), 14px
- Color: #7C3AED (purple — distinct from all zone colors)
- Position: immediately right of the metric value it annotates
- Tooltip: "Fleet record — best [metric name] ever recorded as of [date]"
- Persists across date range changes (it is an absolute record, not relative to the current filter)

---

### Perfect Route Flag

Marks a route where 100% of required POD tasks were completed on time.

**Spec:**
- Icon: star (★), 14px, #F59E0B (gold)
- Position: Route name or ID column in route detail table
- Tooltip: "Perfect Route — all required tasks completed, all stops on time"
- Available in: Route Efficiency detail table, POD detail table, Trends section

---

## 8. Data Notes & Caveats

### 8.1 Nullable Fields & Graceful Degradation

The following fields are frequently null and require explicit handling:

| Field | When Null | Display Behavior |
|---|---|---|
| `stops.distance_from_previous_stop` | First stop in a route (no prior stop), or data not recorded | Exclude from SUM; show "— " in table cell; note in chart footnote |
| `stops.arrived_at` | Stop not yet visited, or driver did not check in | Exclude from on-time calculation; do not count as on-time or late — count as "no data" |
| `stops.departed_at` | Driver did not check out of stop | Dwell time not computable; exclude from AVG dwell |
| `stops.estimated_arrival_at_stop` | Route not estimated, or estimation unavailable | On-time rate cannot be computed for this stop; shown as "N/A" in table |
| `itineraries.total_estimated_time` | Route not planned through routing engine | Planned vs Actual chart excludes this route; note in chart annotation |
| `vehicle_specs.*` | Vehicle not linked to a spec record | Capacity Utilization metric unavailable; toggle grayed out |
| `payload_items.*` | Stop has no payload data | Capacity Utilization metric unavailable |

---

### 8.2 Cascading Duration Logic

Actual route duration is not a single stored field. It is computed via the following cascading logic, in order of preference:

```
IF itinerary.completed_at IS NOT NULL AND itinerary.started_at IS NOT NULL:
  actual_duration = itinerary.completed_at - itinerary.started_at

ELSE IF MAX(stops.departed_at) IS NOT NULL AND MIN(stops.arrived_at) IS NOT NULL:
  actual_duration = MAX(stops.departed_at) - MIN(stops.arrived_at)

ELSE IF MAX(stops.arrived_at) IS NOT NULL AND MIN(stops.arrived_at) IS NOT NULL:
  actual_duration = MAX(stops.arrived_at) - MIN(stops.arrived_at)
  [NOTE: This underestimates duration by excluding time at final stop]

ELSE:
  actual_duration = NULL
  [Route excluded from duration-dependent metrics]
```

**Display:** Routes with `actual_duration = NULL` are excluded from Average Route Duration, Total Route Hours, and Planned vs Actual Duration chart. The count of excluded routes is surfaced as a footnote beneath affected charts: "N routes excluded from duration metrics (insufficient timestamp data)."

---

### 8.3 Planned-Only Mileage Caveat

There is currently no odometer or GPS-tracked actual mileage field. The `stops.distance_from_previous_stop` field represents **planned/estimated** stop-to-stop distance, not driven distance.

**Implications:**
- "Total Distance" in Fleet Overview stat cards is planned distance, not verified odometer mileage
- "Miles per Vehicle" in Vehicle Utilization is planned distance, not actual vehicle mileage
- Planned vs Actual Mileage chart is **not feasible** without odometer integration and should not be displayed
- All distance metrics must carry a footnote: "Distance figures are estimated based on routing data, not odometer readings."

---

### 8.4 Capacity Utilization Dependency

Capacity Utilization in Vehicle Utilization requires all of the following conditions to be met:

1. `freeform_vehicles.id` is linked to a `vehicle_specs` record
2. `vehicle_specs.max_payload_weight` IS NOT NULL
3. The stops in the itinerary have associated `stop_tasks` linked to `payloads`
4. `payload_items.quantity` and `payload_items.weight` are both populated

If any condition fails for any vehicle in the filtered set, the Capacity Utilization toggle is grayed out for the entire chart (not per-vehicle). Partial capacity data is more misleading than no data.

---

### 8.5 Driver Attribution

Driver-to-route attribution uses the `itinerary_drivers` join table, which links to `freeform_drivers`. Caveats:

- A single itinerary may have multiple drivers assigned (team driving). When this occurs, all route-level metrics (hours, miles, routes) are attributed to each driver in full — not split. This may cause Total Route Hours across all drivers to exceed fleet Total Route Hours.
- The driver displayed on leaderboard rows uses `freeform_drivers.name`. If `name` is null, fall back to `freeform_drivers.id` (display as "Driver [short ID]").
- Route Frequency calculation uses `DISTINCT DATE(itinerary.completed_at)` to count active days — not distinct itinerary count.

---

### 8.6 Subscription Adherence Calculation

`itinerary_subscriptions.frequency` represents the intended delivery cadence (e.g., daily, weekly, 3x/week). The actual itinerary count per subscription per period is derived from linking itineraries back to their originating subscription.

- If a subscription has no `frequency` value set, it is excluded from adherence calculation and noted as "frequency not configured."
- Adherence rate = `(actual itineraries in period) / (expected itineraries based on frequency × days in period)` capped at 100% (over-delivery is not penalized in the rate).
- Over-delivery (actual > expected) is noted separately in the insight callout as informational, not flagged as a problem.

---

*End of Specification*

---

**Document maintained by:** Product / Design
**Engineering contact:** Reference data notes in Section 8 for all backend query implementation
**Design contact:** Reference Sections 6 and 7 for all component-level visual implementation
