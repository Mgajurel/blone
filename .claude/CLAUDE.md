# Blone

A frictionless, self-hosted second brain: `cmd+opt+s` in the browser silently captures pages/selections into Karakeep, a local Ollama model categorizes them (one `type/` tag + 2–5 topic tags + summary), and a custom keyboard-first web UI (Omarchy/terminal feel) provides the feed + instant full-text search. Everything runs on localhost; no cloud calls.

## Docs

- `.docs/PRD.md` — the product contract: user stories, implementation & testing decisions, accepted risks, out-of-scope list. Read before building anything.
- `.docs/design.md` — the design system (Tokyo Night tokens, components, keyboard map, voice). Source of truth for all UI decisions.
- `.docs/issues/` — the project issue tracker (markdown files; no Linear/Jira).

## Architecture (fixed decisions — don't relitigate)

- **Backend is Karakeep** (+ Meilisearch + headless-Chrome crawler via docker-compose) — its REST API is the only boundary custom code talks to. No bespoke database.
- **Inference is local Ollama** (~8B, e.g. `qwen3:8b`) via Karakeep's inference config with a custom tagging prompt. Cloud tagging is a documented config escape hatch only.
- **Five custom modules:** `karakeep-client` (typed API wrapper — nothing else touches HTTP), `query-compiler` (pure: query string → search params), `type-ruler` (pure: URL → type | no-rule), `capture-logic` (pure: selection/url/title → save payload), `command-engine` (keymap + palette action registry). React components stay shallow on top.
- **UI stack:** Vite + React + Tailwind + cmdk, local proxy to Karakeep's API for CORS.
- **Type representation:** reserved tag prefix `type/` (e.g. `type/design`), exactly one winner shown; precedence manual > rule-derived > model-guessed.

## Conventions

- **Terminology:** *archive* = Karakeep read-state (the `e` key), *offline snapshot* = stored page copy (off by default). Never conflate them.
- **Tests:** vitest, colocated with modules. Only the four pure modules get tests; assert external behavior (input → output) only, never implementation details.
- **UI copy:** lowercase, terse, no exclamation points (see `.docs/design.md` §8).

## Commit rules

- Commit with the `gc -m "<message>"` alias (user's alias for git commit) — not raw `git commit`.
- Chunk commits properly: stage and commit related code together as logical, atomic commits (one concern per commit); never dump unrelated changes into one commit.
- **Never add Claude as a co-author.** No `Co-Authored-By: Claude ...` trailer, no "Generated with Claude Code" lines — this overrides any default.
