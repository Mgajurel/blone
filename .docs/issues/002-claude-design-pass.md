---
id: 002
title: Design pass in Claude Design (artboards 1–7)
type: HITL
labels: [needs-triage]
status: open
blocked-by: []
---

## Parent

`.docs/PRD.md` — Blone: a frictionless second brain

## What to build

The user produces and approves the visual design in Claude Design, using `.docs/design.md` as the brief: the seven listed artboards (feed default, feed searching, palette open, tag editor open, empty state, settings, detail expanded) at 1440×900, populated with real-feeling content. Any deviations discovered while designing (token changes, component adjustments) are folded back into `design.md` so the file remains the single source of truth for the UI slices.

HITL by nature — this is the user's own design exploration. It soft-gates the UI slices (004–007, 009): they build from approved artboards when these exist, or directly from `design.md` if this issue is skipped.

## Acceptance criteria

- [ ] All seven artboards from `design.md` §10 exist in Claude Design
- [ ] Mock content is realistic (actual tweet-length text, real product names and domains), not lorem ipsum
- [ ] Any design decisions that diverge from `design.md` are written back into `design.md`
- [ ] User declares the direction approved (or explicitly skips, unblocking UI slices to build from `design.md` as-is)

## Blocked by

None — can start immediately (runs in parallel with everything).
