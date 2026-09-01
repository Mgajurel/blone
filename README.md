# blone

A frictionless, self-hosted second brain: `⌘⌥S` in the browser silently captures pages and selections; a local model categorizes them; everything is full-text searchable. Karakeep + Meilisearch + a headless-Chrome crawler under a custom keyboard-first UI, with all inference on local Ollama — nothing leaves the machine.

Docs: product spec `.docs/PRD.md` · design system `.docs/design.md` · issues `.docs/issues/`.

## Quickstart

Prereqs: [Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/) (or OrbStack) and [Ollama](https://ollama.com/download) on the host.

```sh
# 1. secrets
cp .env.example .env            # then fill both secrets: openssl rand -base64 36

# 2. the tagging model (~5 GB, one time)
ollama pull qwen3:8b

# 3. the stack (Karakeep + Meilisearch + crawler Chrome)
docker compose up -d

# 4. first run
open http://localhost:3000      # sign up (one account — it's yours)
```

After signing up, uncomment `DISABLE_SIGNUPS=true` in `.env` and `docker compose up -d` again — single-user hardening.

## The capture hotkey

1. Install the [Karakeep extension](https://chromewebstore.google.com/detail/karakeep/kgcjekpmcjjogibpjebkhaanilehneje) and point it at `http://localhost:3000`, signing in with your account.
2. Open `chrome://extensions/shortcuts`, find Karakeep's save action, and bind **⌘⌥S**.
3. On any page: press `⌘⌥S` and move on. The pipeline crawls it, extracts its text, and Ollama tags + summarizes it in the background.

Tweet-saving contract (v0, stock extension): save from the tweet's **permalink** page. The custom selection-aware extension is issue 008.

## Verify the round trip

Save a real article, give the pipeline ~a minute, then in the Karakeep UI check the save has: title + description, AI tags, a one-line summary — and that searching a phrase from the article **body** (not its title) finds it. That's extracted-text search working end-to-end.

## Tagging pipeline

Type assignment is layered (precedence: manual > rule > ai). One-time setup in the Karakeep UI:

1. **Custom prompt** — paste the block from `config/tagging-prompt.md` into *Settings → AI Settings → Prompt Customization*. It makes the model emit exactly one `type/` tag (closed set) plus 2–5 lowercase topic tags.
2. **Type rules** — mirror `config/type-rules.json` in *Settings → Rule Engine*: for each string below, a rule *when a bookmark is added, if URL contains `<string>`, then attach tag* (combine per type with OR conditions if your Karakeep version supports condition groups):

   | URL contains | attach tag |
   |---|---|
   | `//x.com/` · `//twitter.com/` · `//mobile.twitter.com/` | `type/tweet` |
   | `//www.youtube.com/` · `//youtube.com/` · `//youtu.be/` · `//vimeo.com/` | `type/video` |
   | `//news.ycombinator.com/` | `type/article` |

   `config/type-rules.json` is canonical — when you add a rule there, add it in the UI too.
3. **API key** — create one in *Settings → API Keys* and put it in `.env` as `KARAKEEP_API_KEY=` (scripts and the future UI use it).

Then judge quality with the smoke test (~20 real URLs through the live pipeline, report lands in `.docs/reports/003-smoke-report.md`):

```sh
node scripts/smoke-test.mjs
```

## Configuration

Archival policy per the PRD — extracted text stored, pixels off — is explicit in `docker-compose.yml` (`CRAWLER_STORE_SCREENSHOT`, `CRAWLER_FULL_PAGE_ARCHIVE`, …). Flip those to opt in to offline snapshots. Model, context length, and timeouts live there too; the model is also overridable via `INFERENCE_TEXT_MODEL` in `.env`.

**Cloud escape hatch** (documented, not default): if local tagging quality disappoints after prompt/model tuning, point Karakeep at a cloud model instead — set `OPENAI_API_KEY` (plus `OPENAI_BASE_URL` for any OpenAI-compatible endpoint, e.g. Anthropic's) and `INFERENCE_TEXT_MODEL` in `.env`, remove `OLLAMA_BASE_URL` from the compose environment, `docker compose up -d`. Config change only; nothing else moves.

## Backup

Everything lives in two Docker volumes (`data` = SQLite + assets, `meilisearch` = rebuildable index). Backup is one tarball of the data volume:

```sh
docker compose stop web
docker run --rm -v blone_data:/data -v "$PWD":/backup alpine tar czf /backup/blone-backup.tgz -C /data .
docker compose start web
```

The search index rebuilds from Karakeep if lost; the `data` volume is the brain.
