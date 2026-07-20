# Homepage section reorder + Education

**Date:** 2026-07-20  
**Status:** Approved — building  
**Scope:** Reorder home sections; add Education timeline

## Goal

Put the homepage in this order and surface Education as its own section:

1. Hero  
2. Current Chapter  
3. Where the work lives  
4. Education (new)  
5. Biography  
6. Mentor quote (“My commitment…”)  
7. How George teaches  
8. Stages  

## Education

- Content from `src/content/site.ts` (matches Grover Pro)
- Timeline layout twin of appointments: year + location left; degree + institution right
- No photos, no bullets
- Title: Education
- Newest first (already ordered in content)

## Approach

Reorder in `HomeExperience`; pass `education` from `index.astro`; add `EducationSection` + CSS parallel to appointments without media column.

## Out of scope

Endorsement placement, pedagogy copy, retro-pop tokens.
