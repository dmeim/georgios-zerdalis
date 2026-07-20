import { SlidingThumb } from './sliding-thumb';

let mounted: SlidingThumb | null = null;

function mountNavThumb(): void {
  const nav = document.querySelector<HTMLElement>('.site-nav');
  if (!nav) return;

  mounted?.destroy();
  mounted = new SlidingThumb(nav, {
    itemSelector: 'a',
    activeSelector: 'a[aria-current="page"]',
  });
}

function onPageReady(): void {
  mountNavThumb();
  // Second frame: view transitions / sticky header layout can settle late.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => mounted?.sync());
  });
}

onPageReady();
document.addEventListener('astro:page-load', onPageReady);
