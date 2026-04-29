// src/routes/inquiries.js
const express = require('express');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/inquiries (Public - submit inquiry)
router.post('/', (req, res) => {
  const { name, country = '', whatsapp = '', requirement = '', productId = null } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const result = db.prepare(
    'INSERT INTO inquiries (name, country, whatsapp, requirement, productId, status) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, country, whatsapp, requirement, productId, 'new');
  res.status(201).json({ id: result.lastInsertRowid, success: true });
});

// GET /api/inquiries (Admin)
router.get('/', requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM inquiries ORDER BY createdAt DESC').all();
  res.json(rows);
});

// GET /api/inquiries/stats (Admin)
router.get('/stats', requireAdmin, (req, res) => {
  const rows = db.prepare(
    'SELECT country, COUNT(*) as count FROM inquiries GROUP BY country ORDER BY count DESC'
  ).all();
  res.json(rows);
});

// PATCH /api/inquiries/:id/status (Admin)
router.patch('/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'status is required' });
  const existing = db.prepare('SELECT id FROM inquiries WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Inquiry not found' });
  db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

// DELETE /api/inquiries/:id (Admin)
router.delete('/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM inquiries WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
