const express = require('express');
const { query } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, country='', whatsapp='', requirement='', productId=null, source='Website' } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const r = await query(
      'INSERT INTO inquiries(name,country,whatsapp,requirement,"productId",status,source,"pipelineStage") VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
      [name,country,whatsapp,requirement,productId,'new',source,'New']
    );
    res.status(201).json({ id: r.rows[0].id, success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/', requireAdmin, async (req, res) => {
  try {
    const r = await query('SELECT * FROM inquiries ORDER BY "createdAt" DESC');
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const byCountry = await query('SELECT country, COUNT(*) as count FROM inquiries GROUP BY country ORDER BY count DESC');
    const bySource = await query('SELECT source, COUNT(*) as count FROM inquiries GROUP BY source ORDER BY count DESC');
    const byStage = await query('SELECT "pipelineStage" as stage, COUNT(*) as count FROM inquiries GROUP BY "pipelineStage" ORDER BY count DESC');
    res.json({
      byCountry: byCountry.rows,
      bySource: bySource.rows,
      byStage: byStage.rows
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await query('UPDATE inquiries SET status=$1 WHERE id=$2', [status, req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch('/:id/crm', requireAdmin, async (req, res) => {
  try {
    const { source, qualified, pipelineStage, assignedTo } = req.body;
    const updates = [];
    const params = [];
    if (source !== undefined) { params.push(source); updates.push(`source=$${params.length}`); }
    if (qualified !== undefined) { params.push(qualified); updates.push(`qualified=$${params.length}`); }
    if (pipelineStage !== undefined) { params.push(pipelineStage); updates.push(`"pipelineStage"=$${params.length}`); }
    if (assignedTo !== undefined) { params.push(assignedTo); updates.push(`"assignedTo"=$${params.length}`); }
    
    if (updates.length === 0) return res.json({ success: true, message: 'no fields to update' });
    
    params.push(req.params.id);
    await query(`UPDATE inquiries SET ${updates.join(', ')} WHERE id=$${params.length}`, params);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM inquiries WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
