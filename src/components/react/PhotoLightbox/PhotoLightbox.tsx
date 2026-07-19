import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { PhotoTilt } from "../../motion";
import {
  closePhoto,
  getPhotoLightboxState,
  showNextPhoto,
  showPrevPhoto,
  subscribePhotoLightbox,
  type PhotoLightboxState,
} from "./store";
import "./PhotoLightbox.css";

const EASE = [0.22, 1, 0.36, 1] as const;
const SWIPE_THRESHOLD = 56;

function usePhotoLightboxState() {
  const [state, setState] = useState<PhotoLightboxState>(getPhotoLightboxState);
  useEffect(() => subscribePhotoLightbox(setState), []);
  return state;
}

export default function PhotoLightbox() {
  const state = usePhotoLightboxState();
  const reduced = useReducedMotion();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dragStartX = useRef<number | null>(null);
  const navigable = Boolean(state.items && state.items.length > 1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!state.open) return;
    const previousOverflow = document.body.style.overflow;
    document.documentElement.classList.add("photo-lightbox-open");
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.documentElement.classList.remove("photo-lightbox-open");
      document.body.style.overflow = previousOverflow;
    };
  }, [state.open]);

  useEffect(() => {
    if (!state.open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closePhoto();
        return;
      }
      if (!navigable) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevPhoto();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextPhoto();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.open, navigable]);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!navigable || event.pointerType === "mouse") return;
    dragStartX.current = event.clientX;
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragStartX.current == null) return;
    const delta = event.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta > 0) showPrevPhoto();
    else showNextPhoto();
  }

  function onPointerCancel() {
    dragStartX.current = null;
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {state.open ? (
        /*
          Root must stay a plain fixed element — Framer opacity/transform on an
          ancestor disables backdrop-filter, so the page never actually blurs.
        */
        <div
          className="photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="photo-lightbox__backdrop"
            aria-label="Close photo"
            onClick={closePhoto}
          />

          <div className="photo-lightbox__chrome">
            <motion.div
              className="photo-lightbox__chrome-inner"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: reduced ? 0.01 : 0.28, ease: EASE }}
            >
              <button
                ref={closeRef}
                type="button"
                className="photo-lightbox__close"
                aria-label="Close photo"
                onClick={closePhoto}
              >
                <span aria-hidden="true">&times;</span>
              </button>

              {navigable ? (
                <button
                  type="button"
                  className="photo-lightbox__nav photo-lightbox__nav--prev"
                  aria-label="Previous photo"
                  onClick={showPrevPhoto}
                >
                  <span aria-hidden="true">‹</span>
                </button>
              ) : null}

              {navigable ? (
                <button
                  type="button"
                  className="photo-lightbox__nav photo-lightbox__nav--next"
                  aria-label="Next photo"
                  onClick={showNextPhoto}
                >
                  <span aria-hidden="true">›</span>
                </button>
              ) : null}
            </motion.div>
          </div>

          <div
            className="photo-lightbox__stage"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={state.src + state.index}
                className="photo-lightbox__figure"
                initial={reduced ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: reduced ? 0.01 : 0.32, ease: EASE }}
              >
                <span id={titleId} className="photo-lightbox__sr-only">
                  {state.alt || "Photo preview"}
                </span>
                <PhotoTilt
                  className="photo-lightbox__frame"
                  intensity="main"
                >
                  <img
                    className="photo-lightbox__img"
                    src={state.src}
                    alt={state.alt}
                    decoding="async"
                    draggable={false}
                  />
                </PhotoTilt>
                {state.caption ? (
                  <p className="photo-lightbox__caption">{state.caption}</p>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
