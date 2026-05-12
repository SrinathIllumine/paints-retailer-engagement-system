## ASM Reports — new screen inside ASM Dashboard (New)

Add a new read-only "ASM Reports" screen inside the existing **ASM Dashboard (New)** section (route family `/asm-dashboard-new`), per the uploaded spec. Reuse the section's existing theme (light cards, red/orange accents, existing typography). No new top-level app.

### Route & entry point

- **New route:** `/asm-dashboard-new/reports` → new page `src/pages/AsmReportsNew.tsx`. Registered in `src/App.tsx`.
- **Entry from ASM Dashboard (New) home** (`src/pages/AsmDashboardNew.tsx`): add an `ASM Reports` button in the page header (top-right, next to the week chip) that links to `/asm-dashboard-new/reports`.
- **Close button** in the new screen's header calls `navigate("/asm-dashboard-new")`.

### Page structure (`AsmReportsNew.tsx`)

Matches the wrapper used by `AsmDashboardNew.tsx`: `min-h-screen bg-background` with a `max-w-screen-xl mx-auto px-6 py-6` container, so it inherits the same chrome.

1. **Header row** — left: `ASM Reports` (large bold); right: `Close` link styled in primary/red accent.
2. **Sub-header strip** (`bg-muted` band, matches existing dashboard tone): **`Ravi Kumar, ASM, Pune`** | Team of 6 MEs | 6 markets (name+designation bold).
3. **Body grid:** `grid grid-cols-1 md:grid-cols-2 gap-4`, four cards in this order:

```text
[ 1. Engagement Reports        ] [ 2. Retailer Engagement Heatmap ]
[ 3. Top Retailer Objections   ] [ 4. Key insights from markets   ]
```

Each card uses `bg-card border rounded-lg p-4` to match the existing ASM Dashboard cards.

### Card 1 — Engagement Reports (Area-level)

- Header `1. Engagement Reports (Area-level)` + italic sub-label *Recent Reports (as on 12th May 2026)*.
- shadcn `Table` with columns **ME, Area, Retailer Engaged, Report, Time** and the 5 rows from the spec.
- **View Report** rendered as an underlined `text-primary` link → navigates to existing `/me/visit-summary/1` (placeholder, since per-row report ids don't exist yet).

### Card 2 — Retailer Engagement Coverage Heatmap

- Header + italic sub-label *Overall coverage from 12th March till 12th May*.
- Table with columns **ME, Area, Engagement 1: Value Proposition, Engagement 2: Expanding Contractor Base, Engagement 3: Improving Service**. Engagement number regular weight, name in **bold** within header cells.
- 5 rows from spec. Percentage cell color via helper:
  - `>=80` → `bg-success/15 text-success`
  - `40–79` → `bg-warning/15 text-warning`
  - `<40` → `bg-destructive/15 text-destructive`
- The `25%` cell shows `50/200 retailers` as a smaller muted sub-label below the percentage.

### Card 3 — Top Retailer Objections (in the area)

- Recharts `PieChart` (already in deps) with the 5 slices and spec colors (Red, Light green, Dark teal, Steel blue, Orange — inline since they're data-viz hues).
- External labels with leader lines (`label` + `labelLine`), legend below. Centered, ~280px height.

### Card 4 — Key insights from markets in Pune

- Two stacked inset cards using `bg-muted` (matches existing ASM Dashboard inset style):
  - **Common insights across markets** (bold label) → tag chip `SCHEME-RELATED` (uppercase, underlined, `text-primary text-xs tracking-wider`) + bold lead sentence + remainder regular.
  - **Market specific insights** (bold label) → tag chip `IN HINJEWADI` + bold lead + supporting sentence.

### Styling & conventions

- Reuse semantic tokens (`bg-card`, `bg-muted`, `border`, `text-foreground`, `text-muted-foreground`, `text-primary`, `bg-success/15`, `bg-warning/15`, `bg-destructive/15`) — no new palette.
- Mobile-first single column at `<md`, two columns at `md+`.
- Entire screen is read-only.

### Files to change

- **New:** `src/pages/AsmReportsNew.tsx`
- **Edit:** `src/App.tsx` (register `/asm-dashboard-new/reports` route)
- **Edit:** `src/pages/AsmDashboardNew.tsx` (add `ASM Reports` link in header)

No backend, no schema, no new top-level section.