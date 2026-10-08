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

    def make_icon(size: int, inner_ratio: float = 0.76) -> Image.Image:
        base = Image.new("RGBA", (size, size), (18, 19, 22, 255))
        target = int(size * inner_ratio)
        f = mark.copy()
        f.thumbnail((target, target), Image.Resampling.LANCZOS)
        base.paste(f, ((size - f.width) // 2, (size - f.height) // 2), f)
        return base

    ico_120 = make_icon(120)
    ico_120.save(PUBLIC / "favicon-120x120.png", "PNG", optimize=True)
    ico_120.save(PUBLIC / "favicon.png", "PNG", optimize=True)

    ico_192 = make_icon(192)
    ico_192.save(PUBLIC / "favicon-192x192.png", "PNG", optimize=True)

    ico_180 = make_icon(180)
    ico_180.save(PUBLIC / "apple-touch-icon.png", "PNG", optimize=True)

    ico_120.save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (120, 120)],
    )
    print("Generated all favicon variants: 120x120, 192x192, 180x180, ICO, and favicon.png")


if __name__ == "__main__":
    main()
