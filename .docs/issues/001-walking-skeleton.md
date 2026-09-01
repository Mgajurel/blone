---
id: 001
title: Walking skeleton — hotkey save to tagged + searchable
type: HITL
labels: [needs-triage]
status: in-progress
blocked-by: []
---

## Parent

`.docs/PRD.md` — Blone: a frictionless second brain

## What to build

Stand up the entire reused pipeline so that one real capture travels end-to-end: pressing `cmd+opt+s` on a page in the browser produces a bookmark in Karakeep that is crawled, text-extracted, AI-tagged by local Ollama, and findable by a phrase from its body — all verified through Karakeep's **stock** web UI (no custom UI yet). Deliverables: the docker-compose stack (Karakeep + Meilisearch + headless Chrome) with offline snapshots disabled, Ollama wired into Karakeep's inference config, the stock browser extension installed and bound to the hotkey, and a quickstart README.

HITL because the human must install Ollama, install the extension, bind the hotkey in the browser, and eyeball the round trip.

## Acceptance criteria

- [ ] `docker compose up` from a clean checkout brings up Karakeep, Meilisearch, and the crawler with no manual fixes
- [ ] Offline snapshots (full-page archive, screenshots) are disabled via deployment config, per the PRD default
- [ ] Karakeep's inference points at local Ollama; the model name is configuration, not hardcoded
- [ ] Pressing `cmd+opt+s` on a real page silently saves it; title, description, favicon, and extracted text appear on the bookmark
- [ ] AI tags and a one-line summary appear on the save within ~a minute (stock prompt is fine for this slice)
- [ ] Searching a phrase from the page **body** (not the title) in the stock UI finds the save
- [ ] Quickstart README covers: compose up, Ollama install + model pull, extension install + hotkey binding, and backup (copy the SQLite DB + assets dir)

## Blocked by

None — can start immediately.
