---
id: 006
title: Curation slice — tag editor, type precedence, archive/open/delete, detail view
type: AFK
labels: [needs-triage]
status: open
blocked-by: [004]
---

## Parent

`.docs/PRD.md` — Blone: a frictionless second brain

## What to build

The one-keystroke correction loop the taxonomy depends on. On the selected card: `t` opens the inline tag editor (cyclable type row + editable tag chips, `enter` commits, `esc` cancels), `e` archives (read-state), `o` opens the source URL, `enter` expands the in-place detail view per `design.md`, and delete requires a danger-voiced confirm. karakeep-client grows its mutation surface (update tags, set type, toggle archive, delete). Type-precedence resolution (manual > rule-derived > model-guessed, using tag provenance) ships as pure, vitest-covered logic — the UI always displays exactly one winning type and offers fixup when it detects conflicting `type/` tags.

## Acceptance criteria

- [ ] `t` edits type and tags on the selected card; changes persist through the API and survive reload
- [ ] Precedence logic is pure and unit-tested: rule + AI conflict → rule wins; manual choice beats both and sticks; multiple `type/` tags surface a fixup affordance
- [ ] `e` archives: the save leaves the default feed and remains findable via `is:archived`
- [ ] `o` opens the source URL in a new tab
- [ ] Delete asks a `danger`-styled lowercase confirm before removing the save
- [ ] `enter` expands the detail view in place (full title, body/extracted-text preview, full tag set, action-row kbd hints); `enter`/`esc` collapse; `j`/`k` collapse and move
- [ ] All mutations go through karakeep-client; every action matches the `design.md` keyboard map

## Blocked by

- `004-feed-skeleton-ui.md`
