
# ME App — Retailer Snapshot & Engagement Flow Redesign

Implements the spec from `lovable_prompt_ME_app.md`. Mobile-first, light blue/white card design, red/orange small-caps section labels, full-screen bottom-sheet popups, all retailer-centric.

---

## 1. My Trading Area — single retailer

**File:** `src/pages/me/MyTradingArea.tsx` (and/or `src/data/mockData.ts`)

- Show only **Jai Maharashtra Hardware & Electricals**, Hinjewadi, Pimpri-Chinchwad, MH.
- Either filter the list to this one dealer or replace the seed data so all downstream IDs (`/me/dealer/:id`, etc.) point to it.
- Keep the existing card layout for the row.

---

## 2. Retailer Snapshot — Profile popup cleanup

**File:** `src/pages/me/DealerSnapshot.tsx`

- In the **Profile Details** modal, remove the **Retailer Dimensions** and **Retailer Mindset** sections entirely (lines ~178–231).
- Keep generic details (name, location, joining date, revenue, engagements, products handled, category badge).
- **Engagement History** modal: leave untouched.

---

## 3. Customized Engagement Plan — replace 3 themes with PREPARE / ENGAGE / DIAGNOZE

**File:** `src/pages/me/DealerSnapshot.tsx` (replace the `engagementThemes.map` block)

Render a single light-blue card containing 3 vertical tappable rows:

```text
PREPARE   →   Before The Conversation
ENGAGE    →   During The Conversation
DIAGNOZE  →   Post Conversation
```

- Bold uppercase label in red/orange small-caps + arrow `→`
- Subtitle below in regular weight
- Each row opens a full-screen modal (sheet) — implemented as local state in the page (`openPhase: 'prepare'|'engage'|'diagnose'|null`) so navigation stays inside the snapshot.
- Existing routes `/me/engagement/...`, `/me/notes/...`, `/me/complete/...` are no longer entered from this card. They can remain in the router as legacy.

---

## 4. PREPARE popup (read-only)

New component: `src/components/me/PreparePopup.tsx`

- Full-screen modal, header chip `PREPARE` (red/orange small-caps), title **Preparation Points Before Meeting the Retailer**, close `✕` top-right.
- 3 numbered cards, each with category tag, bold title, body — content exactly as in the spec (sections 4.1–4.3).
- No inputs. Sticky close button.

---

## 5. ENGAGE popup (interactive)

New component: `src/components/me/EngagePopup.tsx`

State managed in `DealerSnapshot.tsx` and passed down (or held in context within the popup) so values persist when DIAGNOZE opens.

- Header `ENGAGE`, title **Tools For Engagement During The Meeting With Retailer**.
- **Section A — Objections Faced** (multi-select checkbox cards). 5 objections from spec. When a card is checked, expand a `Best Practices ›` chevron sub-section (collapsed by default) with the (i)/(ii) bullets.
- **Section B — Action Points** (multi-select checkboxes, 5 items from spec).
- Sticky bottom CTA `✓ Complete Engagement Session` → closes ENGAGE and opens DIAGNOZE.

---

## 6. DIAGNOZE popup (data capture)

New component: `src/components/me/DiagnozePopup.tsx`

Header `DIAGNOZE`, title **Post Meeting With The Retailer**. Three accordion-style questions, all collapsed by default.

1. **Which of the points were you able to cover?** — checkboxes pre-populated from PREPARE titles (3 + "None — dealer was not receptive").
2. **Record new market insights** — category tag selector (Demand / Competitor / Scheme), text input, mic button. Reuses existing `VoiceTextInput` component (already supports voice + text + AI summarize).
3. **Any comments or suggestions from the dealer** — text input + mic button. Reuses `VoiceTextInput`.

Sticky bottom CTA `📋 Generate Visit Summary` → navigates to new Visit Summary page with all collected state.

---

## 7. Visit Summary page

New route + page: `/me/visit-summary/:id` → `src/pages/me/VisitSummary.tsx` (registered in `src/App.tsx`).

- Receives state via `navigate(..., { state })` from DiagnozePopup (objections, action points, prepare-points covered, market insight text, dealer feedback text).
- Header: **Visit Summary — Jai Maharashtra Hardware & Elec.**
- Meta row: 📅 today's date, 👤 Manish Kumar from JK, 🏪 Jai Maharashtra Hardware & Elec. (Owner / In-shop).
- Sections (cards):
  - 📋 Topics Discussed — from Q1
  - ⚠️ Objections Raised — from ENGAGE
  - ✅ Action Points / Go-Forwards — from ENGAGE
  - 💡 New Market Insight — from Q2 (AI summary if present, else raw text)
  - 🔑 Key Critical Feedback — from Q3
- Empty sections render a soft "—" placeholder.

---

## 8. WhatsApp preview & share

Within the Visit Summary page, render a WhatsApp-styled card below the summary:

- White rounded bubble, faint shadow, small avatar/JK label, double-tick `✓✓` and timestamp "Just now".
- Plain-text formatting of the summary fields, footer line `— JK Cement ME Team`.
- Button `📤 Share via WhatsApp` → `window.open(\`https://wa.me/?text=${encodeURIComponent(message)}\`)`.

---

## Technical notes

- All popups use a shared full-screen modal pattern (fixed inset, scrollable inner panel, sticky header with `✕`, sticky footer CTA) consistent with existing modals in `DealerSnapshot.tsx`.
- Section labels (PREPARE / ENGAGE / DIAGNOZE) use `text-primary uppercase tracking-wider text-xs font-bold` with red/orange tone (project's `--primary` is JK red — matches spec).
- Checkboxes use existing `@/components/ui/checkbox`. Accordions use `@/components/ui/accordion`.
- State for the engagement session (objections, action points, Q1/Q2/Q3) lives in `DealerSnapshot.tsx` and is passed to the Visit Summary via router state. No backend persistence in this scope.
- Voice + AI-summary keep using current `VoiceTextInput` (browser SpeechRecognition + mock summarizer). No Lovable Cloud changes.
- Legacy routes (`/me/engagement/...`, `/me/notes/...`, `/me/complete/...`) remain in the router but are unreferenced from the new flow.

---

## Files to add / change

- **Edit** `src/pages/me/MyTradingArea.tsx` — show only Jai Maharashtra (or filter dealers list).
- **Edit** `src/pages/me/DealerSnapshot.tsx` — remove dimensions/mindset, replace engagement plan card, host phase state, mount popups.
- **New** `src/components/me/PreparePopup.tsx`
- **New** `src/components/me/EngagePopup.tsx`
- **New** `src/components/me/DiagnozePopup.tsx`
- **New** `src/pages/me/VisitSummary.tsx`
- **Edit** `src/App.tsx` — add `/me/visit-summary/:id` route.
