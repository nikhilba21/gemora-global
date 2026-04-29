// src/routes/products.js
const express = require('express');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

function parseProduct(row) {
  if (!row) return null;
  return {
    ...row,
    imageUrls: JSON.parse(row.imageUrls || '[]'),
    featured: row.featured === 1,
    isNewArrival: row.isNewArrival === 1,
  };
}

// GET /api/products?categoryId=1&page=0&pageSize=20
router.get('/', (req, res) => {
  const { categoryId, page, pageSize, featured, newArrivals } = req.query;

  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (categoryId) {
    query += ' AND categoryId = ?';
    params.push(parseInt(categoryId));
  }
  if (featured === 'true') {
    query += ' AND featured = 1';
  }
  if (newArrivals === 'true') {
    query += ' AND isNewArrival = 1';
  }

  query += ' ORDER BY createdAt DESC';

  // Pagination
  if (page !== undefined && pageSize !== undefined) {
    const pg = parseInt(page) || 0;
    const ps = parseInt(pageSize) || 20;
    const total = db.prepare(query.replace('SELECT *', 'SELECT COUNT(*) as count')).get(...params)?.count || 0;
    const pages = Math.max(1, Math.ceil(total / ps));
    query += ' LIMIT ? OFFSET ?';
    params.push(ps, pg * ps);
    const items = db.prepare(query).all(...params).map(parseProduct);
    return res.json({ items, total, pages });
  }

  const rows = db.prepare(query).all(...params).map(parseProduct);
  res.json(rows);
});

// GET /api/products/featured
router.get('/featured', (req, res) => {
  const rows = db.prepare('SELECT * FROM products WHERE featured = 1 ORDER BY createdAt DESC').all().map(parseProduct);
  res.json(rows);
});

// GET /api/products/new-arrivals
router.get('/new-arrivals', (req, res) => {
  const rows = db.prepare('SELECT * FROM products WHERE isNewArrival = 1 ORDER BY createdAt DESC LIMIT 8').all().map(parseProduct);
  if (rows.length > 0) return res.json(rows);
  // Fallback: latest 8 products
  const fallback = db.prepare('SELECT * FROM products ORDER BY createdAt DESC LIMIT 8').all().map(parseProduct);
  res.json(fallback);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  // Try by id first, then by slug
  let row = null;
  if (!isNaN(id)) {
    row = db.prepare('SELECT * FROM products WHERE id = ?').get(parseInt(id));
  }
  if (!row) {
    // slug match: lowercase, spaces to hyphens
    const all = db.prepare('SELECT * FROM products').all();
    row = all.find(p => p.name.toLowerCase().replace(/ /g, '-') === id) || null;
  }
  if (!row) return res.status(404).json({ error: 'Product not found' });
  res.json(parseProduct(row));
});

// POST /api/products (Admin)
router.post('/', requireAdmin, (req, res) => {
  const {
    categoryId, name, description = '', moq = '',
    imageUrls = [], featured = false, isNewArrival = false,
    sku = null, subcategory = null, color = null, keyFeatures = null
  } = req.body;
  if (!categoryId || !name) return res.status(400).json({ error: 'categoryId and name are required' });
  const result = db.prepare(`
    INSERT INTO products (categoryId, name, description, moq, imageUrls, featured, isNewArrival, sku, subcategory, color, keyFeatures)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    categoryId, name, description, moq,
    JSON.stringify(imageUrls),
    featured ? 1 : 0, isNewArrival ? 1 : 0,
    sku, subcategory, color, keyFeatures
  );
  res.status(201).json(parseProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid)));
});

// PUT /api/products/:id (Admin)
router.put('/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });
  const {
    categoryId, name, description, moq, imageUrls,
    featured, isNewArrival, sku, subcategory, color, keyFeatures
  } = req.body;
  db.prepare(`
    UPDATE products SET
      categoryId = ?, name = ?, description = ?, moq = ?, imageUrls = ?,
      featured = ?, isNewArrival = ?, sku = ?, subcategory = ?, color = ?, keyFeatures = ?
    WHERE id = ?
  `).run(
    categoryId ?? existing.categoryId,
    name ?? existing.name,
    description ?? existing.description,
    moq ?? existing.moq,
    imageUrls !== undefined ? JSON.stringify(imageUrls) : existing.imageUrls,
    featured !== undefined ? (featured ? 1 : 0) : existing.featured,
    isNewArrival !== undefined ? (isNewArrival ? 1 : 0) : existing.isNewArrival,
    sku !== undefined ? sku : existing.sku,
    subcategory !== undefined ? subcategory : existing.subcategory,
    color !== undefined ? color : existing.color,
    keyFeatures !== undefined ? keyFeatures : existing.keyFeatures,
    req.params.id
  );
  res.json(parseProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)));
});

// DELETE /api/products/:id (Admin)
router.delete('/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
