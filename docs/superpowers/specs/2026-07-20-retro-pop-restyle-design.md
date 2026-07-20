# Retro-pop site restyle

**Date:** 2026-07-20  
**Status:** Approved for implementation planning  
**Scope:** Light-mode visual restyle of the existing George Zerdalis site toward the “retro-pop” language from the reference café/retail interiors

## Goal

Restyle the website so it reads as **retro-pop**: warm cream field, deep green as the primary brand mass, scarce international orange as the secondary action color — without rebuilding layout, content, or interaction structure. Light mode is the designed target; dark mode is deferred unless cheap token compatibility falls out naturally.

## Reference language (merged)

Source: two interior photos + Gemini analysis, reconciled into a website-ready brief.

### Keep

- **Green as ground mass** on furniture-scale surfaces (counters, chairs, pedestals)
- **Orange as scarce high-contrast pop** (banner, accent pedestal, action)
- Warm plaster/cream walls; speckled gray terrazzo as support neutral
- Chrome/silver as jewelry (pendants, mesh) — not a fill color
- Soft, curated retail/café mood: playful via color contrast, not cute UI

### Correct / cut from Gemini

- “Sage-toned emerald” → too soft; use the locked green below
- Treating lamp amber and banner vermilion as one orange → split: **hard orange = action**, soft amber = atmosphere only if needed later
- Over-naming (“Industrial Retro-Modern / Scandi-Industrial”) as the brand label → ingredients only; product name is **retro-pop**
- Hard right-angle furniture geometry as a UI mandate → **do not** import sharp corners into the site

### Add

- Color **ratio**: green may repeat; orange should stay ~scarce (roughly one loud orange hit per viewport)
- Site already has a soft/bubbly photo language — preserve it; the room’s rectilinear joinery does not override that

## Chosen approach

**Approach A — Cream room, green furniture**

- Page ground = warm cream (plaster walls)
- Green owns header/footer bands, occasional section anchors, brand mass
- Orange reserved for primary CTAs, focus, active/new
- Photos sit on cream; green may frame or band around them, not tint them

Rejected for this pass:

- **B — Green shell** (green as full page ground): too heavy for a photo-forward portfolio
- **C — Minimal token swap** on the current dark “concert hall” theme: would not read as retro-pop

## Locked colors

| Role | Hex | Notes |
|------|-----|--------|
| Primary | `#467066` | Forest/racing green — brand mass |
| Secondary | `#c24427` | International / poppy orange — action only |

Supporting neutrals (exact hexes may be tuned at implementation, roles are fixed):

| Role | Direction |
|------|-----------|
| Ground | Warm cream (~`#f3efe8`) |
| Ground elevated | Softer cream or light terrazzo-gray |
| Ink | Near-black on cream |
| Ink on primary | Cream / off-white on green |
| Ink muted | Muted green-gray |
| Border | Low-contrast green-gray |
| Chrome | Soft silver — thin rules / highlights only |

## Token mapping (light mode)

Retoken from the current champagne-gold / cool-stage system in `src/styles/global.css` (and consumers).

| New / role | Maps from / replaces | Usage |
|------------|----------------------|--------|
| `--color-primary` | New (or remap former accent mass) | Header, footer, green bands |
| `--color-secondary` | Replaces action role of `--color-accent` for CTAs | Primary buttons, focus, active |
| `--color-ground` | Was cool gray / near-black | Cream page field |
| `--color-ground-elevated` | Elevated surfaces | Panels only where interaction needs them |
| `--color-ink` / `--color-ink-muted` | Existing ink roles | Body / secondary text |
| `--color-ink-on-primary` | New if needed | Text on green |
| `--color-border` | Existing border role | Hairlines |
| `--color-spot` / soft accents | Retarget away from gold | Soft green or neutral wash, not gold |

Implementation may keep old token names temporarily if a clean alias layer is simpler, but **no champagne gold** (`#d4bc8a` / `#8a7349`) should remain as the brand accent in light mode.

## Typography

Keep existing families; retune roles only:

| Role | Font | Use |
|------|------|-----|
| Display | Syne | Name, section titles — geometric, confident on cream or green |
| Body / UI | Manrope | Nav, body, forms, buttons |
| Serif | Instrument Serif | Quotes / endorsement only — sparse |

No new font families this pass.

## Form & rounding

- **Preserve soft, bubbly rounding.** Do not adopt hard right corners from the reference furniture.
- **Keep photo frame radius** as today (`--he-frame-radius`, currently `1.15rem`) and matching shadow language.
- General UI (buttons, inputs, chrome) should stay soft/rounded in the same family as photos. Do not use sharp `--radius: 2px` as a retro mandate; bump shared UI radius toward the bubbly photo language where controls still feel too crisp.
- Cards only where interaction needs a container (forms, lightbox). Prefer open cream field + dividers.
- Optional: very subtle vertical ribbing on large green surfaces — skip if it fights type or photos.
- Chrome = thin silver/gray rules and focus treatment — no glow-as-brand.

## Color application map

| Surface | Treatment |
|---------|-----------|
| Page ground | Warm cream |
| Header / footer | Green mass, cream type; orange only if a primary action lives there |
| Hero | Cream field; strong brand/name; primary CTA orange; secondary quiet green or ink |
| Photo frames | Current soft radius + shadow; on cream |
| Section titles / chapter | Occasional green band or green display type — not every section |
| Body | Cream + ink; muted green-gray secondary text |
| Primary buttons | Orange fill, cream label |
| Secondary buttons | Green outline or soft green fill |
| Focus / active / “new” | Orange |
| Gallery / lightbox | Cream chrome; soft frames kept; green controls, orange active |
| Connect form | Cream field; green structure; orange submit |

**Density rule:** if a viewport has more than one big orange element, remove one. Green may repeat; orange should not.

## Motion

- Keep existing reveal / magnetic / tilt behavior if it still feels calm on cream + green.
- Prefer short fades/slides over glow/sparkle.
- Grain may remain if it reads as plaster/terrazzo, not stage haze.

## Dark mode

- **Out of scope** for a designed dark palette this pass.
- If renaming tokens or splitting primary/secondary makes the existing dark theme less broken for free, do that.
- Dedicated dark retro-pop pass later.

## In scope

- Light-mode restyle to retro-pop (Approach A)
- CSS token and component color updates across `global.css` and hard-coded accent consumers
- Role mapping: green mass, orange action, cream ground
- Preserve layout, content, IA, and component structure
- Preserve soft photo rounding and overall bubbly corner language
- Keep font families; retune roles/weights only

## Out of scope

- Full dark-mode redesign
- New pages, copy rewrites, or information architecture changes
- New font families
- Hard/rectilinear corner system from the room photos
- Literal tambour, hoist, or molten-pendant recreation
- Perfecting every green/orange placement in v1 — owner will tweak after the rewrite

## Likely files

Primary:

- `src/styles/global.css` — tokens, buttons, header/footer, shared chrome
- `src/layouts/BaseLayout.astro` — only if theme/color-scheme defaults need a light-first nudge
- `src/components/react/HomeExperience.css`
- `src/components/react/PageIntro.css`
- `src/components/react/GalleryMasonry.css`
- `src/components/react/PhotoLightbox/PhotoLightbox.css`
- Component-scoped styles in `src/components/home/*`, `src/components/connect/*`, `src/pages/*` that reference accent/ground colors

Do not change photo assets or lightbox interaction behavior unless required for color contrast.

## Acceptance criteria

1. Light mode uses `#467066` as primary and `#c24427` as secondary; champagne gold is gone as brand accent.
2. Default reading experience is cream ground with green furniture-scale chrome and scarce orange CTAs.
3. Photo frames keep the current soft bubbly radius/shadow character.
4. Header and footer read as green brand mass with readable cream (or equivalent) type.
5. Primary CTAs are orange; secondary actions are green or quiet ink — not gold.
6. Layout, content, and major interactions (home experience, gallery, lightbox, connect form) still work.
7. Dark mode may look unfinished; it must not be the focus of this pass.

## Open for implementation plan

- Exact cream / elevated / muted hex values
- Whether theme default stays “light” explicitly or only light is polished
- Whether subtle tambour CSS ships in v1 or is deferred
)