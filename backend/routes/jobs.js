/**
 * routes/jobs.js — Job API Router
 *
 * Public routes (no token required):
 *   GET  /api/jobs                        → all live jobs
 *   GET  /api/jobs/category/:categorySlug → jobs by smart category
 *
 * Admin routes (X-Admin-Token header required):
 *   POST   /api/jobs             → create a new listing
 *   PATCH  /api/jobs/:id/toggle  → flip isLive on/off
 *   DELETE /api/jobs/:id         → permanently remove a listing
 */

const express = require('express')
const router  = express.Router()

const adminAuth = require('../middleware/adminAuth')
const {
  createJob,
  getJobs,
  getByCategory,
  toggleLive,
  deleteJob,
} = require('../controllers/jobController')

/* ── Public ─────────────────────────────────────────── */
router.get('/', getJobs)
router.get('/category/:categorySlug', getByCategory)

/* ── Admin-protected ────────────────────────────────── */
router.post('/',             adminAuth, createJob)
router.patch('/:id/toggle',  adminAuth, toggleLive)
router.delete('/:id',        adminAuth, deleteJob)

module.exports = router