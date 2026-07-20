import { useEffect, useRef } from "react";

type FieldPoint = {
  x: number;
  y: number;
  radius: number;
  phase: number;
  speed: number;
  amplitude: number;
  alpha: number;
};

const SPACING = 12;
const DPR_CAP = 2;

/** Always secondary orange — never page- or primary-tinted. */
const GLYPH_RGB_LIGHT = "253, 94, 2"; // #fd5e02
const GLYPH_RGB_DARK = "255, 122, 51"; // #ff7a33

/** Dark ground needs stronger dots; light cream already reads well. */
const DARK_ALPHA_MULT = 1.5;

function isDarkTheme(): boolean {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function glyphRgb(): string {
  return isDarkTheme() ? GLYPH_RGB_DARK : GLYPH_RGB_LIGHT;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function buildGrid(width: number, height: number): FieldPoint[] {
  const points: FieldPoint[] = [];
  const cols = Math.ceil(width / SPACING) + 1;
  const rows = Math.ceil(height / SPACING) + 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      points.push({
        x: col * SPACING,
        y: row * SPACING,
        radius: 1 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 0.45,
        amplitude: 2.5 + Math.random() * 1.5,
        alpha: 0.03 + Math.random() * 0.1,
      });
    }
  }

  return points;
}

/** Soft animated dotted wave field. Fixed behind page content; decorative only. */
export default function GlyphField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let points: FieldPoint[] = [];
    let inkRgb = glyphRgb();
    let alphaMult = isDarkTheme() ? DARK_ALPHA_MULT : 1;
    let rafId = 0;
    let running = false;
    let reduced = prefersReducedMotion();
    let resizeTimer = 0;

    const syncAppearance = () => {
      inkRgb = glyphRgb();
      alphaMult = isDarkTheme() ? DARK_ALPHA_MULT : 1;
    };

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = buildGrid(w, h);
    };

    const drawFrame = (timeSec: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      for (const p of points) {
        const wave = Math.sin(timeSec * p.speed + p.phase);
        const cross = Math.cos(timeSec * p.speed * 0.8 + p.phase * 1.3);
        const x = p.x + cross * p.amplitude * 0.55;
        const y = p.y + wave * p.amplitude;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${inkRgb}, ${Math.min(1, p.alpha * alphaMult)})`;
        ctx.arc(x, y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (now: number) => {
      drawFrame(now * 0.001);
      if (running) rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduced || document.hidden) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const paintStatic = () => {
      stop();
      drawFrame(0);
    };

    const syncMotion = () => {
      reduced = prefersReducedMotion();
      if (reduced || document.hidden) paintStatic();
      else start();
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        sizeCanvas();
        if (reduced || document.hidden) paintStatic();
      }, 100);
    };

    const onVisibility = () => {
      if (document.hidden) paintStatic();
      else syncMotion();
    };

    const onAppearanceChange = () => {
      syncAppearance();
      if (reduced || document.hidden || !running) paintStatic();
    };

    const themeObserver = new MutationObserver(onAppearanceChange);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // ClientRouter can keep this island alive across soft navigations —
    // re-sync so Home never keeps a stale primary/blue ink from an older paint.
    document.addEventListener("astro:page-load", onAppearanceChange);

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => syncMotion();
    motionMq.addEventListener("change", onMotionChange);

    sizeCanvas();
    syncAppearance();
    syncMotion();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("astro:page-load", onAppearanceChange);
      motionMq.removeEventListener("change", onMotionChange);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="glyph-field"
      aria-hidden="true"
    />
  );
}
