import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps asset URLs relative so the build works both locally
// and when served from a subpath like https://ycl-2004.github.io/YC/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      // Multi-page build: home + standalone legal pages. Each .html is its own
      // entry, so /privacy and /terms ship as real, directly-linkable pages.
      input: {
        main: './index.html',
        privacy: './privacy.html',
        terms: './terms.html',
      },
    },
  },
})
