const express = require('express');
const bcrypt = require('bcryptjs');
const { query } = require('../db/database');
const { generateAdminToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    const uRow = await query("SELECT value FROM admin_settings WHERE key='admin_username'");
    const hRow = await query("SELECT value FROM admin_settings WHERE key='admin_password_hash'");
    if (!uRow.rows[0] || !hRow.rows[0]) return res.status(500).json({ error: 'Admin not configured' });
    if (username !== uRow.rows[0].value) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    const valid = bcrypt.compareSync(password, hRow.rows[0].value);
    if (!valid) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    const token = generateAdminToken(username);
    res.json({ success: true, token, expiresIn: '24h' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/verify', requireAdmin, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.post('/change-credentials', requireAdmin, async (req, res) => {
  try {
    const { currentUsername, currentPassword, newUsername, newPassword } = req.body;
    const uRow = await query("SELECT value FROM admin_settings WHERE key='admin_username'");
    const hRow = await query("SELECT value FROM admin_settings WHERE key='admin_password_hash'");
    if (currentUsername !== uRow.rows[0]?.value) return res.json({ success: false });
    if (!bcrypt.compareSync(currentPassword, hRow.rows[0]?.value)) return res.json({ success: false });
    const newHash = bcrypt.hashSync(newPassword, 10);
    await query("UPDATE admin_settings SET value=$1 WHERE key='admin_username'", [newUsername]);
    await query("UPDATE admin_settings SET value=$1 WHERE key='admin_password_hash'", [newHash]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
