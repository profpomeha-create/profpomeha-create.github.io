import io
import re
import urllib.error
import urllib.request
from PIL import Image

BASE = 'https://aaa.is-a.dev'
HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML,'
        ' like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
}


def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, {k.lower(): v for k, v in r.getheaders()}, r.read()
    except urllib.error.HTTPError as e:
        return e.code, {k.lower(): v for k, v in e.headers.items()}, e.read()


print('=== 1. VERIFYING HTML PAGES ===')
pages = ['/', '/privacy', '/uslugi', '/keysy', '/non-existent-page-check-404']
for p in pages:
    url = BASE + p
    status, hdrs, raw = fetch(url)
    html = raw.decode('utf-8', errors='replace')
    has_ym_init = "ym(113563863, 'init'" in html
    has_ym_tag = 'tag.js?id=113563863' in html
    has_ym_noscript = 'watch/113563863' in html
    has_svg_ico = 'favicon.svg' in html
    has_120_ico = 'favicon-120x120.png' in html
    has_privacy_link = '/privacy' in html
    print(f'[{status}] {p}:')
    print(
        f'    YM init: {has_ym_init} | YM tag: {has_ym_tag} | YM noscript:'
        f' {has_ym_noscript}'
    )
    print(f'    Favicon SVG: {has_svg_ico} | Favicon 120x120: {has_120_ico}')
    print(f'    Has /privacy link: {has_privacy_link}')

print('\n=== 2. VERIFYING PRIVACY PAGE CONTENT ===')
status, hdrs, raw = fetch(BASE + '/privacy')
priv = raw.decode('utf-8', errors='replace')
print(
    '  Metrica Terms link:',
    'https://yandex.ru/legal/metrica_termsofuse/ru/' in priv,
)
print('  Yandex Confidential link:', 'https://yandex.ru/legal/confidential/' in priv)
print('  152-FZ mention:', '152-ФЗ' in priv)
print('  Counter ID 113563863:', '113563863' in priv)
print('  Opt-out link:', 'opt-out.html' in priv)

print('\n=== 3. VERIFYING FAVICONS ===')
favs = [
    ('/favicon.svg', 'SVG'),
    ('/favicon-120x120.png', 'PNG 120'),
    ('/favicon-192x192.png', 'PNG 192'),
    ('/apple-touch-icon.png', 'PNG 180'),
    ('/favicon.png', 'PNG default'),
    ('/favicon.ico', 'ICO'),
]
for f, desc in favs:
    url = BASE + f
    status, hdrs, raw = fetch(url)
    ct = hdrs.get('content-type', '')
    sz = len(raw)
    dim = ''
    if 'PNG' in desc:
        im = Image.open(io.BytesIO(raw))
        dim = f'{im.size}'
    elif 'ICO' in desc:
        im = Image.open(io.BytesIO(raw))
        dim = f"sizes={im.info.get('sizes')}"
    print(f'[{status}] {f:22} ({desc:12}): {ct:16} {dim} ({sz} bytes)')

print('\n=== 4. VERIFYING SITEMAP & ROBOTS ===')
status, hdrs, raw = fetch(BASE + '/sitemap.xml')
sitemap = raw.decode('utf-8', errors='replace')
print('  Sitemap HTTP status:', status)
print('  /privacy in sitemap:', 'https://aaa.is-a.dev/privacy' in sitemap)
print('  Total URLs in sitemap:', len(re.findall(r'<loc>', sitemap)))

status, hdrs, raw = fetch(BASE + '/robots.txt')
robots = raw.decode('utf-8', errors='replace')
print('  robots.txt status:', status)
print('  Sitemap directive in robots.txt:', 'Sitemap:' in robots)

print('\n=== 5. VERIFYING SECURITY HEADERS ===')
status, headers, raw = fetch(BASE + '/')
csp = headers.get('content-security-policy', '')
print('  CSP length:', len(csp))
print('  CSP contains mc.yandex.ru:', 'https://mc.yandex.ru' in csp)
print('  CSP contains yastatic.net:', 'https://yastatic.net' in csp)
print('  HSTS:', headers.get('strict-transport-security'))
print('  X-Frame-Options:', headers.get('x-frame-options'))
print('  X-Content-Type-Options:', headers.get('x-content-type-options'))
