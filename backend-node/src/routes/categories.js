const express = require('express');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
  try { res.json(db.prepare('SELECT * FROM categories ORDER BY sortOrder ASC').all()); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM categories WHERE id=?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.post('/', requireAdmin, (req, res) => {
  try {
    const { name, description='', imageUrl='', sortOrder=0 } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const r = db.prepare('INSERT INTO categories(name,description,imageUrl,sortOrder) VALUES(?,?,?,?)').run(name,description,imageUrl,sortOrder);
    res.status(201).json(db.prepare('SELECT * FROM categories WHERE id=?').get(r.lastInsertRowid));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', requireAdmin, (req, res) => {
  try {
    const ex = db.prepare('SELECT * FROM categories WHERE id=?').get(req.params.id);
    if (!ex) return res.status(404).json({ error: 'Not found' });
    const { name, description, imageUrl, sortOrder } = req.body;
    db.prepare('UPDATE categories SET name=?,description=?,imageUrl=?,sortOrder=? WHERE id=?').run(
      name??ex.name, description??ex.description, imageUrl??ex.imageUrl, sortOrder??ex.sortOrder, req.params.id
    );
    res.json(db.prepare('SELECT * FROM categories WHERE id=?').get(req.params.id));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', requireAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM categories WHERE id=?').run(req.params.id);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
