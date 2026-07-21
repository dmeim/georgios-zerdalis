/** Read a CSS custom property as a resolved `rgb(...)` color (SSR-safe with fallback).
 *  `getPropertyValue` leaves `var(...)` chains unresolved — Framer color
 *  interpolation needs a concrete rgb/hex, so we resolve via a probe element. */
export function readCssColor(varName: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;

  const probe = document.createElement("span");
  probe.style.color = `var(${varName})`;
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  document.documentElement.appendChild(probe);
  const resolved = getComputedStyle(probe).color.trim();
  probe.remove();

  if (!resolved || resolved === "rgba(0, 0, 0, 0)") return fallback;
  return resolved;
}

/** Convert `#rgb` / `#rrggbb` / `rgb(...)` to `"r, g, b"` for canvas fills. */
export function cssColorToRgbTriplet(
  color: string,
  fallback = "0, 0, 0",
): string {
  const value = color.trim();

  if (value.startsWith("#")) {
    const cleaned = value.slice(1);
    const full =
      cleaned.length === 3
        ? cleaned
            .split("")
            .map((c) => c + c)
            .join("")
        : cleaned;
    if (full.length !== 6) return fallback;
    const n = parseInt(full, 16);
    if (Number.isNaN(n)) return fallback;
    return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
  }

  const match = value.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i,
  );
  if (match) {
    return `${Math.round(Number(match[1]))}, ${Math.round(Number(match[2]))}, ${Math.round(Number(match[3]))}`;
  }

  return fallback;
}
