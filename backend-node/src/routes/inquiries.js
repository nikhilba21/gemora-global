const express = require('express');
const { query } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Auto-detect country from phone code
function detectCountry(phone) {
  if (!phone) return 'India';
  const cleaned = phone.replace(/[^\d+]/g, '');
  let code = cleaned.startsWith('00') ? '+' + cleaned.slice(2) : (cleaned.startsWith('+') ? cleaned : '+' + cleaned);
  if (code.startsWith('+91')) return 'India';
  if (code.startsWith('+971')) return 'UAE';
  if (code.startsWith('+966')) return 'Saudi Arabia';
  if (code.startsWith('+974')) return 'Qatar';
  if (code.startsWith('+965')) return 'Kuwait';
  if (code.startsWith('+968')) return 'Oman';
  if (code.startsWith('+973')) return 'Bahrain';
  if (code.startsWith('+44')) return 'United Kingdom';
  if (code.startsWith('+33')) return 'France';
  if (code.startsWith('+31')) return 'Netherlands';
  if (code.startsWith('+49')) return 'Germany';
  if (code.startsWith('+39')) return 'Italy';
  if (code.startsWith('+34')) return 'Spain';
  if (code.startsWith('+61')) return 'Australia';
  if (code.startsWith('+65')) return 'Singapore';
  if (code.startsWith('+60')) return 'Malaysia';
  if (code.startsWith('+94')) return 'Sri Lanka';
  if (code.startsWith('+880')) return 'Bangladesh';
  if (code.startsWith('+977')) return 'Nepal';
  if (code.startsWith('+92')) return 'Pakistan';
  if (code.startsWith('+1')) return 'USA / Canada';
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]/.test(digits)) return 'India';
  return 'International';
}

router.post('/', async (req, res) => {
  try {
    let { name, country='', whatsapp='', requirement='', productId=null, source='Website' } = req.body;
    if (!name && whatsapp) {
      name = `WhatsApp Buyer (${whatsapp.slice(-4)})`;
    }
    if (!name) return res.status(400).json({ error: 'name or phone required' });
    if (!country && whatsapp) {
      country = detectCountry(whatsapp);
    }
    if (requirement && requirement.toLowerCase().includes('gemora global')) {
      source = 'WhatsApp (Gemora Global Text)';
    }
    const r = await query(
      'INSERT INTO inquiries(name,country,whatsapp,requirement,"productId",status,source,"pipelineStage") VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
      [name,country,whatsapp,requirement,productId,'new',source,'New']
    );
    res.status(201).json({ id: r.rows[0].id, success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Bulk or single WhatsApp auto-sync endpoint (for WhatsApp Web 1-click sync)
router.post('/whatsapp', async (req, res) => {
  try {
    const rawItems = Array.isArray(req.body) 
      ? req.body 
      : (Array.isArray(req.body.leads) ? req.body.leads : [req.body]);
    
    let addedCount = 0;
    let existingCount = 0;

    for (const item of rawItems) {
      const rawPhone = item.whatsapp || item.phone || item.from || '';
      const cleanDigits = rawPhone.replace(/[^\d+]/g, '');
      if (!cleanDigits || cleanDigits.replace(/\D/g, '').length < 8) continue;

      const phone = cleanDigits.startsWith('+') ? cleanDigits : (cleanDigits.startsWith('00') ? '+' + cleanDigits.slice(2) : '+' + cleanDigits);
      const country = item.country || detectCountry(phone);
      const requirement = item.requirement || item.message || item.text || item.lastMessage || 'Incoming WhatsApp Lead';
      const name = item.name && item.name.trim() ? item.name.trim() : `WhatsApp Buyer (${phone.slice(-4)})`;
      const source = item.source || (requirement.toLowerCase().includes('gemora global') ? 'WhatsApp (Gemora Global Text)' : 'WhatsApp Incoming');

      // Check if lead already exists by normalized phone digits (matches regardless of spaces, +91, or 0)
      const digitsOnly = phone.replace(/\D/g, '');
      const last10 = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;

      const existing = await query(
        `SELECT id, name, requirement FROM inquiries 
         WHERE regexp_replace(whatsapp, '\\D', '', 'g') = $1
            OR (length(regexp_replace(whatsapp, '\\D', '', 'g')) >= 10 AND length($2) >= 10 AND RIGHT(regexp_replace(whatsapp, '\\D', '', 'g'), 10) = $2)
         ORDER BY id DESC LIMIT 1`,
        [digitsOnly, last10]
      );

      if (existing.rows.length > 0) {
        existingCount++;
        // Update requirement & country if newer info provided
        if (requirement && requirement !== 'Incoming WhatsApp Lead') {
          await query('UPDATE inquiries SET requirement=$1, country=$2 WHERE id=$3', [requirement, country, existing.rows[0].id]);
        }
      } else {
        await query(
          'INSERT INTO inquiries(name,country,whatsapp,requirement,"productId",status,source,"pipelineStage") VALUES($1,$2,$3,$4,$5,$6,$7,$8)',
          [name, country, phone, requirement, null, 'new', source, 'New']
        );
        addedCount++;
      }
    }

    // Auto-clean any previously duplicated rows by phone digits in database
    try {
      await query(`
        DELETE FROM inquiries a USING inquiries b
        WHERE a.id < b.id 
          AND length(regexp_replace(a.whatsapp, '\\D', '', 'g')) >= 8
          AND regexp_replace(a.whatsapp, '\\D', '', 'g') = regexp_replace(b.whatsapp, '\\D', '', 'g')
      `);
    } catch (cleanErr) {
      console.warn('Auto-dedupe cleanup warning:', cleanErr.message);
    }

    res.json({ success: true, addedCount, existingCount, totalReceived: rawItems.length });
  } catch (e) {
    console.error('WhatsApp sync error:', e);
    res.status(500).json({ error: e.message });
  }
});

// Dedicated deduplication route for Admin cleanup
router.post('/dedupe', requireAdmin, async (req, res) => {
  try {
    const result = await query(`
      DELETE FROM inquiries a USING inquiries b
      WHERE a.id < b.id 
        AND length(regexp_replace(a.whatsapp, '\\D', '', 'g')) >= 8
        AND (
          regexp_replace(a.whatsapp, '\\D', '', 'g') = regexp_replace(b.whatsapp, '\\D', '', 'g')
          OR (length(regexp_replace(a.whatsapp, '\\D', '', 'g')) >= 10 AND length(regexp_replace(b.whatsapp, '\\D', '', 'g')) >= 10 AND RIGHT(regexp_replace(a.whatsapp, '\\D', '', 'g'), 10) = RIGHT(regexp_replace(b.whatsapp, '\\D', '', 'g'), 10))
        )
      RETURNING a.id
    `);
    res.json({ success: true, removedCount: result.rowCount || 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Meta WhatsApp Cloud API Webhook Verification
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' || token === 'gemora_whatsapp_webhook_2026') {
    return res.status(200).send(challenge || 'OK');
  }
  res.status(200).send('Webhook active');
});

// Real-time Webhook Receiver for Meta WhatsApp Cloud API, Twilio, or n8n
router.post('/webhook', async (req, res) => {
  try {
    const body = req.body;
    // Check if Meta WhatsApp Cloud API payload
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;
    const contacts = value?.contacts;

    if (messages && messages.length > 0) {
      for (const msg of messages) {
        const fromNumber = msg.from; // e.g. "917976341419"
        const formattedPhone = fromNumber.startsWith('+') ? fromNumber : '+' + fromNumber;
        const contactInfo = contacts?.find(c => c.wa_id === fromNumber);
        const senderName = contactInfo?.profile?.name || `WhatsApp Buyer (${fromNumber.slice(-4)})`;
        const textBody = msg.text?.body || msg.button?.text || msg.interactive?.button_reply?.title || 'Incoming WhatsApp Message';
        const source = textBody.toLowerCase().includes('gemora global') ? 'WhatsApp (Gemora Global Text)' : 'WhatsApp Incoming';
        const country = detectCountry(formattedPhone);

        const existing = await query('SELECT id FROM inquiries WHERE whatsapp=$1 OR whatsapp=$2 LIMIT 1', [formattedPhone, fromNumber]);
        if (existing.rows.length === 0) {
          await query(
            'INSERT INTO inquiries(name,country,whatsapp,requirement,"productId",status,source,"pipelineStage") VALUES($1,$2,$3,$4,$5,$6,$7,$8)',
            [senderName, country, formattedPhone, textBody, null, 'new', source, 'New']
          );
        } else {
          await query('UPDATE inquiries SET requirement=$1 WHERE id=$2', [textBody, existing.rows[0].id]);
        }
      }
    } else if (body.from || body.phone || body.whatsapp) {
      // Simple webhook payload (Twilio / Wasapi / n8n webhook)
      const phone = body.from || body.phone || body.whatsapp;
      const formattedPhone = String(phone).startsWith('+') ? String(phone) : '+' + String(phone);
      const text = body.body || body.text || body.message || 'Incoming WhatsApp Message';
      const senderName = body.name || `WhatsApp Buyer (${formattedPhone.slice(-4)})`;
      const country = body.country || detectCountry(formattedPhone);
      const source = text.toLowerCase().includes('gemora global') ? 'WhatsApp (Gemora Global Text)' : 'WhatsApp Incoming';

      const existing = await query('SELECT id FROM inquiries WHERE whatsapp=$1 LIMIT 1', [formattedPhone]);
      if (existing.rows.length === 0) {
        await query(
          'INSERT INTO inquiries(name,country,whatsapp,requirement,"productId",status,source,"pipelineStage") VALUES($1,$2,$3,$4,$5,$6,$7,$8)',
          [senderName, country, formattedPhone, text, null, 'new', source, 'New']
        );
      }
    }

    res.status(200).json({ status: 'success' });
  } catch (e) {
    console.error('Webhook processing error:', e);
    res.status(200).json({ status: 'error', error: e.message });
  }
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
