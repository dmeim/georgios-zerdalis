import { createElement, Moon, Sun, SunMoon } from 'lucide';
import { SlidingThumb } from './sliding-thumb';

export type ThemePreference = 'light' | 'system' | 'dark';

const STORAGE_KEY = 'theme';
const PREFERENCES: ThemePreference[] = ['light', 'system', 'dark'];

const ICONS = {
  light: Sun,
  system: SunMoon,
  dark: Moon,
} as const;

const LABELS = {
  light: 'Light',
  system: 'System',
  dark: 'Dark',
} as const;

function isPreference(value: string | null): value is ThemePreference {
  return value === 'light' || value === 'system' || value === 'dark';
}

function getStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isPreference(stored)) return stored;
  } catch {
    /* ignore */
  }
  return 'system';
}

function resolveTheme(pref: ThemePreference): 'light' | 'dark' {
  if (pref === 'light' || pref === 'dark') return pref;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyPreference(pref: ThemePreference): void {
  const resolved = resolveTheme(pref);
  document.documentElement.setAttribute('data-theme-pref', pref);
  document.documentElement.setAttribute('data-theme', resolved);
  try {
    localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    /* ignore */
  }
}

export class ThemeToggle {
  private root: HTMLElement;
  private options: HTMLButtonElement[] = [];
  private thumb: SlidingThumb;
  private mediaQuery: MediaQueryList;
  private onMediaChange: () => void;

  constructor(host: HTMLElement) {
    this.root = this.build();
    host.replaceChildren(this.root);
    this.thumb = new SlidingThumb(this.root, {
      itemSelector: '.theme-toggle-option',
      activeSelector: '.theme-toggle-option[aria-checked="true"]',
    });
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.onMediaChange = () => {
      const pref = getStoredPreference();
      if (pref === 'system') applyPreference('system');
    };
    this.mediaQuery.addEventListener('change', this.onMediaChange);

    const initial = getStoredPreference();
    applyPreference(initial);
    this.syncAria(initial);
  }

  private build(): HTMLElement {
    const root = document.createElement('div');
    root.className = 'theme-toggle segment-track';
    root.id = 'theme-toggle';
    root.setAttribute('role', 'radiogroup');
    root.setAttribute('aria-label', 'Color theme');

    for (const pref of PREFERENCES) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'theme-toggle-option';
      button.dataset.themeOption = pref;
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-label', LABELS[pref]);
      button.setAttribute('aria-checked', 'false');
      button.tabIndex = -1;

      const icon = createElement(ICONS[pref], {
        width: 16,
        height: 16,
        'stroke-width': 1.75,
        'aria-hidden': 'true',
      });
      button.appendChild(icon);

      button.addEventListener('click', () => this.setPreference(pref));
      this.options.push(button);
      root.appendChild(button);
    }

    return root;
  }

  private setPreference(pref: ThemePreference): void {
    applyPreference(pref);
    this.syncAria(pref);
  }

  private syncAria(pref: ThemePreference): void {
    for (const button of this.options) {
      const selected = button.dataset.themeOption === pref;
      button.setAttribute('aria-checked', selected ? 'true' : 'false');
      button.tabIndex = selected ? 0 : -1;
    }
    this.thumb.sync();
  }

  destroy(): void {
    this.thumb.destroy();
    this.mediaQuery.removeEventListener('change', this.onMediaChange);
  }

  /** Re-measure the sliding thumb after layout / view transitions. */
  resync(): void {
    this.thumb.sync();
  }
}

let mounted: ThemeToggle | null = null;

function mountThemeToggle(): void {
  const host =
    document.getElementById('theme-toggle-host') ??
    document.querySelector<HTMLElement>('.header-right');

  if (!host) return;

  const existing = host.querySelector('#theme-toggle');
  if (existing && mounted && host.contains(existing)) {
    mounted.resync();
    return;
  }

  mounted?.destroy();
  mounted = new ThemeToggle(host);
}

mountThemeToggle();
document.addEventListener('astro:page-load', mountThemeToggle);
