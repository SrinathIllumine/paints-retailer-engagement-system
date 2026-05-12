## Goal
Restructure the ASM Dashboard New page (`/asm-dashboard-new`) into a 4-section 2x2 grid that matches the new spec, replacing the existing Engagement Reports / Heatmap / Insights cards with the new content, charts, and modal popups.

## Changes to `src/pages/AsmDashboardNew.tsx`

### Header & sub-header
- Keep "ASM Reports" title with back arrow.
- Replace the avatar/profile block with a single sub-header line: `Ravi Kumar, ASM, Pune | Team of 6 MEs | 6 markets`.

### Section 1 — "What is the quality of retailer engagement by MEs in Pune?"
- Vertical bar chart (recharts `BarChart`) with months: Feb 80%, Mar 85%, Apr 70%.
- Soft blue bars, Y-axis label "Engagement Quality".
- Dotted horizontal `ReferenceLine` at 80% labeled "Company Benchmark" on the right.
- Arrow annotation from Mar bar pointing toward Apr decline (use a small absolute-positioned SVG/lucide arrow overlay or a recharts `ReferenceDot`/custom label).
- Red clickable text "Click to view" → opens modal.

### Section 1 popup — "Detailed list of MEs & Engagement Quality"
- Table with columns: ME, Area, No. of retailers covered, Overall Engagement Quality, Avg. Time Spent, Preparation levels, Discussion Points Covered.
- 5 rows (Aditya, Shivam, Dheeraj, Raj, Sagar) with exact values from spec.
- Cells in cols 4–7 use semantic color pills: green (HIGH / 9+), orange (MODERATE / 6–7), red (LOW).

### Section 2 — "Collated insights from across markets in Pune"
- Render 3 categorized snippets (Competition, Packaging, Scheme) with bold headline + indented sub-bullets exactly as listed in spec.
- Red CTA: "See All 10 Insights" → opens modal.

### Section 2 popup — "Insights from the Market"
- 5 numbered sections: Competition Related, Product Quality, Schemes Related, Contractor Related, Demand Related.
- Each insight: bold title + supporting paragraph beneath. Demand Related shows "No change – already reflected."

### Section 3 — "Top Retailer Objections (in the area)"
- Pie chart with categories: Competition Related 45%, Product quality 30%, Scheme related 9%, SKU Space related 7%, Working Capital related 3%.
- Use callout labels around the slices showing both name and % (no separate legend list).
- Red CTA "See top 5 objections in the area" → opens modal.

### Section 3 popup — "Top 5 objections in Pune"
- 3 bold category headers (Competition-Related, Product-Quality Related, Scheme-Related).
- Under each, italic-quote objection lines followed by subdued explanation text.

### Section 4 — "ME Leaderboard w.r.t Sales & Engagement Levels"
- Static table with columns: #, ME, Area, Engagement Quality, Sales Growth, Status.
- 5 rows from spec.
- Engagement Quality / Sales Growth use HIGH/MODERATE/LOW pills (green/orange/red).
- Status column tinted by severity: Top Performer (green), Can Improve (orange), Needs significant Improvement (red-ish), Needs immediate attention (strong red).
- No popup for this section.

## Shared helpers
- Add a small `Pill` helper for HIGH/MODERATE/LOW + numeric scores (parses "9/10", "HIGH", etc. → green/orange/red token).
- Use existing shadcn `Dialog` for all popups (background dim + scrollable content already built-in).
- Use semantic Tailwind tokens (`text-success`, `text-warning`, `text-destructive`, plus matching `/15` backgrounds) — no raw hex in components.

## Cleanup
- Remove unused `reports`, `heatmap`, `heatColor`, `allInsights`, `InsightCard`, `ReportsTable`, and related imports (`Avatar`, `Link`, `ReportRow` type) that the new layout no longer uses.
- Keep responsive 2x2 grid (`grid-cols-1 md:grid-cols-2`), allow each card to scroll internally, ensure pie chart labels don't overlap (use `outerRadius` ~70% with `label` callouts and adequate card padding).

## Out of scope
- No business-logic changes; all data static/mock.
- No changes to other routes or shared components.