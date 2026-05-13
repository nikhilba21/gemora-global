const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// POST /api/email/send
router.post('/send', requireAdmin, async (req, res) => {
  const { recipients, subject, body } = req.body;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Resend API Key is not configured on the server.' });
  }

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ error: 'Recipients array is required.' });
  }

  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  // We send individual emails for personalization
  for (const contact of recipients) {
    try {
      const personalizedBody = body
        .replace(/{name}/g, (contact.name || '').split(' ')[0])
        .replace(/{country}/g, contact.country || '')
        .replace(/{company}/g, contact.company || '');

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Gemora Global <marketing@gemoraglobal.co>', // Ensure this domain is verified in Resend
          to: [contact.email],
          subject: subject,
          text: personalizedBody,
          // If you want HTML support, you can add it here
        })
      });

      const data = await response.json();

      if (response.ok) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push({ email: contact.email, error: data.message || 'Unknown error' });
      }
    } catch (error) {
      results.failed++;
      results.errors.push({ email: contact.email, error: error.message });
    }
  }

  res.json({
    message: `Completed: ${results.success} sent, ${results.failed} failed.`,
    results
  });
});

module.exports = router;
