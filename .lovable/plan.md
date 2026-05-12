## Goal

Restructure the ASM Analytics app so each tab is sourced from the data shown in `AsmDashboardNew` (`/asm-dashboard-new`), but rendered using the existing ASM Analytics UI shell (`ASMLayout`, shadcn `Card`, `Table`, `Dialog`, current typography and tokens). No look-and-feel from `AsmDashboardNew` is copied — only its data, structure and copy.

## 1. Sidebar — reorder tabs

In `src/components/asm/ASMLayout.tsx`, reorder `navItems` to:

1. Engagement Quality → `/asm`
2. Market Insights → `/asm/insights`
3. Retailer Objections → `/asm/objections`
4. Leaderboard → `/asm/retailers` (route stays the same; page is repurposed to a Leaderboard view, see §4)

Sub-text is left as already configured.

## 2. Engagement Quality (`ASMDashboard.tsx`) — rebuild

Strip the page down to two sections only:

**a. Top identity card (kept, slightly extended)**
- Reuse the existing avatar + name + location card (Rajesh Kumar · ASM · Pune).
- Replace the right-hand "Area in-charge" block with three inline summary chips: `Team of 6 MEs`, `6 markets`, `Pune region`. Use existing `text-xs text-muted-foreground` + `text-sm font-semibold` styling — no new colors.

**b. "Quality of retailer engagement" bar chart card**
- New `Card` containing a Recharts `BarChart`.
- X-axis: market areas — `Pune City`, `Wakad`, `Baner`, `Kothrud`, `Hinjewadi` (replaces months from AsmDashboardNew).
- Y-axis: engagement quality % (0–100).
- Data values per area sourced from the `meDetail` rows in AsmDashboardNew (Aditya 90, Shivam 40, Dheeraj 65, Raj 90, Sagar 95). Bar color tier (green/orange/red) follows AsmDashboardNew thresholds but using existing semantic tokens (`success`, `warning`, `destructive`) so it stays inside the current design system.
- Company benchmark = 80%, drawn as `ReferenceLine` with a `Label` rendered with extra right margin so the "Company Benchmark" text is fully visible (right margin ~120px, label `position="right"`, never clipped).
- Bottom-right CTA "Click to view detailed list →" using a small ghost/link button consistent with current ASM Analytics (`text-primary text-sm font-medium hover:underline`), opens the dialog described in §3.

Remove: SNAPSHOT KPI grid, ME-wise breakdown table, Daily engagement coverage card, Quarterly leaderboard, MEProfileDialog wiring, and any imports that become unused.

## 3. Engagement Quality detail dialog (popup)

Inside `ASMDashboard.tsx`, add a shadcn `Dialog` opened by the CTA above. Use existing `Table` styling (header uppercase muted, alternating rows already used elsewhere in ASM Analytics).

Columns, in this exact order — `Discussion points` removed:

1. Area
2. ME
3. Retailers covered
4. Overall engagement quality
5. Avg. time spent
6. Preparation

Rows = the 5 entries from AsmDashboardNew `meDetail`. For tier coloring, render `HIGH/MODERATE/LOW` and the `9/10` style values using small pills built from existing tokens (`bg-success/10 text-success`, `bg-warning/10 text-warning`, `bg-destructive/10 text-destructive`) — no inline hex from the AsmDashboardNew palette.

## 4. Leaderboard tab (`ASMAllRetailers.tsx` → repurposed)

Replace the entire All-Retailers page contents with a Leaderboard page sourced from AsmDashboardNew's `leaderboard` data.

- Page title: "ME Leaderboard", subtitle "ME leaderboard w.r.t. sales & engagement levels", with the same `MapPin` Pune line used on other ASM pages.
- Single `Card` containing a shadcn `Table` with columns: `#`, `ME`, `Area`, `Engagement Quality`, `Sales Growth`, `Status`.
- Rows: the 5 leaderboard entries from AsmDashboardNew (Aditya, Shivam, Dheeraj, Raj, Sagar).
- HIGH / MODERATE / LOW rendered with the same semantic-token pills as §3.
- Status column ("Top Performer", "Can Improve", "Needs significant Improvement", "Needs immediate attention") rendered using the existing `Badge` component with semantic variants:
  - green → `bg-success/10 text-success`
  - orange → `bg-warning/10 text-warning`
  - red / red-strong → `bg-destructive/10 text-destructive` (red-strong adds `font-semibold`)
- Keep the existing route `/asm/retailers` so the sidebar entry continues to work; rename the default export to `ASMLeaderboard` and update the import in `src/App.tsx`. File is renamed to `src/pages/asm/ASMLeaderboard.tsx`; old `ASMAllRetailers.tsx` is deleted.

## 5. Retailer Objections (`ASMObjections.tsx`) — trim

Keep only the pie-chart card. Remove the "Retailer-wise objections" table card and the "Market area objection view" table card, plus their search input, helpers, and unused imports (`Input`, `Badge`, `Search`, `Clock`, `useMemo`, etc.).

Pie-chart updates:
- Replace `objectionBreakdown` data with the 5 entries from AsmDashboardNew `objections`: Competition Related 45, Product quality 30, Scheme related 9, SKU Space related 7, Working Capital related 3.
- Slice colors continue to use the current ASM Analytics `COLORS` HSL array (no inline hex from AsmDashboardNew) so the donut visually matches the rest of the app.
- Keep the donut/pie sizing from the current page; render percentage labels as already done.

CTA inside the same card, bottom-right: a link-style button "See top 5 objections in the area →" (`text-primary text-sm font-medium hover:underline`) that opens a shadcn `Dialog`.

Dialog content is sourced verbatim from the AsmDashboardNew section-3 popup ("Top 5 objections in Pune"), grouped by category (Competition-related, Product-quality related, Scheme-related) with the exact `q`/`e` items already authored there. Render with current ASM Analytics styling: section eyebrow in `text-xs uppercase text-muted-foreground`, each item as `border-l-2 border-primary/40 pl-3` (no AsmDashboardNew palette hex), quote in `text-sm font-medium text-foreground`, explanation in `text-xs text-muted-foreground`.

## 6. Market Insights (`ASMInsights.tsx`)

No structural change required — it stays as the current ASM Analytics insights page (already in the right slot in the new sidebar order). Out of scope for this plan.

## Files touched

- `src/components/asm/ASMLayout.tsx` — reorder `navItems`.
- `src/pages/asm/ASMDashboard.tsx` — full rewrite per §2 + §3.
- `src/pages/asm/ASMAllRetailers.tsx` → renamed/replaced by `src/pages/asm/ASMLeaderboard.tsx` per §4.
- `src/pages/asm/ASMObjections.tsx` — trimmed per §5.
- `src/App.tsx` — update the `/asm/retailers` import to `ASMLeaderboard`.

## Out of scope

- `AsmDashboardNew.tsx` itself remains unchanged; it's only used as a data/copy source.
- Market Insights page is not modified.
- No design-token, color, or typography changes; no new shadcn components introduced.
