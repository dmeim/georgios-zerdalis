import { MotionConfigProvider } from "../motion";
import GlyphField from "./GlyphField";

/** Root motion config island — grain lives in global CSS (`body::before`). */
export default function SiteEffects() {
  return (
    <MotionConfigProvider>
      <GlyphField />
    </MotionConfigProvider>
  );
}
