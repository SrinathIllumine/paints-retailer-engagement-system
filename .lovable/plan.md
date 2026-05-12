## Change

In `src/pages/me/MyDashboard.tsx`, the "Recently visited retailers" accordion currently routes each row to `/me/dealer/:id` (the Retailer Snapshot). Update the row click handler to navigate to `/me/visit-summary/:id` instead, so the user lands on the generated WhatsApp Visit Summary report (`src/pages/me/VisitSummary.tsx`).

`VisitSummary` already handles missing location state — it falls back to defaults and renders the dealer's WhatsApp summary using the dealer id from the URL — so no other wiring is needed.

## Files touched

- `src/pages/me/MyDashboard.tsx` — change the `onClick` for recently-visited rows from `navigate(\`/me/dealer/${r.id}\`)` to `navigate(\`/me/visit-summary/${r.id}\`)`.

## Out of scope

- No changes to the Retailer Snapshot, the route table, or the other accordion sections.
- The "Report" affordance label on the right of each row stays as-is.
