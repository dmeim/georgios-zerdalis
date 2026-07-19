import { MotionConfigProvider } from "../motion";
import GlyphField from "./GlyphField";
import { PhotoLightbox } from "./PhotoLightbox";

/** Root motion + site-wide photo lightbox island. */
export default function SiteEffects() {
  return (
    <MotionConfigProvider>
      <GlyphField />
      <PhotoLightbox />
    </MotionConfigProvider>
  );
}
