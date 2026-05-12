## 1. Retailer Snapshot — Remove "Current Scenario"

`src/pages/me/DealerSnapshot.tsx`
- Delete the entire "Current Scenario" block (lines ~263–271).
- Remaining sections (header, plan card) reflow naturally — no extra spacing fixes needed since they use the same `space-y-4` parent.

## 2. Fullscreen popup shell (Before / During / After)

Convert `PreparePopup`, `EngagePopup`, and `DiagnozePopup` from bottom-sheet style to true fullscreen on every breakpoint.

Replace the current outer container:
```
fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4
  └ bg-card w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[92vh] ...
```
with a uniform fullscreen shell:
```
fixed inset-0 z-50 bg-background flex flex-col
  ├ sticky top header: back/close button + label (BEFORE/DURING/AFTER) + title
  ├ flex-1 overflow-y-auto content area
  └ sticky bottom footer with primary CTA
```
- Header uses a left-aligned back arrow (`ArrowLeft`) instead of a right `X` to match a real page nav, plus the existing tag + title.
- Container becomes opaque (`bg-background`), no rounded corners, no max-width, fills the viewport on web and mobile.
- Content scrolls inside the middle region; header and footer stay fixed.

## 3. DURING popup — full redesign

Rewrite `src/components/me/EngagePopup.tsx` content. Drop the current flashpoint search/best-practice list entirely.

New `EngageState` shape:
```ts
type EngageSection = { text: string; summary: string; suggestions: string[] };
export type EngageState = {
  objections: EngageSection;       // Section 1
  ideas: EngageSection;            // Section 2
  education: EngageSection;        // Section 3
  // legacy fields kept optional only if still referenced elsewhere
};
```
Update `DealerSnapshot.tsx` initial state and the `navigate(..., { state })` payload accordingly. Update `VisitSummary.tsx` typing.

Three stacked sections inside the scroll area, each as a card:
1. "Would you like help to handle any retailer objections?"
2. "Propose new business building ideas"
3. "Educate on new products and/or schemes"

Each card contains:
- A `VoiceTextInput` (already supports text + voice + AI summarize). Use a meaningful `category` per section ("Objection", "Business Idea", "Product/Scheme") and a tailored placeholder hint.
- A "Get suggestions" button below the input. On click, run a local mock generator (same pattern as `mockSummarize` in `VoiceTextInput.tsx`) that returns 3 short bullet recommendations derived from keywords in the entered text. Store them in `suggestions[]` and render as a styled list with a `Sparkles` icon header ("AI Suggestions"). Re-running replaces the list; an Edit affordance is not needed.
- Empty input → button disabled with helper text.

Voice recording state already shows a pulsing dot via `VoiceTextInput`; no new indicator needed.

Footer CTA stays "Complete Engagement Session".

## 4. Visit Summary + WhatsApp preview

`src/pages/me/VisitSummary.tsx`
- Read new `engage` payload + existing `diagnoze` payload from `loc.state`.
- Replace the current "Objections Raised" single section with three structured sections derived from the new DURING data:
  - "Objections Handled" — input summary + AI suggestions
  - "Business Ideas Proposed" — input summary + AI suggestions
  - "Product / Scheme Education Shared" — input summary + AI suggestions
- Keep Topics Discussed, Action Points, New Market Insights, Key Critical Feedback as today (sourced from AFTER popup).
- Rebuild `waMessage` to mirror the on-screen sections in the same order with section emojis:
  ```
  ⚠️ Objections Handled
  💡 Business Ideas Proposed
  📘 Product / Scheme Education
  ✅ Action Points
  🧠 Market Insights
  🔑 Key Feedback
  ```
  Each section prints the user's note (or AI summary if present) followed by the suggestion bullets when available. Skip empty sections cleanly so the WhatsApp message stays readable.
- WhatsApp preview block already renders `waMessage` verbatim — no further change.

## 5. Polish

- All new copy uses existing semantic tokens (`primary`, `info`, `muted-foreground`, etc.) — no hardcoded colors.
- Placeholder hints per section:
  - Objections: "e.g. Retailer says JK margins are lower than competition…"
  - Ideas: "e.g. Joint contractor meet, in-shop display refresh…"
  - Education: "e.g. New WallMaxx scheme, updated PPC pricing…"
- Verify the lock/sequence logic in `DealerSnapshot.tsx` still works (Engage completion only requires clicking the footer CTA — unchanged).

## Technical notes

- No backend / Lovable Cloud work in this pass; suggestions are generated client-side with a deterministic mock similar to `mockSummarize`. We can wire a real LLM call later via Lovable AI Gateway if desired.
- Keep `OBJECTIONS` export removed from `EngagePopup.tsx`; remove the now-dead `import { OBJECTIONS }` in `VisitSummary.tsx`.
- No route or data-model changes outside the three popup files, `DealerSnapshot.tsx`, and `VisitSummary.tsx`.
