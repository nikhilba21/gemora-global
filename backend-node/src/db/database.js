// src/db/database.js — PostgreSQL
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

function toPostgres(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

function prepare(sql) {
  const pgSql = toPostgres(sql);
  return {
    async run(...params) {
      const flat = params.flat();
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
      slug TEXT DEFAULT '',
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
    CREATE TABLE IF NOT EXISTS gallery_folders (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      "thumbnailUrl" TEXT DEFAULT '',
      "sortOrder" INTEGER DEFAULT 0,
      "imageCount" INTEGER DEFAULT 0,
      "createdAt" BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
    );
    CREATE TABLE IF NOT EXISTS gallery_folder_images (
      id SERIAL PRIMARY KEY,
      "folderId" INTEGER NOT NULL REFERENCES gallery_folders(id) ON DELETE CASCADE,
      "imageUrl" TEXT NOT NULL,
      caption TEXT DEFAULT '',
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
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name TEXT DEFAULT '',
      company TEXT DEFAULT '',
      email TEXT DEFAULT '' UNIQUE,
      phone TEXT DEFAULT '',
      country TEXT DEFAULT '',
      "productInterest" TEXT DEFAULT '',
      source TEXT DEFAULT '',
      tags TEXT DEFAULT '',
      "emailStatus" TEXT DEFAULT 'pending',
      notes TEXT DEFAULT '',
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

  // Add slug column if it doesn't exist (migration for existing DBs)
  await query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug TEXT DEFAULT ''`).catch(() => {});

  // Add indexes for performance
  await query(`
    CREATE INDEX IF NOT EXISTS idx_products_category ON products("categoryId");
    CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
    CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON products("isNewArrival");
    CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
    CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
    CREATE INDEX IF NOT EXISTS idx_gallery_type ON gallery_items("itemType");
    CREATE INDEX IF NOT EXISTS idx_cats_slug ON categories(slug);
  `).catch(() => {});

  await runMigrations();
  console.log('✅ Database ready:', process.env.DATABASE_PATH || 'PostgreSQL');
}

async function runMigrations() {
  const bcrypt = require('bcryptjs');

  // ── Admin credentials — always sync from env ──────────────────────────────
  const u = process.env.ADMIN_USERNAME || 'admin';
  const p = process.env.ADMIN_PASSWORD || 'Gemora@2024';
  const hash = bcrypt.hashSync(p, 10);
  await query(`INSERT INTO admin_settings(key,value) VALUES('admin_username',$1) ON CONFLICT(key) DO UPDATE SET value=$1`, [u]);
  await query(`INSERT INTO admin_settings(key,value) VALUES('admin_password_hash',$1) ON CONFLICT(key) DO UPDATE SET value=$1`, [hash]);
  console.log('✅ Admin synced:', u);

  // ── 7 main categories (Kanhai structure) ─────────────────────────────────
  const m1 = await query("SELECT id FROM migrations WHERE id='cats_v2'");
  if (!m1.rows[0]) {
    const cats = [
      [10,'Imitation Jewellery','imitation-jewellery','Complete range of imitation jewellery','/assets/generated/jewellery-earrings-hd.dim_800x800.jpg',1],
      [11,'Antique Jewellery','antique-jewellery','Traditional antique finish jewellery','/assets/generated/jewellery-necklace-hd.dim_800x800.jpg',2],
      [12,'Kundan Jewellery','kundan-jewellery','Royal Kundan jewellery with stone setting','/assets/generated/jewellery-bridal-hd.dim_800x800.jpg',3],
      [13,'American Diamond Jewellery','american-diamond-jewellery','CZ / American diamond jewellery','/assets/generated/jewellery-rings-hd.dim_800x800.jpg',4],
      [14,'Indo Western Jewellery','indo-western-jewellery','Fusion Indo-Western jewellery','/assets/generated/jewellery-minimal-hd.dim_800x800.jpg',5],
      [15,'Oxidised Jewellery','oxidised-jewellery','Silver oxidised jewellery','/assets/generated/jewellery-bracelets-hd.dim_800x800.jpg',6],
      [16,'Western Jewellery','western-jewellery','Modern western fashion jewellery','/assets/generated/jewellery-minimal-hd.dim_800x800.jpg',7],
    ];
    for (const [id,name,slug,desc,img,order] of cats) {
      await query(
        `INSERT INTO categories(id,name,slug,description,"imageUrl","sortOrder")
         VALUES($1,$2,$3,$4,$5,$6)
         ON CONFLICT(id) DO UPDATE SET name=$2,slug=$3,description=$4,"imageUrl"=$5,"sortOrder"=$6`,
        [id,name,slug,desc,img,order]
      );
    }
    await query(`SELECT setval('categories_id_seq', 20)`);
    await query("INSERT INTO migrations(id) VALUES('cats_v2') ON CONFLICT DO NOTHING");
    console.log('✅ 7 main categories seeded');
  }

  // ── Testimonials ─────────────────────────────────────────────────────────
  const m2 = await query("SELECT id FROM migrations WHERE id='tests_v1'");
  if (!m2.rows[0]) {
    const tests = [
      ['Fatima Al-Hassan','Al-Noor Boutique','UAE',"Outstanding quality. Our customers love Gemora's designs!",5],
      ['Marie Dubois','Paris Bijoux','France','Best imitation jewellery exporter we have worked with.',5],
      ['Sarah Johnson','NYC Accessories','USA',"Gemora's bridal sets are our top sellers.",5],
      ['Ahmed Al-Rashidi','Gulf Wholesale','Kuwait','Fast shipping, competitive pricing.',4],
    ];
    for (const [name,company,country,text,rating] of tests) {
      await query(
        'INSERT INTO testimonials(name,company,country,text,rating,active) VALUES($1,$2,$3,$4,$5,1)',
        [name,company,country,text,rating]
      );
    }
    await query("INSERT INTO migrations(id) VALUES('tests_v1') ON CONFLICT DO NOTHING");
    console.log('✅ Testimonials seeded');
  }

  // ── Reassign old product categoryIds (1-9) to new ones (10-16) ───────────
  const mRecat = await query("SELECT id FROM migrations WHERE id='recat_v1'");
  if (!mRecat.rows[0]) {
    // Check if any products have old category IDs 1-9
    const oldProds = await query(`SELECT COUNT(*) as c FROM products WHERE "categoryId" < 10`);
    const count = parseInt(oldProds.rows[0]?.c || 0);
    if (count > 0) {
      console.log(`🔄 Reassigning ${count} products from old categories to new...`);
      // Map old IDs to new based on common subcategory patterns
      // Old: 1=Ear Chains,2=Earrings,3=Bangles,4=Rings,5=Bridal,6=Minimal,7=Necklaces,8=Anklets,9=Sets
      // New: 10=Imitation,11=Antique,12=Kundan,13=AmDiamond,14=IndoWestern,15=Oxidised,16=Western
      // Strategy: look at product name to determine correct new category
      await query('UPDATE products SET "categoryId" = CASE ' +
        'WHEN name ILIKE $1 OR name ILIKE $2 OR name ILIKE $3 THEN 11 ' +
        'WHEN name ILIKE $4 OR name ILIKE $5 OR name ILIKE $6 THEN 12 ' +
        'WHEN name ILIKE $7 OR name ILIKE $8 THEN 13 ' +
        'WHEN name ILIKE $9 OR name ILIKE $10 THEN 14 ' +
        'WHEN name ILIKE $11 OR name ILIKE $12 THEN 16 ' +
        'ELSE 10 END WHERE "categoryId" < 10',
        ['%antique%','%oxidised%','%german silver%',
         '%kundan%','%polki%','%meenakari%',
         '%american diamond%','%rhodium%',
         '%indo western%','%fusion%',
         '%western%','%minimal%']
      );
      console.log('✅ Products reassigned to new category IDs');
    }
    await query("INSERT INTO migrations(id) VALUES('recat_v1') ON CONFLICT DO NOTHING");
  }

  // ── Blog posts ────────────────────────────────────────────────────────────
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
      await query(
        `INSERT INTO blog_posts(slug,title,category,excerpt,author,date,"readTime",status,image,content)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT(slug) DO NOTHING`,
        [slug,title,cat,excerpt,author,date,readTime,status,image,content]
      );
    }
    await query("INSERT INTO migrations(id) VALUES('blog_v1') ON CONFLICT DO NOTHING");
    console.log('✅ Blog seeded');
  }
}

module.exports = { query, prepare, pool, initializeDatabase };
