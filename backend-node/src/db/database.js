// src/db/database.js
// Uses better-sqlite3 (Render pe Node 20 ke saath perfectly kaam karta hai)
const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../gemora.db');

let db = null;

function getDb() {
  if (!db) throw new Error('DB not initialized');
  return db;
}

function initializeDatabase() {
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL, description TEXT DEFAULT '',
      imageUrl TEXT DEFAULT '', sortOrder INTEGER DEFAULT 0,
      createdAt INTEGER DEFAULT (strftime('%s','now') * 1000)
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoryId INTEGER NOT NULL, name TEXT NOT NULL,
      description TEXT DEFAULT '', moq TEXT DEFAULT '',
      imageUrls TEXT DEFAULT '[]', featured INTEGER DEFAULT 0,
      isNewArrival INTEGER DEFAULT 0, sku TEXT,
      subcategory TEXT, color TEXT, keyFeatures TEXT,
      createdAt INTEGER DEFAULT (strftime('%s','now') * 1000)
    );
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL, country TEXT DEFAULT '',
      whatsapp TEXT DEFAULT '', requirement TEXT DEFAULT '',
      productId INTEGER, status TEXT DEFAULT 'new',
      createdAt INTEGER DEFAULT (strftime('%s','now') * 1000)
    );
    CREATE TABLE IF NOT EXISTS gallery_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imageUrl TEXT NOT NULL, caption TEXT DEFAULT '',
      itemType TEXT DEFAULT 'image', sortOrder INTEGER DEFAULT 0,
      createdAt INTEGER DEFAULT (strftime('%s','now') * 1000)
    );
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL, company TEXT DEFAULT '',
      country TEXT DEFAULT '', text TEXT DEFAULT '',
      rating INTEGER DEFAULT 5, active INTEGER DEFAULT 1,
      createdAt INTEGER DEFAULT (strftime('%s','now') * 1000)
    );
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL,
      category TEXT DEFAULT '', excerpt TEXT DEFAULT '',
      author TEXT DEFAULT '', date TEXT DEFAULT '',
      readTime TEXT DEFAULT '', status TEXT DEFAULT 'Draft',
      image TEXT DEFAULT '', content TEXT DEFAULT '',
      createdAt INTEGER DEFAULT (strftime('%s','now') * 1000)
    );
    CREATE TABLE IF NOT EXISTS catalogues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL, description TEXT DEFAULT '',
      fileUrl TEXT DEFAULT '', fileName TEXT DEFAULT '',
      uploadedAt TEXT DEFAULT '',
      createdAt INTEGER DEFAULT (strftime('%s','now') * 1000)
    );
    CREATE TABLE IF NOT EXISTS content (
      key TEXT PRIMARY KEY, value TEXT DEFAULT '',
      updatedAt INTEGER DEFAULT (strftime('%s','now') * 1000)
    );
    CREATE TABLE IF NOT EXISTS admin_settings (
      key TEXT PRIMARY KEY, value TEXT NOT NULL,
      updatedAt INTEGER DEFAULT (strftime('%s','now') * 1000)
    );
    CREATE TABLE IF NOT EXISTS migrations (
      id TEXT PRIMARY KEY,
      ranAt INTEGER DEFAULT (strftime('%s','now') * 1000)
    );
  `);

  runMigrations();
  console.log('✅ Database ready:', DB_PATH);
  return db;
}

function runMigrations() {
  const bcrypt = require('bcryptjs');

  // Admin seed (first time)
  if (!db.prepare("SELECT id FROM migrations WHERE id='admin_seed_v1'").get()) {
    const u = process.env.ADMIN_USERNAME || 'admin';
    const p = process.env.ADMIN_PASSWORD || 'Gemora@2024';
    db.prepare("INSERT OR REPLACE INTO admin_settings(key,value) VALUES(?,?)").run('admin_username', u);
    db.prepare("INSERT OR REPLACE INTO admin_settings(key,value) VALUES(?,?)").run('admin_password_hash', bcrypt.hashSync(p, 10));
    db.prepare("INSERT INTO migrations(id) VALUES(?)").run('admin_seed_v1');
    console.log('✅ Admin seeded');
  }

  // Always sync credentials from env vars on every restart
  // Fixes: env vars set AFTER first DB creation cause 401
  {
    const u = process.env.ADMIN_USERNAME;
    const p = process.env.ADMIN_PASSWORD;
    if (u && p) {
      const stored = db.prepare("SELECT value FROM admin_settings WHERE key='admin_username'").get();
      if (!stored || stored.value !== u) {
        db.prepare("INSERT OR REPLACE INTO admin_settings(key,value) VALUES(?,?)").run('admin_username', u);
        db.prepare("INSERT OR REPLACE INTO admin_settings(key,value) VALUES(?,?)").run('admin_password_hash', bcrypt.hashSync(p, 10));
        console.log('✅ Admin credentials synced from env:', u);
      }
    }
  }

  // Categories seed
  if (!db.prepare("SELECT id FROM migrations WHERE id='cats_v1'").get()) {
    const ins = db.prepare("INSERT OR IGNORE INTO categories(id,name,description,imageUrl,sortOrder) VALUES(?,?,?,?,?)");
    [
      [1,"Ear Chains","Stunning ear chain collections","/assets/generated/jewellery-earrings-hd.dim_800x800.jpg",1],
      [2,"Earrings","Jhumkas, studs, chandelier drops, moti earrings","/assets/generated/jewellery-earrings-hd.dim_800x800.jpg",2],
      [3,"Bangles & Bracelets","Gold-plated bangle sets, kada, bracelets","/assets/generated/jewellery-bracelets-hd.dim_800x800.jpg",3],
      [4,"Rings","Cocktail rings, finger rings, adjustable fashion rings","/assets/generated/jewellery-rings-hd.dim_800x800.jpg",4],
      [5,"Bridal Jewellery","Kundan, polki, meenakari bridal sets","/assets/generated/jewellery-bridal-hd.dim_800x800.jpg",5],
      [6,"Minimal Fashion","Minimalist jewellery — layered chains, dainty pieces","/assets/generated/jewellery-minimal-hd.dim_800x800.jpg",6],
      [7,"Necklaces & Pendants","Kundan, polki, layered chains, chokers","/assets/generated/jewellery-necklace-hd.dim_800x800.jpg",7],
      [8,"Anklets & Waist Chains","Payal, anklets, baju band and body jewellery","/assets/generated/jewellery-bracelets-hd.dim_800x800.jpg",8],
      [9,"Sets & Collections","Complete jewellery sets — necklace, earring, maang tikka","/assets/generated/jewellery-bridal-hd.dim_800x800.jpg",9],
    ].forEach(r => ins.run(...r));
    db.prepare("INSERT INTO migrations(id) VALUES(?)").run('cats_v1');
    console.log('✅ Categories seeded');
  }

  // Testimonials seed
  if (!db.prepare("SELECT id FROM migrations WHERE id='tests_v1'").get()) {
    const ins = db.prepare("INSERT INTO testimonials(name,company,country,text,rating,active) VALUES(?,?,?,?,?,1)");
    [
      ["Fatima Al-Hassan","Al-Noor Boutique","UAE","Outstanding quality and prompt delivery. Our customers love Gemora!",5],
      ["Marie Dubois","Paris Bijoux","France","Best imitation jewellery exporter. Consistent quality every order.",5],
      ["Sarah Johnson","NYC Accessories","USA","Gemora's bridal sets are our top sellers. Exceptional craftsmanship.",5],
      ["Ahmed Al-Rashidi","Gulf Wholesale","Kuwait","Fast shipping, competitive pricing, professional team.",4],
    ].forEach(r => ins.run(...r));
    db.prepare("INSERT INTO migrations(id) VALUES(?)").run('tests_v1');
    console.log('✅ Testimonials seeded');
  }

  // Blog seed
  if (!db.prepare("SELECT id FROM migrations WHERE id='blog_v1'").get()) {
    const ins = db.prepare("INSERT OR IGNORE INTO blog_posts(slug,title,category,excerpt,author,date,readTime,status,image,content) VALUES(?,?,?,?,?,?,?,?,?,?)");
    [
      ["top-imitation-jewellery-trends-2026","Top Imitation Jewellery Trends 2026","Trends","Hottest imitation jewellery styles dominating international markets.","Priya Sharma","March 10, 2026","5 min read","Published","/assets/generated/blog-trends-2026.dim_800x500.jpg","The global fashion jewellery market is seeing a dramatic shift in 2026..."],
      ["how-to-start-jewellery-wholesale-import-business","How to Start a Jewellery Wholesale Import Business","Business Guide","Step-by-step roadmap for boutique owners to source premium jewellery from India.","Rahul Mehta","February 28, 2026","7 min read","Published","/assets/generated/blog-wholesale-import.dim_800x500.jpg","Starting a jewellery wholesale import business can be very rewarding..."],
      ["why-indian-imitation-jewellery-dominates-global-markets","Why Indian Imitation Jewellery Dominates Global Markets","Industry Insights","Why India is the go-to source for boutiques across 50+ countries.","Neha Gupta","February 14, 2026","6 min read","Published","/assets/generated/blog-global-markets.dim_800x500.jpg","India dominance in imitation jewellery is no accident..."],
    ].forEach(r => ins.run(...r));
    db.prepare("INSERT INTO migrations(id) VALUES(?)").run('blog_v1');
    console.log('✅ Blog seeded');
  }
}

module.exports = { db: new Proxy({}, { get(_, prop) { return getDb()[prop]; } }), initializeDatabase };
