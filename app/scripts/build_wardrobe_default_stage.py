"""Build the default wardrobe scene from YC's coffee and moon reference panels."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/wardrobe-default-moon-source.png"
OUTPUT = ROOT / "public/assets/wardrobe-default-coffee-moon.png"
CANVAS = (1600, 880)  # Matches the wardrobe stage's 16:8.8 silhouette.

# 3 × 3 reference-grid cells, measured from the 1254px source with its gutters.
COFFEE_BOX = (830, 29, 1224, 420)
MOON_BOX = (433, 833, 821, 1223)


def cover(image: Image.Image, target: tuple[int, int]) -> Image.Image:
    width, height = target
    scale = max(width / image.width, height / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - width) // 2
    top = (resized.height - height) // 2
    return resized.crop((left, top, left + width, top + height))


def feathered_mask(size: tuple[int, int], fade_width: int) -> Image.Image:
    width, height = size
    mask = Image.new("L", size, 255)
    pixels = mask.load()
    for x in range(fade_width):
        opacity = round(255 * x / max(1, fade_width - 1))
        for y in range(height):
            pixels[x, y] = opacity
    return mask


def main() -> None:
    with Image.open(SOURCE) as source:
        coffee = source.crop(COFFEE_BOX).convert("RGB")
        moon = source.crop(MOON_BOX).convert("RGB")

    moon_width = 950
    coffee_width = 760
    coffee_panel = ImageEnhance.Color(cover(coffee, (coffee_width, CANVAS[1]))).enhance(0.92)
    moon_panel = ImageEnhance.Color(cover(moon, (moon_width, CANVAS[1]))).enhance(0.88)

    scene = Image.new("RGBA", CANVAS, "#33404d")
    scene.alpha_composite(moon_panel.convert("RGBA"), (0, 0))

    # The two moments overlap through a broad, diffused transition rather than
    # reading as two separate cards. It is a day-to-night connection, not a split.
    coffee_x = CANVAS[0] - coffee_width
    scene.paste(coffee_panel.convert("RGBA"), (coffee_x, 0), feathered_mask((coffee_width, CANVAS[1]), 110))

    light_leak = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    glow = ImageDraw.Draw(light_leak)
    glow.ellipse((coffee_x - 180, -80, coffee_x + 210, CANVAS[1] + 80), fill=(242, 186, 133, 52))
    light_leak = light_leak.filter(ImageFilter.GaussianBlur(64))
    scene.alpha_composite(light_leak)

    scene.convert("RGB").save(OUTPUT, quality=94, subsampling=0)
    print(OUTPUT)


if __name__ == "__main__":
    main()
