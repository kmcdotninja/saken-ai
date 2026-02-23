

# Interactive Kanban Board Enhancements

## Overview
Three enhancements to make the Kanban board feel like a true AI-agent-driven product: autonomous agent card movement, a functional deploy button with state toggling, and human supervisor identity in comments.

---

## 1. Autonomous Agent Card Movement

Agents will periodically and automatically move cards between columns, simulating real AI work.

**How it works:**
- A `useEffect` interval (every 8-12 seconds, randomized) picks a random card that has an assigned agent
- The card animates from its current column to the next logical column (e.g., `todo` -> `in_progress` -> `review` -> `done`)
- A toast notification fires: "[Agent Name] moved [Card ID] to [Column]"
- The card receives a brief highlight/glow animation on arrival
- Only cards with an assigned agent are eligible for auto-movement

**Files to modify:**
- `src/components/KanbanBoard.tsx` -- add `useEffect` with interval logic, a highlight state for recently-moved cards, and a subtle CSS transition on the moved card

---

## 2. Functional Deploy Button with State Toggle

The Deploy button in the TopBar becomes stateful with animated transitions.

**How it works:**
- TopBar tracks a `deployState`: `idle` | `deploying` | `deployed`
- Clicking "Deploy" transitions to `deploying` (shows a spinner + "Deploying..." text for ~3 seconds)
- After the timer, transitions to `deployed` (green checkmark + "Deployed" text, success toast with confetti-style animation)
- In `deployed` state, clicking the same button shows "Undeploy" -- clicking it resets to `idle` with a toast confirmation
- The button color and icon change per state

**Files to modify:**
- `src/components/TopBar.tsx` -- add `deployState` state, timer logic, conditional button rendering
- `src/pages/Index.tsx` -- optionally lift deploy state if needed across views

---

## 3. Human Supervisor Identity in Comments

Comments posted by the user show a supervisor name rather than being anonymous.

**How it works:**
- A hardcoded supervisor profile: name "Supervisor" with a user icon (distinguishable from AI agents)
- The supervisor name is pulled from the `ProfileSettingsPanel` or a shared constant (e.g., "Alex Chen" or a default)
- When posting a comment in `IssueModal`, the new comment object includes `{ author: "supervisor", text: ..., time: "Just now" }`
- The comment renders with a distinct human icon (user icon instead of agent avatar) and the supervisor's name
- Comments list updates in real-time with the new entry prepended

**Files to modify:**
- `src/components/IssueModal.tsx` -- make comments stateful, add supervisor entry on submit, render supervisor avatar distinctly
- `src/data/kanban-data.ts` -- add a `supervisor` entry or constant for the human persona

---

## Technical Details

### KanbanBoard.tsx - Auto-move logic
```
useEffect(() => {
  const interval = setInterval(() => {
    // Pick random eligible card (has assignee, not in "done")
    // Move to next column in sequence
    // Set highlight state for animation
    // Fire toast with agent name
  }, 8000 + Math.random() * 4000);
  return () => clearInterval(interval);
}, [cols]);
```

### TopBar.tsx - Deploy state machine
```
idle -> (click) -> deploying -> (3s timer) -> deployed -> (click) -> idle
```

### IssueModal.tsx - Comment with supervisor
- Convert `mockComments` to state: `useState([...mockComments])`
- On submit: prepend `{ author: "supervisor", name: "Supervisor", text, time: "Just now" }`
- Render with a distinct style (e.g., border accent or "HUMAN" badge)

