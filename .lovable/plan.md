
## ASM Reports — layout & content refinements

All changes are scoped to `src/pages/AsmDashboardNew.tsx`. No backend, no routing changes.

### 1. Fit all 4 cards in a single screen view

- Tighten the page wrapper: reduce vertical padding (`py-4`), shrink header margin and sub-header strip.
- Reduce card padding (`p-3`), title sizes (`text-[14px]`), and inter-card gap (`gap-3`).
- Make each card a fixed-height panel so the 2×2 grid fits the viewport (~`h-[calc((100vh-160px)/2)]`) with internal scroll for tables/legend overflow only.
- Shrink pie chart height (~220px) and table row padding so cards stay compact.

### 2. Reorder the 2×2 grid

```text
┌──────────────────────────┬──────────────────────────┐
│ 1. Engagement Reports    │ 2. Top Retailer          │
│    (top-left)            │    Objections (top-right)│
├──────────────────────────┼──────────────────────────┤
│ 3. Retailer Engagement   │ 4. Key Market Insights   │
│    Coverage Heatmap      │    (bottom-right)        │
│    (bottom-left)         │                          │
└──────────────────────────┴──────────────────────────┘
```

Rename card 4 header to **"Key Market Insights"**.

### 3. Redesign Key Market Insights card

Replace the two flat grey blocks with a more visually engaging layout:

- Two stacked insight items, each on a white card surface with a left accent bar in `--primary` (4px wide).
- Each insight has:
  - A small colored pill badge for the category (e.g. "Scheme-related" in primary tint, "Hinjewadi" in accent tint) at the top.
  - A bold one-line takeaway in `text-foreground`.
  - A short supporting line in `text-muted-foreground`.
  - A small lucide icon (e.g. `Lightbulb` for common, `MapPin` for market-specific) in a soft circular badge on the right.
- Subtle hover lift (`hover:shadow-md transition`) for parity with the other cards.

Stays within design tokens (no raw colors).

### 4. Heatmap column changes

- Remove the **ME** column.
- Add a new **Overall Engagement Quality** column immediately to the right of **Area**, showing the average of E1 + E2 + E3 (rounded), color-coded with the same `heatColor()` helper.
- Keep the existing three engagement columns unchanged.

Resulting columns: `Area | Overall Engagement Quality | Engagement 1 | Engagement 2 | Engagement 3`.

### 5. Engagement Reports — top 3 + View More

- Render only the first 3 rows of the `reports` array by default.
- Add a **View more** button (ghost/link style, primary color) at the bottom-right of the card.
- Clicking opens a Dialog (shadcn `Dialog`) titled "All Engagement Reports" containing the full table with the same columns, including per-row "View Report" links that preserve the existing `state` payload.

### Technical notes

- Use existing shadcn `Dialog` for the View More modal; no new dependencies.
- Use `useState` to control the dialog.
- Compute heatmap "Overall" inline: `Math.round((e1 + e2 + e3) / 3)`.
- All colors via design tokens (`--primary`, `--muted`, `--success`, `--warning`, `--destructive`, etc.). No hard-coded hex except the existing pie chart palette.
- No changes to `App.tsx`, routes, or the visit-summary page.

### Files to edit

- `src/pages/AsmDashboardNew.tsx` — only file touched.
