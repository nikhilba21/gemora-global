// src/routes/dashboard.js
const express = require('express');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// GET /api/dashboard/stats (Admin)
router.get('/stats', requireAdmin, (req, res) => {
  const stats = {
    totalProducts: db.prepare('SELECT COUNT(*) as c FROM products').get().c,
    totalCategories: db.prepare('SELECT COUNT(*) as c FROM categories').get().c,
    totalInquiries: db.prepare('SELECT COUNT(*) as c FROM inquiries').get().c,
    newInquiries: db.prepare("SELECT COUNT(*) as c FROM inquiries WHERE status = 'new'").get().c,
    totalGalleryItems: db.prepare('SELECT COUNT(*) as c FROM gallery_items').get().c,
    totalBlogPosts: db.prepare('SELECT COUNT(*) as c FROM blog_posts').get().c,
    totalCatalogues: db.prepare('SELECT COUNT(*) as c FROM catalogues').get().c,
    totalVisits: 0,
  };
  res.json(stats);
});

module.exports = router;
