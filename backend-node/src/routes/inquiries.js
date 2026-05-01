const express = require('express');
const { query } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, country='', whatsapp='', requirement='', productId=null } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const r = await query(
      'INSERT INTO inquiries(name,country,whatsapp,requirement,"productId",status) VALUES($1,$2,$3,$4,$5,$6) RETURNING id',
      [name,country,whatsapp,requirement,productId,'new']
    );
    res.status(201).json({ id: r.rows[0].id, success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/', requireAdmin, async (req, res) => {
  try {
    const r = await query('SELECT * FROM inquiries ORDER BY "createdAt" DESC');
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const r = await query('SELECT country, COUNT(*) as count FROM inquiries GROUP BY country ORDER BY count DESC');
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await query('UPDATE inquiries SET status=$1 WHERE id=$2', [status, req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM inquiries WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
