// src/db/database.js
const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const DB_PATH = process.env.DATABASE_PATH || './gemora.db';
const db = new Database(path.resolve(DB_PATH));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initializeDatabase() {
  db.exec(`
    -- Categories
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      imageUrl TEXT DEFAULT '',
      sortOrder INTEGER DEFAULT 0,
      createdAt INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    );

    -- Products
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoryId INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      moq TEXT DEFAULT '',
      imageUrls TEXT DEFAULT '[]',
      featured INTEGER DEFAULT 0,
      isNewArrival INTEGER DEFAULT 0,
      sku TEXT,
      subcategory TEXT,
      color TEXT,
      keyFeatures TEXT,
      createdAt INTEGER DEFAULT (strftime('%s', 'now') * 1000),
      FOREIGN KEY (categoryId) REFERENCES categories(id)
    );

    -- Inquiries
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      country TEXT DEFAULT '',
      whatsapp TEXT DEFAULT '',
      requirement TEXT DEFAULT '',
      productId INTEGER,
      status TEXT DEFAULT 'new',
      createdAt INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    );

    -- Gallery Items
    CREATE TABLE IF NOT EXISTS gallery_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imageUrl TEXT NOT NULL,
      caption TEXT DEFAULT '',
      itemType TEXT DEFAULT 'image',
      sortOrder INTEGER DEFAULT 0,
      createdAt INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    );

    -- Testimonials
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      company TEXT DEFAULT '',
      country TEXT DEFAULT '',
      text TEXT DEFAULT '',
      rating INTEGER DEFAULT 5,
      active INTEGER DEFAULT 1,
      createdAt INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    );

    -- Blog Posts
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT DEFAULT '',
      excerpt TEXT DEFAULT '',
      author TEXT DEFAULT '',
      date TEXT DEFAULT '',
      readTime TEXT DEFAULT '',
      status TEXT DEFAULT 'Draft',
      image TEXT DEFAULT '',
      content TEXT DEFAULT '',
      createdAt INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    );

    -- Catalogues
    CREATE TABLE IF NOT EXISTS catalogues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      fileUrl TEXT DEFAULT '',
      fileName TEXT DEFAULT '',
      uploadedAt TEXT DEFAULT '',
      createdAt INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    );

    -- Content (key-value store)
    CREATE TABLE IF NOT EXISTS content (
      key TEXT PRIMARY KEY,
      value TEXT DEFAULT '',
      updatedAt INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    );

    -- Admin settings
    CREATE TABLE IF NOT EXISTS admin_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updatedAt INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    );

    -- Migrations tracking
    CREATE TABLE IF NOT EXISTS migrations (
      id TEXT PRIMARY KEY,
      ranAt INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    );
  `);

  runMigrations();
}

function runMigrations() {
  // Migration 1: Seed default admin credentials
  const m1 = db.prepare("SELECT id FROM migrations WHERE id = 'admin_seed_v1'").get();
  if (!m1) {
    const bcrypt = require('bcryptjs');
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'Gemora@2024';
    const hashed = bcrypt.hashSync(password, 10);
    db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES (?, ?)").run('admin_username', username);
    db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES (?, ?)").run('admin_password_hash', hashed);
    db.prepare("INSERT INTO migrations (id) VALUES ('admin_seed_v1')").run();
    console.log('✅ Admin credentials seeded');
  }

  // Migration 2: Seed categories
  const m2 = db.prepare("SELECT id FROM migrations WHERE id = 'categories_seed_v1'").get();
  if (!m2) {
    const cats = [
      [1, "Ear Chains", "Stunning ear chain collections — American diamond, antique, rhodium, gold plated ear chains", "/assets/generated/jewellery-earrings-hd.dim_800x800.jpg", 1],
      [2, "Earrings", "Exquisite earring collections — jhumkas, jhumkis, studs, chandelier drops, moti earrings, earcuffs", "/assets/generated/jewellery-earrings-hd.dim_800x800.jpg", 2],
      [3, "Bangles & Bracelets", "Elegant gold-plated bangle sets, kada, bracelets and stackable designs", "/assets/generated/jewellery-bracelets-hd.dim_800x800.jpg", 3],
      [4, "Rings", "Statement cocktail rings, finger rings, adjustable fashion rings for every occasion", "/assets/generated/jewellery-rings-hd.dim_800x800.jpg", 4],
      [5, "Bridal Jewellery", "Complete bridal jewellery sets — kundan, polki, meenakari bridal sets for weddings", "/assets/generated/jewellery-bridal-hd.dim_800x800.jpg", 5],
      [6, "Minimal Fashion", "Modern minimalist fashion jewellery — layered chains, dainty pieces for western boutiques", "/assets/generated/jewellery-minimal-hd.dim_800x800.jpg", 6],
      [7, "Necklaces & Pendants", "Exquisite handcrafted necklaces — kundan, polki, layered chains, chokers, pendant sets", "/assets/generated/jewellery-necklace-hd.dim_800x800.jpg", 7],
      [8, "Anklets & Waist Chains", "Payal, anklets, hath pan, baju band and body jewellery", "/assets/generated/jewellery-bracelets-hd.dim_800x800.jpg", 8],
      [9, "Sets & Collections", "Complete jewellery sets — necklace, earring, maang tikka, bangles combinations", "/assets/generated/jewellery-bridal-hd.dim_800x800.jpg", 9],
    ];
    const insertCat = db.prepare("INSERT OR IGNORE INTO categories (id, name, description, imageUrl, sortOrder) VALUES (?, ?, ?, ?, ?)");
    for (const c of cats) insertCat.run(...c);
    db.prepare("INSERT INTO migrations (id) VALUES ('categories_seed_v1')").run();
    console.log('✅ Categories seeded');
  }

  // Migration 3: Seed testimonials
  const m3 = db.prepare("SELECT id FROM migrations WHERE id = 'testimonials_seed_v1'").get();
  if (!m3) {
    const tests = [
      ["Fatima Al-Hassan", "Al-Noor Boutique", "UAE", "Outstanding quality and prompt delivery. Our customers love Gemora's designs!", 5],
      ["Marie Dubois", "Paris Bijoux", "France", "Best imitation jewellery exporter we have worked with. Consistent quality every order.", 5],
      ["Sarah Johnson", "NYC Accessories", "USA", "Gemora's bridal sets are our top sellers. The craftsmanship is exceptional for the price.", 5],
      ["Ahmed Al-Rashidi", "Gulf Wholesale", "Kuwait", "Fast shipping, competitive pricing, professional team. Highly recommended.", 4],
    ];
    const insertTest = db.prepare("INSERT INTO testimonials (name, company, country, text, rating, active) VALUES (?, ?, ?, ?, ?, 1)");
    for (const t of tests) insertTest.run(...t);
    db.prepare("INSERT INTO migrations (id) VALUES ('testimonials_seed_v1')").run();
    console.log('✅ Testimonials seeded');
  }

  // Migration 4: Seed blog posts
  const m4 = db.prepare("SELECT id FROM migrations WHERE id = 'blog_seed_v1'").get();
  if (!m4) {
    const posts = [
      ["top-imitation-jewellery-trends-2026", "Top Imitation Jewellery Trends to Watch in 2026", "Trends", "From bold layered necklaces to minimalist ear cuffs, discover the hottest imitation jewellery styles dominating international markets this year.", "Priya Sharma", "March 10, 2026", "5 min read", "Published", "/assets/generated/blog-trends-2026.dim_800x500.jpg", "The global fashion jewellery market is seeing a dramatic shift in 2026..."],
      ["how-to-start-jewellery-wholesale-import-business", "How to Start a Jewellery Wholesale Import Business", "Business Guide", "A step-by-step roadmap for boutique owners and distributors looking to source premium imitation jewellery from India's top manufacturers.", "Rahul Mehta", "February 28, 2026", "7 min read", "Published", "/assets/generated/blog-wholesale-import.dim_800x500.jpg", "Starting a jewellery wholesale import business can be one of the most rewarding ventures..."],
      ["why-indian-imitation-jewellery-dominates-global-markets", "Why Indian Imitation Jewellery Dominates Global Markets", "Industry Insights", "Explore why India's imitation jewellery industry has become the go-to source for boutiques and distributors across 50+ countries.", "Neha Gupta", "February 14, 2026", "6 min read", "Published", "/assets/generated/blog-global-markets.dim_800x500.jpg", "India's dominance in the global imitation jewellery market is no accident..."],
      ["bridal-jewellery-collections-international-buyers", "Bridal Jewellery Collections: What International Buyers Want", "Collections", "Discover what wholesale buyers from the UAE, UK, and USA are seeking in bridal jewellery collections for 2026.", "Ananya Patel", "January 30, 2026", "5 min read", "Published", "/assets/generated/blog-bridal-sets.dim_800x500.jpg", "Bridal jewellery remains one of the highest-margin categories in the imitation jewellery segment..."],
      ["export-jewellery-india-usa-guide", "Export Jewellery from India to USA: Complete Guide", "Export Tips", "Everything you need to know about exporting imitation jewellery from India to the United States — regulations, shipping, and finding buyers.", "Vikram Singh", "January 15, 2026", "6 min read", "Published", "/assets/generated/blog-usa-boutiques.dim_800x500.jpg", "The USA is one of the largest importers of Indian imitation jewellery..."],
      ["private-label-jewellery-india-guide", "Private Label Jewellery Manufacturing in India", "Business Guide", "How boutiques and brands can create their own private label jewellery collections with Indian manufacturers.", "Deepika Rao", "December 20, 2025", "5 min read", "Published", "/assets/generated/blog-private-label.dim_800x500.jpg", "Private label jewellery is one of the fastest-growing segments in the global fashion accessories market..."],
    ];
    const insertPost = db.prepare("INSERT OR IGNORE INTO blog_posts (slug, title, category, excerpt, author, date, readTime, status, image, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    for (const p of posts) insertPost.run(...p);
    db.prepare("INSERT INTO migrations (id) VALUES ('blog_seed_v1')").run();
    console.log('✅ Blog posts seeded');
  }
}

module.exports = { db, initializeDatabase };
