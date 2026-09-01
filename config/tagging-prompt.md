# Custom tagging prompt (issue 003)

Paste the block below into Karakeep: **Settings → AI Settings → Prompt Customization** (tagging prompt). It is appended to Karakeep's built-in tagging instructions and enforces the PRD taxonomy: one `type/` guess + 2–5 topic tags.

---

```
Additional strict tagging rules:

1. Include EXACTLY ONE type tag from this closed list (with the "type/" prefix):
   - type/tweet    — a tweet / X post
   - type/video    — a video page
   - type/product  — a page presenting or selling a product, app, tool, or service
   - type/design   — visual design work, inspiration, showcase, or design resource
   - type/article  — essay, blog post, news, documentation, or discussion thread
   - type/link     — only when none of the above fits
   Never more than one type tag. Never invent new type/ values.

2. Besides the type tag, emit 2 to 5 topic tags describing the subject matter:
   lowercase, hyphenate multi-word tags (e.g. typography, self-hosting, pricing-page).

3. No other tags. No generic filler tags such as "web", "internet", "interesting", "misc".
```

---

Notes:

- Deterministic domains (x.com, youtube, HN — see `type-rules.json`) also get their type from the rule engine; the model's guess matters for everything else. When both exist, display precedence is manual > rule > ai (resolved by the UI, issue 006).
- If the model keeps violating the closed list, the escape hatch is a config flip to a cloud model (see README → Configuration); tune here first.
