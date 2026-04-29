// src/routes/testimonials.js
const express = require('express');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM testimonials WHERE active = 1 ORDER BY rating DESC').all();
  res.json(rows);
});

router.get('/all', requireAdmin, (req, res) => {
  res.json(db.prepare('SELECT * FROM testimonials ORDER BY id DESC').all());
});

router.post('/', requireAdmin, (req, res) => {
  const { name, company = '', country = '', text = '', rating = 5, active = true } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const r = db.prepare('INSERT INTO testimonials (name, company, country, text, rating, active) VALUES (?, ?, ?, ?, ?, ?)').run(name, company, country, text, rating, active ? 1 : 0);
  res.status(201).json(db.prepare('SELECT * FROM testimonials WHERE id = ?').get(r.lastInsertRowid));
});

router.put('/:id', requireAdmin, (req, res) => {
  const ex = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id);
  if (!ex) return res.status(404).json({ error: 'Not found' });
  const { name, company, country, text, rating, active } = req.body;
  db.prepare('UPDATE testimonials SET name=?, company=?, country=?, text=?, rating=?, active=? WHERE id=?').run(
    name ?? ex.name, company ?? ex.company, country ?? ex.country,
    text ?? ex.text, rating ?? ex.rating,
    active !== undefined ? (active ? 1 : 0) : ex.active,
    req.params.id
  );
  res.json(db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id));
});

router.delete('/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM testimonials WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
