require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { initializeDatabase } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());

// ── CORS ──────────────────────────────────────────────────────────────────────
const FRONTEND_URL = process.env.FRONTEND_URL || '';
app.use(cors({
  origin: function (origin, cb) {
    if (!origin) return cb(null, true);              // Postman / server calls
    if (
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('vercel.app') ||
      origin.includes('gemoraglobal.co') ||
      origin.includes('globalgemora.co') ||
      (FRONTEND_URL && origin.startsWith(FRONTEND_URL))
    ) return cb(null, true);
    cb(new Error('CORS blocked: ' + origin));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 5000 })); // High limit for bulk admin uploads
app.use('/api/inquiries', rateLimit({ windowMs: 60 * 60 * 1000, max: 30 }));

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'ok', service: 'Gemora Global API', version: '2.0.0' }));
app.get('/health', (req, res) => res.json({ status: 'healthy', timestamp: new Date().toISOString() }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/categories',   require('./routes/categories'));
app.use('/api/products',     require('./routes/products'));
app.use('/api/inquiries',    require('./routes/inquiries'));
app.use('/api/gallery',      require('./routes/gallery'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/blog',         require('./routes/blog'));
app.use('/api/catalogues',   require('./routes/catalogues'));
app.use('/api/content',      require('./routes/content'));
app.use('/api/dashboard',    require('./routes/dashboard'));
app.post('/api/visit', (req, res) => res.json({ success: true }));

// ── 404 / Error ───────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error('❌', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
try {
  initializeDatabase();
  app.listen(PORT, () => {
    console.log(`\n🚀 Gemora API running on port ${PORT}`);
    console.log(`🌐 CORS allowed for: ${FRONTEND_URL || 'all vercel.app origins'}\n`);
  });
} catch (err) {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
}

module.exports = app;
