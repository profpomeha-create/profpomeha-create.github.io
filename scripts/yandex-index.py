"""Notify Yandex about the live site: sitemap ping + IndexNow."""

from __future__ import annotations

import json
import ssl
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
HOST = "aaa.is-a.dev"
SITE = f"https://{HOST}"
INDEXNOW_KEY = "7c9e2b4a1f8d0635e4a0c8b7d2f1956e"
INDEXNOW_FILE = PUBLIC / f"{INDEXNOW_KEY}.txt"

NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
CTX = ssl.create_default_context()
FALLBACK = [
    f"{SITE}/",
    f"{SITE}/uslugi",
    f"{SITE}/uslugi/infrastruktura",
    f"{SITE}/uslugi/set",
    f"{SITE}/uslugi/backend",
    f"{SITE}/uslugi/pochta",
    f"{SITE}/uslugi/ai",
    f"{SITE}/keysy",
    f"{SITE}/keysy/set",
    f"{SITE}/keysy/uchet",
    f"{SITE}/keysy/pochta",
    f"{SITE}/keysy/server",
    f"{SITE}/keysy/ai",
]


def sitemap_urls() -> list[str]:
    sitemap_url = f"{SITE}/sitemap.xml"
    try:
        status, payload = request("GET", sitemap_url)
    except Exception as err:
        print(f"sitemap fetch   failed ({err})  using fallback list")
        return FALLBACK
    if status != 200 or not payload.strip():
        print(f"sitemap fetch   {status}  using fallback list")
        return FALLBACK
    try:
        root = ET.fromstring(payload)
        locs = [node.text.strip() for node in root.findall(".//sm:loc", NS) if node.text]
        return locs or FALLBACK
    except ET.ParseError:
        print("sitemap fetch   parse error  using fallback list")
        return FALLBACK


def request(method: str, url: str, body: bytes | None = None, content_type: str | None = None) -> tuple[int, str]:
    headers = {"User-Agent": "AAA-lab-yandex-index/1.0"}
    if content_type:
        headers["Content-Type"] = content_type
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, context=CTX, timeout=20) as res:
            payload = res.read().decode("utf-8", errors="replace")
            return res.status, payload
    except urllib.error.HTTPError as err:
        payload = err.read().decode("utf-8", errors="replace")
        return err.code, payload


def ping_sitemap() -> None:
    sitemap_url = f"{SITE}/sitemap.xml"
    ping = "https://webmaster.yandex.com/ping?" + urllib.parse.urlencode({"sitemap": sitemap_url})
    status, payload = request("GET", ping)
    print(f"webmaster ping  {status}  {payload.strip() or 'ok'}")


def submit_indexnow(urls: list[str]) -> None:
    if INDEXNOW_FILE.read_text(encoding="utf-8").strip() != INDEXNOW_KEY:
        raise SystemExit(f"IndexNow key file mismatch: {INDEXNOW_FILE}")

    body = json.dumps(
        {
            "host": HOST,
            "key": INDEXNOW_KEY,
            "urlList": urls,
        }
    ).encode("utf-8")
    status, payload = request(
        "POST",
        "https://yandex.com/indexnow",
        body=body,
        content_type="application/json; charset=utf-8",
    )
    hint = {
        200: "accepted",
        202: "key is waiting for verification — deploy the key file first",
    }.get(status, payload.strip() or "see Yandex docs")
    print(f"indexnow        {status}  {hint}")
    for url in urls:
        print(f"  {url}")


def main() -> None:
    urls = sitemap_urls()
    ping_sitemap()
    submit_indexnow(urls)


if __name__ == "__main__":
    main()
