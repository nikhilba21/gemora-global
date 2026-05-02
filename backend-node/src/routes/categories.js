const express = require('express');
const { query } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const r = await query('SELECT * FROM categories ORDER BY "sortOrder" ASC');
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    let r;
    if (!isNaN(req.params.id)) {
      r = await query('SELECT * FROM categories WHERE id=$1', [req.params.id]);
    }
    if (!r?.rows[0]) {
      r = await query('SELECT * FROM categories WHERE slug=$1', [req.params.id]);
    }
    if (!r?.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/categories/:slug/subcategories — all unique subcategories for a category
router.get('/:id/subcategories', async (req, res) => {
  try {
    let catRow;
    if (!isNaN(req.params.id)) {
      const r = await query('SELECT * FROM categories WHERE id=$1', [req.params.id]);
      catRow = r.rows[0];
    }
    if (!catRow) {
      const r = await query('SELECT * FROM categories WHERE slug=$1', [req.params.id]);
      catRow = r.rows[0];
    }
    if (!catRow) return res.status(404).json({ error: 'Not found' });
    
    const r = await query(
      `SELECT subcategory, COUNT(*) as count FROM products 
       WHERE "categoryId"=$1 AND subcategory IS NOT NULL AND subcategory != ''
       GROUP BY subcategory ORDER BY subcategory ASC`,
      [catRow.id]
    );
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, description='', imageUrl='', sortOrder=0 } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const r = await query(
      'INSERT INTO categories(name,description,"imageUrl","sortOrder") VALUES($1,$2,$3,$4) RETURNING *',
      [name, description, imageUrl, sortOrder]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const ex = await query('SELECT * FROM categories WHERE id=$1', [req.params.id]);
    if (!ex.rows[0]) return res.status(404).json({ error: 'Not found' });
    const { name, description, imageUrl, sortOrder } = req.body;
    const e = ex.rows[0];
    const r = await query(
      'UPDATE categories SET name=$1,description=$2,"imageUrl"=$3,"sortOrder"=$4 WHERE id=$5 RETURNING *',
      [name??e.name, description??e.description, imageUrl??e.imageUrl, sortOrder??e.sortOrder, req.params.id]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM categories WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
