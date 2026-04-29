// src/routes/content.js
const express = require('express');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// GET /api/content/:key
router.get('/:key', (req, res) => {
  const row = db.prepare('SELECT value FROM content WHERE key = ?').get(req.params.key);
  res.json({ value: row ? row.value : null });
});

// GET /api/content/page/:pageId
router.get('/page/:pageId', (req, res) => {
  const prefix = req.params.pageId + '.';
  const rows = db.prepare("SELECT key, value FROM content WHERE key LIKE ?").all(prefix + '%');
  const result = rows.map(r => [r.key.replace(prefix, ''), r.value]);
  res.json(result);
});

// POST /api/content (Admin) - set a single key
router.post('/', requireAdmin, (req, res) => {
  const { key, value } = req.body;
  if (!key) return res.status(400).json({ error: 'key required' });
  db.prepare('INSERT OR REPLACE INTO content (key, value) VALUES (?, ?)').run(key, value);
  res.json({ success: true });
});

// POST /api/content/page (Admin) - set multiple fields for a page
router.post('/page', requireAdmin, (req, res) => {
  const { pageId, fields } = req.body;
  if (!pageId || !Array.isArray(fields)) return res.status(400).json({ error: 'pageId and fields array required' });
  const insert = db.prepare('INSERT OR REPLACE INTO content (key, value) VALUES (?, ?)');
  for (const [field, value] of fields) {
    insert.run(`${pageId}.${field}`, value);
  }
  res.json({ success: true });
});

module.exports = router;
