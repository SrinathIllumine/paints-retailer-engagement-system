# ASM Reports — Visual Refinements

All edits scoped to `src/pages/AsmDashboardNew.tsx`. No routing or data changes.

## 1. Header & typography consistency

- Replace the small grey sub-header strip with a richer header block:
  - Avatar (shadcn `Avatar`, ~48px) of Ravi Kumar on the left (initials fallback "RK").
  - Beside it: **"Ravi Kumar"** at `text-[18px] font-bold`, sub-line "ASM, Pune" at `text-[12px] text-muted-foreground`.
  - Below avatar row: two compact stats — **Total MEs: 6** and **Total Markets: 6** — as small pill chips.
- Standardize type scale across all 4 cards:
  - Card titles: `text-[15px] font-bold`
  - Card sub-captions (italic dates): `text-[11px]`
  - All body content (table cells, heatmap cells, insight text): `text-[12px]`
  - Table headers: `text-[12px] font-semibold`
- Page H1 ("ASM Reports") stays `text-[20px] font-bold`.

## 2. Heatmap — red-only background

- In `heatColor()`:
  - `>= 80` → `text-success` only (no background; transparent cell)
  - `>= 40` → `text-warning` only (no background)
  - `< 40` → keep `bg-destructive/15 text-destructive` (red background retained)
- Cell wrapper keeps padding/centering so alignment is unchanged; only the green/yellow fills disappear.

## 3. Key Market Insights — neutral styling + View all

- Remove the colored left accent bar, the colored category pills, and the lucide icon badges (`Lightbulb`, `MapPin`).
- Each insight becomes a clean card: white background, neutral border, small uppercase muted category label, bold one-line takeaway, supporting line in muted text.
- Add a **"View all →"** ghost link at bottom-right of the card that opens a shadcn `Dialog` titled "All Market Insights" listing the same two insights plus 3 more sample entries (Demand, Product Quality, Customer Behavior) in the same neutral style.

## 4. Top Retailer Objections — inline legend with %

- Remove the recharts `<Legend>` at the bottom.
- Render a custom legend list to the right of (or below, depending on space) the pie:
  - Color swatch + name + `value%` on one line each, e.g. `■ Demand related — 30%`.
- Pie keeps its slice `%` labels; tooltip retained.

## Technical notes

- Uses existing semantic tokens (`--success`, `--warning`, `--destructive`, `--primary`, `--muted-foreground`).
- New imports: `Avatar`, `AvatarFallback` (already available). Drop unused `Lightbulb`, `MapPin` imports.
- New local state for the "All Market Insights" dialog (alongside existing `showAllReports`).
- 2×2 grid sizing and viewport-fit behavior preserved.
