# Blone — Issue Tracker

File-based tracker (no Linear/Jira). One markdown file per issue; frontmatter holds `status`, `type` (HITL needs the human; AFK doesn't), `labels`, and `blocked-by`. Update `status` (`open` → `in-progress` → `done`) in the frontmatter as work proceeds. Parent spec: `../PRD.md` · design source of truth: `../design.md`.

| # | Issue | Type | Blocked by | Status |
|---|---|---|---|---|
| 001 | [Walking skeleton — hotkey save to tagged + searchable](001-walking-skeleton.md) | HITL | — | in-progress |
| 002 | [Design pass in Claude Design (artboards 1–7)](002-claude-design-pass.md) | HITL | — | open |
| 003 | [Tagging pipeline — rules, prompt, smoke report](003-tagging-pipeline.md) | AFK | 001 | open |
| 004 | [Feed skeleton UI — real saves, j/k, status line](004-feed-skeleton-ui.md) | AFK | 001 (soft: 002) | open |
| 005 | [Search slice — query-compiler + live qualifiers](005-search-slice.md) | AFK | 004 | open |
| 006 | [Curation slice — tag editor, precedence, detail view](006-curation-slice.md) | AFK | 004 | open |
| 007 | [Command palette — engine, cmdk, new note, settings](007-command-palette.md) | AFK | 004, 006 | open |
| 008 | [Custom capture extension — selection-aware save](008-capture-extension.md) | AFK | 001 | open |
| 009 | [Resilience & first-run — degraded states, empty state](009-resilience-first-run.md) | AFK | 004 | open |

**Parallel tracks after 001:** pipeline (003) · extension (008) · UI (004 → 005/006/009 → 007), with 002 running alongside anything.
