/**
 * models/Job.js — Mongoose Job Schema
 */

const mongoose = require('mongoose')

const VALID_CATEGORIES = [
  'no-experience', 'remote-friendly', 'low-stress', 'high-salary',
  'entry-level', 'government-job', 'tech-roles', 'sales-ops',
  'global-remote', 'internships',
]

const jobSchema = new mongoose.Schema(
  {
    /* ── Core fields ─────────────────────────────────────────── */
    title: {
      type: String, required: [true, 'Job title is required.'],
      trim: true, maxlength: [120, 'Title must be 120 characters or fewer.'],
    },
    company: {
      type: String, required: [true, 'Company name is required.'],
      trim: true, maxlength: [80, 'Company must be 80 characters or fewer.'],
    },
    nigerianState: {
      type: String, required: [true, 'Nigerian state is required.'], trim: true,
    },

    /* ── Application method: link OR email (one is required) ── */
    applicationMethod: {
      type: String,
      enum: ['link', 'email'],
      default: 'link',
    },
    applicationLink: {
      type: String, trim: true, default: '',
      // validated in pre-save hook below instead of schema-level required
    },
    applicationEmail: {
      type: String, trim: true, default: '',
    },

    /* ── Closing date (optional but shown prominently when set) */
    closingDate: {
      type: Date, default: null,
    },

    /* ── Salary ─────────────────────────────────────────────── */
    salaryNaira: {
      type: String, trim: true, default: '',
    },

    /* ── Curator editorial content ──────────────────────────── */
    realTalkBreakdown: {
      type: String, trim: true,
      maxlength: [2000, 'Real Talk must be 2000 characters or fewer.'], default: '',
    },
    honestTake: {
      type: String, trim: true,
      maxlength: [2000, 'Honest Take must be 2000 characters or fewer.'], default: '',
    },
    redFlags: {
      type: String, trim: true,
      maxlength: [1000, 'Red Flags must be 1000 characters or fewer.'], default: '',
    },
    scamAlertText: {
      type: String, trim: true, default: '',
    },

    /* ── Dynamic Category Engine ────────────────────────────── */
    smartCategories: {
      type: [String],
      enum: { values: VALID_CATEGORIES, message: '"{VALUE}" is not a valid category.' },
      default: [],
    },

    /* ── Visibility ─────────────────────────────────────────── */
    isLive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

/* Validate: link required if method is 'link', email required if 'email' */
jobSchema.pre('validate', function (next) {
  if (this.applicationMethod === 'link' && !this.applicationLink) {
    this.invalidate('applicationLink', 'Application link is required when method is "link".')
  }
  if (this.applicationMethod === 'email' && !this.applicationEmail) {
    this.invalidate('applicationEmail', 'Application email is required when method is "email".')
  }
  next()
})

jobSchema.index({ smartCategories: 1, createdAt: -1 })
jobSchema.index({ isLive: 1, createdAt: -1 })

module.exports = mongoose.model('Job', jobSchema)