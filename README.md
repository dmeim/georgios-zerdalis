# Georgios Zerdalis

Portfolio site for [Georgios Zerdalis](https://github.com/dmeim/georgios-zerdalis) — DMA candidate at the University of Miami Frost School of Music; timpanist, percussionist, and educator.

**Production:** https://georgios-zerdalis.dimitri-meimaridis.workers.dev

## Stack

- [Astro 7](https://astro.build) with `output: 'static'` and TypeScript
- React islands + [Framer Motion](https://www.framer.com/motion/) for scroll/entrance choreography
- Cloudflare Workers Static Assets (Wrangler) — **not** Cloudflare Pages, **not** `@astrojs/cloudflare`
- Design system: “Midnight Concert Hall” (Syne / Instrument Serif / Manrope, champagne + steel accents)
- Icons via [`@lucide/astro`](https://lucide.dev)
- Node.js ≥ 22
- Contact form scaffolds to `PUBLIC_N8N_WEBHOOK_URL` (n8n webhook; optional until connected)

Worker name in `wrangler.jsonc`: `georgios-zerdalis` (serves `./dist`, `not_found_handling: "404-page"`).

## Routes

| Path | Page |
| --- | --- |
| `/` | One-scroll home |
| `/gallery` | Media gallery |
| `/contact` | Contact info + form |

## Content

- Site copy, email, Instagram, appointments, etc.: `src/content/site.ts`
- Gallery items: `src/content/gallery.json`

## Local development

```bash
# Node ≥ 22
npm install
npm run dev      # local Astro dev server
npm run build    # output → dist/
npm run preview  # preview the production build locally
```

## Production deploy

Deploys the static build to the production Worker `georgios-zerdalis`:

```bash
npm run deploy
# equivalent: astro build && wrangler deploy
```

Production URL: https://georgios-zerdalis.dimitri-meimaridis.workers.dev

Do **not** use the production Worker name for experiments unless you intend to overwrite that deploy.

## Experiment deploys (separate workers.dev URL)

Use a different Worker `--name` so production stays untouched. Each name gets its own `*.workers.dev` URL.

### Option A — different Worker name (quick)

Good for a branch or worktree when you only need a live preview:

```bash
npm run build
npx wrangler deploy --name georgios-zerdalis-exp-<label>
```

This creates/updates a separate Worker (e.g. `georgios-zerdalis-exp-nav`) and a separate workers.dev URL. The production Worker `georgios-zerdalis` is left alone.

### Option B — git worktree + separate deploy

Explore without disturbing your main working tree. Worktrees share the same git repo/history; the **separate Cloudflare Worker name** is what isolates the live preview URL.

```bash
git worktree add ../geozerd-exp-<label> -b exp/<label>
cd ../geozerd-exp-<label>
npm install
npm run build
npx wrangler deploy --name georgios-zerdalis-exp-<label>
```

### Option C — temporary preview (no Cloudflare login)

If Wrangler is not authenticated:

```bash
npm run build
npx wrangler deploy --temporary --name georgios-zerdalis-exp-<label>
```

You get a live `*.workers.dev` URL plus a claim link (valid ~60 minutes). Production is never touched.

### Wrangler environments

`wrangler.jsonc` currently has a single default config (no named `[env.*]` blocks). Prefer `--name` overrides for experiment targets. If you add Wrangler `--env` configs later, document them here then.

### Clean up experiment Workers

When finished:

```bash
npx wrangler delete --name georgios-zerdalis-exp-<label>
```

Or delete the Worker from the Cloudflare dashboard.

## Environment

Copy `.env.example` as needed for local/public env:

| Variable | Purpose |
| --- | --- |
| `PUBLIC_SITE_URL` | Optional absolute site URL (links / SEO) |
| `PUBLIC_N8N_WEBHOOK_URL` | Contact form POST target (`name`, `email`, `subject`, `message`). If unset, the form validates but shows “not connected yet”. |

Contact email, Instagram, and other site content live in `src/content/site.ts`, not in env.
