# Blone — Design System

The design language for Blone's UI: a keyboard-first, terminal-flavored capture feed. This file is the source of truth for visual decisions and is written to be dropped into Claude Design as the design brief for every screen.

## 1. Direction

**One line:** a terminal that remembers.

Blone should feel like part of an Omarchy rig — a tiling-WM, waybar, TUI world — not like a SaaS dashboard. Everything monospace, everything flat, everything reachable by keyboard, information-dense without being cramped. The UI is furniture: quiet, sharp, and instantly legible; the user's captured material is the only thing with color and voice.

**Anti-goals:** no hero sections, no marketing whitespace, no rounded-blob cards, no gradients, no illustration, no skeleton shimmer, no hover-lift shadows, no sentence-case buttons with exclamation points.

## 2. Principles

1. **Keyboard is the primary input.** Every action has a key; the mouse is a courtesy. Key hints are visible in-situ (status line, palette rows), never hidden in tooltips.
2. **Density over whitespace.** More items on screen beats more padding. Compression comes from small type and tight line-height, not truncation.
3. **Flat and sharp.** 1px borders, near-square corners, no elevation except the palette overlay. Depth is expressed with background layers, not shadows.
4. **One hue per meaning.** Each content *type* owns a color, used consistently everywhere that type appears. Accent blue means "selected/focused" and nothing else.
5. **Motion is acknowledgment, not decoration.** Feedback animations are ≤160ms; navigation (j/k selection) moves instantly with zero animation, like a TUI cursor.

## 3. Color tokens

One theme in v0: dark, Tokyo Night–flavored. (Light mode is out of scope; do not design for it.)

### Surfaces

| Token | Hex | Use |
|---|---|---|
| `bg/base` | `#1a1b26` | App background |
| `bg/sunken` | `#16161e` | Search bar well, status line, code/quote blocks |
| `bg/raised` | `#24283b` | Selected card, palette panel, popovers, chips on hover |
| `border/subtle` | `#292e42` | Card separators, input borders |
| `border/strong` | `#3b4261` | Focused input border, palette panel border |

### Text

| Token | Hex | Use |
|---|---|---|
| `fg/primary` | `#c0caf5` | Titles, body |
| `fg/secondary` | `#a9b1d6` | Summaries, note text |
| `fg/muted` | `#565f89` | Metadata (domain, age), placeholders, key hints, empty-state copy |

### Semantic

| Token | Hex | Use |
|---|---|---|
| `accent` | `#7aa2f7` | Selection bar, focused elements, links, active filter, primary action |
| `success` | `#9ece6a` | Save-confirmed toast tick |
| `warn` | `#e0af68` | Degraded states (crawl failed, under-enriched item) |
| `danger` | `#f7768e` | Delete, destructive confirm |

### Type colors (one hue per content type)

| Type | Hex | Sample |
|---|---|---|
| `tweet` | `#7dcfff` | cyan |
| `article` | `#7aa2f7` | blue |
| `product` | `#9ece6a` | green |
| `design` | `#bb9af7` | magenta |
| `video` | `#ff9e64` | orange |
| `link` | `#565f89` | muted (the undistinguished default) |

Type badge rendering: colored text + same hue at ~12% opacity as background, 1px border at ~25% opacity. Never solid-filled badges.

## 4. Typography

**One family everywhere:** JetBrains Mono. Fallback stack: `"JetBrains Mono", "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace`. No second typeface, no italics.

| Role | Size / line-height | Weight |
|---|---|---|
| Palette input | 16 / 24 | 400 |
| Search input | 14 / 20 | 400 |
| Card title | 14 / 20 | 500 |
| Body / summary / note text | 13 / 20 | 400 |
| Tags, metadata, buttons | 12 / 16 | 400 |
| Status line, key hints, badge labels | 11 / 16 | 400 |

All UI copy is lowercase (see Voice). Numbers and dates render in the same mono — alignment comes free; lean on it for the age column.

## 5. Spacing, layout, shape

- **Grid:** 4px base. Standard steps: 4, 8, 12, 16, 24.
- **App layout:** single centered column, max-width **760px**; `bg/base` full-bleed behind it.
  - Top: search bar, 44px tall, sticky.
  - Middle: the feed, edge-to-edge cards separated by 1px `border/subtle` lines (no gaps, no floating cards — a continuous list, like a mail client).
  - Bottom: status line, 28px, sticky, `bg/sunken`.
- **Card padding:** 12px vertical, 16px horizontal. Rows within a card: 4px apart.
- **Corner radius:** 4px on inputs, chips, badges, palette panel. 0 on cards (they're list rows).
- **Borders:** 1px always. **Shadows:** none, except the palette overlay: `0 8px 32px rgba(0,0,0,0.5)` over a 40% black backdrop.

## 6. Components

### Search bar (always visible, top)
`bg/sunken` well, 1px `border/subtle` (focus: `border/strong` + `accent` caret). Left: a `❯` prompt glyph in `fg/muted`. Placeholder: `search — try #tag, type:design, after:2026-01-01`. Right edge: `/` key hint chip when unfocused. Results filter the feed live as the user types; no separate results page.

### Feed card (the core object)
A list row, three lines:
1. **Title line:** type badge (lowercase, e.g. `design`) · title in `fg/primary` 500 · age right-aligned in `fg/muted` (`2h`, `3d`, `jan 12`).
2. **Summary line:** one line, `fg/secondary`, ellipsized. For text notes: the note's first line, prefixed with a `“` in the type color.
3. **Meta line:** favicon (12px, grayscale until row is selected/hovered) · domain in `fg/muted` · topic tags as `#chips`.

**States:**
- *Default:* transparent background.
- *Hover:* `bg/raised` at 50%.
- *Selected (j/k cursor):* `bg/raised` + 2px `accent` bar flush left. Exactly one row is ever selected; movement is instant.
- *Under-enriched (crawl failed):* `warn`-colored dot before the domain + `fetch failed — text not indexed` in `fg/muted` on the meta line.
- *Archived (in `is:archived` views):* title in `fg/muted`, badge desaturated.

### Type badge
11px lowercase label in the type's hue, tinted background (12%), 1px border (25%), 4px radius, 2px 6px padding. Clicking (or the palette filter) scopes the feed to that type.

### Tag chip
`#tag` in `fg/muted`, 12px; hover/selected: `bg/raised` + `fg/secondary`. In the tag editor, chips gain a trailing `×`.

### Command palette (`cmd+k`)
Centered overlay, 560px wide, top at ~20% viewport. `bg/raised` panel, `border/strong`, 4px radius, the one permitted shadow. Input row (16px type, `❯` prompt) above a result list: rows of action name (left, `fg/primary`) + key hint (right, `fg/muted` in a bordered kbd chip). Selected row: same left-accent-bar treatment as feed cards. Sections: actions (`new note`, `archive`, `open source`, `settings`), filters (`type:design` …), then matching saves. Opens/closes in 140ms fade + 2px rise; no bounce.

### Tag editor (inline, on `t`)
A small `bg/raised` popover anchored to the selected card: current type as a cyclable segmented row of type badges, then editable tag chips + a bare text input for new tags. `esc` closes, `enter` commits. No save button.

### Detail view (`enter` on selected card)
The selected row expands **in place** — no route change, no modal, mail-client style. The expanded row keeps its left `accent` bar, switches to `bg/raised`, and reveals below the normal three lines: the full title (wrapping), the note body or extracted-text preview (13px `fg/secondary`, max-height ~60vh, internally scrollable), the complete tag set as chips, and an action row of kbd hints (`o open · t tag · e archive · d delete`). `enter` or `esc` collapses; `j`/`k` collapses and moves. Only one row is ever expanded.

### Status line (bottom, waybar-flavored)
28px, `bg/sunken`, 11px `fg/muted`, three zones:
- left: `142 saves · 12 today`
- center: active scope, if any: `type:design · #typography` in `accent`
- right: key hints: `j/k move · enter open · t tag · e archive · ⌘k palette`

### Toast
Bottom-right, `bg/raised`, 1px border, 12px mono, terse: `✓ saved` / `✗ fetch failed — kept url`. 160ms in, auto-dismiss 2.5s. Never stacks more than two.

### Empty state
Centered in the feed area, `fg/muted`, small ascii-flavored mark (e.g. `[ ]`), then: `nothing here yet` and `press ⌘⌥s on any page to start` with the shortcut rendered as kbd chips.

### Settings panel
A palette-launched pane, not a route: plain definition list (label left, value/control right) for pipeline config — offline snapshots toggle (or documented env flip), screenshot toggle, model name, tagging prompt (read-only preview). Same 13px mono, no section cards.

## 7. Keyboard map (design for its visibility)

| Key | Action |
|---|---|
| `⌘⌥s` | capture (in browser, global) |
| `/` | focus search |
| `⌘k` | command palette |
| `j` / `k` | move selection down / up |
| `enter` | open detail |
| `o` | open source url |
| `t` | tag editor (type + tags) |
| `e` | archive (read-state) |
| `esc` | close overlay / clear search |

Render key hints as bordered kbd chips: 11px, `fg/muted`, 1px `border/subtle`, 3px radius.

## 8. Voice

Lowercase, terse, mechanical-friendly. `saved`, `3 results`, `no matches — try fewer words`, `fetch failed — kept url`. No exclamation points, no "oops", no first person. The interface never celebrates; it confirms.

## 9. Motion

| Event | Spec |
|---|---|
| Selection move (j/k) | none — instant |
| Palette open/close | 140ms ease-out, fade + 2px rise |
| Toast in/out | 160ms ease-out |
| Hover states | 100ms background-color only |
| Feed updates (new save appears) | 120ms fade-in, no slide |

Nothing else animates.

## 10. Using this file in Claude Design

Design at **1440×900 desktop**. Suggested artboards, in order:

1. **feed — default:** populated feed (~8 mixed-type cards), one selected row, status line showing counts.
2. **feed — searching:** query with qualifiers in the bar (`type:design #typography`), filtered results, active scope in the status line.
3. **palette open:** overlay over a dimmed feed, mixed actions/filters/results with key hints.
4. **tag editor open:** selected card with the popover, type row + chips.
5. **empty state:** first-run.
6. **settings:** the definition-list pane.
7. **detail expanded:** feed with one card expanded in place — note body, full tag set, action-row kbd hints.

Populate mocks with real-feeling content (actual tweet-length text, real product names, real domains) — lorem ipsum hides density problems this system is designed to surface.
