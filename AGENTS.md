<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# The Observer Effect

A prediction game for MPCS 51238 Assignment 3 (Patterns & Flows). Users wager tokens on the outcomes of events in six categories (Sports, Politics, World, Markets, Culture, Science). A win pays 2× the wager and a loss costs the wager. Users start with 100 tokens. A daily streak bonus pays +10, +15, +20, and then +25 at most for consecutive days, and a missed day resets it to +10. Each event shows a seeded crowd split, and a prize facts strip appears on home and the leaderboard. A monthly leaderboard ranks the most correct predictors.

Main flow: I pick an outcome and wager tokens → it's in my open predictions → I come back tomorrow, my +10 tokens are waiting, and the closed events have collapsed into wins or losses.

## Constraints
- Next.js (App Router, `src/`) + Tailwind CSS v4 only. No database, accounts, backend, or external APIs, and no new npm packages without asking.
- All user data lives in `localStorage` under one key (`observer:v1`). Every access is wrapped in try/catch with a safe default.
- Events and rivals are seeded local data with fictional names. Event close times are relative to the user's first visit, and outcomes are pre-set.
- A dev clock offset ("Simulate tomorrow") lets the return flow be tested.

## Conventions
- Use shared components from `src/components/` everywhere (Button, Field, RadioGroup, Chip, Card, Nav, Toast, EmptyState).
- Forms are one column with a real `<label>` on every field. Errors sit next to the field, say what to do next, and use `aria-invalid` + `aria-describedby`. Never clear what the user typed.
- Everything works by keyboard with visible focus. Text contrast is at least 4.5:1. Win/loss state never relies on color alone.
- Keep it simple and remove steps, fields, and interactions that aren't needed.
- Commit after each build step so the history shows progress.

## Docs
- `flows.md`: the Mermaid flow diagram (also embedded in `README.md`)
- `research.md`: onboarding research on similar tools
