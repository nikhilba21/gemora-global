// src/routes/blog.js
const express = require('express');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// GET /api/blog?status=Published&page=0&pageSize=10
router.get('/', (req, res) => {
  const { status, page, pageSize } = req.query;
  let query = 'SELECT * FROM blog_posts WHERE 1=1';
  const params = [];
  if (status) { query += ' AND status = ?'; params.push(status); }
  query += ' ORDER BY createdAt DESC';

  if (page !== undefined && pageSize !== undefined) {
    const pg = parseInt(page) || 0;
    const ps = parseInt(pageSize) || 10;
    const total = db.prepare(query.replace('SELECT *', 'SELECT COUNT(*) as count')).get(...params)?.count || 0;
    const pages = Math.max(1, Math.ceil(total / ps));
    query += ' LIMIT ? OFFSET ?';
    params.push(ps, pg * ps);
    return res.json({ items: db.prepare(query).all(...params), total, pages });
  }
  res.json(db.prepare(query).all(...params));
});

// GET /api/blog/:slug
router.get('/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Blog post not found' });
  res.json(row);
});

// POST /api/blog (Admin)
router.post('/', requireAdmin, (req, res) => {
  const { slug, title, category = '', excerpt = '', author = '', date = '', readTime = '', status = 'Draft', image = '', content = '' } = req.body;
  if (!slug || !title) return res.status(400).json({ error: 'slug and title required' });
  try {
    const r = db.prepare('INSERT INTO blog_posts (slug, title, category, excerpt, author, date, readTime, status, image, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(slug, title, category, excerpt, author, date, readTime, status, image, content);
    res.status(201).json(db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(r.lastInsertRowid));
  } catch (e) {
    if (e.message.includes('UNIQUE')) return res.status(409).json({ error: 'Slug already exists' });
    throw e;
  }
});

// PUT /api/blog/:id (Admin)
router.put('/:id', requireAdmin, (req, res) => {
  const ex = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id);
  if (!ex) return res.status(404).json({ error: 'Not found' });
  const { slug, title, category, excerpt, author, date, readTime, status, image, content } = req.body;
  db.prepare('UPDATE blog_posts SET slug=?, title=?, category=?, excerpt=?, author=?, date=?, readTime=?, status=?, image=?, content=? WHERE id=?').run(
    slug ?? ex.slug, title ?? ex.title, category ?? ex.category, excerpt ?? ex.excerpt,
    author ?? ex.author, date ?? ex.date, readTime ?? ex.readTime, status ?? ex.status,
    image ?? ex.image, content ?? ex.content, req.params.id
  );
  res.json(db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id));
});

// DELETE /api/blog/:id (Admin)
router.delete('/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM blog_posts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
