const express = require('express');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    const { itemType, page, pageSize } = req.query;
    let q = 'SELECT * FROM gallery_items WHERE 1=1'; const p = [];
    if (itemType) { q+=' AND itemType=?'; p.push(itemType); }
    q+=' ORDER BY sortOrder ASC, id ASC';
    if (page!==undefined && pageSize!==undefined) {
      const pg=parseInt(page)||0, ps=parseInt(pageSize)||20;
      const total = db.prepare(q.replace('SELECT *','SELECT COUNT(*) as c')).get(...p)?.c || 0;
      return res.json({ items: db.prepare(q+' LIMIT ? OFFSET ?').all(...p,ps,pg*ps), total, pages: Math.max(1,Math.ceil(total/ps)) });
    }
    res.json(db.prepare(q).all(...p));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.post('/', requireAdmin, (req, res) => {
  try {
    const { imageUrl, caption='', itemType='image', sortOrder=0 } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'imageUrl required' });
    const r = db.prepare('INSERT INTO gallery_items(imageUrl,caption,itemType,sortOrder) VALUES(?,?,?,?)').run(imageUrl,caption,itemType,sortOrder);
    res.status(201).json(db.prepare('SELECT * FROM gallery_items WHERE id=?').get(r.lastInsertRowid));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', requireAdmin, (req, res) => {
  try {
    const ex = db.prepare('SELECT * FROM gallery_items WHERE id=?').get(req.params.id);
    if (!ex) return res.status(404).json({ error: 'Not found' });
    const { imageUrl, caption, itemType, sortOrder } = req.body;
    db.prepare('UPDATE gallery_items SET imageUrl=?,caption=?,itemType=?,sortOrder=? WHERE id=?').run(
      imageUrl??ex.imageUrl, caption??ex.caption, itemType??ex.itemType, sortOrder??ex.sortOrder, req.params.id
    );
    res.json(db.prepare('SELECT * FROM gallery_items WHERE id=?').get(req.params.id));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', requireAdmin, (req, res) => {
  try { db.prepare('DELETE FROM gallery_items WHERE id=?').run(req.params.id); res.json({ success: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
