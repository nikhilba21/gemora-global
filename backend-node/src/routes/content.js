const express = require('express');
const { query } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/page/:pageId', async (req, res) => {
  try {
    const prefix = req.params.pageId + '.';
    const r = await query("SELECT key, value FROM content WHERE key LIKE $1", [prefix+'%']);
    res.json(r.rows.map(row => [row.key.replace(prefix,''), row.value]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:key', async (req, res) => {
  try {
    const r = await query('SELECT value FROM content WHERE key=$1', [req.params.key]);
    res.json({ value: r.rows[0]?.value || null });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const { key, value } = req.body;
    await query('INSERT INTO content(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=$2', [key,value]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/page', requireAdmin, async (req, res) => {
  try {
    const { pageId, fields } = req.body;
    for (const [field, value] of fields) {
      await query('INSERT INTO content(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=$2',
        [`${pageId}.${field}`, value]);
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
