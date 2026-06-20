#!/usr/bin/env python3
"""Split a 4x4 sticker sheet into individual transparent-background poses.

Picks 8 of the 16 cells, removes the white background via edge flood-fill
(interior whites like shirt/shoes stay opaque because the dark outline encloses
them), and writes uniform square PNGs that drop straight into the hero portrait.

Re-run after replacing the source sheet:
    python3 scripts/split_grid.py
"""
from PIL import Image, ImageDraw
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets/animate_raw/YC_Pose.png"
OUT_DIRS = [ROOT / "app/public/assets/stickers", ROOT / "assets/stickers"]

GRID = 4
CANVAS = 314          # uniform output size so every pose aligns identically
THRESH = 52           # flood-fill tolerance: eats white + soft shadow, keeps denim
SENT = (255, 0, 255)  # magenta sentinel for "this was background"

# (row, col) -> output name.  Hand-picked for variety; first is the calm default.
PICKS = [
    ((0, 0), "yc-stand"),   # hands in pockets, neutral
    ((0, 1), "yc-wave"),    # waving hello
    ((0, 2), "yc-peace"),   # peace sign
    ((1, 1), "yc-thumb"),   # thumbs up + wink
    ((1, 2), "yc-cross"),   # arms crossed
    ((2, 2), "yc-jump"),    # jumping, arms up
    ((2, 3), "yc-heart"),   # heart hands
    ((3, 3), "yc-cheer"),   # fist up + sparkles
]


def remove_bg(cell: Image.Image) -> Image.Image:
    im = cell.convert("RGB")
    w, h = im.size
    seeds = []
    for t in range(0, w, 10):
        seeds += [(t, 0), (t, h - 1)]
    for t in range(0, h, 10):
        seeds += [(0, t), (w - 1, t)]
    for s in seeds:
        if im.getpixel(s) != SENT:
            ImageDraw.floodfill(im, s, SENT, thresh=THRESH)
    rgba = im.convert("RGBA")
    px = rgba.load()
    for y in range(h):
        for x in range(w):
            if px[x, y][:3] == SENT:
                px[x, y] = (0, 0, 0, 0)
    return rgba


def main():
    sheet = Image.open(SRC).convert("RGB")
    W, H = sheet.size
    xs = [round(i * W / GRID) for i in range(GRID + 1)]
    ys = [round(i * H / GRID) for i in range(GRID + 1)]

    for d in OUT_DIRS:
        d.mkdir(parents=True, exist_ok=True)

    for (r, c), name in PICKS:
        cell = sheet.crop((xs[c], ys[r], xs[c + 1], ys[r + 1]))
        cell = cell.resize((CANVAS, CANVAS), Image.LANCZOS)
        out = remove_bg(cell)
        for d in OUT_DIRS:
            out.save(d / f"{name}.png")
        print(f"  {name}.png  <- cell ({r},{c})")

    print(f"Done: {len(PICKS)} poses -> {', '.join(str(d) for d in OUT_DIRS)}")


if __name__ == "__main__":
    main()
