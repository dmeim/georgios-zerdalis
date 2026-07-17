import { MotionConfigProvider } from "../motion";

/** Root motion config island — grain lives in global CSS (`body::before`). */
export default function SiteEffects() {
  return <MotionConfigProvider>{null}</MotionConfigProvider>;
}
