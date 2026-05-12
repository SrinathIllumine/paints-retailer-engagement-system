## Make ASM Reports the main ASM Dashboard (New) screen

Replace the current contents of the ASM Dashboard (New) home screen with the ASM Reports screen we just built. The old dashboard sections (KPI cards, Engagement Unit Coverage, Objections + donut, Market Insights, Engagement Quality, Daily Engagement Reports) are removed from the route.

### Changes

1. **`src/pages/AsmDashboardNew.tsx`** — replace the entire body with the ASM Reports layout currently in `AsmReportsNew.tsx`:
   - Header: `ASM Reports` title (no Close button — this is now the section's main screen).
   - Sub-header strip: **`Ravi Kumar, ASM, Pune`** | Team of 6 MEs | 6 markets.
   - 2×2 grid of the four cards (Engagement Reports table, Coverage Heatmap, Top Objections pie, Key Insights).
   - Drop the previous header chips (week chip and ASM Reports link) since reports are now the page itself.

2. **`src/App.tsx`** — remove the `/asm-dashboard-new/reports` route (no longer needed; the home route renders the reports screen).

3. **Delete** `src/pages/AsmReportsNew.tsx` (its content moves into `AsmDashboardNew.tsx`).

4. **Leave untouched** the old dashboard component files under `src/components/asm-dashboard/*` (KpiCards, EngagementUnitCoverage, ObjectionsAndDonut, MarketInsights, EngagementQuality, DailyEngagementReports). They are no longer imported anywhere but remain in the repo in case you want them back. Tell me if you'd like them deleted too.

### Files to change

- **Edit:** `src/pages/AsmDashboardNew.tsx` (replace body with reports layout)
- **Edit:** `src/App.tsx` (remove `/asm-dashboard-new/reports` route + import)
- **Delete:** `src/pages/AsmReportsNew.tsx`

No backend changes.