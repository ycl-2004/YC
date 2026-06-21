# YC Website — React + TypeScript

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
  scene auto-scroll/lightbox, name-card modal, meteors, heart burst). Mounted
  once after the React app renders in `App.tsx`.
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

The repository root no longer contains a deployable static-site fallback. Treat
`app/` as the single source of truth for runtime code, styles, public assets, and
future UI work. The only root-level asset directory kept intentionally is
`assets/animate_raw/`, which stores source sheets used by the generation scripts.

### Animated portraits

The five portrait animations are large SVG files with embedded frame images.
`index.html` preloads each lightweight first-frame PNG so a visitor sees every
portrait immediately. `MotionPortrait` then downloads the SVG at low priority
and cross-fades to it only after it has decoded, hiding the PNG so its pixels
cannot remain behind transparent animation frames. Visitors who prefer
reduced motion keep the first frame and do not download the animation. Keep
both assets together: removing the first frame brings back the blank delay on a
cold network cache.

### Wardrobe scene previews

The About section opens with a day-to-night default scene: YC looking up at the
moon on the left, coffee in hand on the right. On a desktop pointer, hovering a
look opens its matching wide scene and leaving the wardrobe area returns to
this default; on touch devices, the same selector uses a tap instead. Each
look's four topic-specific tags float around the centred character, and its
thumbnail is a miniature preview of that same environment rather than a white
portrait card.

The environments live under `public/assets/wardrobe-scenes/` and are deliberately
free of a second YC character. The animated portrait is composited as the
foreground subject. When a raw `assets/animate_raw/img_stable_*.png` sheet is
replaced, run `python3 scripts/split_stable_animations.py` from the repository
root. It recuts all five 16-frame pose animations directly into
`app/public/assets/animate_clips/wardrobe-clean/`, preserving transparent
foregrounds and removing stale frame artifacts. The app uses those cleaned copies
for both the stage and the look selector. Run `python3 scripts/audit_wardrobe_frames.py`
from `app/` to generate frame-by-frame composite contact sheets in
`/private/tmp/yc-wardrobe-frame-audit/` before shipping new animation frames. The
love-brain scene intentionally centers its character so the person joining in
later frames stays inside the stage. The default scene is generated from the
copied character reference grid by
`python3 scripts/build_wardrobe_default_stage.py`; it blends the moon and
coffee panels with a narrow soft transition, preserving the visible moon.

## Notes

- The name-card avatar that was an inline base64 image is now a real file at
  `public/assets/stickers/nc-char.png`.
