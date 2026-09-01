---
id: 008
title: Custom capture extension — selection-aware save
type: AFK
labels: [needs-triage]
status: open
blocked-by: [001]
---

## Parent

`.docs/PRD.md` — Blone: a frictionless second brain

## What to build

Replace the stock extension binding with the capture semantics the product actually wants: `cmd+opt+s` with text selected saves the selection as a text note carrying its source URL and title; with nothing selected it saves the page as a bookmark. A minimal MV3 extension wraps the **capture-logic** pure module (selection/url/title → save payload), posts to the Karakeep API, and confirms with a terse toast (`✓ saved` / `✗ save failed — kept url`). On API failure the capture is not lost silently. This is the canonical tweet-preservation path per the PRD: select the tweet text, hit the key.

Code and unit tests are AFK; the final load-unpacked + rebind step belongs to the user and is documented.

## Acceptance criteria

- [ ] capture-logic is pure and vitest-covered: selection → text-note payload with source URL + title; no selection → page-bookmark payload; whitespace-only selection counts as none; missing title falls back to the URL
- [ ] With text selected on a page, the hotkey produces a text note in the feed showing the passage and its source
- [ ] With no selection, the hotkey produces a normal page save (identical outcome to slice 001's flow)
- [ ] Toast feedback matches the `design.md` voice; failures are visible, never silent
- [ ] Extension calls the API through shared capture/client code — no duplicated request logic
- [ ] README documents load-unpacked install, hotkey binding, and unbinding the stock extension

## Blocked by

- `001-walking-skeleton.md`
