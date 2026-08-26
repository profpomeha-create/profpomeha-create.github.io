"""One-shot: compress case covers to WebP and paint the Open Graph card."""

from __future__ import annotations

from pathlib import Path
import urllib.request

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "src" / "assets"
PUBLIC = ROOT / "public"
FONTS = ROOT / "scripts" / ".fonts"

COVERS = ["case-shroudme", "case-fintech", "case-mail", "case-linux", "case-ai"]
FONT_URLS = {
    "Archivo-VF.ttf": "https://github.com/google/fonts/raw/main/ofl/archivo/Archivo%5Bwdth%2Cwght%5D.ttf",
    "JetBrainsMono-VF.ttf": "https://github.com/google/fonts/raw/main/ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf",
}


def convert_covers() -> None:
    for name in COVERS:
        src = ASSETS / f"{name}.png"
        dst = ASSETS / f"{name}.webp"
        if dst.exists():
            continue
        if not src.exists():
            print(f"skip {name}: no PNG source, WebP not present")
            continue
        im = Image.open(src).convert("RGB")
        im = im.resize((1440, 960), Image.Resampling.LANCZOS)
        im.save(dst, "WEBP", quality=70, method=6)
        print(
            f"{name}: {src.stat().st_size / 1024:.0f} KB PNG -> "
            f"{dst.stat().st_size / 1024:.1f} KB WebP {im.size}"
        )


def fetch_fonts() -> dict[str, Path]:
    FONTS.mkdir(parents=True, exist_ok=True)
    out: dict[str, Path] = {}
    for name, url in FONT_URLS.items():
        path = FONTS / name
        if not path.exists():
            print(f"download {name}")
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=60) as res:
                path.write_bytes(res.read())
        out[name] = path
    return out


def load_font(path: Path, size: int, axes: list[float]) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(path), size=size)
    font.set_variation_by_axes(axes)
    return font


def paint_og(fonts: dict[str, Path]) -> None:
    w, h = 1200, 630
    void = (18, 19, 22)
    fg = (241, 239, 233)
    muted = (154, 158, 166)
    signal = (242, 161, 58)
    live = (53, 214, 138)

    img = Image.new("RGB", (w, h), void)
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Amber wash behind the plate so the card doesn't read as a void.
    wash = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    wash_draw = ImageDraw.Draw(wash)
    wash_draw.ellipse([-80, -120, 720, 520], fill=(*signal, 28))
    wash_draw.ellipse([760, 80, 1380, 700], fill=(*signal, 18))
    img = Image.alpha_composite(img.convert("RGBA"), wash.filter(ImageFilter.GaussianBlur(48)))

    # Blueprint grid
    for x in range(0, w, 48):
        draw.line([(x, 0), (x, h)], fill=(255, 255, 255, 22), width=1)
    for y in range(0, h, 48):
        draw.line([(0, y), (w, y)], fill=(255, 255, 255, 22), width=1)

    traces = [
        [(820, 80), (820, 210), (1040, 210), (1040, 340)],
        [(980, 40), (980, 140), (1120, 140), (1120, 420), (980, 420)],
        [(760, 500), (980, 500), (980, 560), (1140, 560)],
        [(860, 280), (860, 470), (1080, 470)],
    ]
    for path in traces:
        draw.line(path, fill=(*signal, 160), width=2, joint="miter")
        for pt in path:
            r = 3
            draw.rectangle([pt[0] - r, pt[1] - r, pt[0] + r, pt[1] + r], fill=(*signal, 220))

    hx, hy = 980, 280
    draw.rectangle([hx - 14, hy - 14, hx + 14, hy + 14], outline=(*signal, 240), width=2)
    draw.rectangle([hx - 4, hy - 4, hx + 4, hy + 4], fill=(*signal, 255))
    draw.ellipse([hx - 28, hy - 28, hx + 28, hy + 28], outline=(*signal, 90), width=1)

    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    tick, inset = 18, 36
    for x0, y0, dx, dy in (
        (inset, inset, 1, 1),
        (w - inset, inset, -1, 1),
        (inset, h - inset, 1, -1),
        (w - inset, h - inset, -1, -1),
    ):
        draw.line([(x0, y0), (x0 + dx * tick, y0)], fill=signal, width=2)
        draw.line([(x0, y0), (x0, y0 + dy * tick)], fill=signal, width=2)

    lockup = Image.open(ASSETS / "logo.webp").convert("RGBA")
    lockup.thumbnail((360, 360), Image.Resampling.LANCZOS)
    img.paste(lockup, (48, 86), lockup)

    display_sm = load_font(fonts["Archivo-VF.ttf"], 26, [700, 110])
    mono = load_font(fonts["JetBrainsMono-VF.ttf"], 18, [500])
    mono_sm = load_font(fonts["JetBrainsMono-VF.ttf"], 15, [500])

    draw.text((64, 52), "AAA LAB  ·  ИНФРА В ПРОДЕ", font=mono_sm, fill=muted)
    draw.rectangle([64, 86, 72, 94], fill=live)

    draw.text((64, 392), "FULL-STACK  ·  DEVOPS  ·  NETWORK", font=display_sm, fill=fg)

    specs = [("SHROUDME", "VPN"), ("FINTECH", "Учёт"), ("MAILCOW", "Edge")]
    x = 64
    for key, value in specs:
        draw.line([(x, 440), (x + 210, 440)], fill=(255, 255, 255, 48), width=1)
        draw.text((x, 454), key, font=mono_sm, fill=muted)
        draw.text((x, 480), value, font=mono, fill=fg)
        x += 240

    draw.text((64, 552), "aaa.is-a.dev", font=mono, fill=signal)

    out = PUBLIC / "og.png"
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"og.png: {out.stat().st_size / 1024:.1f} KB {img.size}")


def main() -> None:
    convert_covers()
    fonts = fetch_fonts()
    paint_og(fonts)


if __name__ == "__main__":
    main()
