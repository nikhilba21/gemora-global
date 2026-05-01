const express = require('express');
const { query } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const r = await query('SELECT * FROM testimonials WHERE active=1 ORDER BY rating DESC');
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
router.get('/all', requireAdmin, async (req, res) => {
  try {
    const r = await query('SELECT * FROM testimonials ORDER BY id DESC');
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name,company='',country='',text='',rating=5,active=true } = req.body;
    const r = await query(
      'INSERT INTO testimonials(name,company,country,text,rating,active) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [name,company,country,text,rating,active?1:0]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const ex = await query('SELECT * FROM testimonials WHERE id=$1', [req.params.id]);
    if (!ex.rows[0]) return res.status(404).json({ error: 'Not found' });
    const e=ex.rows[0], { name,company,country,text,rating,active } = req.body;
    const r = await query(
      'UPDATE testimonials SET name=$1,company=$2,country=$3,text=$4,rating=$5,active=$6 WHERE id=$7 RETURNING *',
      [name??e.name,company??e.company,country??e.country,text??e.text,rating??e.rating,active!==undefined?(active?1:0):e.active,req.params.id]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM testimonials WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
