const express = require('express');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

const parse = row => row ? { ...row, imageUrls: JSON.parse(row.imageUrls||'[]'), featured: row.featured===1, isNewArrival: row.isNewArrival===1 } : null;

router.get('/featured', (req, res) => {
  try { res.json(db.prepare('SELECT * FROM products WHERE featured=1 ORDER BY createdAt DESC').all().map(parse)); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

router.get('/new-arrivals', (req, res) => {
  try {
    let rows = db.prepare('SELECT * FROM products WHERE isNewArrival=1 ORDER BY createdAt DESC LIMIT 8').all().map(parse);
    if (!rows.length) rows = db.prepare('SELECT * FROM products ORDER BY createdAt DESC LIMIT 8').all().map(parse);
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.get('/', (req, res) => {
  try {
    const { categoryId, page, pageSize, featured, newArrivals } = req.query;
    let q = 'SELECT * FROM products WHERE 1=1'; const p = [];
    if (categoryId) { q+=' AND categoryId=?'; p.push(parseInt(categoryId)); }
    if (featured==='true') q+=' AND featured=1';
    if (newArrivals==='true') q+=' AND isNewArrival=1';
    q+=' ORDER BY createdAt DESC';

    if (page!==undefined && pageSize!==undefined) {
      const pg=parseInt(page)||0, ps=parseInt(pageSize)||20;
      const total = db.prepare(q.replace('SELECT *','SELECT COUNT(*) as c')).get(...p)?.c || 0;
      const items = db.prepare(q+' LIMIT ? OFFSET ?').all(...p, ps, pg*ps).map(parse);
      return res.json({ items, total, pages: Math.max(1,Math.ceil(total/ps)) });
    }
    res.json(db.prepare(q).all(...p).map(parse));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    let row = !isNaN(id) ? db.prepare('SELECT * FROM products WHERE id=?').get(parseInt(id)) : null;
    if (!row) row = db.prepare('SELECT * FROM products').all().find(p => p.name.toLowerCase().replace(/ /g,'-')===id) || null;
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(parse(row));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.post('/', requireAdmin, (req, res) => {
  try {
    const { categoryId, name, description='', moq='', imageUrls=[], featured=false, isNewArrival=false, sku=null, subcategory=null, color=null, keyFeatures=null } = req.body;
    if (!categoryId||!name) return res.status(400).json({ error: 'categoryId and name required' });
    const r = db.prepare('INSERT INTO products(categoryId,name,description,moq,imageUrls,featured,isNewArrival,sku,subcategory,color,keyFeatures) VALUES(?,?,?,?,?,?,?,?,?,?,?)').run(
      categoryId, name, description, moq, JSON.stringify(imageUrls), featured?1:0, isNewArrival?1:0, sku, subcategory, color, keyFeatures
    );
    res.status(201).json(parse(db.prepare('SELECT * FROM products WHERE id=?').get(r.lastInsertRowid)));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', requireAdmin, (req, res) => {
  try {
    const ex = db.prepare('SELECT * FROM products WHERE id=?').get(req.params.id);
    if (!ex) return res.status(404).json({ error: 'Not found' });
    const { categoryId, name, description, moq, imageUrls, featured, isNewArrival, sku, subcategory, color, keyFeatures } = req.body;
    db.prepare('UPDATE products SET categoryId=?,name=?,description=?,moq=?,imageUrls=?,featured=?,isNewArrival=?,sku=?,subcategory=?,color=?,keyFeatures=? WHERE id=?').run(
      categoryId??ex.categoryId, name??ex.name, description??ex.description, moq??ex.moq,
      imageUrls!==undefined?JSON.stringify(imageUrls):ex.imageUrls,
      featured!==undefined?(featured?1:0):ex.featured,
      isNewArrival!==undefined?(isNewArrival?1:0):ex.isNewArrival,
      sku!==undefined?sku:ex.sku, subcategory!==undefined?subcategory:ex.subcategory,
      color!==undefined?color:ex.color, keyFeatures!==undefined?keyFeatures:ex.keyFeatures,
      req.params.id
    );
    res.json(parse(db.prepare('SELECT * FROM products WHERE id=?').get(req.params.id)));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', requireAdmin, (req, res) => {
  try { db.prepare('DELETE FROM products WHERE id=?').run(req.params.id); res.json({ success: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
