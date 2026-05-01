// src/db/database.js — PostgreSQL (persistent, never wipes on Render)
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
});

async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

// Convert SQLite ? to PostgreSQL $1,$2...
function toPostgres(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

// Returns a prepared-statement-like object (async)
function prepare(sql) {
  const pgSql = toPostgres(sql);
  return {
    async run(...params) {
      const flat = params.flat();
      // For INSERT RETURNING id
      let finalSql = pgSql;
      if (/^insert/i.test(pgSql.trim()) && !/returning/i.test(pgSql)) {
        finalSql = pgSql + ' RETURNING id';
      }
      const r = await query(finalSql, flat);
      return { lastInsertRowid: r.rows[0]?.id || 0, changes: r.rowCount };
    },
    async get(...params) {
      const flat = params.flat();
      let finalSql = pgSql;
      if (!/limit\s+\d/i.test(pgSql)) finalSql += ' LIMIT 1';
      const r = await query(finalSql, flat);
      return r.rows[0];
    },
    async all(...params) {
      const flat = params.flat();
      const r = await query(pgSql, flat);
      return r.rows;
    },
  };
}

async function initializeDatabase() {
  console.log('🔌 Connecting to PostgreSQL...');

  await query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      "imageUrl" TEXT DEFAULT '',
      "sortOrder" INTEGER DEFAULT 0,
      "createdAt" BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
    );
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      "categoryId" INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      moq TEXT DEFAULT '',
      "imageUrls" TEXT DEFAULT '[]',
      featured INTEGER DEFAULT 0,
      "isNewArrival" INTEGER DEFAULT 0,
      sku TEXT,
      subcategory TEXT,
      color TEXT,
      "keyFeatures" TEXT,
      "createdAt" BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
    );
    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT DEFAULT '',
      whatsapp TEXT DEFAULT '',
      requirement TEXT DEFAULT '',
      "productId" INTEGER,
      status TEXT DEFAULT 'new',
      "createdAt" BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
    );
    CREATE TABLE IF NOT EXISTS gallery_items (
      id SERIAL PRIMARY KEY,
      "imageUrl" TEXT NOT NULL,
      caption TEXT DEFAULT '',
      "itemType" TEXT DEFAULT 'image',
      "sortOrder" INTEGER DEFAULT 0,
      "createdAt" BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
    );
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT DEFAULT '',
      country TEXT DEFAULT '',
      text TEXT DEFAULT '',
      rating INTEGER DEFAULT 5,
      active INTEGER DEFAULT 1,
      "createdAt" BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
    );
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT DEFAULT '',
      excerpt TEXT DEFAULT '',
      author TEXT DEFAULT '',
      date TEXT DEFAULT '',
      "readTime" TEXT DEFAULT '',
      status TEXT DEFAULT 'Draft',
      image TEXT DEFAULT '',
      content TEXT DEFAULT '',
      "createdAt" BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
    );
    CREATE TABLE IF NOT EXISTS catalogues (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      "fileUrl" TEXT DEFAULT '',
      "fileName" TEXT DEFAULT '',
      "uploadedAt" TEXT DEFAULT '',
      "createdAt" BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
    );
    CREATE TABLE IF NOT EXISTS content (
      key TEXT PRIMARY KEY,
      value TEXT DEFAULT '',
      "updatedAt" BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
    );
    CREATE TABLE IF NOT EXISTS admin_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS migrations (
      id TEXT PRIMARY KEY,
      "ranAt" BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
    );
  `);

  await runMigrations();
  console.log('✅ Database ready');
}

async function runMigrations() {
  const bcrypt = require('bcryptjs');

  // Always sync admin credentials from env vars
  const u = process.env.ADMIN_USERNAME || 'admin';
  const p = process.env.ADMIN_PASSWORD || 'Gemora@2024';
  const hash = bcrypt.hashSync(p, 10);
  await query(`INSERT INTO admin_settings(key,value) VALUES('admin_username',$1)
    ON CONFLICT(key) DO UPDATE SET value=$1`, [u]);
  await query(`INSERT INTO admin_settings(key,value) VALUES('admin_password_hash',$1)
    ON CONFLICT(key) DO UPDATE SET value=$1`, [hash]);
  console.log('✅ Admin synced:', u);

  // Categories
  const m1 = await query("SELECT id FROM migrations WHERE id='cats_v1'");
  if (!m1.rows[0]) {
    const cats = [
      [1,'Ear Chains','Stunning ear chain collections','/assets/generated/jewellery-earrings-hd.dim_800x800.jpg',1],
      [2,'Earrings','Jhumkas, studs, chandelier drops, moti earrings','/assets/generated/jewellery-earrings-hd.dim_800x800.jpg',2],
      [3,'Bangles & Bracelets','Gold-plated bangle sets, kada, bracelets','/assets/generated/jewellery-bracelets-hd.dim_800x800.jpg',3],
      [4,'Rings','Statement cocktail rings, finger rings','/assets/generated/jewellery-rings-hd.dim_800x800.jpg',4],
      [5,'Bridal Jewellery','Complete bridal jewellery sets — kundan, polki, meenakari','/assets/generated/jewellery-bridal-hd.dim_800x800.jpg',5],
      [6,'Minimal Fashion','Modern minimalist fashion jewellery','/assets/generated/jewellery-minimal-hd.dim_800x800.jpg',6],
      [7,'Necklaces & Pendants','Exquisite handcrafted necklaces','/assets/generated/jewellery-necklace-hd.dim_800x800.jpg',7],
      [8,'Anklets & Waist Chains','Payal, anklets, hath pan, baju band','/assets/generated/jewellery-bracelets-hd.dim_800x800.jpg',8],
      [9,'Sets & Collections','Complete jewellery sets','/assets/generated/jewellery-bridal-hd.dim_800x800.jpg',9],
    ];
    for (const [id,name,desc,img,order] of cats) {
      await query(`INSERT INTO categories(id,name,description,"imageUrl","sortOrder")
        VALUES($1,$2,$3,$4,$5) ON CONFLICT(id) DO NOTHING`, [id,name,desc,img,order]);
    }
    await query(`SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories))`);
    await query("INSERT INTO migrations(id) VALUES('cats_v1') ON CONFLICT DO NOTHING");
    console.log('✅ Categories seeded');
  }

  // Testimonials
  const m2 = await query("SELECT id FROM migrations WHERE id='tests_v1'");
  if (!m2.rows[0]) {
    const tests = [
      ['Fatima Al-Hassan','Al-Noor Boutique','UAE',"Outstanding quality. Our customers love Gemora's designs!",5],
      ['Marie Dubois','Paris Bijoux','France','Best imitation jewellery exporter we have worked with.',5],
      ['Sarah Johnson','NYC Accessories','USA',"Gemora's bridal sets are our top sellers.",5],
      ['Ahmed Al-Rashidi','Gulf Wholesale','Kuwait','Fast shipping, competitive pricing.',4],
    ];
    for (const [name,company,country,text,rating] of tests) {
      await query('INSERT INTO testimonials(name,company,country,text,rating,active) VALUES($1,$2,$3,$4,$5,1)',
        [name,company,country,text,rating]);
    }
    await query("INSERT INTO migrations(id) VALUES('tests_v1') ON CONFLICT DO NOTHING");
    console.log('✅ Testimonials seeded');
  }

  // Blog posts
  const m3 = await query("SELECT id FROM migrations WHERE id='blog_v1'");
  if (!m3.rows[0]) {
    const posts = [
      ['top-imitation-jewellery-trends-2026','Top Imitation Jewellery Trends to Watch in 2026','Trends','From bold layered necklaces to minimalist ear cuffs.','Priya Sharma','March 10, 2026','5 min read','Published','/assets/generated/blog-trends-2026.dim_800x500.jpg','The global fashion jewellery market is seeing a dramatic shift in 2026...'],
      ['how-to-start-jewellery-wholesale-import-business','How to Start a Jewellery Wholesale Import Business','Business Guide','A step-by-step roadmap for boutique owners.','Rahul Mehta','February 28, 2026','7 min read','Published','/assets/generated/blog-wholesale-import.dim_800x500.jpg','Starting a jewellery wholesale import business can be rewarding...'],
      ['why-indian-imitation-jewellery-dominates-global-markets','Why Indian Imitation Jewellery Dominates Global Markets','Industry Insights','India is the go-to source for boutiques in 50+ countries.','Neha Gupta','February 14, 2026','6 min read','Published','/assets/generated/blog-global-markets.dim_800x500.jpg','India\'s dominance in imitation jewellery is no accident...'],
      ['bridal-jewellery-collections-international-buyers','Bridal Jewellery Collections: What International Buyers Want','Collections','UAE, UK, and USA buyers\' preferences for 2026.','Ananya Patel','January 30, 2026','5 min read','Published','/assets/generated/blog-bridal-sets.dim_800x500.jpg','Bridal jewellery remains the highest-margin category...'],
      ['export-jewellery-india-usa-guide','Export Jewellery from India to USA: Complete Guide','Export Tips','Regulations, shipping, and finding buyers.','Vikram Singh','January 15, 2026','6 min read','Published','/assets/generated/blog-usa-boutiques.dim_800x500.jpg','The USA is one of the largest importers of Indian jewellery...'],
      ['private-label-jewellery-india-guide','Private Label Jewellery Manufacturing in India','Business Guide','Create your own private label jewellery collections.','Deepika Rao','December 20, 2025','5 min read','Published','/assets/generated/blog-private-label.dim_800x500.jpg','Private label jewellery is the fastest-growing segment...'],
    ];
    for (const [slug,title,cat,excerpt,author,date,readTime,status,image,content] of posts) {
      await query(`INSERT INTO blog_posts(slug,title,category,excerpt,author,date,"readTime",status,image,content)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT(slug) DO NOTHING`,
        [slug,title,cat,excerpt,author,date,readTime,status,image,content]);
    }
    await query("INSERT INTO migrations(id) VALUES('blog_v1') ON CONFLICT DO NOTHING");
    console.log('✅ Blog seeded');
  }
}

module.exports = { query, prepare, pool, initializeDatabase };
