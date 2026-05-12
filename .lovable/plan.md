# Polish ASM Dashboard (new) — Visual Refinement

Target file: `src/pages/AsmDashboardNew.tsx` only. No business logic / wording changes.

## 1. Header sub-tagline
- Bump "Ravi Kumar, ASM, Pune | Team of 6 MEs | 6 markets" from `text-[12px] text-muted-foreground` to `text-sm font-semibold text-foreground` and increase bottom margin so it reads as a real subtitle.
- Use a stronger separator color (`text-muted-foreground/40`) between the pipes.

## 2. Shared visual language (match ASM Analytics)
Adopt the same look used in `EngagementQuality.tsx` / `ObjectionsAndDonut.tsx` / `MarketInsights.tsx`:
- Section eyebrow: `text-[11px] uppercase tracking-wide text-muted-foreground font-medium` over a `text-[15px] font-medium text-foreground` title (replaces the bold 14px titles currently used).
- Cards: keep `bg-card border rounded-lg`, but use `p-4` and consistent inner spacing (`mb-3` / `mb-4` rhythm).
- Body text: `text-[12px]` foreground, `text-[11px]` muted for support copy. Eliminate the mixed 10/11/12/13/14px sizes presently in use.
- Pills: switch from `bg-*/15` semantic tints to the analytics palette (`#E1F5EE/#1D9E75`, `#FAEEDA/#BA7517`, `#FCEBEB/#E24B4A`) via a shared `tier()`-style helper, so HIGH/MODERATE/LOW pills look identical to the analytics quality-score pills.

## 3. Section 1 — Engagement Quality bar chart
- Wrap in the new eyebrow + title pattern.
- Replace pastel blue with the analytics green/orange/red tier colors per bar (Feb 80→green, Mar 85→green, Apr 70→orange) using `<Cell>`.
- Reduce bar size, tighten margins, drop the in-chart "Engagement Quality" Y-axis label (use the eyebrow copy instead) so the plot is not cramped.
- Move the "Decline" annotation to a small inline chip above the Apr bar using absolute positioning tied to the bar (not a fixed `right-[24%]`). Use `text-[11px]`.
- "Click to view →" CTA: keep destructive color but `text-[11px] font-medium`.

## 4. Section 2 — Collated insights
- Eyebrow + title + supporting line ("3 of 10 shown this week").
- Each insight becomes a row matching the analytics flagged-intel pattern: small left color dot + category pill (right) + headline (medium) + muted sub-line. Border-top dividers between rows.
- Consistent `text-[12px]` headline, `text-[11px]` muted sub-line.
- CTA aligned right, same style as Section 1.

## 5. Section 3 — Pie chart (key fix)
- Replace external string labels with an internal donut + side legend (mirrors `ObjectionsAndDonut.tsx`):
  - `innerRadius="55%"` `outerRadius="90%"`, no Pie `label`/`labelLine`.
  - Two-column layout inside the card: donut left, legend list right with name + % rows separated by border-t (same as analytics legend).
  - Card uses `overflow-hidden`; donut wrapper is a fixed flex container so labels can never escape.
- Colors switch to the analytics palette (`#1D9E75`, `#EF9F27`, `#D85A30`, `#378ADD`, `#E24B4A`).
- All legend text `text-[12px]` foreground / `text-[11px]` muted — consistent with rest of page.

## 6. Section 4 — ME Leaderboard
- Remove background-color pills on Engagement Quality and Sales Growth columns. Render value as plain colored text: `text-success` (HIGH), `text-warning` (MODERATE), `text-destructive` (LOW), `font-semibold text-[12px]`.
- Status column keeps a colored text label (no filled background) with a small leading dot, matching analytics flagged-intel rows. Drop the `destructive-strong` filled chip.
- Tighten table typography: header `text-[10px] uppercase tracking-wide text-muted-foreground`, cells `text-[12px]`, row padding `py-2`, hover `hover:bg-muted/40`.

## 7. Popups (Dialogs)
All three dialogs:
- `DialogContent` gets `bg-card text-foreground border-border` (explicit) and consistent `max-w-3xl` / `max-w-4xl` sizing scaled to content; padding `p-6`; scroll area `max-h-[75vh]`.
- `DialogTitle` uses display-style: `text-lg font-semibold text-foreground`, with a `text-xs text-muted-foreground` sub-label.

Section 1 popup (ME × Engagement table):
- Header row uses analytics-style uppercase tiny labels.
- Switch tinted pills to plain colored text (same rule as the leaderboard) so values stay readable on light bg. Keep one accent pill only on the "Overall EQ" score column for emphasis (analytics tier pill).
- Add zebra striping (`even:bg-muted/30`) and aligned numeric columns.

Section 2 popup (Insights from the Market):
- Two-column readable layout: numbered category title on a sticky left rail (`md:grid-cols-[180px_1fr]`), items on the right with `text-[13px]` headline + `text-[12px] text-muted-foreground` body.
- Consistent vertical rhythm (`space-y-4` between sub-items, `space-y-8` between sections), divider between sections.

Section 3 popup (Top 5 objections):
- Quote line in foreground (drop italic, keep medium weight) with a small left accent bar in the category color; explanation in muted; `space-y-3` between objections, `space-y-6` between categories.
- Category header reuses the eyebrow style for consistency.

## 8. Cleanup
- Remove `Pill`/`StatusPill` if unused after the changes, or repurpose into a single `tierColor()` helper returning `{text, bg}` so analytics-style pills can still be used selectively (Section 1 popup score column).
- Remove unused imports.

## Technical notes
- All new colors added inline via the established analytics palette constants (kept local to the file to avoid touching `index.css`/`tailwind.config.ts`).
- Recharts: rely on `ResponsiveContainer` + parent fixed/flex height to prevent label overflow; pie no longer uses external `label` so the wrapping concern in the user's screenshot is resolved.
- No data, route, or business-wording changes.
