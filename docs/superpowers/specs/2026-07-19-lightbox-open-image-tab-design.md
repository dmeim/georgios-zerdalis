# Lightbox image → open in new tab

**Date:** 2026-07-19  
**Status:** Approved for implementation  
**Scope:** `PhotoLightbox` — click on the open lightbox image

## Goal

When the lightbox is open, clicking the displayed photo opens that image’s file URL in a **new browser tab**. Existing tilt-on-hover and backdrop/close behavior stay unchanged.

## Chosen approach

Click handler on the lightbox image (approach 1): `window.open(state.src, "_blank", "noopener,noreferrer")` on the lightbox `<img>` (or its immediate clickable wrapper). Prefer a handler over wrapping in `<a>` to avoid fighting `PhotoTilt` pointer handling.

## Interaction

| Action | Result |
|--------|--------|
| Click lightbox image | Open `state.src` in a new tab (`noopener,noreferrer`) |
| Click backdrop / close / Escape | Close lightbox (unchanged) |
| Hover image | Tilt effect (unchanged) |
| Swipe (touch, multi-item) | Prev/next (unchanged) |

- Apply `cursor: pointer` on `.photo-lightbox__img` so the affordance is clear.
- Do not close the lightbox when opening the new tab (user can return to the lightbox tab).
- No Fullscreen API.

## Files

1. `src/components/react/PhotoLightbox/PhotoLightbox.tsx` — click handler on lightbox image  
2. `src/components/react/PhotoLightbox/PhotoLightbox.css` — `cursor: pointer` on `.photo-lightbox__img`

## Out of scope

- Changing open/close morph, gallery triggers, or tilt intensity  
- Same-tab navigation  
- Keyboard shortcut dedicated to “open original” (click / pointer only for this feature)

## Acceptance criteria

- Clicking the lightbox photo opens `state.src` in a new tab.  
- Backdrop click, close button, and Escape still close the lightbox.  
- Tilt on hover still works.  
- Image shows a pointer cursor while the lightbox is open.
