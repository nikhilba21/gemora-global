import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.gemoraglobal.co';
const PUBLIC_DIR = path.resolve(__dirname, '../public');

console.log('🚀 Automated Sitemap Generator running...');

// 1. Collect all blog posts from JSON files and TS files
const allBlogsMap = new Map();

// Helper to normalize date string to YYYY-MM-DD
function normalizeDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  if (dateStr.includes('T')) {
    return dateStr.split('T')[0];
  }
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  return new Date().toISOString().split('T')[0];
}

// Read blogData62.json
const json62Path = path.join(PUBLIC_DIR, 'data/blogData62.json');
if (fs.existsSync(json62Path)) {
  try {
    const raw = fs.readFileSync(json62Path, 'utf-8');
    const posts = JSON.parse(raw);
    for (const p of posts) {
      if (p.slug && p.date) {
        allBlogsMap.set(p.slug, {
          slug: p.slug,
          date: normalizeDate(p.date),
          rawDate: p.date,
          status: p.status || 'published'
        });
      }
    }
    console.log(`✅ Loaded ${posts.length} posts from blogData62.json`);
  } catch (err) {
    console.error('Error reading blogData62.json:', err);
  }
}

// Read static blogBatch*.ts files regex match
const utilsDir = path.resolve(__dirname, '../src/utils');
if (fs.existsSync(utilsDir)) {
  const files = fs.readdirSync(utilsDir);
  for (const file of files) {
    if (file.startsWith('blogBatch') && file.endsWith('.ts')) {
      const filePath = path.join(utilsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Match objects with slug and date
      const slugMatches = [...content.matchAll(/slug:\s*["']([^"']+)["']/g)];
      const dateMatches = [...content.matchAll(/date:\s*["']([^"']+)["']/g)];
      
      for (let i = 0; i < slugMatches.length; i++) {
        const slug = slugMatches[i][1];
        const dateStr = dateMatches[i] ? dateMatches[i][1] : new Date().toISOString().split('T')[0];
        if (!allBlogsMap.has(slug)) {
          allBlogsMap.set(slug, {
            slug,
            date: normalizeDate(dateStr),
            rawDate: dateStr,
            status: 'published'
          });
        }
      }
    }
  }
}

// Filter published blogs (must be past or today)
const now = new Date();
const validBlogs = [];

for (const blog of allBlogsMap.values()) {
  let publishTime;
  if (blog.rawDate.includes('T')) {
    publishTime = new Date(blog.rawDate).getTime();
  } else {
    publishTime = new Date(`${blog.date}T09:00:00+05:30`).getTime();
  }
  
  if (!isNaN(publishTime) && publishTime <= now.getTime()) {
    validBlogs.push(blog);
  }
}

// Sort by date descending
validBlogs.sort((a, b) => b.date.localeCompare(a.date));

console.log(`ℹ️ Found ${allBlogsMap.size} total blogs (${validBlogs.length} published up to today)`);

// 2. Generate blogs-sitemap.xml
const todayStr = new Date().toISOString().split('T')[0];

let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Auto-generated on build for Gemora Global Blogs -->
  <url>
    <loc>${BASE_URL}/blog</loc>
    <lastmod>${todayStr}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

for (const b of validBlogs) {
  xmlContent += `  <url>
    <loc>${BASE_URL}/blog/${b.slug}</loc>
    <lastmod>${b.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
}

xmlContent += `</urlset>`;

const blogSitemapPath = path.join(PUBLIC_DIR, 'blogs-sitemap.xml');
fs.writeFileSync(blogSitemapPath, xmlContent, 'utf-8');
console.log(`🎉 Successfully updated ${blogSitemapPath} with ${validBlogs.length} published blog URLs!`);

// 3. Update root sitemap.xml index lastmod
const rootSitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
if (fs.existsSync(rootSitemapPath)) {
  let rootXml = fs.readFileSync(rootSitemapPath, 'utf-8');
  rootXml = rootXml.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${todayStr}</lastmod>`);
  fs.writeFileSync(rootSitemapPath, rootXml, 'utf-8');
  console.log(`✅ Root sitemap.xml index lastmod updated to ${todayStr}`);
}
