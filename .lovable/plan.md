## DURING popup (`src/components/me/EngagePopup.tsx`) — full restructure

### Layout

- Replace the 3-stacked-card layout with an accordion (reuse the `Q` component pattern from `DiagnozePopup.tsx`: clickable header + chevron, body conditionally rendered).
- Drop the "Section 1 / Section 2 / Section 3" tag labels. Headers show only the question text, with a small `Q1.` / `Q2.` / `Q3.` prefix.
- Single-open behavior: opening one question collapses the others. Q1 is open by default when the popup opens.
- Compact spacing (`space-y-2`, smaller paddings) so all 3 question rows fit within the viewport without scrolling when collapsed; only the open question's body scrolls if needed (inner `overflow-y-auto`).

### Q1 — "Would you like help to handle any retailer objections?"

- Keep the existing `VoiceTextInput` (voice + textarea + AI summarize).
- Replace the current generic "Get suggestions" output with an **intelligent objection matcher**:
  - Maintain a small in-file catalogue of canonical retailer objections (e.g. Margin/price, Stock/supply, Painter influence, Competitor scheme, Quality perception, Delivery delay), each with: `keywords[]`, `label`, `bestPractices[]` (2–3 short tactics).
  - On voice/text update (debounced) or via the existing "Get suggestions" button, score the catalogue against the captured text using the same keyword approach already used in `EngagePopup`, and surface the top 1–2 matches.
  - Render matches as cards: objection label + a "Best practices to handle this" bullet list.
  - Keep all matched objections + best-practice text in `state.objections` so they flow into the summary.

### Q2 — "Propose new business building ideas"

- Remove `VoiceTextInput` and the AI suggestions block entirely.
- Show two static selectable, non-editable bullet points:
  1. Track the new construction sites and approach their site supervisors.
  2. Expand your contractor base by getting in touch with JK's DGs. Below this, a small expandable "Show nearby DG details" panel listing 2–3 mock DGs (name, area, phone) — pulled from a local mock array inside the file.
- Persist these as the body for the "Business Ideas Proposed" block in the visit summary (always present, no user input needed).

### Q3 — "Educate on new products and/or schemes"

- Remove `VoiceTextInput` and the AI suggestions block.
- Show two static selectable bullet points:
  1. Promote the newly launched small-sized packs for repainting projects.
  2. Talk about the new "Painter Loyalty Scheme" launched by JK.
- Persist these as the body for the "Product / Scheme Education" block in the summary.

### EngageState shape changes

Update `EngageState` so the summary screen has structured data:

- `objections`: keep `text`, `summary`, plus new `matches: { label: string; bestPractices: string[] }[]`.
- `ideas`: change to a fixed payload `{ points: string[]; dgDetails: {name, area, phone}[] }`.
- `education`: change to fixed payload `{ points: string[] }`.
- Update `newEngageState()` accordingly with the static content pre-filled (so even if the ME just clicks through, Q2/Q3 content reaches the summary).

## Visit Summary (`src/pages/me/VisitSummary.tsx`)

- "Objections Handled" card: show the captured note/summary, then a sub-block listing each matched objection with its best-practice bullets (replacing the current generic numbered AI suggestions list).
- "Business Ideas Proposed" card: render the two static bullets + a compact DG details list.
- "Product / Scheme Education" card: render the two static bullets.

## WhatsApp preview (same file)

Update the `waBlocks` builder so:

- Objections section prints: the ME's note (if any) + each matched objection as `• <label>` with indented best-practice lines.
- Business Ideas section always prints the two bullets + DG names/areas.
- Product/Scheme section always prints the two bullets.

## Out of scope

- No changes to BEFORE (Prepare) or AFTER (Diagnoze) popups beyond what's already in place.
- No backend/data-model changes; all new content stays in component-level mock data.