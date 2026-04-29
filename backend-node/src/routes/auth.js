// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db/database');
const { generateAdminToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const storedUsername = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_username'").get();
  const storedHash = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_password_hash'").get();

  if (!storedUsername || !storedHash) {
    return res.status(500).json({ error: 'Admin not configured' });
  }

  if (username !== storedUsername.value) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const valid = bcrypt.compareSync(password, storedHash.value);
  if (!valid) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const token = generateAdminToken(username);
  res.json({ success: true, token, expiresIn: '24h' });
});

// POST /api/auth/verify - check if token is valid
router.get('/verify', requireAdmin, (req, res) => {
  res.json({ success: true, user: req.user });
});

// POST /api/auth/change-credentials
router.post('/change-credentials', requireAdmin, (req, res) => {
  const { currentUsername, currentPassword, newUsername, newPassword } = req.body;

  const storedUsername = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_username'").get();
  const storedHash = db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_password_hash'").get();

  if (currentUsername !== storedUsername.value) {
    return res.json({ success: false });
  }

  const valid = bcrypt.compareSync(currentPassword, storedHash.value);
  if (!valid) {
    return res.json({ success: false });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.prepare("UPDATE admin_settings SET value = ? WHERE key = 'admin_username'").run(newUsername);
  db.prepare("UPDATE admin_settings SET value = ? WHERE key = 'admin_password_hash'").run(newHash);

  res.json({ success: true });
});

module.exports = router;
