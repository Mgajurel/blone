---
id: 009
title: Resilience & first-run — degraded states, empty state, toasts
type: AFK
labels: [needs-triage]
status: open
blocked-by: [004]
---

## Parent

`.docs/PRD.md` — Blone: a frictionless second brain

## What to build

The honest edges: capture never silently loses anything, and the app teaches its own core loop. Under-enriched saves (crawler failed, X blocked the fetch) render with the `warn` treatment from `design.md` (`fetch failed — text not indexed`) instead of pretending to be complete — the save exists with whatever was captured. A brand-new brain shows the empty state with the capture shortcut as kbd chips. The in-app toast component ships per spec (bottom-right, 160ms, 2.5s auto-dismiss, max two) and is used by curation/palette actions for confirmations and errors.

## Acceptance criteria

- [ ] A save whose crawl failed still appears in the feed, with the `warn` dot and `fetch failed — text not indexed` meta line
- [ ] Saving an unreachable URL end-to-end yields a visible, searchable-by-title card rather than nothing
- [ ] Fresh database renders the empty state per `design.md` (`nothing here yet` + `⌘⌥s` kbd chips)
- [ ] Toasts match spec and voice; error toasts are visually distinct (`danger`/`warn`) from confirmations
- [ ] No action in the app fails without visible feedback

## Blocked by

- `004-feed-skeleton-ui.md`
