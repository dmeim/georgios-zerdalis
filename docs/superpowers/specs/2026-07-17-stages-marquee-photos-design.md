# Stages marquee photo cards

**Date:** 2026-07-17  
**Status:** Approved for planning  
**Scope:** Home page Stages strip (`VenuesMarquee` in `HomeExperience`)

## Goal

Pair each scrolling stage name with its venue photo so the Stages marquee reads as photo cards (layout option B), not text-only labels.

## Chosen approach

Explicit `image` path on each venue entry in content data (approach 1). No filename derivation, no separate image map.

## Data

Extend `VenueHighlight` in `src/content/site.ts`:

```ts
export type VenueHighlight = {
  name: string;
  place: string;
  image: string; // public URL, e.g. "/images/Carnegie-Hall.jpg"
};
```

Map the four existing venues to files already in `public/images/`:

| Name | Place | Image |
|------|-------|-------|
| Carnegie Hall | New York City, USA | `/images/Carnegie-Hall.jpg` |
| Konzerthaus | Berlin, Germany | `/images/Konzerthaus.jpg` |
| Concertgebouw | Amsterdam, Netherlands | `/images/Concertgebouw.jpg` |
| Odeon of Herodes Atticus | Athens, Greece | `/images/Odeon-of-Herodes.jpg` |

## UI behavior

- Keep the continuous horizontal CSS marquee and the “Stages” section label.
- Each marquee item becomes a compact card: landscape photo on top, italic venue name, uppercase place caption below.
- Remove inter-item · separators; horizontal gap between cards provides rhythm.
- Preserve edge fade mask on the track.
- `prefers-reduced-motion`: static wrapped row of the same photo cards (no animation), matching current reduced-motion pattern.

## Components / files to touch

1. `src/content/site.ts` — type + venue `image` fields  
2. `src/components/react/HomeExperience.tsx` — `VenuesMarquee` markup and props type  
3. `src/components/react/HomeExperience.css` — card layout styles for `.he-venues__*`

## Out of scope

- Spotlight / scroll-synced large image (layout C)
- Inline thumbnails beside text (layout A)
- Gallery page, lightbox, Astro `<Image>` optimization pipeline
- Renaming or compressing source JPEGs

## Acceptance criteria

- Each of the four stage names scrolls with its matching photo.
- Name and place remain readable under the photo.
- Marquee still loops seamlessly; reduced-motion shows a static grid/wrap of cards.
- Adding a fifth venue later only requires a new content entry + image file under `public/images/`.
