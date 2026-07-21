import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { LayoutGroup } from "framer-motion";
import { X } from "lucide-react";
import {
  findLightboxIndex,
  flattenGalleryPeers,
  type GalleryCollectionPeer,
  type GalleryPeer,
} from "../../lib/galleryModel";
import { MotionConfigProvider, PhotoTilt } from "../motion";
import {
  openPhotoFromEvent,
  photoLayoutId,
  PhotoLightbox,
  SharedPhotoShell,
  usePhotoLightboxState,
  type PhotoLightboxItem,
} from "./PhotoLightbox";
import "./GalleryGrid.css";

const DECK_PREVIEW = 3;

type GalleryGridProps = {
  peers: GalleryPeer[];
};

function CollectionDeck({
  collection,
  onOpen,
}: {
  collection: GalleryCollectionPeer;
  onOpen: () => void;
}) {
  const preview = collection.images.slice(0, DECK_PREVIEW);
  const slots =
    preview.length === 1
      ? (["center"] as const)
      : preview.length === 2
        ? (["left", "center"] as const)
        : (["left", "center", "right"] as const);

  // Map preview images onto fan slots: center = first, left = second, right = third
  const bySlot: Record<string, (typeof preview)[number] | undefined> = {};
  if (preview[0]) bySlot.center = preview[0];
  if (preview[1]) bySlot.left = preview[1];
  if (preview[2]) bySlot.right = preview[2];

  return (
    <button
      type="button"
      className="gallery-deck"
      aria-label="Open photo collection"
      onClick={onOpen}
    >
      <span className="gallery-deck__fan" aria-hidden="true">
        {slots.map((slot) => {
          const image = bySlot[slot];
          if (!image) return null;
          return (
            <span
              key={slot}
              className={`gallery-deck__card gallery-deck__card--${slot}`}
            >
              <span className="gallery-deck__frame">
                <img
                  className="gallery-deck__img"
                  src={image.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </span>
            </span>
          );
        })}
      </span>
    </button>
  );
}

function CollectionModal({
  collection,
  open,
  onClose,
  onSelectImage,
  lightboxOpen,
}: {
  collection: GalleryCollectionPeer | null;
  open: boolean;
  onClose: () => void;
  onSelectImage: (
    event: ReactMouseEvent<HTMLButtonElement>,
    src: string,
  ) => void;
  lightboxOpen: boolean;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !collection) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!lightboxOpen) closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, collection, lightboxOpen]);

  useEffect(() => {
    if (!open || lightboxOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, lightboxOpen, onClose]);

  if (!mounted || !open || !collection) return null;

  return createPortal(
    <div
      className="gallery-collection-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="gallery-collection-modal__backdrop"
        aria-label="Close collection"
        tabIndex={-1}
        onClick={onClose}
      />
      <div className="gallery-collection-modal__shell">
        <button
          ref={closeRef}
          type="button"
          className="gallery-collection-modal__close"
          aria-label="Close collection"
          onClick={onClose}
        >
          <X aria-hidden="true" strokeWidth={2.5} />
        </button>
        <div className="gallery-collection-modal__panel">
          <h2 id={titleId} className="gallery-collection-modal__sr-only">
            Photo collection
          </h2>
          <ul className="gallery-collection-modal__grid" role="list">
            {collection.images.map((image, index) => {
              const layoutId = photoLayoutId(image.src, `collection-${collection.id}-${index}`);
              return (
                <li key={image.id} className="gallery-collection-modal__item">
                  <button
                    type="button"
                    className="gallery-collection-modal__trigger"
                    aria-label="View gallery photo"
                    onClick={(event) => onSelectImage(event, image.src)}
                  >
                    <SharedPhotoShell layoutId={layoutId}>
                      <PhotoTilt className="gallery-collection-modal__frame">
                        <img
                          className="gallery-collection-modal__img"
                          src={image.src}
                          alt={image.alt}
                          loading={index < 6 ? "eager" : "lazy"}
                          decoding="async"
                        />
                      </PhotoTilt>
                    </SharedPhotoShell>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function GalleryGrid({ peers }: GalleryGridProps) {
  const slides = flattenGalleryPeers(peers) as PhotoLightboxItem[];
  const lightbox = usePhotoLightboxState();
  const wasLightboxOpen = useRef(false);
  const [openCollectionId, setOpenCollectionId] = useState<string | null>(null);

  const openCollection =
    openCollectionId == null
      ? null
      : (peers.find(
          (peer): peer is GalleryCollectionPeer =>
            peer.type === "collection" && peer.id === openCollectionId,
        ) ?? null);

  // Closing the lightbox while on a collection slide restores that modal.
  // Closing on a solo clears any open collection modal.
  useEffect(() => {
    const justClosed = wasLightboxOpen.current && !lightbox.open;
    wasLightboxOpen.current = lightbox.open;
    if (!justClosed) return;

    const collectionId =
      lightbox.items?.[lightbox.index]?.collectionId ?? undefined;
    setOpenCollectionId(collectionId ?? null);
  }, [lightbox.open, lightbox.items, lightbox.index]);

  function openAtSrc(
    event: { currentTarget: Element },
    src: string,
    layoutId?: string,
  ) {
    const index = findLightboxIndex(slides, src);
    openPhotoFromEvent(event, {
      src,
      alt: slides[index]?.alt,
      items: slides,
      index,
      layoutId,
    });
  }

  function onSoloKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    src: string,
    layoutId: string,
  ) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openAtSrc(event, src, layoutId);
  }

  if (!peers.length) return null;

  return (
    <MotionConfigProvider>
      <LayoutGroup>
        <ul className="gallery-grid" role="list">
          {peers.map((peer, peerIndex) => {
            if (peer.type === "collection") {
              return (
                <li
                  key={`collection-${peer.id}`}
                  className="gallery-grid__item gallery-grid__item--deck"
                >
                  <CollectionDeck
                    collection={peer}
                    onOpen={() => setOpenCollectionId(peer.id)}
                  />
                </li>
              );
            }

            const { image } = peer;
            const layoutId = photoLayoutId(image.src, `solo-${peerIndex}`);
            return (
              <li
                key={`image-${peer.id}`}
                className="gallery-grid__item gallery-grid__item--solo"
              >
                <button
                  type="button"
                  className="gallery-grid__solo"
                  aria-label="View gallery photo"
                  onClick={(event) => openAtSrc(event, image.src, layoutId)}
                  onKeyDown={(event) => onSoloKeyDown(event, image.src, layoutId)}
                >
                  <SharedPhotoShell layoutId={layoutId}>
                    <PhotoTilt className="gallery-grid__solo-frame">
                      <img
                        className="gallery-grid__solo-img"
                        src={image.src}
                        alt={image.alt}
                        loading={peerIndex < 4 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </PhotoTilt>
                  </SharedPhotoShell>
                </button>
              </li>
            );
          })}
        </ul>

        <CollectionModal
          collection={openCollection}
          open={Boolean(openCollection)}
          lightboxOpen={lightbox.open}
          onClose={() => setOpenCollectionId(null)}
          onSelectImage={(event, src) => {
            const localIndex =
              openCollection?.images.findIndex((image) => image.src === src) ??
              0;
            const layoutId = photoLayoutId(
              src,
              `collection-${openCollectionId}-${localIndex}`,
            );
            openAtSrc(event, src, layoutId);
          }}
        />

        <PhotoLightbox />
      </LayoutGroup>
    </MotionConfigProvider>
  );
}
