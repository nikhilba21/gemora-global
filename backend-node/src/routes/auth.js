const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db/database');
const { generateAdminToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const storedUser = db.prepare("SELECT value FROM admin_settings WHERE key='admin_username'").get();
    const storedHash = db.prepare("SELECT value FROM admin_settings WHERE key='admin_password_hash'").get();

    if (!storedUser || !storedHash) return res.status(500).json({ error: 'Admin not configured' });
    if (username !== storedUser.value) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    if (!bcrypt.compareSync(password, storedHash.value)) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const token = generateAdminToken(username);
    res.json({ success: true, token, expiresIn: '24h' });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/auth/verify
router.get('/verify', requireAdmin, (req, res) => {
  res.json({ success: true, user: req.user });
});

// POST /api/auth/change-credentials
router.post('/change-credentials', requireAdmin, (req, res) => {
  try {
    const { currentUsername, currentPassword, newUsername, newPassword } = req.body;
    const storedUser = db.prepare("SELECT value FROM admin_settings WHERE key='admin_username'").get();
    const storedHash = db.prepare("SELECT value FROM admin_settings WHERE key='admin_password_hash'").get();

    if (currentUsername !== storedUser.value) return res.json({ success: false });
    if (!bcrypt.compareSync(currentPassword, storedHash.value)) return res.json({ success: false });

    db.prepare("UPDATE admin_settings SET value=? WHERE key='admin_username'").run(newUsername);
    db.prepare("UPDATE admin_settings SET value=? WHERE key='admin_password_hash'").run(bcrypt.hashSync(newPassword, 10));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
