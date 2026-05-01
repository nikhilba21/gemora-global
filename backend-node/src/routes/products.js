const express = require('express');
const { query } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

function parse(p) {
  if (!p) return null;
  // PostgreSQL quoted cols return as-is, handle both cases
  const imageUrls = p.imageUrls || p.imageurl || '[]';
  const categoryId = p.categoryId || p.categoryid;
  const isNewArrival = p.isNewArrival ?? p.isnewarrival ?? false;
  const keyFeatures = p.keyFeatures || p.keyfeatures || null;
  const createdAt = p.createdAt || p.createdat || 0;
  return {
    ...p,
    categoryId,
    isNewArrival: isNewArrival===1||isNewArrival==='1'||isNewArrival===true,
    featured: p.featured===1||p.featured==='1'||p.featured===true,
    imageUrls: typeof imageUrls === 'string' ? JSON.parse(imageUrls) : (imageUrls || []),
    keyFeatures,
    createdAt,
  };
}

router.get('/featured', async (req, res) => {
  try {
    const r = await query('SELECT * FROM products WHERE featured=1 ORDER BY "createdAt" DESC');
    res.json(r.rows.map(parse));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/new-arrivals', async (req, res) => {
  try {
    const r = await query('SELECT * FROM products WHERE "isNewArrival"=1 ORDER BY "createdAt" DESC LIMIT 8');
    if (r.rows.length) return res.json(r.rows.map(parse));
    const fallback = await query('SELECT * FROM products ORDER BY "createdAt" DESC LIMIT 8');
    res.json(fallback.rows.map(parse));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/', async (req, res) => {
  try {
    const { categoryId, page, pageSize, featured, newArrivals } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    if (categoryId) { params.push(categoryId); sql += ` AND "categoryId"=$${params.length}`; }
    if (featured==='true') sql += ' AND featured=1';
    if (newArrivals==='true') sql += ' AND "isNewArrival"=1';
    sql += ' ORDER BY "createdAt" DESC';

    if (page !== undefined && pageSize !== undefined) {
      const pg = parseInt(page)||0, ps = parseInt(pageSize)||20;
      const countSql = sql.replace('SELECT *','SELECT COUNT(*) as count');
      const countR = await query(countSql, params);
      const total = parseInt(countR.rows[0]?.count||0);
      const pages = Math.max(1, Math.ceil(total/ps));
      params.push(ps, pg*ps);
      sql += ` LIMIT $${params.length-1} OFFSET $${params.length}`;
      const r = await query(sql, params);
      return res.json({ items: r.rows.map(parse), total, pages });
    }
    const r = await query(sql, params);
    res.json(r.rows.map(parse));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let r;
    if (!isNaN(id)) {
      r = await query('SELECT * FROM products WHERE id=$1', [id]);
    }
    if (!r?.rows[0]) {
      // slug lookup
      const all = await query('SELECT * FROM products');
      const match = all.rows.find(p => p.name.toLowerCase().replace(/ /g,'-') === id);
      if (match) return res.json(parse(match));
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(parse(r.rows[0]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const { categoryId,name,description='',moq='',imageUrls=[],featured=false,isNewArrival=false,sku=null,subcategory=null,color=null,keyFeatures=null } = req.body;
    if (!categoryId||!name) return res.status(400).json({ error: 'categoryId and name required' });
    const r = await query(
      `INSERT INTO products("categoryId",name,description,moq,"imageUrls",featured,"isNewArrival",sku,subcategory,color,"keyFeatures")
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [categoryId,name,description,moq,JSON.stringify(imageUrls),featured?1:0,isNewArrival?1:0,sku,subcategory,color,keyFeatures]
    );
    res.status(201).json(parse(r.rows[0]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const ex = await query('SELECT * FROM products WHERE id=$1', [req.params.id]);
    if (!ex.rows[0]) return res.status(404).json({ error: 'Not found' });
    const e = ex.rows[0];
    const { categoryId,name,description,moq,imageUrls,featured,isNewArrival,sku,subcategory,color,keyFeatures } = req.body;
    const r = await query(
      `UPDATE products SET "categoryId"=$1,name=$2,description=$3,moq=$4,"imageUrls"=$5,featured=$6,"isNewArrival"=$7,sku=$8,subcategory=$9,color=$10,"keyFeatures"=$11 WHERE id=$12 RETURNING *`,
      [categoryId??e.categoryId,name??e.name,description??e.description,moq??e.moq,
       imageUrls!==undefined?JSON.stringify(imageUrls):e.imageUrls,
       featured!==undefined?(featured?1:0):e.featured,
       isNewArrival!==undefined?(isNewArrival?1:0):e.isNewArrival,
       sku!==undefined?sku:e.sku,subcategory!==undefined?subcategory:e.subcategory,
       color!==undefined?color:e.color,keyFeatures!==undefined?keyFeatures:e.keyFeatures,req.params.id]
    );
    res.json(parse(r.rows[0]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM products WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;

// POST /api/products/bulk — upload many products at once (admin only)
router.post('/bulk', requireAdmin, async (req, res) => {
  try {
    const { products: items } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'products array required' });
    
    let created = 0, failed = 0, errors = [];
    
    // Process in batches of 50 for stability
    const BATCH = 50;
    for (let i = 0; i < items.length; i += BATCH) {
      const batch = items.slice(i, i + BATCH);
      await Promise.all(batch.map(async (item) => {
        try {
          const { categoryId, name, description='', moq='', imageUrls=[], featured=false,
            isNewArrival=false, sku=null, subcategory=null, color=null, keyFeatures=null } = item;
          if (!categoryId || !name) { failed++; return; }
          await query(
            `INSERT INTO products("categoryId",name,description,moq,"imageUrls",featured,"isNewArrival",sku,subcategory,color,"keyFeatures")
             VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [categoryId, name, description, moq, JSON.stringify(imageUrls),
             featured?1:0, isNewArrival?1:0, sku, subcategory, color, keyFeatures]
          );
          created++;
        } catch(e) { failed++; errors.push(e.message); }
      }));
    }
    
    res.json({ success: true, created, failed, total: items.length, errors: errors.slice(0,5) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
