#!/usr/bin/env python3
"""Split the stable 4x4 YC animation sheets into 16 clean PNG frames each.

Input:
    assets/animate_raw/img_stable_1.png ... img_stable_5.png
    assets/animate_raw/img_stable_4_extra.png (love-brain ending frames only)

Output (per pose):
    app/public/assets/animate_clips/wardrobe/<pose>/frame_01.png ... 16

Playback note
-------------
We deliberately do NOT bundle the frames into an animated WebP. libwebp encodes
each frame as a partial diff-rectangle with alpha blending, so a moving pose
blends over leftovers of the previous frame -> visible ghosting / "残影". The
web component instead swaps these full PNGs one at a time, so exactly one
complete frame is ever on screen and frames can never overlap.

Love-brain continuity
---------------------
Frames 1-11 come from ``img_stable_4.png``. Frames 12-16 use cells 12-16 of
``img_stable_4_extra.png`` so the girl remains part of the animation ending.

Background removal
------------------
The sheets do not share one flat white background: ``adjust-glasses-cool`` sits
on a cream field and ``listen-music`` draws every cell on its own white rounded
card. So removal samples each cell's actual corner colour and flood-fills
anything close to it from the edge inward. Whites enclosed by the character line
art (white sweater, white tee, sneakers) stay opaque because the flood cannot
reach them.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import shutil

from collections import deque

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT / "assets/animate_raw"
FRAME_OUT_ROOT = ROOT / "app/public/assets/animate_clips/wardrobe"
STALE_PUBLIC_FRAME_ROOT = ROOT / "app/public/assets/animate_frames/wardrobe"
STALE_DEBUG_FRAME_ROOT = ROOT / "assets/animate_frames"
STALE_CLIP_MIRROR = ROOT / "assets/animate_clips"

GRID = 4
CANVAS = 314
EDGE_CLEAR = 0           # don't shave the outer border (was clipping hair/feet)
BARRIER_EXPAND = 7       # default mask dilation to seal line-art gaps; small
                         # values free trapped card-white but risk leaking into
                         # exposed white clothes -> override per sheet below
BG_TOLERANCE = 46        # how far a pixel may drift from the sampled bg colour
HALO_PEEL_PASSES = 9     # peel trapped white that touches transparency without
                         # relying on one global value for every sheet
MIN_ISLAND_PX = 90       # drop disconnected specks / stray lines below this size


@dataclass(frozen=True)
class FrameOverride:
    """Replace one output frame with a specific cell from another source sheet."""
    target_frame: int
    source: str
    source_cell: int
    clear_number_label: bool = False


@dataclass(frozen=True)
class Sheet:
    source: str
    slug: str
    clear_number_label: bool = False
    barrier_expand: int = BARRIER_EXPAND
    crop_inset_px: int = 0
    crop_top_px: int | None = None
    frame_padding_px: int = 0
    clear_bright_edges: bool = False
    halo_peel_passes: int = HALO_PEEL_PASSES
    frame_overrides: tuple[FrameOverride, ...] = ()


SHEETS = [
    Sheet("img_stable_1.png", "tidy-clothes"),
    # listen-music draws each cell on a white rounded card. Crop inward first so
    # the neighbouring card edge is not part of the cell, then use a stronger
    # barrier to keep the white sweater from being flood-filled away.
    Sheet(
        "img_stable_2.png",
        "listen-music",
        barrier_expand=15,
        crop_inset_px=10,
        crop_top_px=0,
        frame_padding_px=12,
        clear_bright_edges=True,
    ),
    Sheet("img_stable_3.png", "adjust-glasses-cool"),
    Sheet(
        "img_stable_4.png",
        "love-brain",
        # The last five poses continue the story with the girl from Extra:
        # source cells 12-16 are row 3 / column 4, then all of row 4.
        halo_peel_passes=5,
        frame_overrides=(
            FrameOverride(12, "img_stable_4_extra.png", 12, clear_number_label=True),
            FrameOverride(13, "img_stable_4_extra.png", 13, clear_number_label=True),
            FrameOverride(14, "img_stable_4_extra.png", 14, clear_number_label=True),
            FrameOverride(15, "img_stable_4_extra.png", 15),
            FrameOverride(16, "img_stable_4_extra.png", 16),
        ),
    ),
    # White trousers have exposed outer edges, so use the gentler halo cleanup
    # that preserves the fabric while still removing the cell background.
    Sheet(
        "img_stable_5.png",
        "late-backpack-run",
        clear_number_label=True,
        halo_peel_passes=5,
    ),
]


def edge_seeds(width: int, height: int, step: int = 8) -> list[tuple[int, int]]:
    seeds: list[tuple[int, int]] = []
    for x in range(0, width, step):
        seeds.append((x, 0))
        seeds.append((x, height - 1))
    for y in range(0, height, step):
        seeds.append((0, y))
        seeds.append((width - 1, y))
    return seeds


def sample_bg_color(rgb: Image.Image) -> tuple[int, int, int]:
    """Median colour of the cell's outer ring -- the real background tone."""
    width, height = rgb.size
    pixels = rgb.load()
    probes = [
        (3, 3), (width - 4, 3), (3, height - 4), (width - 4, height - 4),
        (width // 2, 3), (3, height // 2), (width - 4, height // 2), (width // 2, height - 4),
    ]
    samples = [pixels[x, y] for x, y in probes]
    mid = len(samples) // 2
    reds = sorted(s[0] for s in samples)
    greens = sorted(s[1] for s in samples)
    blues = sorted(s[2] for s in samples)
    return reds[mid], greens[mid], blues[mid]


def make_background_test(bg_color: tuple[int, int, int]):
    """A pixel counts as background if it is close to the sampled bg colour, or
    a generic bright low-saturation tone (covers card whites + cream)."""
    bg_red, bg_green, bg_blue = bg_color

    def is_background(pixel: tuple[int, int, int]) -> bool:
        red, green, blue = pixel
        if (
            abs(red - bg_red) <= BG_TOLERANCE
            and abs(green - bg_green) <= BG_TOLERANCE
            and abs(blue - bg_blue) <= BG_TOLERANCE
        ):
            return True
        high = max(pixel)
        low = min(pixel)
        avg = (red + green + blue) / 3
        spread = high - low
        return low >= 234 or (avg >= 212 and spread <= 34)

    return is_background


def remove_background(cell: Image.Image, barrier_expand: int = BARRIER_EXPAND) -> Image.Image:
    rgb = cell.convert("RGB")
    width, height = rgb.size
    source = rgb.load()
    is_background = make_background_test(sample_bg_color(rgb))

    barrier = Image.new("L", (width, height), 0)
    barrier_pixels = barrier.load()
    for y in range(height):
        for x in range(width):
            if not is_background(source[x, y]):
                barrier_pixels[x, y] = 255

    # Close tiny antialiasing gaps in the line art so the flood-fill cannot leak
    # into the white sweater, white tee, white pants, or skin highlights.
    barrier = barrier.filter(ImageFilter.MaxFilter(barrier_expand))
    barrier_pixels = barrier.load()

    clear: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    for seed in edge_seeds(width, height, step=4):
        if seed not in clear and barrier_pixels[seed] == 0 and is_background(source[seed]):
            clear.add(seed)
            queue.append(seed)

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if nx < 0 or ny < 0 or nx >= width or ny >= height or (nx, ny) in clear:
                continue
            if barrier_pixels[nx, ny] == 0 and is_background(source[nx, ny]):
                clear.add((nx, ny))
                queue.append((nx, ny))

    rgba = rgb.convert("RGBA")
    pixels = rgba.load()
    for x, y in clear:
        pixels[x, y] = (0, 0, 0, 0)

    # Any panel line touching the crop boundary is never part of the character.
    for i in range(EDGE_CLEAR):
        for x in range(width):
            pixels[x, i] = (0, 0, 0, 0)
            pixels[x, height - 1 - i] = (0, 0, 0, 0)
        for y in range(height):
            pixels[i, y] = (0, 0, 0, 0)
            pixels[width - 1 - i, y] = (0, 0, 0, 0)

    return rgba


def is_white_halo_pixel(pixel: tuple[int, int, int, int]) -> bool:
    """Bright low-saturation pixels left as an exterior fringe after removal."""
    red, green, blue, alpha = pixel
    if alpha == 0:
        return False
    high = max(red, green, blue)
    low = min(red, green, blue)
    avg = (red + green + blue) / 3
    spread = high - low
    return (
        low >= 224
        or (avg >= 198 and spread <= 60)
        or (avg >= 182 and spread <= 30)
    )


def clear_perimeter_halo(frame: Image.Image, passes: int = HALO_PEEL_PASSES) -> Image.Image:
    """Peel a thin bright fringe that hugs the line art, edge inward only.

    Only clears bright low-saturation pixels that touch transparency, so whites
    fully enclosed by the character line art are never reached.
    """
    rgba = frame.convert("RGBA")
    width, height = rgba.size

    for _ in range(passes):
        pixels = rgba.load()
        to_clear: list[tuple[int, int]] = []
        for y in range(1, height - 1):
            for x in range(1, width - 1):
                if not is_white_halo_pixel(pixels[x, y]):
                    continue
                touches_transparency = False
                for ny in (y - 1, y, y + 1):
                    for nx in (x - 1, x, x + 1):
                        if (nx, ny) == (x, y):
                            continue
                        if pixels[nx, ny][3] == 0:
                            touches_transparency = True
                            break
                    if touches_transparency:
                        break
                if touches_transparency:
                    to_clear.append((x, y))
        if not to_clear:
            break
        for x, y in to_clear:
            pixels[x, y] = (0, 0, 0, 0)

    return rgba


def clear_top_left_label(frame: Image.Image) -> None:
    """Remove a source-frame number drawn in the top-left corner."""
    pixels = frame.load()
    for y in range(0, 58):
        for x in range(0, 64):
            pixels[x, y] = (0, 0, 0, 0)


def clear_top_card_edge(frame: Image.Image) -> None:
    """Remove the thin dark bar that bleeds in from the rounded card edge of the
    cell above (only the listen-music sheet draws each cell on a card).

    The bar is dark, low-saturation, wide, very short, and touches the top edge.
    Red hair is high-saturation, so it is never matched and stays intact.
    """
    pixels = frame.load()
    width, height = frame.size
    region = 30

    def dark_neutral(x: int, y: int) -> bool:
        red, green, blue, alpha = pixels[x, y]
        if alpha == 0:
            return False
        avg = (red + green + blue) / 3
        spread = max(red, green, blue) - min(red, green, blue)
        return avg < 110 and spread < 38

    seen: set[tuple[int, int]] = set()
    for y in range(0, region):
        for x in range(width):
            if (x, y) in seen or not dark_neutral(x, y):
                continue
            queue: deque[tuple[int, int]] = deque([(x, y)])
            seen.add((x, y))
            points: list[tuple[int, int]] = []
            while queue:
                cx, cy = queue.popleft()
                points.append((cx, cy))
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < width and 0 <= ny < region and (nx, ny) not in seen and dark_neutral(nx, ny):
                        seen.add((nx, ny))
                        queue.append((nx, ny))
            xs = [p[0] for p in points]
            ys = [p[1] for p in points]
            comp_w = max(xs) - min(xs) + 1
            comp_h = max(ys) - min(ys) + 1
            if min(ys) <= 3 and comp_w >= 34 and comp_h <= 22 and comp_w >= comp_h * 2:
                for px, py in points:
                    pixels[px, py] = (0, 0, 0, 0)


def is_bright_edge_artifact_pixel(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, alpha = pixel
    if alpha == 0:
        return False
    high = max(red, green, blue)
    low = min(red, green, blue)
    avg = (red + green + blue) / 3
    spread = high - low
    return low >= 218 or (avg >= 196 and spread <= 46)


def clear_bright_edge_artifacts(frame: Image.Image, top_seed: int = 18, side_seed: int = 10) -> Image.Image:
    """Remove card-white remnants connected to the top/side crop edges.

    This is only used for listen-music. We deliberately do not seed from the
    bottom edge because the white sweater often touches the bottom crop.
    """
    rgba = frame.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    queue: deque[tuple[int, int]] = deque()
    seen: set[tuple[int, int]] = set()

    def seed(x: int, y: int) -> None:
        if (x, y) not in seen and is_bright_edge_artifact_pixel(pixels[x, y]):
            seen.add((x, y))
            queue.append((x, y))

    for y in range(min(top_seed, height)):
        for x in range(width):
            seed(x, y)

    for y in range(height):
        for x in range(min(side_seed, width)):
            seed(x, y)
        for x in range(max(0, width - side_seed), width):
            seed(x, y)

    while queue:
        x, y = queue.popleft()
        pixels[x, y] = (0, 0, 0, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if (
                0 <= nx < width
                and 0 <= ny < height
                and (nx, ny) not in seen
                and is_bright_edge_artifact_pixel(pixels[nx, ny])
            ):
                seen.add((nx, ny))
                queue.append((nx, ny))

    return rgba


def clear_top_edge_artifacts(frame: Image.Image) -> None:
    """Drop isolated slivers that leak from the neighbouring cell above."""
    alpha = frame.getchannel("A")
    alpha_pixels = alpha.load()
    pixels = frame.load()
    width, height = frame.size
    seen: set[tuple[int, int]] = set()

    for y in range(0, 70):
        for x in range(width):
            if (x, y) in seen or alpha_pixels[x, y] == 0:
                continue
            queue: deque[tuple[int, int]] = deque([(x, y)])
            seen.add((x, y))
            points: list[tuple[int, int]] = []
            while queue:
                cx, cy = queue.popleft()
                points.append((cx, cy))
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if (
                        0 <= nx < width
                        and 0 <= ny < height
                        and (nx, ny) not in seen
                        and alpha_pixels[nx, ny] > 0
                    ):
                        seen.add((nx, ny))
                        queue.append((nx, ny))
            xs = [p[0] for p in points]
            ys = [p[1] for p in points]
            min_y, max_y = min(ys), max(ys)
            component_width = max(xs) - min(xs) + 1
            component_height = max_y - min_y + 1
            if min_y <= 48 and max_y <= 68 and component_width >= 16 and component_height <= 24:
                for px, py in points:
                    pixels[px, py] = (0, 0, 0, 0)


def remove_small_islands(frame: Image.Image) -> Image.Image:
    """Drop disconnected opaque components smaller than MIN_ISLAND_PX, keeping
    the character (and any sizeable prop). Clears leftover specks and the thin
    one-pixel lines that can cling to the crop boundary."""
    rgba = frame.convert("RGBA")
    width, height = rgba.size
    alpha = rgba.getchannel("A").load()
    pixels = rgba.load()
    seen = [[False] * width for _ in range(height)]

    for y in range(height):
        for x in range(width):
            if seen[y][x] or alpha[x, y] <= 20:
                continue
            queue: deque[tuple[int, int]] = deque([(x, y)])
            seen[y][x] = True
            points: list[tuple[int, int]] = []
            while queue:
                cx, cy = queue.popleft()
                points.append((cx, cy))
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < width and 0 <= ny < height and not seen[ny][nx] and alpha[nx, ny] > 20:
                        seen[ny][nx] = True
                        queue.append((nx, ny))
            if len(points) < MIN_ISLAND_PX:
                for px, py in points:
                    pixels[px, py] = (0, 0, 0, 0)

    return rgba


def add_frame_padding(frame: Image.Image, padding: int) -> Image.Image:
    """Inset a cleaned frame inside the same canvas to keep hover-scale edges safe."""
    if padding <= 0:
        return frame
    width, height = frame.size
    inner_width = width - padding * 2
    inner_height = height - padding * 2
    resized = frame.resize((inner_width, inner_height), Image.LANCZOS)
    padded = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    padded.paste(resized, (padding, padding), resized)
    return padded


def crop_grid_cell(image: Image.Image, sheet: Sheet, cell_number: int) -> Image.Image:
    """Crop one 1-based cell from a 4x4 source sheet with its sheet settings."""
    if not 1 <= cell_number <= GRID * GRID:
        raise ValueError(f"Cell {cell_number} is outside the {GRID}x{GRID} grid")

    width, height = image.size
    xs = [round(i * width / GRID) for i in range(GRID + 1)]
    ys = [round(i * height / GRID) for i in range(GRID + 1)]
    row, col = divmod(cell_number - 1, GRID)
    inset = sheet.crop_inset_px
    top_inset = inset if sheet.crop_top_px is None else sheet.crop_top_px
    cell = image.crop((xs[col] + inset, ys[row] + top_inset, xs[col + 1] - inset, ys[row + 1] - inset))
    return cell.resize((CANVAS, CANVAS), Image.LANCZOS)


def clean_cell(cell: Image.Image, sheet: Sheet, clear_number_label: bool = False) -> Image.Image:
    """Remove the panel background and source labels from one resized grid cell."""
    frame = remove_background(cell, sheet.barrier_expand)
    if sheet.clear_number_label or clear_number_label:
        clear_top_left_label(frame)
    clear_top_edge_artifacts(frame)
    frame = clear_perimeter_halo(frame, sheet.halo_peel_passes)
    clear_top_edge_artifacts(frame)
    clear_top_card_edge(frame)
    if sheet.clear_bright_edges:
        frame = clear_bright_edge_artifacts(frame)
        clear_top_edge_artifacts(frame)
        clear_top_card_edge(frame)
    frame = remove_small_islands(frame)
    return add_frame_padding(frame, sheet.frame_padding_px)


def split_sheet(sheet: Sheet) -> int:
    source_images = {
        sheet.source: Image.open(RAW_DIR / sheet.source).convert("RGB"),
    }
    overrides = {override.target_frame: override for override in sheet.frame_overrides}
    for override in sheet.frame_overrides:
        if override.source not in source_images:
            source_images[override.source] = Image.open(RAW_DIR / override.source).convert("RGB")

    out_dir = FRAME_OUT_ROOT / sheet.slug
    out_dir.mkdir(parents=True, exist_ok=True)
    for old_frame in out_dir.glob("frame_*.png"):
        old_frame.unlink()
    # Remove stale assets from the previous (animated WebP) pipeline.
    for name in ("clip.webp", "poster.png", "final.png"):
        old_asset = out_dir / name
        if old_asset.exists():
            old_asset.unlink()

    count = 0
    for frame_number in range(1, GRID * GRID + 1):
        override = overrides.get(frame_number)
        source_name = override.source if override else sheet.source
        source_cell = override.source_cell if override else frame_number
        cell = crop_grid_cell(source_images[source_name], sheet, source_cell)
        frame = clean_cell(cell, sheet, override.clear_number_label if override else False)
        count += 1
        frame.save(out_dir / f"frame_{count:02d}.png")

    print(f"{sheet.slug}: {count} clean PNG frames", flush=True)
    return count


def main() -> None:
    for stale in (STALE_PUBLIC_FRAME_ROOT, STALE_DEBUG_FRAME_ROOT, STALE_CLIP_MIRROR):
        if stale.exists():
            shutil.rmtree(stale)

    total = 0
    for sheet in SHEETS:
        total += split_sheet(sheet)
    print(f"Done: {total} frames across {len(SHEETS)} poses", flush=True)


if __name__ == "__main__":
    main()
