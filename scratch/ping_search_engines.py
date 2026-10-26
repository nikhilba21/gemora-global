import urllib.request
import urllib.parse
import json

BASE_URL = "https://www.gemoraglobal.co"
SITEMAP_URL = f"{BASE_URL}/blogs-sitemap.xml"

def ping_google_and_bing():
    endpoints = [
        ("Google Sitemap Ping", f"https://www.google.com/ping?sitemap={urllib.parse.quote(SITEMAP_URL)}"),
        ("Bing Sitemap Ping", f"https://www.bing.com/ping?sitemap={urllib.parse.quote(SITEMAP_URL)}")
    ]

    for name, url in endpoints:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            with urllib.request.urlopen(req, timeout=10) as response:
                print(f"[{name}] Status: {response.status}")
        except Exception as e:
            print(f"[{name}] Ping notice: {e}")

if __name__ == "__main__":
    ping_google_and_bing()
