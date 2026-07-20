export type SlidingThumbOptions = {
  /** Selector for each segment item inside the track. */
  itemSelector: string;
  /** Selector for the currently active item. */
  activeSelector: string;
  /** Class applied to the thumb element. */
  thumbClass?: string;
  /** Inset from the active item edges (px). */
  inset?: number;
};

const DEFAULT_THUMB_CLASS = 'segment-thumb';
const DEFAULT_INSET = 2;

/**
 * Positions an absolute sliding thumb over the active item in a segmented track.
 * Repositions on resize and when aria-current / aria-checked change.
 */
export class SlidingThumb {
  private readonly root: HTMLElement;
  private readonly thumb: HTMLElement;
  private readonly activeSelector: string;
  private readonly inset: number;
  private readonly resizeObserver: ResizeObserver;
  private readonly mutationObserver: MutationObserver;
  private frame = 0;

  constructor(root: HTMLElement, options: SlidingThumbOptions) {
    this.root = root;
    this.activeSelector = options.activeSelector;
    this.inset = options.inset ?? DEFAULT_INSET;

    const thumbClass = options.thumbClass ?? DEFAULT_THUMB_CLASS;
    let thumb = root.querySelector<HTMLElement>(`:scope > .${thumbClass}`);
    if (!thumb) {
      thumb = document.createElement('span');
      thumb.className = thumbClass;
      thumb.setAttribute('aria-hidden', 'true');
      // Inline critical layout so a missing/lagging stylesheet can't
      // let the thumb participate in the track's grid/flex and break it.
      thumb.style.position = 'absolute';
      thumb.style.top = `${this.inset}px`;
      thumb.style.left = '0';
      thumb.style.height = `calc(100% - ${this.inset * 2}px)`;
      thumb.style.pointerEvents = 'none';
      thumb.style.zIndex = '0';
      thumb.style.opacity = '0';
      root.prepend(thumb);
    }
    this.thumb = thumb;

    this.resizeObserver = new ResizeObserver(() => this.scheduleSync());
    this.resizeObserver.observe(root);

    this.mutationObserver = new MutationObserver(() => this.scheduleSync());
    this.mutationObserver.observe(root, {
      attributes: true,
      subtree: true,
      attributeFilter: ['aria-current', 'aria-checked'],
    });

    this.sync();
    // Layout can settle after fonts / view transitions.
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => this.sync());
    }
  }

  sync(): void {
    const active = this.root.querySelector<HTMLElement>(this.activeSelector);
    if (!active) {
      this.thumb.style.opacity = '0';
      return;
    }

    const inset = this.inset;
    const left = active.offsetLeft + inset;
    const width = Math.max(0, active.offsetWidth - inset * 2);

    this.thumb.style.opacity = '1';
    this.thumb.style.width = `${width}px`;
    this.thumb.style.transform = `translate3d(${left}px, 0, 0)`;
  }

  destroy(): void {
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.mutationObserver.disconnect();
  }

  private scheduleSync(): void {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.sync());
  }
}
