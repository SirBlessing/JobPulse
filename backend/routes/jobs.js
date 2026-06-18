/**
 * routes/jobs.js
 *
 * Public:
 *   GET  /api/jobs                        → all live jobs
 *   GET  /api/jobs/category/:categorySlug → jobs by category
 *   GET  /api/jobs/:id                    → single job detail
 *
 * Admin (X-Admin-Token required):
 *   POST   /api/jobs             → create listing
 *   PATCH  /api/jobs/:id/toggle  → toggle live
 *   DELETE /api/jobs/:id         → delete
 */

const express   = require('express')
const router    = express.Router()
const adminAuth = require('../middleware/adminAuth')
const {
  createJob, getJobs, getJobById,
  getByCategory, toggleLive, deleteJob,
} = require('../controllers/jobController')

/* ── Public ─────────────────────────────────────────────── */
router.get('/',                        getJobs)
router.get('/category/:categorySlug',  getByCategory)  // must be BEFORE /:id

/* ── Admin token verification ping (must be before /:id) ── */
router.get('/ping', adminAuth, (_req, res) => res.json({ ok: true }))

router.get('/:id',                     getJobById)

/* ── Admin ──────────────────────────────────────────────── */
router.post('/',              adminAuth, createJob)
router.patch('/:id/toggle',   adminAuth, toggleLive)
router.delete('/:id',         adminAuth, deleteJob)

module.exports = router