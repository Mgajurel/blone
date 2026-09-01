---
id: 005
title: Search slice — query-compiler + live qualifier search
type: AFK
labels: [needs-triage]
status: open
blocked-by: [004]
---

## Parent

`.docs/PRD.md` — Blone: a frictionless second brain

## What to build

Make the search bar real: typing filters the feed live via Karakeep/Meilisearch full-text over extracted content, with Hister-style qualifiers passed through. Births the **query-compiler** pure module (palette/search input → Karakeep search parameters) with its vitest suite — the first tested pure module, establishing the colocated-test convention from the PRD. `esc` clears the query and returns the plain feed; the active scope renders in the status line center per `design.md`.

## Acceptance criteria

- [ ] query-compiler is a pure function with vitest coverage: bare terms, `#tag`, `type:x`, `url:`, `after:`/`before:`, `is:archived`, combinations, and malformed qualifiers degrading gracefully to literal text
- [ ] Tests assert input → output only (no mocks, no implementation details)
- [ ] Typing in the search bar filters the feed as-you-type against real data
- [ ] A body-phrase query finds a save whose title doesn't contain the phrase (proves extracted-text search end-to-end)
- [ ] `type:design` and `#tag` qualifiers demonstrably narrow results
- [ ] `esc` clears search and restores the unfiltered feed; selection and `j`/`k` work within results
- [ ] Active scope (e.g. `type:design · #typography`) appears in the status line in `accent`

## Blocked by

- `004-feed-skeleton-ui.md`
