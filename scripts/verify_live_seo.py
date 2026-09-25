import urllib.request
import json
import re

urls = [
    "https://aaa.is-a.dev/",
    "https://aaa.is-a.dev/uslugi",
    "https://aaa.is-a.dev/uslugi/pochta",
    "https://aaa.is-a.dev/uslugi/infrastruktura",
    "https://aaa.is-a.dev/keysy",
    "https://aaa.is-a.dev/keysy/ai",
    "https://aaa.is-a.dev/keysy/uchet",
]

headers = {"User-Agent": "Mozilla/5.0 (compatible; SEOChecker/1.0)"}

for url in urls:
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            body = resp.read().decode("utf-8")
            scripts = re.findall(r'<script type="application/ld\+json">(.*?)</script>', body, re.DOTALL)
            parsed = []
            has_missing_context = False
            for s in scripts:
                data = json.loads(s)
                ctx = data.get("@context")
                typ = data.get("@type")
                if not ctx or not typ:
                    has_missing_context = True
                parsed.append(f"{typ} (@context: {ctx})")
            
            # Check links to /uslugi/pochta
            pochta_links = len(re.findall(r'href="[^"]*uslugi/pochta"', body))
            
            print(f"[{status}] {url}")
            print(f"  JSON-LD ({len(parsed)}): {', '.join(parsed)}")
            print(f"  Missing @context: {has_missing_context}")
            print(f"  Links to /uslugi/pochta: {pochta_links}")
            print()
    except Exception as e:
        print(f"ERROR {url}: {e}")
