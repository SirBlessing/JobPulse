/**
 * controllers/jobController.js — Job CRUD Logic
 */

const Job = require('../models/Job')

const sanitiseJobInput = (body) => ({
  title:             body.title,
  company:           body.company,
  nigerianState:     body.nigerianState,
  applicationMethod: body.applicationMethod || 'link',
  applicationLink:   body.applicationLink   || '',
  applicationEmail:  body.applicationEmail  || '',
  closingDate:       body.closingDate       || null,
  salaryNaira:       body.salaryNaira       || '',
  realTalkBreakdown: body.realTalkBreakdown || '',
  honestTake:        body.honestTake        || '',
  redFlags:          body.redFlags          || '',
  scamAlertText:     body.scamAlertText     || '',
  smartCategories:   Array.isArray(body.smartCategories) ? body.smartCategories : [],
})

/* POST /api/jobs  (ADMIN) */
const createJob = async (req, res) => {
  try {
    const job = await Job.create(sanitiseJobInput(req.body))
    return res.status(201).json({ success: true, job })
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message)
      return res.status(400).json({ error: messages.join(' | ') })
    }
    console.error('[createJob]', err)
    return res.status(500).json({ error: 'Failed to create job.' })
  }
}

/* GET /api/jobs  (PUBLIC) */
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isLive: true }).sort({ createdAt: -1 }).select('-__v')
    return res.json({ success: true, count: jobs.length, jobs })
  } catch (err) {
    console.error('[getJobs]', err)
    return res.status(500).json({ error: 'Failed to fetch jobs.' })
  }
}

/* GET /api/jobs/:id  (PUBLIC) — single job detail */
const getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, isLive: true }).select('-__v')
    if (!job) return res.status(404).json({ error: 'Job not found.' })
    return res.json({ success: true, job })
  } catch (err) {
    console.error('[getJobById]', err)
    return res.status(500).json({ error: 'Failed to fetch job.' })
  }
}

/* GET /api/jobs/category/:categorySlug  (PUBLIC) */
const getByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params
    if (!/^[a-z0-9-]+$/.test(categorySlug))
      return res.status(400).json({ error: 'Invalid category slug.' })

    const jobs = await Job.find({ isLive: true, smartCategories: { $in: [categorySlug] } })
      .sort({ createdAt: -1 }).select('-__v')
    return res.json({ success: true, category: categorySlug, count: jobs.length, jobs })
  } catch (err) {
    console.error('[getByCategory]', err)
    return res.status(500).json({ error: 'Failed to fetch category jobs.' })
  }
}

/* PATCH /api/jobs/:id/toggle  (ADMIN) */
const toggleLive = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) return res.status(404).json({ error: 'Job not found.' })
    job.isLive = !job.isLive
    await job.save()
    return res.json({ success: true, isLive: job.isLive, id: job._id })
  } catch (err) {
    console.error('[toggleLive]', err)
    return res.status(500).json({ error: 'Failed to toggle.' })
  }
}

/* DELETE /api/jobs/:id  (ADMIN) */
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id)
    if (!job) return res.status(404).json({ error: 'Job not found.' })
    return res.json({ success: true, message: 'Job deleted.' })
  } catch (err) {
    console.error('[deleteJob]', err)
    return res.status(500).json({ error: 'Failed to delete job.' })
  }
}

module.exports = { createJob, getJobs, getJobById, getByCategory, toggleLive, deleteJob }