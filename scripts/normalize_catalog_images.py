from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SOURCE = Path("public/catalog-original")
OUTPUT = Path("public/catalog-normalized")
CANVAS = 1200
TARGET = 960


def studio_background() -> Image.Image:
    y, x = np.ogrid[:CANVAS, :CANVAS]
    distance = np.sqrt(((x - CANVAS / 2) / (CANVAS * 0.72)) ** 2 + ((y - CANVAS * 0.42) / (CANVAS * 0.78)) ** 2)
    shade = np.clip(248 - distance * 30, 216, 248).astype(np.uint8)
    rgb = np.dstack((shade, shade, np.clip(shade + 2, 0, 255).astype(np.uint8)))
    return Image.fromarray(rgb, mode="RGB").convert("RGBA")


def normalize(path: Path) -> None:
    image = Image.open(path).convert("RGBA")
    if max(image.size) > 900:
        image.thumbnail((900, 900), Image.Resampling.LANCZOS)
    rgb = np.asarray(image.convert("RGB"), dtype=np.int16)
    height, width = rgb.shape[:2]
    edge = max(3, min(height, width) // 40)
    border = np.concatenate([rgb[:edge].reshape(-1, 3), rgb[-edge:].reshape(-1, 3), rgb[:, :edge].reshape(-1, 3), rgb[:, -edge:].reshape(-1, 3)])
    background = np.median(border, axis=0)
    distance = np.sqrt(((rgb - background) ** 2).sum(axis=2))
    maximum = rgb.max(axis=2)
    minimum = rgb.min(axis=2)
    saturation = maximum - minimum
    subject_mask = (distance > 30) | (saturation > 24) | (maximum < 150)
    alpha = np.where(subject_mask, 255, np.clip((distance - 8) * 12, 0, 130)).astype(np.uint8)
    alpha_image = Image.fromarray(alpha, mode="L").filter(ImageFilter.GaussianBlur(1.2))
    image.putalpha(alpha_image)
    ys, xs = np.where(np.asarray(alpha_image) > 24)

    if len(xs) and len(ys):
        left, right = int(xs.min()), int(xs.max()) + 1
        top, bottom = int(ys.min()), int(ys.max()) + 1
        if (right - left) * (bottom - top) < width * height * 0.94:
            pad_x = max(4, int((right - left) * 0.025))
            pad_y = max(4, int((bottom - top) * 0.025))
            image = image.crop((max(0, left - pad_x), max(0, top - pad_y), min(width, right + pad_x), min(height, bottom + pad_y)))

    image.thumbnail((TARGET, TARGET), Image.Resampling.LANCZOS)
    canvas = studio_background()
    canvas.alpha_composite(image, ((CANVAS - image.width) // 2, (CANVAS - image.height) // 2))
    canvas.save(OUTPUT / f"{path.stem}.png", optimize=True)


OUTPUT.mkdir(parents=True, exist_ok=True)
for source in SOURCE.iterdir():
    if source.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".avif"}:
        normalize(source)
