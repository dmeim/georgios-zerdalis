# Retro-pop restyle — implementation plan

**Date:** 2026-07-20  
**Spec:** `docs/superpowers/specs/2026-07-20-retro-pop-restyle-design.md`  
**Approach:** A — cream room, green furniture, scarce orange

## Locked decisions (implementation)

| Role | Hex |
|------|-----|
| Primary (green) | `#467066` |
| Secondary (orange) | `#c24427` |
| Ground (cream) | `#f3efe8` |
| Ground elevated | `#ebe5db` |
| Ink | `#1a1f1c` |
| Ink muted | `#5c6862` |
| Ink on primary / secondary | `#f3efe8` |
| Chrome (silver rules) | `#c8cbc9` |
| Soft green (accent-soft / secondary UI) | `#6a8a80` |

- `--color-accent` → alias of `--color-secondary` (action / focus)
- Decorative former-accent usages → `--color-primary` (density rule)
- `--radius` → `0.85rem` (bubbly UI); keep `--he-frame-radius: 1.15rem`
- `:root` = light tokens; dark under `[data-theme="dark"]` only (cheap compatibility)
- FOUC catch / missing theme → `light`
- Tambour: **deferred** (skip unless green bands need it later)

## Tasks

### 1. Global tokens & shared chrome
- [x] Retoken `:root` to light retro-pop; move concert-hall dark to `[data-theme="dark"]`
- [x] Add `--color-primary`, `--color-secondary`, `--color-ink-on-primary`, `--color-ink-on-secondary`, `--color-chrome`
- [x] Alias `--color-accent` → secondary; retarget `--color-accent-soft` / `--color-spot` away from gold
- [x] Bump `--radius` toward bubbly; preserve `--he-frame-radius` / `--he-frame-shadow`
- [x] Header/footer → green mass + cream type (light); cheap dark override
- [x] Buttons: primary = orange fill; ghost/secondary = green outline/soft fill
- [x] Focus / selection → secondary; `.eyebrow` → primary
- [x] Body atmosphere: warm cream gradients (soft green spot, no champagne)

### 2. Theme default nudge
- [x] `BaseLayout.astro` FOUC catch → `light` (not `dark`)
- [x] Confirm `theme-toggle.ts` still resolves system correctly (no logic rewrite unless needed)

### 3. Home experience
- [x] `HomeExperience.css`: eyebrows/rules/links → primary; CTAs/focus/active → secondary
- [x] Replace hard-coded champagne scroll-line gold (`rgba(212, 188, 138, …)`)
- [x] Ensure desktop cream hero + soft frames unchanged structurally
- [x] Primary button label uses ink-on-secondary (readable on orange)

### 4. Gallery / lightbox / page intro
- [x] `PageIntro.css` eyebrow → primary
- [x] `GalleryMasonry.css` focus ring → secondary (via accent or explicit)
- [x] `PhotoLightbox.css`: cream chrome; controls green hover; orange focus/active
- [x] `gallery.astro` accent usages: decorative → primary; active indicator → secondary

### 5. Connect + leftover home/pages
- [x] Connect form: green structure, orange submit; remove gold paths
- [x] ConnectInfo / Quote / Bio / Chapter / Pedagogy / Endorsement / Appointments / CloseCta / Hero / 404: retarget accents
- [x] Fix hard-coded gold hover in `Hero.astro` (`#c4a06a`) if still present

### 6. Sweep & verify
- [x] Grep: no light-mode brand use of `#d4bc8a` / `#8a7349` / champagne gold
- [x] `npm run build` passes
- [x] Sanity-read CSS for cream ground, green header/footer, orange CTAs, soft frames
- [x] **Do not commit or push**
