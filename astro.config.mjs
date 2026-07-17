import { defineConfig } from 'astro/config';

// Static site; Cloudflare deployment via Wrangler assets only (no @astrojs/cloudflare).
export default defineConfig({
  output: 'static',
});
