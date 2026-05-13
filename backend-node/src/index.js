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
const ALLOWED_ORIGINS = [
  'gemoraglobal.co',
  'globalgemora.co',
  'vercel.app',
  'localhost',
  '127.0.0.1'
];

app.use(cors({
  origin: function (origin, cb) {
    if (!origin) return cb(null, true);
    const isAllowed = ALLOWED_ORIGINS.some(domain => origin.includes(domain)) || 
                     (FRONTEND_URL && origin.startsWith(FRONTEND_URL));
    
    if (isAllowed) {
      cb(null, true);
    } else {
      console.warn('CORS blocked for origin:', origin);
      cb(new Error('CORS blocked'));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','Accept','Origin'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 10000 }));
app.use('/api/inquiries', rateLimit({ windowMs: 60 * 60 * 1000, max: 30 }));

// ── Cache headers for public GET endpoints ────────────────────────────────────
app.use('/api/products',     (req, res, next) => { if (req.method === 'GET') res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300'); next(); });
app.use('/api/categories',   (req, res, next) => { if (req.method === 'GET') res.set('Cache-Control', 'public, max-age=300'); next(); });
app.use('/api/blog',         (req, res, next) => { if (req.method === 'GET') res.set('Cache-Control', 'public, max-age=120'); next(); });
app.use('/api/gallery',      (req, res, next) => { if (req.method === 'GET') res.set('Cache-Control', 'public, max-age=120'); next(); });
app.use('/api/testimonials', (req, res, next) => { if (req.method === 'GET') res.set('Cache-Control', 'public, max-age=300'); next(); });

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'ok', service: 'Gemora Global API', version: '2.0.0' }));
app.get('/health', (req, res) => res.json({ status: 'healthy', timestamp: new Date().toISOString() }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',            require('./routes/auth'));
app.use('/api/categories',      require('./routes/categories'));
app.use('/api/products',        require('./routes/products'));
app.use('/api/inquiries',       require('./routes/inquiries'));
app.use('/api/gallery',         require('./routes/gallery'));
app.use('/api/gallery-folders', require('./routes/galleryFolders'));
app.use('/api/testimonials',    require('./routes/testimonials'));
app.use('/api/blog',            require('./routes/blog'));
app.use('/api/catalogues',      require('./routes/catalogues'));
app.use('/api/content',         require('./routes/content'));
app.use('/api/dashboard',       require('./routes/dashboard'));
app.use('/api/contacts',        require('./routes/contacts'));
app.use('/api/email',           require('./routes/email'));
app.post('/api/visit', (req, res) => res.json({ success: true }));

// ── 404 / Error ───────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found', path: req.path }));
app.use((err, req, res, next) => {
  console.error('❌', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Gemora API running on port ${PORT}`);
    console.log(`🌐 CORS allowed for: ${FRONTEND_URL || 'all vercel.app origins'}\n`);
  });
}).catch(err => {
  console.error('❌ Failed to start:', err);
  process.exit(1);
});

module.exports = app;
