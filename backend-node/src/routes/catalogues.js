const express = require('express');
const { query } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const r = await query('SELECT * FROM catalogues ORDER BY "createdAt" DESC');
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/google-photos', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'url required' });

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Google Photos shared album: ${response.statusText}`);
    }

    const html = await response.text();
    const regex = /(https:\/\/lh3\.googleusercontent\.com\/pw\/[A-Za-z0-9_\-]+)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }

    res.json({ images: matches });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title,description='',fileUrl='',fileName='',uploadedAt='' } = req.body;
    if (!title) return res.status(400).json({ error: 'title required' });
    const r = await query(
      'INSERT INTO catalogues(title,description,"fileUrl","fileName","uploadedAt") VALUES($1,$2,$3,$4,$5) RETURNING *',
      [title,description,fileUrl,fileName,uploadedAt]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM catalogues WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
