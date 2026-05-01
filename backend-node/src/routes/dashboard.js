const express = require('express');
const { query } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [p,c,i,ni,g,b,cat] = await Promise.all([
      query('SELECT COUNT(*) as c FROM products'),
      query('SELECT COUNT(*) as c FROM categories'),
      query('SELECT COUNT(*) as c FROM inquiries'),
      query("SELECT COUNT(*) as c FROM inquiries WHERE status='new'"),
      query('SELECT COUNT(*) as c FROM gallery_items'),
      query('SELECT COUNT(*) as c FROM blog_posts'),
      query('SELECT COUNT(*) as c FROM catalogues'),
    ]);
    res.json({
      totalProducts: parseInt(p.rows[0].c),
      totalCategories: parseInt(c.rows[0].c),
      totalInquiries: parseInt(i.rows[0].c),
      newInquiries: parseInt(ni.rows[0].c),
      totalGalleryItems: parseInt(g.rows[0].c),
      totalBlogPosts: parseInt(b.rows[0].c),
      totalCatalogues: parseInt(cat.rows[0].c),
      totalVisits: 0,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
