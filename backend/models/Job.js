/**
 * models/Job.js — Mongoose Job Schema
 *
 * Represents a single curated job listing on NaijaWork.
 * Only the admin curator can create documents in this collection.
 *
 * Key design choices:
 *  - smartCategories: String[] — the Dynamic Category Engine queries this field.
 *  - salaryNaira: stored as a plain string so the curator can write
 *    "₦850k – ₦1.2M/mo" or "Competitive" without forcing a numeric range.
 *  - scamAlertText: optional; when present the frontend renders the amber banner.
 */

const mongoose = require("mongoose");

/* Valid slugs the Dynamic Category Engine recognises */
const VALID_CATEGORIES = [
  "no-experience",
  "remote-friendly",
  "low-stress",
  "high-salary",
  "entry-level",
  "government-job",
  "tech-roles",
  "sales-ops",
  "global-remote",
  "internships",
];

const jobSchema = new mongoose.Schema(
  {
    /* ── Core listing fields ───────────────────────────────────── */
    title: {
      type: String,
      required: [true, "Job title is required."],
      trim: true,
      maxlength: [120, "Title must be 120 characters or fewer."],
    },

    company: {
      type: String,
      required: [true, "Company name is required."],
      trim: true,
      maxlength: [80, "Company name must be 80 characters or fewer."],
    },

    nigerianState: {
      type: String,
      required: [true, "Nigerian state is required."],
      trim: true,
    },

    applicationLink: {
      type: String,
      required: [true, "Application link is required."],
      trim: true,
      match: [/^https?:\/\/.+/, "Application link must be a valid URL."],
    },

    salaryNaira: {
      type: String,
      trim: true,
      default: "",
    },

    /* ── Curator editorial content ─────────────────────────────── */
    realTalkBreakdown: {
      type: String,
      trim: true,
      maxlength: [1000, "Real Talk Breakdown must be 1000 characters or fewer."],
      default: "",
    },

    honestTake: {
      type: String,
      trim: true,
      maxlength: [1000, "Honest Take must be 1000 characters or fewer."],
      default: "",
    },

    redFlags: {
      type: String,
      trim: true,
      maxlength: [500, "Red Flags must be 500 characters or fewer."],
      default: "",
    },

    /* ── Scam alert (amber banner) ─────────────────────────────── */
    scamAlertText: {
      type: String,
      trim: true,
      default: "",
    },

    /* ── Dynamic Category Engine ───────────────────────────────── */
    smartCategories: {
      type: [String],
      enum: {
        values: VALID_CATEGORIES,
        message: '"{VALUE}" is not a recognised category slug.',
      },
      default: [],
    },

    /* ── Soft-delete / visibility flag ────────────────────────── */
    isLive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

/* Index for fast category queries (the most common read path) */
jobSchema.index({ smartCategories: 1, createdAt: -1 });
/* Index for the main live feed */
jobSchema.index({ isLive: 1, createdAt: -1 });

module.exports = mongoose.model("Job", jobSchema);
