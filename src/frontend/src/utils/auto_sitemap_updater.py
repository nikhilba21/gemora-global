import json
import os
import re
from datetime import datetime

BASE_URL = "https://www.gemoraglobal.co"

def auto_update_all_sitemaps():
    public_dir = r"d:\web_code\gemora-global\src\frontend\public"
    data_file = os.path.join(public_dir, "data", "blogData62.json")
    blogs_sitemap_path = os.path.join(public_dir, "blogs-sitemap.xml")
    root_sitemap_path = os.path.join(public_dir, "sitemap.xml")
    
    today_str = datetime.now().strftime("%Y-%m-%d")
    now_ts = datetime.now().timestamp()
    
    blogs_map = {}
    
    # 1. Load from blogData62.json
    if os.path.exists(data_file):
        try:
            with open(data_file, "r", encoding="utf-8") as f:
                posts = json.load(f)
                for p in posts:
                    slug = p.get("slug")
                    date_raw = p.get("date", "")
                    if slug and date_raw:
                        # Extract date string
                        d_str = date_raw.split("T")[0]
                        
                        # Parse time to check published vs future
                        is_published = True
                        try:
                            if "T" in date_raw:
                                # ISO string
                                d_obj = datetime.fromisoformat(date_raw.replace("Z", "+00:00"))
                            else:
                                d_obj = datetime.strptime(d_str, "%Y-%m-%d")
                            if d_obj.timestamp() > now_ts:
                                is_published = False
                        except Exception:
                            is_published = True
                            
                        if is_published:
                            blogs_map[slug] = d_str
        except Exception as e:
            print(f"Error reading blogData62.json for sitemap: {e}")

    # 2. Load from static blogBatch*.ts files
    utils_dir = r"d:\web_code\gemora-global\src\frontend\src\utils"
    if os.path.exists(utils_dir):
        for fname in os.listdir(utils_dir):
            if fname.startswith("blogBatch") and fname.endswith(".ts"):
                fpath = os.path.join(utils_dir, fname)
                with open(fpath, "r", encoding="utf-8") as f:
                    content = f.read()
                    slugs = re.findall(r'slug:\s*["\']([^"\'\n]+)["\']', content)
                    dates = re.findall(r'date:\s*["\']([^"\'\n]+)["\']', content)
                    for i, s in enumerate(slugs):
                        d_val = dates[i] if i < len(dates) else today_str
                        d_str = d_val.split("T")[0]
                        if s not in blogs_map:
                            blogs_map[s] = d_str

    print(f"Total published blogs found for sitemap: {len(blogs_map)}")

    # 3. Re-build blogs-sitemap.xml
    # Sort by date descending
    sorted_blogs = sorted(blogs_map.items(), key=lambda item: item[1], reverse=True)
    
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <!-- Auto-generated & auto-updated for Gemora Global Blogs -->',
        '  <url>',
        f'    <loc>{BASE_URL}/blog</loc>',
        f'    <lastmod>{today_str}</lastmod>',
        '    <changefreq>daily</changefreq>',
        '    <priority>1.0</priority>',
        '  </url>'
    ]
    
    for slug, d_str in sorted_blogs:
        xml_lines.append('  <url>')
        xml_lines.append(f'    <loc>{BASE_URL}/blog/{slug}</loc>')
        xml_lines.append(f'    <lastmod>{d_str}</lastmod>')
        xml_lines.append('    <changefreq>weekly</changefreq>')
        xml_lines.append('    <priority>0.9</priority>')
        xml_lines.append('  </url>')
        
    xml_lines.append('</urlset>')
    
    xml_content = "\n".join(xml_lines)
    with open(blogs_sitemap_path, "w", encoding="utf-8") as f:
        f.write(xml_content)
    print(f"Successfully auto-updated {blogs_sitemap_path} with {len(sorted_blogs)} URLs!")

    # 4. Update lastmod in all other sitemaps to today_str
    for sm in ["sitemap.xml", "pages-sitemap.xml", "collections-sitemap.xml", "products-sitemap.xml"]:
        sm_path = os.path.join(public_dir, sm)
        if os.path.exists(sm_path):
            with open(sm_path, "r", encoding="utf-8") as f:
                c = f.read()
            c_up = re.sub(r"<lastmod>.*?</lastmod>", f"<lastmod>{today_str}</lastmod>", c)
            with open(sm_path, "w", encoding="utf-8") as f:
                f.write(c_up)
            print(f"Updated lastmod in {sm} to {today_str}")

if __name__ == "__main__":
    auto_update_all_sitemaps()
