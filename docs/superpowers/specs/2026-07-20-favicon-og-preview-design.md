# Favicon + iOS Messages preview image

**Date:** 2026-07-20  
**Status:** Approved — implementing  
**Scope:** Use `public/images/George-Zerdalis-Hero.JPG` for site favicon and Open Graph / iMessage link preview

## Goal

Replace the SVG “GZ” mark with a photo-based favicon, and add social/link-preview metadata so iOS Messages (and other clients) show George’s portrait when a URL is shared.

## Decisions

- **Favicon crop:** Wider head-and-shoulders (not tight face-only)
- **Preview crop:** Landscape Open Graph ~1200×630, face centered
- **Approach:** Static derived assets in `public/` (not build-time pipeline; not raw 14MB hero)

## Assets

| Role | Path | Spec |
|------|------|------|
| Favicon | `public/favicon.png` | Square head-and-shoulders PNG (multi-size via 32 + 180) |
| Apple touch | `public/apple-touch-icon.png` | 180×180 head-and-shoulders |
| OG / iMessage | `public/images/og-image.jpg` | 1200×630 JPEG, face-centered landscape |

Source remains the hero JPG for on-page use; derivatives are for icon/share only.

## Layout changes

In `BaseLayout.astro`:

- `link rel="icon"` → PNG favicon (remove SVG)
- `link rel="apple-touch-icon"`
- Open Graph + Twitter Card meta (`og:image`, `og:title`, `og:description`, `twitter:card`, `twitter:image`)
- Absolute image URL via `PUBLIC_SITE_URL` or Astro `site`

## Out of scope

- Regenerating crops automatically when the hero photo changes
- Dark/light favicon variants
- Per-page OG images
