/**
 * pages/JobDetailPage.jsx — Full job detail view
 * Mobile-first: stacked sections, full-width apply button.
 */
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import { publicFetch } from '../utils/api.js'
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

function daysBetween(date) {
  if (!date) return null
  return Math.ceil((new Date(date) - new Date()) / 86400000)
}

function ClosingBanner({ closingDate }) {
  if (!closingDate) return null
  const days = daysBetween(closingDate)
  const dateStr = new Date(closingDate).toLocaleDateString('en-NG', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  if (days < 0) return (
    <div className="closing-banner closing-banner--closed">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
      <div>
        <p className="closing-banner__title">Applications Closed</p>
        <p className="closing-banner__sub">Closed on {dateStr}</p>
      </div>
    </div>
  )

  const urgent = days <= 3
  return (
    <div className={`closing-banner ${urgent ? 'closing-banner--urgent' : 'closing-banner--open'}`}>
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: 28 }}>
        {urgent ? 'timer' : 'event_available'}
      </span>
      <div>
        <p className="closing-banner__title">
          {days === 0 ? '⚠️ Closes TODAY — Apply immediately!' : `${days} day${days !== 1 ? 's' : ''} left to apply`}
        </p>
        <p className="closing-banner__sub">Deadline: {dateStr}</p>
      </div>
    </div>
  )
}

function EmailApply({ email }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2500)
    })
  }
  return (
    <div className="apply-box">
      <p className="t-micro" style={{ color: 'var(--on-surface-variant)', marginBottom: 10 }}>
        Application Email Address
      </p>
      <div className="email-row">
        <div className="email-row__address">
          <span className="material-symbols-outlined">mail</span>
          <span>{email}</span>
        </div>
        <button className="btn btn-primary btn-sm email-row__copy" onClick={copy}>
          <span className="material-symbols-outlined">{copied ? 'check' : 'content_copy'}</span>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="t-small" style={{ color: 'var(--on-surface-variant)', margin: '10px 0 var(--sp-md)' }}>
        Send your CV and cover letter to this address. Include the job title in your subject line.
      </p>
      <a href={`mailto:${email}`} className="btn btn-outline btn-full">
        <span className="material-symbols-outlined">open_in_new</span>
        Open in Email App
      </a>
    </div>
  )
}

function LinkApply({ link }) {
  return (
    <div className="apply-box">
      <p className="t-small" style={{ color: 'var(--on-surface-variant)', marginBottom: 'var(--sp-md)' }}>
        You will be taken to the company's official application page. <strong>Never pay fees to apply.</strong>
      </p>
      <a href={link} target="_blank" rel="noopener noreferrer"
        className="btn btn-primary btn-full" style={{ padding: '16px', fontSize: 15 }}>
        <span className="material-symbols-outlined">open_in_new</span>
        Apply Now — Official Link
      </a>
    </div>
  )
}

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob]         = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    publicFetch(`/jobs/${id}`)
      .then(d => setJob(d.job))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <AppShell>
      <div className="detail-wrap">

        {/* Back */}
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm back-btn">
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>

        {loading && <div className="loader-wrap"><div className="spinner" />Loading job details…</div>}

        {error && (
          <div className="banner banner-error">
            <span className="material-symbols-outlined">error</span>
            <div>
              <strong>Could not load this job</strong>
              <p style={{ fontWeight: 400, marginTop: 4, fontSize: 13 }}>{error}</p>
            </div>
          </div>
        )}

        {job && (
          <>
            {/* Scam alert */}
            {job.scamAlertText && (
              <div className="detail-scam-alert">
                <span className="material-symbols-outlined" style={{ flexShrink: 0 }}>warning</span>
                {job.scamAlertText}
              </div>
            )}

            {/* Job header card */}
            <div className="detail-header">
              <h1 className="t-h1 detail-header__title">{job.title}</h1>
              <p className="detail-header__company">{job.company}</p>

              <div className="detail-header__badges">
                <span className="badge badge-location">
                  <span className="material-symbols-outlined">location_on</span>
                  {job.nigerianState}
                </span>
                {job.salaryNaira?.trim() && (
                  <span className="badge badge-salary">💰 {job.salaryNaira}</span>
                )}
                <span className="badge badge-time">
                  <span className="material-symbols-outlined">schedule</span>
                  {timeAgo(job.createdAt)}
                </span>
              </div>

              {job.smartCategories?.length > 0 && (
                <div className="detail-header__cats">
                  {job.smartCategories.map(slug => {
                    const m = CATEGORY_META[slug]
                    return (
                      <span key={slug} className="badge badge-category">
                        {m ? `${m.emoji} ${m.label}` : slug}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Closing date */}
            <ClosingBanner closingDate={job.closingDate} />

            {/* Real Talk */}
            {job.realTalkBreakdown && (
              <div className="detail-section">
                <div className="detail-section__header">
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>list_alt</span>
                  <h2 className="detail-section__title">The Real Talk Breakdown</h2>
                </div>
                <p className="t-body detail-section__body">{job.realTalkBreakdown}</p>
              </div>
            )}

            {/* Honest Take */}
            {job.honestTake && (
              <div className="curator-box detail-curator">
                <div className="curator-box__eyebrow">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
                  Curator's Honest Take
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.75 }}>"{job.honestTake}"</p>
              </div>
            )}

            {/* Red Flags */}
            {job.redFlags && (
              <div className="red-flags-box" style={{ borderRadius: 'var(--r-xl)' }}>
                <div className="red-flags-box__label">
                  <span className="material-symbols-outlined">gavel</span>
                  Red Flags to Watch Out For
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{job.redFlags}</p>
              </div>
            )}

            {/* Trust note */}
            <div className="trust-note">
              <span className="material-symbols-outlined"
                style={{ color: 'var(--primary)', flexShrink: 0, fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
              <p className="t-small">
                <strong style={{ color: 'var(--primary)' }}>NaijaWork Shield:</strong>{' '}
                This listing has been reviewed by our curator. Legitimate employers never ask you to pay fees to apply or attend interviews.
              </p>
            </div>

            {/* How to Apply */}
            <div className="detail-apply">
              <h2 className="t-h2" style={{ marginBottom: 'var(--sp-md)' }}>How to Apply</h2>
              {job.applicationMethod === 'email'
                ? <EmailApply email={job.applicationEmail} />
                : <LinkApply link={job.applicationLink} />
              }
            </div>

            {/* Browse more */}
            <div style={{ textAlign: 'center' }}>
              <Link to="/" className="btn btn-ghost">
                <span className="material-symbols-outlined">arrow_back</span>
                Browse more jobs
              </Link>
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}