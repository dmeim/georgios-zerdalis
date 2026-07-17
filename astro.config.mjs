import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// Static site; Cloudflare deployment via Wrangler assets only (no @astrojs/cloudflare).
export default defineConfig({
  output: 'static',
  integrations: [react()],
});