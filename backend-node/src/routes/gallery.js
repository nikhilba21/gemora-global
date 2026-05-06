const express = require('express');
const { query } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { itemType, page, pageSize } = req.query;
    let sql = 'SELECT * FROM gallery_items WHERE 1=1';
    const params = [];
    if (itemType) { params.push(itemType); sql += ` AND "itemType"=$${params.length}`; }
    sql += ' ORDER BY "sortOrder" ASC, id ASC';
    if (page !== undefined && pageSize !== undefined) {
      const pg=parseInt(page)||0, ps=parseInt(pageSize)||20;
      const cR = await query(sql.replace('SELECT *','SELECT COUNT(*) as count').split(' ORDER BY')[0], params);
      const total=parseInt(cR.rows[0]?.count||0), pages=Math.max(1,Math.ceil(total/ps));
      params.push(ps, pg*ps);
      sql += ` LIMIT $${params.length-1} OFFSET $${params.length}`;
      const r = await query(sql, params);
      return res.json({ items: r.rows, total, pages });
    }
    const r = await query(sql, params);
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const { imageUrl, caption='', itemType='image', sortOrder=0 } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'imageUrl required' });
    const r = await query(
      'INSERT INTO gallery_items("imageUrl",caption,"itemType","sortOrder") VALUES($1,$2,$3,$4) RETURNING *',
      [imageUrl,caption,itemType,sortOrder]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const ex = await query('SELECT * FROM gallery_items WHERE id=$1', [req.params.id]);
    if (!ex.rows[0]) return res.status(404).json({ error: 'Not found' });
    const e=ex.rows[0], { imageUrl,caption,itemType,sortOrder } = req.body;
    const r = await query(
      'UPDATE gallery_items SET "imageUrl"=$1,caption=$2,"itemType"=$3,"sortOrder"=$4 WHERE id=$5 RETURNING *',
      [imageUrl??e.imageUrl,caption??e.caption,itemType??e.itemType,sortOrder??e.sortOrder,req.params.id]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM gallery_items WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
