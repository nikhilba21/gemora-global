import json
import os
import re
from datetime import datetime

BASE_URL = "https://www.gemoraglobal.co"

ALL_PAGE_ROUTES = [
    # Main Site Pages
    ("/", "1.0", "daily"),
    ("/about", "0.8", "weekly"),
    ("/products", "0.8", "weekly"),
    ("/wholesale", "0.8", "weekly"),
    ("/export", "0.8", "weekly"),
    ("/global-markets", "0.8", "weekly"),
    ("/gallery", "0.8", "weekly"),
    ("/catalogues", "0.8", "weekly"),
    ("/blog", "0.8", "daily"),
    ("/contact", "0.8", "weekly"),
    ("/why-choose-us", "0.8", "weekly"),
    ("/faq", "0.8", "weekly"),
    ("/privacy-policy", "0.5", "monthly"),
    ("/terms-and-conditions", "0.5", "monthly"),
    ("/return-refund-cancellation-policy", "0.5", "monthly"),
    
    # Primary Country SEO Pages & Regional Export Guides
    ("/imitation-jewellery-supplier-usa", "0.9", "weekly"),
    ("/wholesale-jewellery-uk", "0.9", "weekly"),
    ("/jewellery-exporter-uae", "0.9", "weekly"),
    ("/imitation-jewellery-supplier-uae", "0.9", "weekly"),
    ("/jewellery-exporter-australia", "0.9", "weekly"),
    ("/jewellery-exporter-canada", "0.9", "weekly"),
    ("/jewellery-exporter-singapore", "0.9", "weekly"),
    ("/jewellery-exporter-france", "0.9", "weekly"),
    ("/jewellery-exporter-europe", "0.9", "weekly"),
    ("/jewellery-exporter-kuwait", "0.9", "weekly"),
    ("/jewellery-exporter-malaysia", "0.9", "weekly"),
    ("/jewellery-exporter-nigeria", "0.9", "weekly"),
    ("/jewellery-exporter-saudi-arabia", "0.9", "weekly"),
    ("/jewellery-exporter-sri-lanka", "0.9", "weekly"),

    # Core B2B Wholesale Hubs & SEO Landing Pages
    ("/artificial-jewellery-wholesale", "0.9", "weekly"),
    ("/jhumka-earrings-wholesale", "0.9", "weekly"),
    ("/jhumka-earrings-wholesale-bulk", "0.8", "weekly"),
    ("/bridal-jewellery-wholesale", "0.9", "weekly"),
    ("/bridal-imitation-jewellery-wholesale", "0.8", "weekly"),
    ("/bridal-imitation-jewellery", "0.8", "weekly"),
    ("/wholesale-bridal-jewelry-sets", "0.8", "weekly"),
    ("/imitation-jewellery-exporter", "0.9", "weekly"),
    ("/imitation-jewellery-exporter-india", "0.9", "weekly"),
    ("/wholesale-imitation-jewellery-manufacturer-exporter-india", "0.9", "weekly"),
    ("/kundan-jewellery-wholesale", "0.9", "weekly"),
    ("/oxidised-jewellery-wholesale", "0.9", "weekly"),
    ("/oxidised-jewellery-supplier", "0.9", "weekly"),
    ("/oxidized-silver-jewelry-wholesale-exporter", "0.8", "weekly"),
    ("/meenakari-jewellery-wholesale", "0.8", "weekly"),
    ("/american-diamond-jewellery-wholesale", "0.8", "weekly"),
    ("/american-diamond-jewelry-exporter", "0.8", "weekly"),
    ("/gold-plated-jewellery-wholesale-india", "0.8", "weekly"),
    ("/antique-jewellery-wholesale-india", "0.8", "weekly"),
    ("/temple-jewellery-manufacturer", "0.8", "weekly"),
    ("/fashion-jewellery-exporter", "0.8", "weekly"),
    ("/fashion-jewellery-exporter-india", "0.8", "weekly"),
    ("/fashion-jewellery-manufacturer-india", "0.8", "weekly"),
    ("/custom-jewellery-manufacturer", "0.8", "weekly"),
    ("/bulk-jewellery-supplier", "0.8", "weekly"),
    ("/private-label-jewellery-india", "0.8", "weekly"),
    ("/artificial-jewellery-exporter", "0.8", "weekly"),
    ("/artificial-jewelry-exporter-moq", "0.8", "weekly"),
    ("/imitation-jewellery-manufacturer-jaipur", "0.8", "weekly"),
    ("/wholesale-jewellery-rajasthan", "0.8", "weekly"),
    ("/wholesale-jewelry-moq-50", "0.8", "weekly"),
    ("/costume-jewelry-wholesale-supplier-india", "0.8", "weekly"),
    ("/necklace-sets-wholesale-exporter", "0.8", "weekly"),
    ("/wholesale-jewelry-no-middleman", "0.8", "weekly"),
    ("/factory-direct-jewelry-exporter", "0.8", "weekly"),
    ("/products/american-diamond-jewellery", "0.9", "daily"),
]

def auto_update_all_sitemaps():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    public_dir = os.path.abspath(os.path.join(script_dir, "..", "..", "public"))
    data_file = os.path.join(public_dir, "data", "blogData62.json")
    blogs_sitemap_path = os.path.join(public_dir, "blogs-sitemap.xml")
    pages_sitemap_path = os.path.join(public_dir, "pages-sitemap.xml")
    root_sitemap_path = os.path.join(public_dir, "sitemap.xml")
    
    today_str = datetime.now().strftime("%Y-%m-%d")
    now_ts = datetime.now().timestamp()
    
    # 1. Update pages-sitemap.xml with all core pages & new SEO landing pages
    page_xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    for route, priority, freq in ALL_PAGE_ROUTES:
        url = f"{BASE_URL}{route}" if route != "/" else f"{BASE_URL}/"
        page_xml_lines.append('  <url>')
        page_xml_lines.append(f'    <loc>{url}</loc>')
        page_xml_lines.append(f'    <lastmod>{today_str}</lastmod>')
        page_xml_lines.append(f'    <changefreq>{freq}</changefreq>')
        page_xml_lines.append(f'    <priority>{priority}</priority>')
        page_xml_lines.append('  </url>')
    page_xml_lines.append('</urlset>')
    
    with open(pages_sitemap_path, "w", encoding="utf-8") as f:
        f.write("\n".join(page_xml_lines) + "\n")
    print(f"Successfully updated {pages_sitemap_path} with {len(ALL_PAGE_ROUTES)} pages!")

    # 2. Collect & build blogs-sitemap.xml
    blogs_map = {}
    if os.path.exists(data_file):
        try:
            with open(data_file, "r", encoding="utf-8") as f:
                posts = json.load(f)
                for p in posts:
                    slug = p.get("slug")
                    date_raw = p.get("date", "")
                    if slug and date_raw:
                        d_str = date_raw.split("T")[0]
                        is_published = True
                        try:
                            if "T" in date_raw:
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
            print(f"Error reading blogData62.json: {e}")

    utils_dir = os.path.abspath(script_dir)
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

    sorted_blogs = sorted(blogs_map.items(), key=lambda item: item[1], reverse=True)
    
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
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
    
    with open(blogs_sitemap_path, "w", encoding="utf-8") as f:
        f.write("\n".join(xml_lines) + "\n")
    print(f"Successfully updated {blogs_sitemap_path} with {len(sorted_blogs)} blog URLs!")

    # 3. Update lastmod in all other sitemaps to today_str
    for sm in ["sitemap.xml", "collections-sitemap.xml", "products-sitemap.xml", "image-sitemap.xml"]:
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
