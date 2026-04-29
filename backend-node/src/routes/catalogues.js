// src/routes/catalogues.js
const express = require('express');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM catalogues ORDER BY createdAt DESC').all());
});

router.post('/', requireAdmin, (req, res) => {
  const { title, description = '', fileUrl = '', fileName = '', uploadedAt = '' } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const r = db.prepare('INSERT INTO catalogues (title, description, fileUrl, fileName, uploadedAt) VALUES (?, ?, ?, ?, ?)').run(title, description, fileUrl, fileName, uploadedAt);
  res.status(201).json(db.prepare('SELECT * FROM catalogues WHERE id = ?').get(r.lastInsertRowid));
});

router.delete('/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM catalogues WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
