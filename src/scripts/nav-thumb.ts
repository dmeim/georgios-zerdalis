import { SlidingThumb } from './sliding-thumb';

let mounted: SlidingThumb[] = [];
let openObserver: MutationObserver | null = null;

function syncAll(): void {
  for (const instance of mounted) instance.sync();
}

function mountNavThumb(): void {
  const navs = document.querySelectorAll<HTMLElement>('.site-nav');
  if (!navs.length) return;

  for (const instance of mounted) instance.destroy();
  mounted = Array.from(navs).map(
    (nav) =>
      new SlidingThumb(nav, {
        itemSelector: 'a',
        activeSelector: 'a[aria-current="page"]',
      }),
  );

  openObserver?.disconnect();
  const popover = document.getElementById('mobile-nav');
  if (popover) {
    openObserver = new MutationObserver(() => {
      if (popover.getAttribute('data-open') === 'true') {
        requestAnimationFrame(() => syncAll());
      }
    });
    openObserver.observe(popover, {
      attributes: true,
      attributeFilter: ['data-open'],
    });
  }
}

function onPageReady(): void {
  mountNavThumb();
  // Second frame: view transitions / sticky header layout can settle late.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => syncAll());
  });
}

onPageReady();
document.addEventListener('astro:page-load', onPageReady);
