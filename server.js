'use strict';

const express    = require('express');
const path       = require('path');
const dotenv     = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(express.json());

// Security + CORS headers (mirrors vercel.json)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (req.path.startsWith('/api/')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  next();
});

// API routes — Vercel handler signature (req, res) works with Express as-is
function mount(handler) {
  return async (req, res) => {
    try { await handler(req, res); }
    catch (err) { res.status(500).json({ error: err.message }); }
  };
}

app.options('/api/*', (req, res) => res.status(200).end());
app.get('/api/manufacturers', mount(require('./api/manufacturers')));
app.post('/api/submit',       mount(require('./api/submit')));
app.post('/api/ec3-proxy',    mount(require('./api/ec3-proxy')));

// Cache-control for manufacturer API (mirrors vercel.json)
app.use('/api/manufacturers', (req, res, next) => {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname), { index: 'index.html' }));

// Fallback to index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Low-Carbon Material Finder running at http://localhost:${PORT}`);
});
