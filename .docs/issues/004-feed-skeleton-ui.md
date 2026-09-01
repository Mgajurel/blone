---
id: 004
title: Feed skeleton UI — real saves, j/k selection, status line
type: AFK
labels: [needs-triage]
status: open
blocked-by: [001]
---

## Parent

`.docs/PRD.md` — Blone: a frictionless second brain

## What to build

The first custom surface: a Vite + React + Tailwind app (with a local proxy for CORS) that renders the user's real captures as the reverse-chronological feed specified in `.docs/design.md` — dense three-line cards (type badge · title · age / summary / favicon · domain · tag chips), continuous mail-client list, sticky search bar shell (`/` focuses it; live querying is slice 005), sticky status line with counts, and instant `j`/`k` selection. This slice births two modules at minimum size: **karakeep-client** (auth, list, paginate — the only place HTTP lives) and the **command-engine** seed (a declarative keymap table driving j/k/`/`).

Design source: approved artboards from 002 if available, else `design.md` directly.

## Acceptance criteria

- [ ] App on localhost shows real saves from Karakeep, newest first, with pagination/infinite scroll
- [ ] Card anatomy, tokens, and type-hue mapping match `design.md` (badge tint treatment, mono type scale, 760px column)
- [ ] Exactly one row is selected; `j`/`k` move instantly (no animation) and keep the selection in view
- [ ] `/` focuses the search bar; keys do not fire while an input is focused
- [ ] Status line shows total saves and today's count
- [ ] No component fetches directly — all API access goes through karakeep-client
- [ ] Keymap is declared in one table (command-engine seed), not scattered in event handlers

## Blocked by

- `001-walking-skeleton.md`
- Soft: `002-claude-design-pass.md` (build from `design.md` if 002 is skipped)
