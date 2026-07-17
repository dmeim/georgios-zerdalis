# Georgios Zerdalis

Portfolio site for Georgios Zerdalis — Timpanist & Educator.

## Stack

- [Astro 7](https://astro.build) (static)
- TypeScript, plain CSS
- Cloudflare Workers (assets-only via Wrangler)

## Prerequisites

- Node.js ≥ 22
- npm

## Scripts

```bash
npm install
npm run dev      # local dev server
npm run build    # output → dist/
npm run preview  # preview production build
npm run deploy   # build + wrangler deploy
```

## Project layout

```
src/
  layouts/BaseLayout.astro
  pages/           # routes (404 + content pages)
  styles/global.css
public/            # static assets
wrangler.jsonc     # Cloudflare assets Worker
```

## Deploy

Worker name: `georgios-zerdalis`. Serves `./dist` with `not_found_handling: "404-page"`.
