const express = require('express');
const { query } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status, page, pageSize } = req.query;
    let sql = 'SELECT * FROM blog_posts WHERE 1=1';
    const params = [];
    if (status) { params.push(status); sql += ` AND status=$${params.length}`; }
    sql += ' ORDER BY "createdAt" DESC';
    if (page !== undefined && pageSize !== undefined) {
      const pg=parseInt(page)||0, ps=parseInt(pageSize)||10;
      const cR = await query(sql.replace('SELECT *','SELECT COUNT(*) as count'), params);
      const total=parseInt(cR.rows[0]?.count||0), pages=Math.max(1,Math.ceil(total/ps));
      params.push(ps,pg*ps);
      sql += ` LIMIT $${params.length-1} OFFSET $${params.length}`;
      const r = await query(sql, params);
      return res.json({ items: r.rows, total, pages });
    }
    const r = await query(sql, params);
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:slug', async (req, res) => {
  try {
    const r = await query('SELECT * FROM blog_posts WHERE slug=$1', [req.params.slug]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const { slug,title,category='',excerpt='',author='',date='',readTime='',status='Draft',image='',content='' } = req.body;
    if (!slug||!title) return res.status(400).json({ error: 'slug and title required' });
    const r = await query(
      `INSERT INTO blog_posts(slug,title,category,excerpt,author,date,"readTime",status,image,content)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [slug,title,category,excerpt,author,date,readTime,status,image,content]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    if (e.code==='23505') return res.status(409).json({ error: 'Slug already exists' });
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const ex = await query('SELECT * FROM blog_posts WHERE id=$1', [req.params.id]);
    if (!ex.rows[0]) return res.status(404).json({ error: 'Not found' });
    const e=ex.rows[0], { slug,title,category,excerpt,author,date,readTime,status,image,content } = req.body;
    const r = await query(
      `UPDATE blog_posts SET slug=$1,title=$2,category=$3,excerpt=$4,author=$5,date=$6,"readTime"=$7,status=$8,image=$9,content=$10 WHERE id=$11 RETURNING *`,
      [slug??e.slug,title??e.title,category??e.category,excerpt??e.excerpt,author??e.author,date??e.date,readTime??e.readTime,status??e.status,image??e.image,content??e.content,req.params.id]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM blog_posts WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
