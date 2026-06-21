"""Render every wardrobe animation frame over its real stage background.

The contact sheets mirror the About-stage crop and character placement closely
enough to catch white matte, jumping silhouettes, and any frame-to-frame
composition drift before the assets are shipped.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = Path("/private/tmp/yc-wardrobe-frame-audit")
FRAME_COUNT = 16
PANEL_WIDTH = 300
PANEL_HEIGHT = 165
GAP = 8
HEADER = 24

SCENES = {
    "tidy-clothes": "city-dusk.jpg",
    "listen-music": "music-room.jpg",
    "adjust-glasses-cool": "style-studio.jpg",
    "love-brain": "flower-date.jpg",
    "late-backpack-run": "morning-platform.jpg",
}

def cover(image: Image.Image, width: int, height: int) -> Image.Image:
    scale = max(width / image.width, height / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - width) // 2
    top = (resized.height - height) // 2
    return resized.crop((left, top, left + width, top + height))


def render_frame(scene_path: Path, frame_path: Path, character_left: float) -> Image.Image:
    with Image.open(scene_path) as scene_source:
        stage = cover(scene_source.convert("RGBA"), PANEL_WIDTH, PANEL_HEIGHT)

    with Image.open(frame_path) as frame_source:
        character = frame_source.convert("RGBA")
        character.thumbnail((round(PANEL_WIDTH * 0.51), round(PANEL_HEIGHT * 1.22)), Image.Resampling.LANCZOS)

    # Matches the CSS: left: 50%; transform: translateX(-50%); bottom: -13%;
    # width: 51%; height: 122%.
    x = round(PANEL_WIDTH * character_left - character.width / 2)
    y = PANEL_HEIGHT - character.height + round(PANEL_HEIGHT * 0.08)
    stage.alpha_composite(character, (x, y))
    return stage


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    font = ImageFont.load_default()

    for slug, scene_name in SCENES.items():
        scene_path = ROOT / "public/assets/wardrobe-scenes" / scene_name
        frame_dir = ROOT / "public/assets/animate_clips/wardrobe-clean" / slug
        sheet = Image.new(
            "RGB",
            (PANEL_WIDTH * 4 + GAP * 3, (PANEL_HEIGHT + HEADER) * 4 + GAP * 3),
            "#f7f1e7",
        )
        draw = ImageDraw.Draw(sheet)

        for index in range(FRAME_COUNT):
            frame_path = frame_dir / f"frame_{index + 1:02}.png"
            panel = render_frame(scene_path, frame_path, 0.50).convert("RGB")
            column, row = index % 4, index // 4
            x = column * (PANEL_WIDTH + GAP)
            y = row * (PANEL_HEIGHT + HEADER + GAP)
            sheet.paste(panel, (x, y + HEADER))
            draw.text((x + 6, y + 6), f"{slug} · frame {index + 1:02}", fill="#3d3742", font=font)

        target = OUTPUT / f"{slug}.jpg"
        sheet.save(target, quality=94)
        print(target)


if __name__ == "__main__":
    main()
