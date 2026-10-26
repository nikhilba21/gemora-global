import json
import os
import re
from datetime import datetime

base_dir = r"d:\web_code\gemora-global\src\frontend"
json_path = os.path.join(base_dir, "public", "data", "blogData62.json")
utils_dir = os.path.join(base_dir, "src", "utils")

now_ts = datetime.now().timestamp()
today_str = datetime.now().strftime("%Y-%m-%d")

blogs_by_slug = {}

# 1. Load from blogData62.json
if os.path.exists(json_path):
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        for item in data:
            slug = item.get("slug", "")
            title = item.get("title", "")
            date_raw = item.get("date", "")
            content = item.get("content", "") + " " + item.get("excerpt", "") + " " + title + " " + slug
            
            d_str = date_raw.split("T")[0] if date_raw else ""
            is_live = True
            try:
                if "T" in date_raw:
                    d_obj = datetime.fromisoformat(date_raw.replace("Z", "+00:00"))
                else:
                    d_obj = datetime.strptime(d_str, "%Y-%m-%d")
                if d_obj.timestamp() > now_ts:
                    is_live = False
            except Exception:
                is_live = True
                
            blogs_by_slug[slug] = {
                "slug": slug,
                "title": title,
                "date": d_str,
                "is_live": is_live,
                "text": content.lower()
            }

# 2. Load from blogBatch*.ts files
if os.path.exists(utils_dir):
    for fname in sorted(os.listdir(utils_dir)):
        if fname.startswith("blogBatch") and fname.endswith(".ts"):
            fpath = os.path.join(utils_dir, fname)
            with open(fpath, "r", encoding="utf-8") as f:
                content = f.read()
                slugs = re.findall(r'slug:\s*["\']([^"\'\n]+)["\']', content)
                titles = re.findall(r'title:\s*["\']([^"\'\n]+)["\']', content)
                dates = re.findall(r'date:\s*["\']([^"\'\n]+)["\']', content)
                for i, s in enumerate(slugs):
                    if s in blogs_by_slug:
                        continue
                    t = titles[i] if i < len(titles) else s
                    d_val = dates[i] if i < len(dates) else today_str
                    d_str = d_val.split("T")[0]
                    is_live = True
                    try:
                        d_obj = datetime.strptime(d_str, "%Y-%m-%d")
                        if d_obj.timestamp() > now_ts:
                            is_live = False
                    except Exception:
                        is_live = True
                    blogs_by_slug[s] = {
                        "slug": s,
                        "title": t,
                        "date": d_str,
                        "is_live": is_live,
                        "text": (t + " " + s + " " + content).lower()
                    }

all_blogs = list(blogs_by_slug.values())
live_blogs = [b for b in all_blogs if b["is_live"]]

navratri_live = [b for b in live_blogs if "navratri" in b["text"]]
garba_live = [b for b in live_blogs if ("garba" in b["text"] or "dandiya" in b["text"]) and "navratri" not in b["text"]]

scheduled_navratri = [b for b in all_blogs if not b["is_live"] and ("navratri" in b["text"] or "garba" in b["text"] or "dandiya" in b["text"])]

out = []
out.append(f"TOTAL UNIQUE BLOGS: {len(all_blogs)}")
out.append(f"TOTAL LIVE BLOGS AS OF TODAY ({today_str}): {len(live_blogs)}")
out.append(f"TOTAL LIVE NAVRATRI BLOGS: {len(navratri_live)}")
out.append(f"TOTAL LIVE GARBA/DANDIYA BLOGS: {len(garba_live)}")
out.append(f"TOTAL SCHEDULED NAVRATRI BLOGS: {len(scheduled_navratri)}")

out.append("\n=== LIVE NAVRATRI BLOGS ===")
for idx, b in enumerate(navratri_live, 1):
    out.append(f"{idx}. [{b['date']}] {b['title']}\n   https://www.gemoraglobal.co/blog/{b['slug']}")

out.append("\n=== LIVE GARBA & DANDIYA BLOGS ===")
for idx, b in enumerate(garba_live, 1):
    out.append(f"{idx}. [{b['date']}] {b['title']}\n   https://www.gemoraglobal.co/blog/{b['slug']}")

report_content = "\n".join(out)
with open(r"d:\web_code\gemora-global\scratch\navratri_report.txt", "w", encoding="utf-8") as f:
    f.write(report_content)

print(report_content)
