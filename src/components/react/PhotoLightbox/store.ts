export type PhotoLightboxItem = {
  src: string;
  alt?: string;
  caption?: string;
};

export type OpenPhotoOptions = PhotoLightboxItem & {
  /** Gallery only — ordered set for prev/next + swipe. */
  items?: PhotoLightboxItem[];
  index?: number;
};

export type PhotoLightboxState = {
  open: boolean;
  src: string;
  alt: string;
  caption: string;
  items: PhotoLightboxItem[] | null;
  index: number;
};

type Listener = (state: PhotoLightboxState) => void;

const listeners = new Set<Listener>();

let state: PhotoLightboxState = {
  open: false,
  src: "",
  alt: "",
  caption: "",
  items: null,
  index: 0,
};

function emit() {
  for (const listener of listeners) listener(state);
}

function applyItem(item: PhotoLightboxItem, index: number, items: PhotoLightboxItem[] | null) {
  state = {
    open: true,
    src: item.src,
    alt: item.alt?.trim() || "",
    caption: item.caption?.trim() || "",
    items,
    index,
  };
  emit();
}

/** Island-safe open API — works across separate Astro React trees. */
export function openPhoto(options: OpenPhotoOptions) {
  const items =
    options.items && options.items.length > 0 ? options.items : null;
  const index = items
    ? Math.min(Math.max(options.index ?? 0, 0), items.length - 1)
    : 0;
  const item = items ? items[index]! : options;
  applyItem(item, index, items);
}

export function closePhoto() {
  if (!state.open) return;
  state = { ...state, open: false };
  emit();
}

export function showPhotoAt(index: number) {
  if (!state.open || !state.items?.length) return;
  const next = ((index % state.items.length) + state.items.length) % state.items.length;
  applyItem(state.items[next]!, next, state.items);
}

export function showPrevPhoto() {
  showPhotoAt(state.index - 1);
}

export function showNextPhoto() {
  showPhotoAt(state.index + 1);
}

export function getPhotoLightboxState() {
  return state;
}

export function subscribePhotoLightbox(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
