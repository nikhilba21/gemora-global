const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://gemoraglobal.co';
const API_BASE = 'https://gemora-global-2.onrender.com';
const BATCH_DIR = path.join(__dirname, '..', 'src', 'frontend', 'src', 'utils');
const JSON_FILE = path.join(__dirname, '..', 'src', 'frontend', 'src', 'data', 'blogData62.json');
const SITEMAP_FILE = path.join(__dirname, '..', 'src', 'frontend', 'public', 'sitemap.xml');

async function generateSitemap() {
  console.log('Generating sitemap...');
  let urls = [];

  // 1. Static Pages
  const staticPages = [
    '', '/wholesale', '/about', '/contact', '/privacy', '/terms', '/faq', '/products', '/blog'
  ];
  staticPages.forEach(p => urls.push(`${BASE_URL}${p}`));

  // 2. Fetch Categories from API
  try {
    const catRes = await fetch(`${API_BASE}/api/categories`);
    const categories = await catRes.json();
    categories.forEach(cat => {
      urls.push(`${BASE_URL}/products/${cat.slug}`);
    });
    console.log(`Added ${categories.length} categories.`);
  } catch (e) { console.error('Error fetching categories:', e); }

  // 3. Fetch Products from API (Iterate pages if needed)
  try {
    // We'll fetch the first 1000 products for simplicity, or loop if more
    const prodRes = await fetch(`${API_BASE}/api/products?pageSize=1000`);
    const prodData = await prodRes.json();
    const items = Array.isArray(prodData) ? prodData : (prodData.items || []);
    items.forEach(p => {
      urls.push(`${BASE_URL}/products/item/${p.id}`);
    });
    console.log(`Added ${items.length} products.`);
  } catch (e) { console.error('Error fetching products:', e); }

  // 4. Collect Blogs from static batches
  for (let i = 1; i <= 61; i++) {
    const filePath = path.join(BATCH_DIR, `blogBatch${i}.ts`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const slugMatches = content.match(/slug:\s*"(.*?)"/g);
      if (slugMatches) {
        slugMatches.forEach(m => {
          const slug = m.match(/"(.*?)"/)[1];
          urls.push(`${BASE_URL}/blog/${slug}`);
        });
      }
    }
  }

  // 5. Collect Blogs from JSON
  if (fs.existsSync(JSON_FILE)) {
    const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
    data.forEach(p => {
      urls.push(`${BASE_URL}/blog/${p.slug}`);
    });
  }
  
  // Unique URLs
  urls = [...new Set(urls)];
  console.log(`Total unique URLs: ${urls.length}`);

  // 6. Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === BASE_URL ? '1.0' : url.includes('/products/item/') ? '0.8' : '0.6'}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(SITEMAP_FILE, xml);
  console.log(`Sitemap written to ${SITEMAP_FILE}`);
}

generateSitemap();
