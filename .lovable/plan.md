
# ME App v2 — Restore Retailer List + Sequential Engagement Checklist

Builds on the existing Prepare/Engage/Diagnoze flow. Three focused changes per the v2 spec.

---

## 1. My Trading Area — restore full retailer list

**File:** `src/pages/me/MyTradingArea.tsx`

- Remove the `dealers.filter((d) => d.id === "1")` restriction.
- Show all dealers from `mockData` again, with original search behaviour intact.
- No other changes to layout, footer, or navigation.

---

## 2. Retailer Snapshot — add "Current Scenario" block

**File:** `src/pages/me/DealerSnapshot.tsx`

Insert a new read-only block **between the dealer header (Profile/History buttons row) and the Customized Engagement Plan card**.

- Small red/orange uppercase label: `CURRENT SCENARIO` (same `text-primary uppercase tracking-wider text-xs font-bold` styling already used for phase labels).
- Light-blue card matching the engagement plan card (`bg-info/5 border-info/20`).
- Body copy (regular weight, dark): *"Long-standing retailer since 2014. At this point in time, his sales are coming down w.r.t JK."*
- No edit controls, no icon actions.

Profile Details popup already has Dimensions & Mindset removed — no change needed.

---

## 3. Customized Engagement Plan — sequential locked checklist

**File:** `src/pages/me/DealerSnapshot.tsx` (replace existing 3-row engagement card)

Replace the current 3-row tappable card with a sequential checklist that enforces order.

### State (added to `DealerSnapshot.tsx`)
```ts
const [completed, setCompleted] = useState<{prepare:boolean; engage:boolean; diagnoze:boolean}>({
  prepare:false, engage:false, diagnoze:false
});
const [lockMsg, setLockMsg] = useState<null | "engage" | "diagnoze">(null);
```

### Row layout (in a single `bg-info/5 border-info/20` card)

```text
[○ / ✓]  PREPARE   →  Before The Conversation       [unlocked]
[○ / ✓]  ENGAGE    →  During The Conversation        [🔒 until prepare done]
[○ / ✓]  DIAGNOZE  →  Post Conversation              [🔒 until engage done]
```

- **Pending/unlocked**: empty `Circle` icon, full opacity.
- **Locked**: empty circle + `Lock` icon on the right; row at `opacity-40`, `cursor-not-allowed`.
- **Completed**: `CheckCircle2` filled in `text-success`.
- Tapping a locked row sets `lockMsg` and renders a small inline note under the card: *"Complete PREPARE first."* / *"Complete ENGAGE first."* (auto-clears after a few seconds via `setTimeout`).
- When all three are complete, render a centered footer line in the card: `Engagement Complete ✓` in `text-success`.

### Unlock & completion wiring

- **PREPARE popup** (`PreparePopup.tsx`): replace the bottom "Close" button with `✓ Mark Prepare as Done`. Add an `onDone` prop. Tapping it calls `onDone()` then `onClose()`. In `DealerSnapshot`, `onDone` sets `completed.prepare = true`.
- **ENGAGE popup**: existing `onComplete` already chains to Diagnoze. Wrap so it also sets `completed.engage = true` before opening Diagnoze.
- **DIAGNOZE popup**: in `onGenerate`, set `completed.diagnoze = true` before navigating to Visit Summary.

No other popup logic changes — Engage's objections/best-practices accordions, Diagnoze's three Q accordions, and the WhatsApp-shared Visit Summary page already match the v2 spec.

---

## Files to change

- **Edit** `src/pages/me/MyTradingArea.tsx` — restore full dealer list.
- **Edit** `src/pages/me/DealerSnapshot.tsx` — insert Current Scenario block; replace engagement plan card with sequential checklist; add completion state; wire popup completion callbacks.
- **Edit** `src/components/me/PreparePopup.tsx` — add `onDone` prop and replace footer button label/handler.

No new files. No backend changes. No router changes.
