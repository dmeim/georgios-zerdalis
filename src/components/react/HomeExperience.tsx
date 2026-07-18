import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  useEffect,
  useId,
  useState,
  useRef,
  type FocusEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Magnetic,
  MotionConfigProvider,
  Reveal,
  TextReveal,
} from "../motion";
import "./HomeExperience.css";

export type HomeExperienceProps = {
  portraitSrc: string;
  portraitWidth: number;
  portraitHeight: number;
  hero: {
    name: string;
    role: string;
    sentence: string;
    ctas: { label: string; href: string }[];
  };
  chapter: { eyebrow: string; title: string; body: string };
  appointments: {
    title: string;
    organization: string;
    location?: string;
    dates: string;
    bullets?: string[];
    image: string;
    url: string;
  }[];
  bio: string;
  quote: { text: string; attribution?: string };
  pedagogy: { title: string; body: string }[];
  endorsement: { label: string; url: string };
  venues: { name: string; place: string; image: string }[];
};

function useCanHover() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return canHover;
}

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

  return (
    <motion.span
      className="he-quote__word"
      style={{ opacity }}
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
  reduced,
}: {
  portraitSrc: string;
  portraitWidth: number;
  portraitHeight: number;
  hero: HomeExperienceProps["hero"];
  reduced: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canHover = useCanHover();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* y drifts down; scale grows from top (CSS transform-origin) so the frame top stays pinned */
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springTiltX = useSpring(tiltX, { stiffness: 160, damping: 22, mass: 0.4 });
  const springTiltY = useSpring(tiltY, { stiffness: 160, damping: 22, mass: 0.4 });

  function onFramePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (reduced || !canHover || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(px * 6);
    tiltX.set(py * -5);
  }

  function onFramePointerLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <section
      ref={ref}
      className="he-hero he__bleed"
      aria-label="Introduction"
    >
      <div className="he-hero__layout">
        <div className="he-hero__content">
          <motion.div
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

            <motion.p
              className="he-hero__role"
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: EASE },
                },
              }}
            >
              {hero.role}
            </motion.p>

            <motion.p
              className="he-hero__sentence"
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: EASE },
                },
              }}
            >
              {hero.sentence}
            </motion.p>

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

        <div className="he-hero__media" aria-hidden="true">
          <motion.div
            ref={frameRef}
            className="he-hero__frame"
            style={
              reduced || !canHover
                ? undefined
                : {
                    rotateX: springTiltX,
                    rotateY: springTiltY,
                    transformPerspective: 1200,
                  }
            }
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
            onPointerMove={onFramePointerMove}
            onPointerLeave={onFramePointerLeave}
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
          </motion.div>
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
}: {
  chapter: HomeExperienceProps["chapter"];
}) {
  const reduced = useReducedMotion();

  return (
    <section className="he-chapter he__section" aria-label={chapter.title}>
      <div className="he__inner">
        <Reveal>
          <p className="he__eyebrow">{chapter.eyebrow}</p>
        </Reveal>

        <motion.span
          className="he-chapter__rule"
          aria-hidden="true"
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={reduced ? undefined : { scaleX: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        />

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
    </section>
  );
}

function VenueCard({
  venue,
  ariaHidden,
}: {
  venue: HomeExperienceProps["venues"][number];
  ariaHidden?: boolean;
}) {
  return (
    <figure
      className="he-venues__item"
      aria-hidden={ariaHidden ? true : undefined}
    >
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
    <section className="he-venues he__bleed" aria-label="Stages">
      <p className="he-venues__label">Stages</p>

      {reduced ? (
        <div className="he-venues__static">
          {items.map((venue) => (
            <VenueCard
              key={`${venue.name}-${venue.place}`}
              venue={venue}
            />
          ))}
        </div>
      ) : (
        <div className="he-venues__track-wrap">
          <div className="he-venues__track he-venues__track--animate">
            <div className="he-venues__group">
              {loop.map((venue, i) => (
                <VenueCard
                  key={`${venue.name}-${i}`}
                  venue={venue}
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
          <Reveal>
            <p className="he__eyebrow">Selected appointments</p>
          </Reveal>
          <TextReveal
            text="Where the work lives"
            as="h2"
            className="he-appointments__title he__serif-title"
            delay={0.06}
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
                <figure className="he-appointments__media">
                  <img
                    className="he-appointments__photo"
                    src={item.image}
                    alt=""
                    width={480}
                    height={300}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function BioSection({ bio }: { bio: string }) {
  const paragraphs = splitBio(bio);

  return (
    <section className="he-bio he__section" aria-label="About">
      <div className="he__inner he-bio__grid">
        <div className="he-bio__sticky">
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
  const canHover = useCanHover();
  const reduced = useReducedMotion();
  const panelId = useId();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [pinnedId, setPinnedId] = useState<number | null>(null);

  const activeId = hoveredId ?? pinnedId;
  const activeItem = activeId !== null ? pedagogy[activeId] : null;

  function activateFromHover(index: number) {
    if (!canHover) return;
    if (pinnedId !== null && pinnedId !== index) {
      setPinnedId(index);
    }
    setHoveredId(index);
  }

  function clearHover() {
    if (!canHover) return;
    setHoveredId(null);
  }

  function handleListBlur(event: FocusEvent<HTMLOListElement>) {
    if (!canHover) return;
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) return;
    setHoveredId(null);
  }

  function togglePin(index: number) {
    setPinnedId((current) => (current === index ? null : index));
  }

  return (
    <section
      className="he-pedagogy he__section"
      aria-label="How Georgios teaches"
    >
      <div className="he__inner">
        <header className="he-pedagogy__header">
          <Reveal>
            <p className="he__eyebrow">How Georgios teaches</p>
          </Reveal>
        </header>

        <div className="he-pedagogy__layout">
          <ol
            className="he-pedagogy__list"
            onMouseLeave={clearHover}
            onBlur={handleListBlur}
          >
            {pedagogy.map((item, i) => {
              const isActive = activeId === i;
              const isPinned = pinnedId === i;

              return (
                <li key={item.title} className="he-pedagogy__item">
                  <Reveal
                    delay={i * 0.07}
                    y={26}
                    className="he-pedagogy__reveal"
                  >
                    <button
                      type="button"
                      className={
                        isActive
                          ? "he-pedagogy__trigger is-active"
                          : "he-pedagogy__trigger"
                      }
                      aria-expanded={isActive}
                      aria-controls={panelId}
                      data-pinned={isPinned ? "true" : undefined}
                      onMouseEnter={() => activateFromHover(i)}
                      onFocus={() => activateFromHover(i)}
                      onClick={() => togglePin(i)}
                    >
                      <span className="he-pedagogy__num" aria-hidden="true">
                        {padIndex(i + 1)}
                      </span>
                      <span className="he-pedagogy__line">{item.title}</span>
                    </button>
                  </Reveal>
                </li>
              );
            })}
          </ol>

          <div
            id={panelId}
            className="he-pedagogy__panel"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence mode="wait">
              {activeItem ? (
                <motion.div
                  key={activeItem.title}
                  className="he-pedagogy__detail"
                  initial={
                    reduced ? false : { opacity: 0, x: 18, filter: "blur(4px)" }
                  }
                  animate={
                    reduced
                      ? { opacity: 1 }
                      : { opacity: 1, x: 0, filter: "blur(0px)" }
                  }
                  exit={
                    reduced
                      ? { opacity: 0 }
                      : { opacity: 0, x: 12, filter: "blur(4px)" }
                  }
                  transition={{ duration: reduced ? 0 : 0.38, ease: EASE }}
                >
                  <p className="he-pedagogy__body">{activeItem.body}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function CloseSection({
  endorsement,
}: {
  endorsement: HomeExperienceProps["endorsement"];
}) {
  return (
    <section
      className="he-close he__section"
      aria-label="Begin a conversation"
    >
      <div className="he__inner">
        <Reveal>
          <p className="he-close__endorse">
            <Magnetic strength={0.18}>
              <a
                className="he-close__endorse-link"
                href={endorsement.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {endorsement.label}
              </a>
            </Magnetic>
          </p>
        </Reveal>

        <TextReveal
          text="Begin a conversation"
          as="h2"
          className="he-close__title he__serif-title"
          delay={0.08}
        />

        <Reveal delay={0.12}>
          <p className="he-close__body">
            For collaborations, lessons, or inquiries — Georgios welcomes your
            message.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <Magnetic strength={0.25}>
            <a className="btn btn--primary he-close__cta" href="/connect">
              Get in Touch
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

export default function HomeExperience({
  portraitSrc,
  portraitWidth,
  portraitHeight,
  hero,
  chapter,
  appointments,
  bio,
  quote,
  pedagogy,
  endorsement,
  venues,
}: HomeExperienceProps) {
  const reduced = useReducedMotion();

  return (
    <MotionConfigProvider>
      <div className="he">
        <HeroSection
          portraitSrc={portraitSrc}
          portraitWidth={portraitWidth}
          portraitHeight={portraitHeight}
          hero={hero}
          reduced={Boolean(reduced)}
        />
        <ChapterSection chapter={chapter} />
        <VenuesMarquee venues={venues} />
        <AppointmentsSection appointments={appointments} />
        <BioSection bio={bio} />
        <QuoteSection quote={quote} />
        <PedagogySection pedagogy={pedagogy} />
        <CloseSection endorsement={endorsement} />
      </div>
    </MotionConfigProvider>
  );
}
