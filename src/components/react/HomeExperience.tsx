import {
  LayoutGroup,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
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
  aboutPortraitSrc: string;
  aboutPortraitWidth: number;
  aboutPortraitHeight: number;
  hero: {
    name: string;
    role: string;
    doctoral: string;
    ctas: { label: string; href: string }[];
  };
  chapter: { eyebrow: string; title: string; body: string };
  chapterImageSrc: string;
  chapterImageWidth: number;
  chapterImageHeight: number;
  appointments: {
    title: string;
    organization: string;
    location?: string;
    dates: string;
    bullets?: string[];
    image: string;
    url: string;
  }[];
  education: {
    degree: string;
    institution: string;
    location?: string;
    year: string;
  }[];
  bio: string;
  quote: { text: string; attribution?: string };
  pedagogy: { title: string; body: string }[];
  endorsement: { label: string; url: string };
  venues: { name: string; place: string; image: string }[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

function splitBio(bio: string): string[] {
  const trimmed = bio.trim();
  if (!trimmed) return [];

  const sentences = trimmed
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length <= 2) return [trimmed];

  const mid = Math.ceil(sentences.length / 2);
  if (sentences.length <= 4) {
    return [
      sentences.slice(0, mid).join(" "),
      sentences.slice(mid).join(" "),
    ];
  }

  const third = Math.ceil(sentences.length / 3);
  return [
    sentences.slice(0, third).join(" "),
    sentences.slice(third, third * 2).join(" "),
    sentences.slice(third * 2).join(" "),
  ];
}

function padIndex(n: number): string {
  return String(n).padStart(2, "0");
}

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
  // Dim words stay ink; revealed words fill secondary orange.
  // Hexes match --color-ink / --color-secondary (framer needs concrete colors).
  const color = useTransform(progress, [start, end], ["#1a1f1c", "#ff7a33"]);

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

function ChapterSection({
  chapter,
  chapterImageSrc,
  chapterImageWidth,
  chapterImageHeight,
}: {
  chapter: HomeExperienceProps["chapter"];
  chapterImageSrc: string;
  chapterImageWidth: number;
  chapterImageHeight: number;
}) {
  return (
    <section className="he-chapter he__section" aria-label={chapter.title}>
      <div className="he__inner he-chapter__layout">
        <div className="he-chapter__content">
          <Reveal>
            <p className="he__eyebrow">{chapter.eyebrow}</p>
          </Reveal>

          <TextReveal
            text={chapter.title}
            as="h2"
            className="he-chapter__title he__serif-title"
            delay={0.08}
          />

          <Reveal delay={0.12} y={24}>
            <p className="he-chapter__body">{chapter.body}</p>
          </Reveal>
        </div>

        <div className="he-chapter__media">
          <Reveal y={28} delay={0.1}>
            <button
              type="button"
              className="he-photo-trigger he-photo-trigger--fill"
              aria-label="View Frost School of Music at twilight"
              onClick={(event) => {
                const layoutId = photoLayoutId(chapterImageSrc, "chapter");
                openPhotoFromEvent(event, {
                  src: chapterImageSrc,
                  alt: "Frost School of Music at twilight",
                  layoutId,
                });
              }}
            >
              <SharedPhotoShell
                layoutId={photoLayoutId(chapterImageSrc, "chapter")}
              >
                <PhotoTilt className="he-chapter__frame">
                  <img
                    className="he-chapter__image"
                    src={chapterImageSrc}
                    width={chapterImageWidth}
                    height={chapterImageHeight}
                    alt=""
                    decoding="async"
                    loading="lazy"
                  />
                </PhotoTilt>
              </SharedPhotoShell>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function VenueCard({
  venue,
  layoutId,
  ariaHidden,
}: {
  venue: HomeExperienceProps["venues"][number];
  layoutId: string;
  ariaHidden?: boolean;
}) {
  return (
    <figure
      className="he-venues__item"
      aria-hidden={ariaHidden ? true : undefined}
    >
      <button
        type="button"
        className="he-photo-trigger"
        aria-label={`View ${venue.name}, ${venue.place}`}
        tabIndex={ariaHidden ? -1 : undefined}
        onClick={(event) =>
          openPhotoFromEvent(event, {
            src: venue.image,
            alt: `${venue.name}, ${venue.place}`,
            layoutId,
          })
        }
      >
        <SharedPhotoShell layoutId={layoutId}>
          <PhotoTilt className="he-venues__frame">
            <img
              className="he-venues__photo"
              src={venue.image}
              alt=""
              width={360}
              height={220}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </PhotoTilt>
        </SharedPhotoShell>
      </button>
      <figcaption className="he-venues__caption">
        <span className="he-venues__name">{venue.name}</span>
        <span className="he-venues__place">{venue.place}</span>
      </figcaption>
    </figure>
  );
}

function VenuesMarquee({
  venues,
}: {
  venues: HomeExperienceProps["venues"];
}) {
  const reduced = useReducedMotion();
  const items = venues.length ? venues : [];

  if (!items.length) return null;

  const loop = [...items, ...items];

  return (
    <section className="he-venues" aria-label="Stages">
      <div className="he__inner he-venues__label-row">
        <p className="he-venues__label">Stages</p>
      </div>

      {reduced ? (
        <div className="he-venues__static">
          {items.map((venue, i) => (
            <VenueCard
              key={`${venue.name}-${venue.place}`}
              venue={venue}
              layoutId={photoLayoutId(venue.image, `venue-${i}`)}
            />
          ))}
        </div>
      ) : (
        <div className="he-venues__track-wrap he__bleed">
          <div className="he-venues__track he-venues__track--animate">
            <div className="he-venues__group">
              {loop.map((venue, i) => (
                <VenueCard
                  key={`${venue.name}-${i}`}
                  venue={venue}
                  layoutId={photoLayoutId(venue.image, `venue-${i}`)}
                  ariaHidden={i >= items.length}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function AppointmentsSection({
  appointments,
}: {
  appointments: HomeExperienceProps["appointments"];
}) {
  return (
    <section
      className="he-appointments he__section"
      aria-label="Where the work lives"
    >
      <div className="he__inner">
        <header className="he-appointments__header">
          <TextReveal
            text="Where the work lives"
            as="h2"
            className="he-appointments__title he__serif-title"
          />
        </header>

        <ol className="he-appointments__list">
          {appointments.map((item, i) => (
            <li
              key={`${item.title}-${item.dates}`}
              className="he-appointments__item"
            >
              <Reveal delay={i * 0.08} y={32} className="he-appointments__grid">
                <div className="he-appointments__meta">
                  <span className="he-appointments__dates">{item.dates}</span>
                  {item.location ? (
                    <span className="he-appointments__place">
                      {item.location}
                    </span>
                  ) : null}
                </div>
                <div className="he-appointments__body">
                  <h3 className="he-appointments__role">{item.title}</h3>
                  <a
                    className="he-appointments__org"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.organization}
                  </a>
                  {item.bullets && item.bullets.length > 0 ? (
                    <ul className="he-appointments__bullets">
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="he-photo-trigger"
                  aria-label={`View photo for ${item.title}`}
                  onClick={(event) => {
                    const layoutId = photoLayoutId(
                      item.image,
                      `appointment-${item.title}`,
                    );
                    openPhotoFromEvent(event, {
                      src: item.image,
                      alt: `${item.title} at ${item.organization}`,
                      layoutId,
                    });
                  }}
                >
                  <SharedPhotoShell
                    layoutId={photoLayoutId(
                      item.image,
                      `appointment-${item.title}`,
                    )}
                  >
                    <PhotoTilt className="he-appointments__media">
                      <img
                        className="he-appointments__photo"
                        src={item.image}
                        alt=""
                        width={480}
                        height={300}
                        loading="lazy"
                        decoding="async"
                      />
                    </PhotoTilt>
                  </SharedPhotoShell>
                </button>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function EducationSection({
  education,
}: {
  education: HomeExperienceProps["education"];
}) {
  return (
    <section className="he-education he__section" aria-label="Education">
      <div className="he__inner">
        <header className="he-education__header">
          <TextReveal
            text="Education"
            as="h2"
            className="he-education__title he__serif-title"
          />
        </header>

        <ol className="he-education__list">
          {education.map((item, i) => (
            <li
              key={`${item.institution}-${item.year}`}
              className="he-education__item"
            >
              <Reveal delay={i * 0.08} y={32} className="he-education__grid">
                <div className="he-education__meta">
                  <span className="he-education__year">{item.year}</span>
                  {item.location ? (
                    <span className="he-education__place">{item.location}</span>
                  ) : null}
                </div>
                <div className="he-education__body">
                  <h3 className="he-education__degree">{item.degree}</h3>
                  <p className="he-education__institution">{item.institution}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function BioSection({
  bio,
  aboutPortraitSrc,
  aboutPortraitWidth,
  aboutPortraitHeight,
}: {
  bio: string;
  aboutPortraitSrc: string;
  aboutPortraitWidth: number;
  aboutPortraitHeight: number;
}) {
  const paragraphs = splitBio(bio);

  return (
    <section className="he-bio he__section" aria-label="About">
      <div className="he__inner he-bio__layout">
        <div className="he-bio__media">
          <Reveal y={28}>
            <button
              type="button"
              className="he-photo-trigger he-photo-trigger--fill"
              aria-label="View portrait of George Zerdalis"
              onClick={(event) => {
                const layoutId = photoLayoutId(aboutPortraitSrc, "bio");
                openPhotoFromEvent(event, {
                  src: aboutPortraitSrc,
                  alt: "George Zerdalis",
                  layoutId,
                });
              }}
            >
              <SharedPhotoShell
                layoutId={photoLayoutId(aboutPortraitSrc, "bio")}
              >
                <PhotoTilt className="he-bio__frame">
                  <img
                    className="he-bio__image"
                    src={aboutPortraitSrc}
                    width={aboutPortraitWidth}
                    height={aboutPortraitHeight}
                    alt=""
                    decoding="async"
                    loading="lazy"
                  />
                </PhotoTilt>
              </SharedPhotoShell>
            </button>
          </Reveal>
        </div>

        <div className="he-bio__content">
          <div className="he-bio__heading">
            <Reveal>
              <p className="he__eyebrow">Biography</p>
            </Reveal>
            <TextReveal
              text="About"
              as="h2"
              className="he-bio__title he__serif-title"
              delay={0.05}
            />
          </div>

          <div className="he-bio__body">
            {paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={0.08 + i * 0.1} y={22}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
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
    offset: ["start 0.85", "end 0.45"],
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

function PedagogySection({
  pedagogy,
}: {
  pedagogy: HomeExperienceProps["pedagogy"];
}) {
  return (
    <section
      className="he-pedagogy he__section"
      aria-label="How George teaches"
    >
      <div className="he__inner">
        <header className="he-pedagogy__header">
          <Reveal>
            <p className="he__eyebrow">How George teaches</p>
          </Reveal>
        </header>

        <ol className="he-pedagogy__list">
          {pedagogy.map((item, i) => (
            <li key={item.title} className="he-pedagogy__item">
              <Reveal delay={i * 0.07} y={26} className="he-pedagogy__reveal">
                <div className="he-pedagogy__row">
                  <span className="he-pedagogy__num" aria-hidden="true">
                    {padIndex(i + 1)}
                  </span>
                  <span className="he-pedagogy__line">{item.title}</span>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function HomeExperience({
  portraitSrc,
  portraitWidth,
  portraitHeight,
  aboutPortraitSrc,
  aboutPortraitWidth,
  aboutPortraitHeight,
  hero,
  chapter,
  chapterImageSrc,
  chapterImageWidth,
  chapterImageHeight,
  appointments,
  education,
  bio,
  quote,
  pedagogy,
  endorsement,
  venues,
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
          <ChapterSection
            chapter={chapter}
            chapterImageSrc={chapterImageSrc}
            chapterImageWidth={chapterImageWidth}
            chapterImageHeight={chapterImageHeight}
          />
          <AppointmentsSection appointments={appointments} />
          <EducationSection education={education} />
          <BioSection
            bio={bio}
            aboutPortraitSrc={aboutPortraitSrc}
            aboutPortraitWidth={aboutPortraitWidth}
            aboutPortraitHeight={aboutPortraitHeight}
          />
          <QuoteSection quote={quote} />
          <PedagogySection pedagogy={pedagogy} />
          <VenuesMarquee venues={venues} />
        </div>
        <PhotoLightbox />
      </LayoutGroup>
    </MotionConfigProvider>
  );
}
