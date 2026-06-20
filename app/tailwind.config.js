/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // Preflight is disabled so Tailwind's reset never alters the existing
  // hand-written styles.css — the view stays pixel-identical. Tailwind
  // utilities are still fully available for future components.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        wine: '#B23A48',
        'wine-deep': '#8E2C3A',
        denim: '#3B6EA5',
        'denim-deep': '#346294',
        'denim-light': '#9DBDE0',
        'denim-soft': '#DCE7F2',
        blush: '#CB5A78',
        'blush-deep': '#9F3754',
        cream: '#FEFCF6',
        'cream-deep': '#FAF6EB',
        paper: '#FFFDF8',
        ink: '#1A1A2E',
        'ink-muted': '#4A4A5A',
        'ink-faint': '#626272',
        night: '#151821',
      },
      fontFamily: {
        serif: ['Huiwen Mincho', 'Noto Serif SC', 'serif'],
        script: ['Caveat', 'cursive'],
        deco: ['Fraunces', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
