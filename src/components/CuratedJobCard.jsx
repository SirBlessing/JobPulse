/**
 * components/CuratedJobCard.jsx
 * Compact feed card. Click anywhere → /job/:id detail page.
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
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

function daysLeft(d) {
  if (!d) return null
  return Math.ceil((new Date(d) - new Date()) / 86400000)
}

export default function CuratedJobCard({ job }) {
  const navigate = useNavigate()
  const {
    _id, title, company, nigerianState,
    salaryNaira, honestTake, scamAlertText,
    smartCategories = [], createdAt, closingDate,
    applicationMethod,
  } = job

  const days    = daysLeft(closingDate)
  const urgent  = days !== null && days <= 3 && days >= 0
  const closed  = days !== null && days < 0

  const go = () => navigate(`/job/${_id}`)

  return (
    <article className="card" onClick={go}
      role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && go()}
      aria-label={`${title} at ${company}`}
      style={{ cursor: 'pointer' }}>

      {/* Banners */}
      {scamAlertText && (
        <div className="card__scam card__scam--soft">
          <span className="material-symbols-outlined">warning</span>
          {scamAlertText}
        </div>
      )}
      {closed && (
        <div className="card__scam" style={{ background: 'var(--on-surface-variant)' }}>
          <span className="material-symbols-outlined">lock</span>
          Applications closed
        </div>
      )}
      {!closed && urgent && (
        <div className="card__scam" style={{ background: '#b45309' }}>
          <span className="material-symbols-outlined">timer</span>
          {days === 0 ? 'Closes TODAY!' : `${days} day${days !== 1 ? 's' : ''} left`}
        </div>
      )}

      <div className="card__body">

        {/* Header: title left, badges right */}
        <div className="card__header">
          <div className="card__title-wrap">
            <h2 className="card__title">{title}</h2>
            <p className="card__company">{company}</p>
          </div>
          <div className="card__meta">
            <span className="badge badge-location">
              <span className="material-symbols-outlined">location_on</span>
              {nigerianState}
            </span>
            {salaryNaira?.trim() && (
              <span className="badge badge-salary">{salaryNaira}</span>
            )}
            <span className="badge badge-time">{timeAgo(createdAt)}</span>
          </div>
        </div>

        {/* Closing date pill */}
        {closingDate && !closed && (
          <div style={{ marginBottom: 'var(--sp-sm)' }}>
            <span className={`closing-pill ${urgent ? 'closing-pill--urgent' : ''}`}>
              <span className="material-symbols-outlined">event</span>
              Closes {new Date(closingDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        )}

        {/* Honest Take preview — 2 lines max */}
        {honestTake && (
          <div className="curator-box" style={{ marginBottom: 'var(--sp-sm)' }}>
            <div className="curator-box__eyebrow">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
              My Honest Take
            </div>
            <p className="card__take-preview">"{honestTake}"</p>
          </div>
        )}

        {/* Category chips */}
        {smartCategories.length > 0 && (
          <div className="card__chips">
            {smartCategories.map(slug => {
              const m = CATEGORY_META[slug]
              return (
                <span key={slug} className="badge badge-category">
                  {m ? `${m.emoji} ${m.label}` : slug}
                </span>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div className="card__footer">
          <span className="card__apply-hint">
            <span className="material-symbols-outlined">
              {applicationMethod === 'email' ? 'mail' : 'open_in_new'}
            </span>
            {applicationMethod === 'email' ? 'Apply via Email' : 'Apply via Link'}
          </span>
          <span className="card__view-link">
            View Details
            <span className="material-symbols-outlined">arrow_forward</span>
          </span>
        </div>

      </div>
    </article>
  )
}