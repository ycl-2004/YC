import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// base: './' keeps asset URLs relative so the build works both locally
// and when served from a subpath like https://ycl-2004.github.io/YC/
export default defineConfig({
    base: './',
    plugins: [react()],
});
