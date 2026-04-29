// src/routes/categories.js
const express = require('express');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM categories ORDER BY sortOrder ASC').all();
  res.json(rows);
});

// GET /api/categories/:id
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Category not found' });
  res.json(row);
});

// POST /api/categories (Admin)
router.post('/', requireAdmin, (req, res) => {
  const { name, description = '', imageUrl = '', sortOrder = 0 } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const result = db.prepare(
    'INSERT INTO categories (name, description, imageUrl, sortOrder) VALUES (?, ?, ?, ?)'
  ).run(name, description, imageUrl, sortOrder);
  const created = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/categories/:id (Admin)
router.put('/:id', requireAdmin, (req, res) => {
  const { name, description, imageUrl, sortOrder } = req.body;
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Category not found' });
  db.prepare(
    'UPDATE categories SET name = ?, description = ?, imageUrl = ?, sortOrder = ? WHERE id = ?'
  ).run(
    name ?? existing.name,
    description ?? existing.description,
    imageUrl ?? existing.imageUrl,
    sortOrder ?? existing.sortOrder,
    req.params.id
  );
  res.json(db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id));
});

// DELETE /api/categories/:id (Admin)
router.delete('/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Category not found' });
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
