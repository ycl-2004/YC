# YC Website — React + Tailwind

React + TypeScript + Vite version of the YC personal site. It is the deployed
version, structured into components so it is ready for future expansion
(routing, a CMS, shadcn/ui components, etc.).

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

## Deployment

GitHub Pages builds this directory with `npm ci && npm run build` and publishes
`app/dist`. The `base: './'` Vite setting keeps generated asset URLs portable for
the repository Pages path.

The original static site remains at the repository root as a local fallback and
reference. Keep its UI changes in sync only while it is still needed; GitHub
Pages serves the React build.

## Notes

- The name-card avatar that was an inline base64 image is now a real file at
  `public/assets/stickers/nc-char.png`.
