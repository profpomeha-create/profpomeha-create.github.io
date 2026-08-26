"""Knock out the baked checkerboard and emit site logo assets."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "AAA LAB_LOGO.png"
ASSETS = ROOT / "src" / "assets"
PUBLIC = ROOT / "public"

BG = ((30, 31, 33), (90, 90, 90))


def dist2(c: tuple[int, int, int], bg: tuple[int, int, int]) -> int:
    return (c[0] - bg[0]) ** 2 + (c[1] - bg[1]) ** 2 + (c[2] - bg[2]) ** 2


def knockout(im: Image.Image) -> Image.Image:
    rgba = im.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    hard, fade = 22 * 22, 48 * 48
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            nearest = min(dist2((r, g, b), bg) for bg in BG)
            mx, mn = max(r, g, b), min(r, g, b)
            sat = mx - mn
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            if nearest <= hard or (sat < 28 and lum < 140):
                px[x, y] = (r, g, b, 0)
            elif nearest < fade and sat < 50 and lum < 175:
                alpha = int(255 * (nearest - hard) / (fade - hard))
                px[x, y] = (r, g, b, alpha)
            else:
                px[x, y] = (r, g, b, 255)
    return rgba


def crop_alpha(im: Image.Image, pad: int) -> Image.Image:
    box = im.getbbox()
    if not box:
        return im
    l, t, r, b = box
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)
    return im.crop((l, t, r, b))


def save_webp(im: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "WEBP", quality=92, method=6)
    print(f"{path.name}: {path.stat().st_size / 1024:.1f} KB {im.size}")


def main() -> None:
    raw = knockout(Image.open(SRC))
    lockup = crop_alpha(raw, 16)
    save_webp(lockup, ASSETS / "logo.webp")
    card = lockup.copy()
    card.thumbnail((640, 640), Image.Resampling.LANCZOS)
    card.save(PUBLIC / "logo.png", "PNG", optimize=True, compress_level=9)
    print(f"logo.png: {(PUBLIC / 'logo.png').stat().st_size / 1024:.1f} KB {card.size}")

    mark = crop_alpha(raw.crop((0, 0, raw.width, 640)), 8)
    save_webp(mark, ASSETS / "logo-mark.webp")

    icon = Image.new("RGBA", (96, 96), (18, 19, 22, 255))
    fitted = mark.copy()
    fitted.thumbnail((72, 72), Image.Resampling.LANCZOS)
    icon.paste(fitted, ((96 - fitted.width) // 2, (96 - fitted.height) // 2), fitted)
    icon.save(PUBLIC / "favicon.png", "PNG", optimize=True)
    print(f"favicon.png: {(PUBLIC / 'favicon.png').stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
