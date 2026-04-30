const express = require('express');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/', (req, res) => {
  try {
    const { name, country='', whatsapp='', requirement='', productId=null } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const r = db.prepare('INSERT INTO inquiries(name,country,whatsapp,requirement,productId,status) VALUES(?,?,?,?,?,?)').run(name,country,whatsapp,requirement,productId,'new');
    res.status(201).json({ id: r.lastInsertRowid, success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.get('/', requireAdmin, (req, res) => {
  try { res.json(db.prepare('SELECT * FROM inquiries ORDER BY createdAt DESC').all()); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

router.get('/stats', requireAdmin, (req, res) => {
  try { res.json(db.prepare('SELECT country, COUNT(*) as count FROM inquiries GROUP BY country ORDER BY count DESC').all()); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

router.patch('/:id/status', requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'status required' });
    db.prepare('UPDATE inquiries SET status=? WHERE id=?').run(status, req.params.id);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', requireAdmin, (req, res) => {
  try { db.prepare('DELETE FROM inquiries WHERE id=?').run(req.params.id); res.json({ success: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
