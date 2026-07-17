export type GalleryItemType = 'image' | 'video';

export interface GalleryItem {
  id: string;
  type: GalleryItemType;
  filename?: string;
  path?: string;
  alt?: string;
  caption?: string;
  source?: string;
  /** Local video filename under src/assets/gallery, or absolute/public URL */
  src?: string;
  /** YouTube / Vimeo / other iframe embed URL */
  embedUrl?: string;
  poster?: string;
}

export interface GalleryManifest {
  source?: string;
  status?: 'empty' | 'partial' | 'ready' | string;
  notes?: string;
  items?: GalleryItem[];
}
