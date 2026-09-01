---
id: 007
title: Command palette — command-engine, cmdk overlay, new note, settings
type: AFK
labels: [needs-triage]
status: open
blocked-by: [004, 006]
---

## Parent

`.docs/PRD.md` — Blone: a frictionless second brain

## What to build

Every action becomes reachable by typing. The **command-engine** grows from keymap seed to full action registry (navigation, curation actions from 006, filters, new note, settings) with vitest coverage of dispatch rules. `cmd+k` opens the cmdk overlay styled per `design.md`: actions with kbd hints, type-filter entries that scope the feed, then matching saves. The **new note** palette action covers free-floating thoughts (PRD story 5): type text → `enter` → a text note lands in the feed via karakeep-client. The settings pane (palette-launched, definition-list style) displays pipeline configuration — offline snapshot and screenshot state, model name, tagging prompt preview — toggling what the API permits and documenting the env flip for what it doesn't.

## Acceptance criteria

- [ ] command-engine registry is declarative and vitest-covered: key → action dispatch, modifier handling, suppression while any input is focused
- [ ] `cmd+k` opens the palette per `design.md` (560px, 140ms, sections: actions / filters / results); `esc` closes
- [ ] Palette actions execute the real curation actions (archive, open source, tag editor) on the selected save
- [ ] Type-filter entries (`type:design` …) scope the feed and show in the status line
- [ ] Selecting a matching save from the palette jumps the feed selection to it
- [ ] New note: text entered in the palette becomes a visible note card in the feed
- [ ] Settings pane shows current pipeline config; each item either toggles live or links the documented config change

## Blocked by

- `004-feed-skeleton-ui.md`
- `006-curation-slice.md`
