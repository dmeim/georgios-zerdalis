/** Read a CSS custom property from :root (SSR-safe with fallback). */
export function readCssColor(varName: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim() || fallback
  );
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
