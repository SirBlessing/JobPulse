/**
 * components/CuratedJobCard.jsx
 *
 * Reusable job card used on LiveFeedPage and CategoryFeedPage.
 * Renders every curator field — scam banner, honest take,
 * real talk, red flags, category chips — conditionally.
 *
 * Props:
 *   job {object}  — a Job document from the API
 */
import React from 'react'
import { timeAgo } from '../utils/format.js'

const CATEGORY_META = {
  'no-experience':   { emoji: '🔰', label: 'No Experience'  },
  'remote-friendly': { emoji: '💻', label: 'Remote Friendly' },
  'low-stress':      { emoji: '😌', label: 'Low Stress'      },
  'high-salary':     { emoji: '💸', label: 'High Salary'     },
  'entry-level':     { emoji: '🎓', label: 'Entry Level'     },
  'government-job':  { emoji: '🏛️', label: 'Govt Job'       },
  'tech-roles':      { emoji: '⚡', label: 'Tech'            },
  'sales-ops':       { emoji: '📈', label: 'Sales / Ops'     },
  'global-remote':   { emoji: '🌍', label: 'Global Remote'   },
  'internships':     { emoji: '📝', label: 'Internship'      },
}

export default function CuratedJobCard({ job }) {
  const {
    title, company, nigerianState,
    applicationLink, salaryNaira,
    realTalkBreakdown, honestTake,
    redFlags, scamAlertText,
    smartCategories = [], createdAt,
  } = job

  return (
    <article className="card">

      {/* ── Scam / alert banner (full-bleed, no radius) ──── */}
      {scamAlertText && (
        <div className="banner-scam-soft">
          <span className="material-symbols-outlined">warning</span>
          {scamAlertText}
        </div>
      )}

      <div style={{ padding: 'var(--sp-lg)' }}>

        {/* ── Header: title + meta ─────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-sm)', marginBottom: 'var(--sp-md)' }}>
          <div style={{ minWidth: 0 }}>
            <h2 className="t-h2" style={{ color: 'var(--on-surface)', marginBottom: 4 }}>{title}</h2>
            <p className="t-label" style={{ color: 'var(--secondary)' }}>{company}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--sp-xs)', flexShrink: 0 }}>
            <span className="badge badge-location">
              <span className="material-symbols-outlined">location_on</span>
              {nigerianState}
            </span>
            {salaryNaira && (
              <span className="badge badge-salary">{salaryNaira}</span>
            )}
            <span className="badge badge-time">{timeAgo(createdAt)}</span>
          </div>
        </div>

        {/* ── Real Talk Breakdown ──────────────────────────── */}
        {realTalkBreakdown && (
          <div style={{ marginBottom: 'var(--sp-md)' }}>
            <p className="t-micro" style={{ color: 'var(--on-surface-variant)', marginBottom: 6 }}>The Real Talk</p>
            <p className="t-small" style={{ color: 'var(--on-surface-variant)' }}>{realTalkBreakdown}</p>
          </div>
        )}

        {/* ── Curator's Honest Take ────────────────────────── */}
        {honestTake && (
          <div className="curator-box" style={{ marginBottom: 'var(--sp-md)' }}>
            <div className="curator-box__eyebrow">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
              My Honest Take
            </div>
            <p>"{honestTake}"</p>
          </div>
        )}

        {/* ── Red Flags ────────────────────────────────────── */}
        {redFlags && (
          <div className="red-flags-box" style={{ marginBottom: 'var(--sp-md)' }}>
            <div className="red-flags-box__label">
              <span className="material-symbols-outlined">gavel</span>
              Red Flags
            </div>
            <p>{redFlags}</p>
          </div>
        )}

        {/* ── Category chips ───────────────────────────────── */}
        {smartCategories.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-xs)', marginBottom: 'var(--sp-md)' }}>
            {smartCategories.map(slug => {
              const meta = CATEGORY_META[slug]
              return (
                <span key={slug} className="badge badge-category">
                  {meta ? `${meta.emoji} ${meta.label}` : slug}
                </span>
              )
            })}
          </div>
        )}

        {/* ── Footer: actions + apply ──────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--sp-md)', borderTop: '1px solid var(--outline-variant)' }}>
          <div style={{ display: 'flex', gap: 'var(--sp-xs)' }}>
            <button className="icon-btn" aria-label="Bookmark this job">
              <span className="material-symbols-outlined">bookmark</span>
            </button>
            <button className="icon-btn" aria-label="Share this job">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
          <a
            href={applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Apply Now
            <span className="material-symbols-outlined">arrow_forward</span>
          </a>
        </div>

      </div>
    </article>
  )
}