import {
  LayoutGroup,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { readCssColor } from "../../lib/cssColor";
import {
  Magnetic,
  MotionConfigProvider,
  PhotoTilt,
  Reveal,
  TextReveal,
} from "../motion";
import {
  openPhotoFromEvent,
  photoLayoutId,
  PhotoLightbox,
  SharedPhotoShell,
} from "./PhotoLightbox";
import "./HomeExperience.css";

export type HomeExperienceProps = {
  portraitSrc: string;
  portraitWidth: number;
  portraitHeight: number;
  hero: {
    name: string;
    role: string;
    doctoral: string;
    ctas: { label: string; href: string }[];
  };
  quote: { text: string; attribution?: string };
  endorsement: { label: string; url: string };
};

const EASE = [0.22, 1, 0.36, 1] as const;

function QuoteWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = Math.min(1, (index + 2.2) / total);
  const opacity = useTransform(progress, [start, end], [0.18, 1]);
  // Dim words stay ink; revealed words fill secondary.
  // Framer needs concrete colors — read from CSS tokens (SSR fallbacks match :root).
  const color = useTransform(progress, [start, end], [
    readCssColor("--color-ink", "#1a1f1c"),
    readCssColor("--color-secondary", "#b31b17"),
  ]);

  return (
    <motion.span
      className="he-quote__word"
      style={{ opacity, color }}
      aria-hidden="true"
    >
      {word}
      {index < total - 1 ? " " : ""}
    </motion.span>
  );
}

function QuoteWords({
  text,
  progress,
  reduced,
}: {
  text: string;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const words = text.trim().split(/\s+/).filter(Boolean);

  if (reduced) {
    return <p className="he-quote__text">{text}</p>;
  }

  return (
    <p className="he-quote__text" aria-label={text}>
      {words.map((word, i) => (
        <QuoteWord
          key={`${word}-${i}`}
          word={word}
          index={i}
          total={words.length}
          progress={progress}
        />
      ))}
    </p>
  );
}

function HeroSection({
  portraitSrc,
  portraitWidth,
  portraitHeight,
  hero,
  endorsement,
  reduced,
}: {
  portraitSrc: string;
  portraitWidth: number;
  portraitHeight: number;
  hero: HomeExperienceProps["hero"];
  endorsement: HomeExperienceProps["endorsement"];
  reduced: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* y drifts down; scale grows from top (CSS transform-origin) so the frame top stays pinned */
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={ref}
      className="he-hero he__bleed"
      aria-label="Introduction"
    >
      <div className="he-hero__layout">
        <div className="he-hero__content">
          <motion.div
            className="he-hero__stack"
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : "visible"}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.11, delayChildren: 0.18 },
              },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 32 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.9, ease: EASE },
                },
              }}
            >
              <TextReveal
                text={hero.name}
                as="h1"
                className="he-hero__name"
                delay={0.02}
              />
            </motion.div>

            <motion.div
              className="he-hero__roles"
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: EASE },
                },
              }}
            >
              <p className="he-hero__role">{hero.role}</p>
              <p className="he-hero__doctoral">{hero.doctoral}</p>
              <p className="he-hero__endorse">
                <a
                  className="he-hero__endorse-link"
                  href={endorsement.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {endorsement.label}
                </a>
              </p>
            </motion.div>

            <motion.div
              className="he-hero__ctas"
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.75, ease: EASE },
                },
              }}
            >
              {hero.ctas.map((cta, i) => (
                <Magnetic key={cta.href} strength={0.22}>
                  <a
                    href={cta.href}
                    className={
                      i === 0 ? "btn btn--primary" : "btn btn--ghost"
                    }
                  >
                    {cta.label}
                  </a>
                </Magnetic>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="he-hero__media">
          <button
            type="button"
            className="he-photo-trigger he-photo-trigger--fill"
            aria-label="View portrait of George Zerdalis"
            onClick={(event) => {
              const layoutId = photoLayoutId(portraitSrc, "hero");
              openPhotoFromEvent(event, {
                src: portraitSrc,
                alt: "George Zerdalis",
                caption: "Photo By: @photoshooters_co",
                layoutId,
              });
            }}
          >
            <SharedPhotoShell layoutId={photoLayoutId(portraitSrc, "hero")}>
              <PhotoTilt
                className="he-hero__frame"
                intensity="main"
                initial={
                  reduced
                    ? false
                    : {
                        opacity: 0,
                        y: 48,
                        scale: 0.94,
                        filter: "blur(8px)",
                      }
                }
                animate={
                  reduced
                    ? undefined
                    : {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: "blur(0px)",
                      }
                }
                transition={{ duration: 1.25, ease: EASE, delay: 0.22 }}
              >
                <motion.div
                  className="he-hero__image-wrap"
                  style={
                    reduced
                      ? undefined
                      : {
                          y: imageY,
                          scale: imageScale,
                        }
                  }
                >
                  <img
                    className="he-hero__image"
                    src={portraitSrc}
                    width={portraitWidth}
                    height={portraitHeight}
                    alt=""
                    decoding="async"
                    fetchPriority="high"
                  />
                </motion.div>
              </PhotoTilt>
            </SharedPhotoShell>
          </button>
          <div className="he-hero__veil" />
        </div>
      </div>

      {!reduced && (
        <motion.div
          className="he-hero__scroll"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.35, duration: 0.7, ease: EASE }}
        >
          <span className="he-hero__scroll-label">Scroll</span>
          <span className="he-hero__scroll-line" />
        </motion.div>
      )}
    </section>
  );
}

function QuoteSection({
  quote,
}: {
  quote: HomeExperienceProps["quote"];
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  return (
    <section
      ref={ref}
      className="he-quote he__section"
      aria-label="Mentor reflection"
    >
      <div className="he__inner">
        <blockquote className="he-quote__block">
          <QuoteWords
            text={quote.text}
            progress={scrollYProgress}
            reduced={Boolean(reduced)}
          />
          {quote.attribution ? (
            <Reveal delay={0.15}>
              <footer className="he-quote__footer">
                <cite className="he-quote__cite">{quote.attribution}</cite>
              </footer>
            </Reveal>
          ) : null}
        </blockquote>
      </div>
    </section>
  );
}

export default function HomeExperience({
  portraitSrc,
  portraitWidth,
  portraitHeight,
  hero,
  quote,
  endorsement,
}: HomeExperienceProps) {
  const reduced = useReducedMotion();

  return (
    <MotionConfigProvider>
      <LayoutGroup>
        <div className="he">
          <HeroSection
            portraitSrc={portraitSrc}
            portraitWidth={portraitWidth}
            portraitHeight={portraitHeight}
            hero={hero}
            endorsement={endorsement}
            reduced={Boolean(reduced)}
          />
          <QuoteSection quote={quote} />
        </div>
        <PhotoLightbox />
      </LayoutGroup>
    </MotionConfigProvider>
  );
}
