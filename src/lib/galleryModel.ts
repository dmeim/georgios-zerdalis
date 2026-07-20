export type GalleryImage = {
  id: string;
  src: string;
  filename: string;
  alt: string;
};

export type GallerySoloPeer = {
  type: "image";
  id: string;
  image: GalleryImage;
};

export type GalleryCollectionPeer = {
  type: "collection";
  id: string;
  images: GalleryImage[];
};

export type GalleryPeer = GallerySoloPeer | GalleryCollectionPeer;

export type GalleryLightboxSlide = {
  src: string;
  alt: string;
  collectionId?: string;
};

/** Flatten peers into lightbox slides; collection slides carry `collectionId`. */
export function flattenGalleryPeers(peers: GalleryPeer[]): GalleryLightboxSlide[] {
  return peers.flatMap((peer) => {
    if (peer.type === "image") {
      return [
        {
          src: peer.image.src,
          alt: peer.image.alt,
        },
      ];
    }
    return peer.images.map((image) => ({
      src: image.src,
      alt: image.alt,
      collectionId: peer.id,
    }));
  });
}

export function findLightboxIndex(
  slides: { src: string }[],
  src: string,
): number {
  const index = slides.findIndex((slide) => slide.src === src);
  return index >= 0 ? index : 0;
}
