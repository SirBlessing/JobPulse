/**
 * server.js — NaijaWork Backend Entry Point
 */

require('dotenv').config()
const express  = require('express')
const cors     = require('cors')
const mongoose = require('mongoose')

const jobRoutes = require('./routes/jobs')

const app  = express()
const PORT = process.env.PORT || 5000

/* ── CORS ────────────────────────────────────────────────────────
   Allow any localhost port so the frontend works on 5173, 3000,
   or whatever port Vite picks. In production, restrict this to
   your actual domain via the CLIENT_ORIGIN env variable.
   ──────────────────────────────────────────────────────────────── */
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4173', // vite preview
  process.env.CLIENT_ORIGIN,
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, same-origin)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error(`CORS: origin ${origin} not allowed`))
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-Admin-Token'],
  })
)

/* ── Body Parser ─────────────────────────────────────────────── */
app.use(express.json({ limit: '10kb' }))

/* ── Routes ──────────────────────────────────────────────────── */
app.use('/api/jobs', jobRoutes)

/* ── Health check ────────────────────────────────────────────── */
app.get('/health', (_req, res) => res.json({ status: 'ok', port: PORT }))

/* ── 404 ─────────────────────────────────────────────────────── */
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }))

/* ── Global error handler ────────────────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' })
})

/* ── Start ───────────────────────────────────────────────────── */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('[DB] Connected to MongoDB')
    app.listen(PORT, () =>
      console.log(`[SERVER] NaijaWork API running on http://localhost:${PORT}`)
    )
  })
  .catch(err => {
    console.error('[DB] Connection failed:', err.message)
    process.exit(1)
  })