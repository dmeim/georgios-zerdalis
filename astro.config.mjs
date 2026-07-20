import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// Static site; Cloudflare deployment via Wrangler assets only (no @astrojs/cloudflare).
export default defineConfig({
  site: 'https://georgios-zerdalis.dimitri-meimaridis.workers.dev',
  output: 'static',
  integrations: [react()],
});