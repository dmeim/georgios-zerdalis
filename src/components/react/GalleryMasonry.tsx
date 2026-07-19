import { LayoutGroup } from "framer-motion";
import { MotionConfigProvider, PhotoTilt } from "../motion";
import {
  openPhotoFromEvent,
  photoLayoutId,
  PhotoLightbox,
  SharedPhotoShell,
  type PhotoLightboxItem,
} from "./PhotoLightbox";
import "./GalleryMasonry.css";

export type GalleryMasonryPhoto = PhotoLightboxItem & {
  width: number;
  height: number;
};

type GalleryMasonryProps = {
  photos: GalleryMasonryPhoto[];
};

export default function GalleryMasonry({ photos }: GalleryMasonryProps) {
  if (!photos.length) return null;

  const items: PhotoLightboxItem[] = photos.map(({ src, alt, caption }) => ({
    src,
    alt,
    caption,
  }));

  return (
    <MotionConfigProvider>
      <LayoutGroup>
        <ul className="gallery-masonry" role="list">
          {photos.map((photo, index) => {
            const alt = photo.alt?.trim() || "Gallery photo";
            const layoutId = photoLayoutId(photo.src, index);
            return (
              <li key={`${photo.src}-${index}`} className="gallery-masonry__item">
                <button
                  type="button"
                  className="gallery-masonry__trigger"
                  aria-label={`View ${alt}`}
                  onClick={(event) =>
                    openPhotoFromEvent(event, {
                      src: photo.src,
                      alt: photo.alt,
                      caption: photo.caption,
                      items,
                      index,
                      layoutId,
                    })
                  }
                >
                  <SharedPhotoShell layoutId={layoutId}>
                    <PhotoTilt className="gallery-masonry__frame">
                      <img
                        className="gallery-masonry__img"
                        src={photo.src}
                        alt={alt}
                        width={photo.width}
                        height={photo.height}
                        loading={index < 4 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </PhotoTilt>
                  </SharedPhotoShell>
                  {photo.caption?.trim() ? (
                    <span className="gallery-masonry__caption">
                      {photo.caption.trim()}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
        <PhotoLightbox />
      </LayoutGroup>
    </MotionConfigProvider>
  );
}
