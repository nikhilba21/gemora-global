const express = require('express');
const { query } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// GET /api/contacts (Admin)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { country, search, page, pageSize } = req.query;
    let sql = 'SELECT * FROM contacts WHERE 1=1';
    const params = [];
    if (country) { params.push(country); sql += ` AND country=$${params.length}`; }
    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length} OR company ILIKE $${params.length})`;
    }
    sql += ' ORDER BY "createdAt" DESC';
    if (page !== undefined && pageSize !== undefined) {
      const pg = parseInt(page)||0, ps = parseInt(pageSize)||50;
      const cR = await query(sql.replace('SELECT *','SELECT COUNT(*) as c'), params);
      const total = parseInt(cR.rows[0]?.c||0);
      params.push(ps, pg*ps);
      sql += ` LIMIT $${params.length-1} OFFSET $${params.length}`;
      const r = await query(sql, params);
      return res.json({ items: r.rows, total, pages: Math.ceil(total/ps) });
    }
    const r = await query(sql, params);
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/contacts/stats (Admin)
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const total = await query('SELECT COUNT(*) as c FROM contacts');
    const countries = await query('SELECT country, COUNT(*) as count FROM contacts GROUP BY country ORDER BY count DESC');
    const withEmail = await query("SELECT COUNT(*) as c FROM contacts WHERE email != '' AND email LIKE '%@%'");
    const withPhone = await query("SELECT COUNT(*) as c FROM contacts WHERE phone != '' AND phone LIKE '+%'");
    res.json({
      total: parseInt(total.rows[0].c),
      withEmail: parseInt(withEmail.rows[0].c),
      withPhone: parseInt(withPhone.rows[0].c),
      byCountry: countries.rows,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/contacts/bulk (Admin) — bulk import
router.post('/bulk', requireAdmin, async (req, res) => {
  try {
    const { contacts } = req.body;
    if (!Array.isArray(contacts)) return res.status(400).json({ error: 'contacts array required' });
    let created = 0, skipped = 0;
    for (const c of contacts) {
      const { name='', company='', email='', phone='', country='', productInterest='', source='', tags='' } = c;
      if (!name && !email) { skipped++; continue; }
      await query(
        `INSERT INTO contacts(name,company,email,phone,country,"productInterest",source,tags)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT(email) DO UPDATE SET
           name=EXCLUDED.name, company=EXCLUDED.company,
           phone=EXCLUDED.phone, country=EXCLUDED.country,
           "productInterest"=EXCLUDED."productInterest",
           source=EXCLUDED.source, tags=EXCLUDED.tags`,
        [name,company,email,phone,country,productInterest,source,tags]
      );
      created++;
    }
    res.json({ success: true, created, skipped, total: contacts.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/contacts (Admin) — single
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name='',company='',email='',phone='',country='',productInterest='',source='',tags='' } = req.body;
    const r = await query(
      `INSERT INTO contacts(name,company,email,phone,country,"productInterest",source,tags)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name,company,email,phone,country,productInterest,source,tags]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/contacts/:id (Admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM contacts WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/contacts/export — CSV export for email campaign (Admin)
router.get('/export', requireAdmin, async (req, res) => {
  try {
    const { country } = req.query;
    let sql = "SELECT name,company,email,phone,country,\"productInterest\",source,tags FROM contacts WHERE email LIKE '%@%'";
    const params = [];
    if (country) { params.push(country); sql += ` AND country=$${params.length}`; }
    sql += ' ORDER BY country, name';
    const r = await query(sql, params);
    const rows = r.rows;
    const header = 'Name,Company,Email,Phone,Country,Product Interest,Source,Tags\n';
    const csv = header + rows.map(row =>
      [row.name,row.company,row.email,row.phone,row.country,row.productInterest,row.source,row.tags]
        .map(v => `"${(v||'').replace(/"/g,'""')}"`)
        .join(',')
    ).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="gemora-contacts${country?'-'+country:''}.csv"`);
    res.send(csv);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
