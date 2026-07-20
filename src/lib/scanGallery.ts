import fs from "node:fs";
import path from "node:path";
import type { GalleryImage, GalleryPeer } from "./galleryModel";

const IMAGE_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
]);

function isImageFile(name: string) {
  return IMAGE_EXT.has(path.extname(name).toLowerCase());
}

function compareNames(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function toPublicSrc(...segments: string[]) {
  return `/gallery/${segments.map(encodeURIComponent).join("/")}`;
}

function toImage(filename: string, folder?: string): GalleryImage {
  const id = folder ? `${folder}/${filename}` : filename;
  const src = folder ? toPublicSrc(folder, filename) : toPublicSrc(filename);
  return {
    id,
    src,
    filename,
    alt: "Gallery photo",
  };
}

/**
 * Build-time scan of `public/gallery`.
 * Root image files → solo peers; one-level subfolders with images → collections.
 * Server-only — do not import from client components.
 */
export function scanGallery(
  galleryDir = path.join(process.cwd(), "public/gallery"),
): GalleryPeer[] {
  if (!fs.existsSync(galleryDir)) return [];

  const entries = fs.readdirSync(galleryDir, { withFileTypes: true });
  const peers: GalleryPeer[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    if (entry.isFile() && isImageFile(entry.name)) {
      const image = toImage(entry.name);
      peers.push({ type: "image", id: image.id, image });
      continue;
    }

    if (!entry.isDirectory()) continue;

    const folderPath = path.join(galleryDir, entry.name);
    const files = fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter((child) => child.isFile() && isImageFile(child.name))
      .map((child) => child.name)
      .sort(compareNames);

    if (files.length === 0) continue;

    peers.push({
      type: "collection",
      id: entry.name,
      images: files.map((filename) => toImage(filename, entry.name)),
    });
  }

  peers.sort((a, b) => {
    if (a.type !== b.type) return a.type === "image" ? -1 : 1;
    return compareNames(a.id, b.id);
  });
  return peers;
}

export type {
  GalleryImage,
  GalleryPeer,
  GallerySoloPeer,
  GalleryCollectionPeer,
} from "./galleryModel";
