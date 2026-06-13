/**
 * controllers/jobController.js — Job CRUD Logic
 *
 * createJob  — Admin only (protected by adminAuth middleware)
 * getJobs    — Public: returns all live jobs, newest first
 * getByCategory — Public: returns live jobs matching a category slug
 * toggleLive — Admin only: flip the isLive flag
 */

const Job = require("../models/Job");

/* ─── Helper: strip unknown fields to prevent mass-assignment ─── */
const sanitiseJobInput = (body) => ({
  title:             body.title,
  company:           body.company,
  nigerianState:     body.nigerianState,
  applicationLink:   body.applicationLink,
  salaryNaira:       body.salaryNaira       || "",
  realTalkBreakdown: body.realTalkBreakdown || "",
  honestTake:        body.honestTake        || "",
  redFlags:          body.redFlags          || "",
  scamAlertText:     body.scamAlertText     || "",
  smartCategories:   Array.isArray(body.smartCategories) ? body.smartCategories : [],
});

/* ─── POST /api/jobs  (ADMIN ONLY) ──────────────────────────────── */
const createJob = async (req, res) => {
  try {
    const data = sanitiseJobInput(req.body);
    const job = await Job.create(data);
    return res.status(201).json({ success: true, job });
  } catch (err) {
    /* Mongoose validation errors → surface them clearly */
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(" | ") });
    }
    console.error("[createJob]", err);
    return res.status(500).json({ error: "Failed to create job." });
  }
};

/* ─── GET /api/jobs  (PUBLIC) ───────────────────────────────────── */
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isLive: true })
      .sort({ createdAt: -1 })
      .select("-__v");
    return res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    console.error("[getJobs]", err);
    return res.status(500).json({ error: "Failed to fetch jobs." });
  }
};

/* ─── GET /api/jobs/category/:categorySlug  (PUBLIC) ────────────── */
/**
 * Dynamic Category Engine
 *
 * Scans the smartCategories array field for every live document.
 * MongoDB's $in operator makes this a single indexed query — fast
 * even with thousands of documents.
 *
 * Example:  GET /api/jobs/category/remote-friendly
 *   → returns every Job where smartCategories contains "remote-friendly"
 */
const getByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;

    /* Basic sanitisation — slugs must be lowercase alphanumeric + hyphens */
    if (!/^[a-z0-9-]+$/.test(categorySlug)) {
      return res.status(400).json({ error: "Invalid category slug format." });
    }

    const jobs = await Job.find({
      isLive: true,
      smartCategories: { $in: [categorySlug] },
    })
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.json({
      success: true,
      category: categorySlug,
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error("[getByCategory]", err);
    return res.status(500).json({ error: "Failed to fetch category jobs." });
  }
};

/* ─── PATCH /api/jobs/:id/toggle  (ADMIN ONLY) ──────────────────── */
const toggleLive = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found." });

    job.isLive = !job.isLive;
    await job.save();

    return res.json({ success: true, isLive: job.isLive, id: job._id });
  } catch (err) {
    console.error("[toggleLive]", err);
    return res.status(500).json({ error: "Failed to toggle job status." });
  }
};

/* ─── DELETE /api/jobs/:id  (ADMIN ONLY) ────────────────────────── */
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found." });
    return res.json({ success: true, message: "Job permanently deleted." });
  } catch (err) {
    console.error("[deleteJob]", err);
    return res.status(500).json({ error: "Failed to delete job." });
  }
};

module.exports = { createJob, getJobs, getByCategory, toggleLive, deleteJob };
