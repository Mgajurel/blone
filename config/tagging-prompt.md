# Custom tagging prompts (issue 003)

Live in Karakeep under **Settings → AI Settings → Tagging Rules** as TWO entries (Karakeep caps each custom prompt at 500 characters), both scoped to **All Tagging** so they apply to text and image tagging alike. This file is the canonical copy — if you edit a prompt in the UI, mirror it here.

## Entry 1 — the type axis

```
Include EXACTLY ONE type tag from this closed list (with the type/ prefix): type/tweet (tweet or X post), type/video (video page), type/product (page presenting or selling a product, app, tool, or service), type/design (visual design work, inspiration, showcase, or design resource), type/article (essay, blog post, news, documentation, or discussion thread), type/link (only when none of the above fits). Never more than one type tag; never invent new type/ values.
```

## Entry 2 — the topic axis

```
Besides the single type tag, emit 2 to 5 topic tags describing the subject matter. No other tags. No generic filler tags such as web, internet, interesting, or misc.
```

## Related settings (also live, configured 2026-09-03)

- **Tag Style = "Lowercase with hyphens"** (Settings → AI Settings) — Karakeep appends the lowercase-hyphen instruction to the base prompt natively, so the custom prompts don't restate it.
- **Auto-tagging: on · Auto-summarization: on.**
- **Curated Tags: deliberately EMPTY** — it would restrict tagging to a fixed list and kill the freeform topic axis. Do not populate it.
- The six `type/*` tags exist as real Karakeep tags (created via API) because rule actions and the tag picker can only reference existing tags.

## Notes

- Deterministic domains (x.com, youtube, HN — see `type-rules.json`) also get their type from the rule engine; the model's guess matters for everything else. When both exist, display precedence is manual > rule > ai (resolved by the UI, issue 006).
- If the model keeps violating the closed list, tune these entries first, try `llama3.1:8b` second; the cloud escape hatch (README → Configuration) is the documented last resort.
