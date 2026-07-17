# Pedagogy expand panel

**Date:** 2026-07-17  
**Status:** Approved for implementation  
**Scope:** Home page “How Georgios teaches” (`PedagogySection` in `HomeExperience`)

## Goal

When a user hovers or clicks a numbered pedagogy item (1–5), a shared detail panel to the right reveals a short body paragraph with a Framer Motion transition. Placeholder lorem ipsum until final copy arrives.

## Chosen approach

Two-column expand panel (approach 1): numbered titles on the left; one shared detail panel on the right that swaps content for the active item.

## Interaction

Active item = `hoveredId ?? pinnedId ?? null`. Panel is empty until the first hover or click.

### Desktop

- Hover opens temporarily; leaving the list clears hover.
- Click pins the item open; click again unpins and returns to hover-only behavior.
- If an item is pinned and the user hovers another, that hovered item becomes the new pinned item (stays open until click-to-close).

### Mobile

- Tap toggles pin open/closed. No hover.
- Panel stacks below the list.

### Reduced motion

Instant content swap / no slide-fade; open/close still works.

## Data

Extend pedagogy content from `string[]` to titled items with body copy:

```ts
export type PedagogyItem = {
  title: string;
  body: string; // placeholder lorem until final copy
};
```

## Files

1. `src/content/site.ts` — type + body placeholders  
2. `src/components/react/HomeExperience.tsx` — interactive `PedagogySection`  
3. `src/components/react/HomeExperience.css` — two-column + mobile stack styles  

## Out of scope

- Final pedagogy body copy (client will supply later)  
- Legacy `Pedagogy.astro` (unused by home page)  
- Keyboard-roving focus redesign beyond basic button/ARIA affordances

## Acceptance criteria

- Desktop hover shows body; leave clears unless pinned.  
- Click pins; second click unpins.  
- Hover while pinned switches pin to the hovered item.  
- Mobile tap toggles.  
- Empty panel until first interaction.  
- `prefers-reduced-motion` skips decorative motion.
