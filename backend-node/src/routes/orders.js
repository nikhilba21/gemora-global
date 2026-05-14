const express = require('express');
const { query } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// GET /api/orders (Admin)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { status, country, page, pageSize } = req.query;
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    
    if (status && status !== 'All') { params.push(status); sql += ` AND status=$${params.length}`; }
    if (country && country !== 'All') { params.push(country); sql += ` AND country=$${params.length}`; }
    
    sql += ' ORDER BY "createdAt" DESC';
    
    if (page !== undefined && pageSize !== undefined) {
      const pg = parseInt(page)||0, ps = parseInt(pageSize)||50;
      params.push(ps, pg*ps);
      sql += ` LIMIT $${params.length-1} OFFSET $${params.length}`;
    }
    
    const r = await query(sql, params);
    
    // Fetch items for each order
    const orders = await Promise.all(r.rows.map(async (ord) => {
      const items = await query('SELECT * FROM order_items WHERE "orderId"=$1', [ord.id]);
      return { ...ord, items: items.rows };
    }));
    
    res.json(orders);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/orders (Admin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { orderId, buyer, company, email, phone, country, address, amount, currency, paymentMethod, type, status, trackingNumber, courier, notes, items } = req.body;
    
    const r = await query(
      `INSERT INTO orders("orderId", buyer, company, email, phone, country, address, amount, currency, "paymentMethod", type, status, "trackingNumber", courier, notes)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`,
      [orderId, buyer, company, email, phone, country, address, amount, currency, paymentMethod, type, status, trackingNumber, courier, notes]
    );
    
    const newId = r.rows[0].id;
    
    if (items && Array.isArray(items)) {
      for (const item of items) {
        await query(
          'INSERT INTO order_items("orderId", name, qty, price) VALUES($1,$2,$3,$4)',
          [newId, item.name, item.qty, item.price]
        );
      }
    }
    
    res.status(201).json({ id: newId, success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/orders/:id (Admin)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { orderId, buyer, company, email, phone, country, address, amount, currency, paymentMethod, type, status, trackingNumber, courier, notes, items } = req.body;
    
    await query(
      `UPDATE orders SET "orderId"=$1, buyer=$2, company=$3, email=$4, phone=$5, country=$6, address=$7, amount=$8, currency=$9, "paymentMethod"=$10, type=$11, status=$12, "trackingNumber"=$13, courier=$14, notes=$15
       WHERE id=$16`,
      [orderId, buyer, company, email, phone, country, address, amount, currency, paymentMethod, type, status, trackingNumber, courier, notes, req.params.id]
    );
    
    // Refresh items
    await query('DELETE FROM order_items WHERE "orderId"=$1', [req.params.id]);
    if (items && Array.isArray(items)) {
      for (const item of items) {
        await query(
          'INSERT INTO order_items("orderId", name, qty, price) VALUES($1,$2,$3,$4)',
          [req.params.id, item.name, item.qty, item.price]
        );
      }
    }
    
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/orders/:id (Admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM orders WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
