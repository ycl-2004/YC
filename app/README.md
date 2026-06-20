# YC Website — React + Tailwind

React + TypeScript + Vite port of the original static site. Same exact view,
restructured into components so it's ready for future expansion (routing, a CMS,
shadcn/ui components, etc.).

## Run it

```bash
cd app
npm install      # first time only
npm run dev      # local dev server (http://localhost:5173)
npm run build    # production build → app/dist
npm run preview  # serve the production build locally
```

## How it's structured

- `src/components/*` — each section of the page (Hero, About, Work, Scenes, …).
- `src/effects.ts` — all interactions (custom cursor, parallax, counters,
  scene auto-scroll/lightbox, name-card modal, meteors, heart burst). Ported
  from the original `script.js`; runs once after mount in `App.tsx`.
- `src/styles.css` — the original hand-written styles, imported as-is. This is
  what guarantees the pixel-identical view.
- `src/index.css` — Tailwind directives only. **Preflight is disabled** in
  `tailwind.config.js` so Tailwind never resets / changes the existing look.
  Use Tailwind utilities freely on any new components you build.
- `src/lib/asset.ts` — resolves `assets/...` paths against Vite's base URL so
  images work both locally and under a subpath like `/YC/`.
- Brand colors and fonts are mirrored into `tailwind.config.js`
  (`bg-wine`, `text-denim`, `font-serif`, …) for new components.

## Notes

- The original static site still lives at the repo root and is what GitHub Pages
  currently deploys. This `app/` build is not wired into the Pages workflow yet —
  switch the deploy to build `app/` (or move it to the root) once you've verified
  the React version in a browser.
- The name-card avatar that was an inline base64 image is now a real file at
  `public/assets/stickers/nc-char.png`.
