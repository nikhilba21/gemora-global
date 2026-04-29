// src/routes/gallery.js
const express = require('express');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// GET /api/gallery?itemType=image
router.get('/', (req, res) => {
  const { itemType, page, pageSize } = req.query;
  let query = 'SELECT * FROM gallery_items WHERE 1=1';
  const params = [];
  if (itemType) { query += ' AND itemType = ?'; params.push(itemType); }
  query += ' ORDER BY sortOrder ASC, id ASC';

  if (page !== undefined && pageSize !== undefined) {
    const pg = parseInt(page) || 0;
    const ps = parseInt(pageSize) || 20;
    const total = db.prepare(query.replace('SELECT *', 'SELECT COUNT(*) as count')).get(...params)?.count || 0;
    const pages = Math.max(1, Math.ceil(total / ps));
    query += ' LIMIT ? OFFSET ?';
    params.push(ps, pg * ps);
    return res.json({ items: db.prepare(query).all(...params), total, pages });
  }
  res.json(db.prepare(query).all(...params));
});

router.post('/', requireAdmin, (req, res) => {
  const { imageUrl, caption = '', itemType = 'image', sortOrder = 0 } = req.body;
  if (!imageUrl) return res.status(400).json({ error: 'imageUrl required' });
  const r = db.prepare('INSERT INTO gallery_items (imageUrl, caption, itemType, sortOrder) VALUES (?, ?, ?, ?)').run(imageUrl, caption, itemType, sortOrder);
  res.status(201).json(db.prepare('SELECT * FROM gallery_items WHERE id = ?').get(r.lastInsertRowid));
});

router.put('/:id', requireAdmin, (req, res) => {
  const ex = db.prepare('SELECT * FROM gallery_items WHERE id = ?').get(req.params.id);
  if (!ex) return res.status(404).json({ error: 'Not found' });
  const { imageUrl, caption, itemType, sortOrder } = req.body;
  db.prepare('UPDATE gallery_items SET imageUrl=?, caption=?, itemType=?, sortOrder=? WHERE id=?').run(
    imageUrl ?? ex.imageUrl, caption ?? ex.caption, itemType ?? ex.itemType, sortOrder ?? ex.sortOrder, req.params.id
  );
  res.json(db.prepare('SELECT * FROM gallery_items WHERE id = ?').get(req.params.id));
});

router.delete('/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM gallery_items WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
