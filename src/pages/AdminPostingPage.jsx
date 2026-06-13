/**
 * pages/AdminPostingPage.jsx
 *
 * Token-gated curator admin panel. Two tabs:
 *  1. Post New Job — full form with all fields + category checkboxes
 *  2. Manage Listings — list all jobs with live toggle + delete
 *
 * Security: the admin token is typed into a password field and held
 * only in React state. It is sent as X-Admin-Token on every request.
 * It is NEVER written to localStorage, sessionStorage, or cookies.
 */
import React, { useState, useEffect, useCallback } from 'react'
import { adminFetch, publicFetch } from '../utils/api.js'
import { timeAgo } from '../utils/format.js'

/* ── Static data ────────────────────────────────────────────────── */
const NIGERIAN_STATES = [
  'Remote (Nigeria-wide)', 'Abuja (FCT)',
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti',
  'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
  'Ogun', 'Ondo', 'Osun', 'Oyo (Ibadan)', 'Plateau',
  'Rivers (Port Harcourt)', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

const SMART_CATEGORIES = [
  { slug: 'no-experience',   emoji: '🔰', label: 'No Experience Needed' },
  { slug: 'remote-friendly', emoji: '💻', label: 'Remote-Friendly'      },
  { slug: 'low-stress',      emoji: '😌', label: 'Low Stress'           },
  { slug: 'high-salary',     emoji: '💸', label: 'High Salary'          },
  { slug: 'entry-level',     emoji: '🎓', label: 'Entry Level'          },
  { slug: 'government-job',  emoji: '🏛️', label: 'Government Job'      },
  { slug: 'tech-roles',      emoji: '⚡', label: 'Tech Roles'           },
  { slug: 'sales-ops',       emoji: '📈', label: 'Sales / Ops'          },
  { slug: 'global-remote',   emoji: '🌍', label: 'Global Remote'        },
  { slug: 'internships',     emoji: '📝', label: 'Internship'           },
]

const EMPTY_FORM = {
  title: '', company: '', nigerianState: 'Lagos',
  applicationLink: '', salaryNaira: '',
  realTalkBreakdown: '', honestTake: '',
  redFlags: '', scamAlertText: '', smartCategories: [],
}

/* ── Small sub-components ───────────────────────────────────────── */
function SectionTitle({ icon, children, count }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: 'var(--sp-md)', paddingBottom: 'var(--sp-sm)',
      borderBottom: '1px solid var(--outline-variant)',
    }}>
      <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 22 }}>{icon}</span>
      <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)', flex: 1 }}>{children}</span>
      {count !== undefined && (
        <span style={{
          fontSize: 11, fontWeight: 700,
          background: 'var(--primary-fixed)', color: 'var(--on-primary-fixed-variant)',
          padding: '2px 10px', borderRadius: 'var(--r-full)',
        }}>
          {count} selected
        </span>
      )}
    </div>
  )
}

function Grid2({ children }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 'var(--sp-md)',
      marginBottom: 'var(--sp-md)',
    }}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Main component
   ═══════════════════════════════════════════════════════════════════ */
export default function AdminPostingPage() {

  /* ── Auth ─────────────────────────────────────────────── */
  const [token,      setToken]      = useState('')
  const [showToken,  setShowToken]  = useState(false)
  const [authed,     setAuthed]     = useState(false)
  const [authError,  setAuthError]  = useState('')
  const [authLoading,setAuthLoading]= useState(false)

  /* ── Form ─────────────────────────────────────────────── */
  const [form,       setForm]       = useState({ ...EMPTY_FORM })
  const [submitting, setSubmitting] = useState(false)
  const [feedback,   setFeedback]   = useState({ type: '', text: '' })

  /* ── Jobs list ────────────────────────────────────────── */
  const [jobs,       setJobs]       = useState([])
  const [loadingJobs,setLoadingJobs]= useState(false)
  const [jobsError,  setJobsError]  = useState('')
  const [actionId,   setActionId]   = useState(null)

  /* ── Tab ──────────────────────────────────────────────── */
  const [tab, setTab] = useState('post')

  /* ── Load all jobs ────────────────────────────────────── */
  const loadJobs = useCallback(async () => {
    setLoadingJobs(true)
    setJobsError('')
    try {
      const data = await publicFetch('/jobs')
      setJobs(data.jobs)
    } catch (err) {
      setJobsError(err.message)
    } finally {
      setLoadingJobs(false)
    }
  }, [])

  useEffect(() => {
    if (tab === 'manage' && authed) loadJobs()
  }, [tab, authed, loadJobs])

  /* ── Verify token ─────────────────────────────────────── */
  const handleAuth = async e => {
    e.preventDefault()
    setAuthError('')
    if (!token.trim()) { setAuthError('Please enter your admin token.'); return }
    setAuthLoading(true)
    try {
      // Ping a protected route — 401 = bad token, 404 = good token (route just doesn't exist)
      await adminFetch('/jobs/__ping__', 'GET', null, token)
    } catch (err) {
      if (err.message === 'Route not found.') { setAuthed(true); setAuthLoading(false); return }
      setAuthError('Invalid token — access denied.')
    }
    setAuthLoading(false)
  }

  /* ── Form handlers ────────────────────────────────────── */
  const handleField = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const toggleCat = slug => {
    setForm(prev => {
      const cats = prev.smartCategories
      return {
        ...prev,
        smartCategories: cats.includes(slug) ? cats.filter(s => s !== slug) : [...cats, slug],
      }
    })
  }

  /* ── Submit new job ───────────────────────────────────── */
  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    setFeedback({ type: '', text: '' })
    try {
      await adminFetch('/jobs', 'POST', form, token)
      setFeedback({ type: 'success', text: '✅ Job published successfully!' })
      setForm({ ...EMPTY_FORM })
    } catch (err) {
      setFeedback({ type: 'error', text: `❌ ${err.message}` })
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Toggle live ──────────────────────────────────────── */
  const handleToggle = async id => {
    setActionId(id)
    try {
      const data = await adminFetch(`/jobs/${id}/toggle`, 'PATCH', null, token)
      setJobs(prev => prev.map(j => j._id === id ? { ...j, isLive: data.isLive } : j))
    } catch (err) {
      alert(`Toggle failed: ${err.message}`)
    } finally {
      setActionId(null)
    }
  }

  /* ── Delete ───────────────────────────────────────────── */
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently delete "${title}"?\n\nThis cannot be undone.`)) return
    setActionId(id)
    try {
      await adminFetch(`/jobs/${id}`, 'DELETE', null, token)
      setJobs(prev => prev.filter(j => j._id !== id))
    } catch (err) {
      alert(`Delete failed: ${err.message}`)
    } finally {
      setActionId(null)
    }
  }

  /* ════════════════════════════════════════════════════════
     TOKEN GATE
     ════════════════════════════════════════════════════════ */
  if (!authed) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 'var(--sp-md)',
        background: 'var(--surface-container-low)',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Logo block */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-xl)' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 'var(--r-full)',
              background: 'var(--primary)', display: 'grid', placeItems: 'center',
              margin: '0 auto var(--sp-md)',
            }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--on-primary)', fontSize: 30, fontVariationSettings: "'FILL' 1" }}>
                lock
              </span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 6 }}>
              NaijaWork Admin
            </h1>
            <p className="t-small" style={{ color: 'var(--on-surface-variant)' }}>
              Curator access only. Enter your admin token.
            </p>
          </div>

          <form onSubmit={handleAuth} className="panel" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <div className="form-group" style={{ marginBottom: 'var(--sp-md)' }}>
              <label htmlFor="admin-token" className="form-label">Admin Token</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-token"
                  type={showToken ? 'text' : 'password'}
                  className="form-input"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  placeholder="Paste your secret token"
                  autoComplete="off"
                  spellCheck={false}
                  style={{ paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowToken(v => !v)}
                  aria-label={showToken ? 'Hide token' : 'Show token'}
                  style={{
                    position: 'absolute', right: 10, top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none', background: 'transparent',
                    cursor: 'pointer', fontSize: 18, color: 'var(--on-surface-variant)',
                  }}
                >
                  {showToken ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {authError && (
              <div className="banner banner-error" style={{ marginBottom: 'var(--sp-md)' }}>
                <span className="material-symbols-outlined">error</span>
                {authError}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={authLoading}>
              {authLoading
                ? <><span className="spinner spinner-sm" /> Verifying…</>
                : <><span className="material-symbols-outlined">verified_user</span> Access Admin Panel</>
              }
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 'var(--sp-md)', fontSize: 12, color: 'var(--outline)' }}>
            Token is verified on every request and never stored locally.
          </p>
        </div>
      </div>
    )
  }

  /* ════════════════════════════════════════════════════════
     ADMIN PANEL
     ════════════════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--surface-container-low)' }}>

      {/* ── Admin Header ──────────────────────────────────── */}
      <header style={{
        background: 'var(--primary)', color: 'var(--on-primary)',
        padding: '0 var(--sp-lg)', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 200,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em' }}>NaijaWork Admin</span>
          <span style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            background: 'rgba(255,255,255,0.18)', padding: '3px 10px', borderRadius: 'var(--r-full)',
          }}>
            Curator
          </span>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.3)' }}
          onClick={() => { setAuthed(false); setToken('') }}
        >
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </button>
      </header>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: 'var(--sp-xl) var(--sp-md)' }}>

        {/* ── Tab switcher ──────────────────────────────────── */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 'var(--sp-xl)',
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 'var(--r-lg)', padding: 4,
        }}>
          {[
            { id: 'post',   icon: 'add_circle', label: 'Post New Job'    },
            { id: 'manage', icon: 'list_alt',   label: 'Manage Listings' },
          ].map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '11px var(--sp-md)',
                borderRadius: 'var(--r)', border: 'none',
                background: tab === id ? 'var(--primary)' : 'transparent',
                color: tab === id ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════
            TAB 1 — POST NEW JOB
            ════════════════════════════════════════════ */}
        {tab === 'post' && (
          <form onSubmit={handleSubmit} noValidate>

            {/* Section: Core Info */}
            <div className="panel" style={{ marginBottom: 'var(--sp-md)' }}>
              <SectionTitle icon="work">Core Listing Info</SectionTitle>
              <Grid2>
                <div className="form-group">
                  <label htmlFor="f-title" className="form-label">Job Title *</label>
                  <input id="f-title" name="title" type="text" className="form-input" required
                    value={form.title} onChange={handleField}
                    placeholder="e.g. Senior Frontend Engineer" />
                </div>
                <div className="form-group">
                  <label htmlFor="f-company" className="form-label">Company Name *</label>
                  <input id="f-company" name="company" type="text" className="form-input" required
                    value={form.company} onChange={handleField}
                    placeholder="e.g. Paystack" />
                </div>
              </Grid2>
              <Grid2>
                <div className="form-group">
                  <label htmlFor="f-state" className="form-label">Nigerian State *</label>
                  <div className="form-select-wrap">
                    <select id="f-state" name="nigerianState" className="form-select" required
                      value={form.nigerianState} onChange={handleField}>
                      {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="f-salary" className="form-label">Salary (₦) — optional</label>
                  <input id="f-salary" name="salaryNaira" type="text" className="form-input"
                    value={form.salaryNaira} onChange={handleField}
                    placeholder='e.g. "₦850k – ₦1.2M/mo" or "Competitive"' />
                </div>
              </Grid2>
              <div className="form-group">
                <label htmlFor="f-link" className="form-label">Application Link *</label>
                <input id="f-link" name="applicationLink" type="url" className="form-input" required
                  value={form.applicationLink} onChange={handleField}
                  placeholder="https://company.com/careers/role" />
              </div>
            </div>

            {/* Section: Curator's Voice */}
            <div className="panel" style={{ marginBottom: 'var(--sp-md)' }}>
              <SectionTitle icon="record_voice_over">Curator's Voice</SectionTitle>

              <div className="form-group" style={{ marginBottom: 'var(--sp-md)' }}>
                <label htmlFor="f-realtalk" className="form-label">The Real Talk Breakdown</label>
                <textarea id="f-realtalk" name="realTalkBreakdown" className="form-textarea"
                  rows={3} value={form.realTalkBreakdown} onChange={handleField}
                  placeholder="Explain the role in plain English — no corporate fluff." />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--sp-md)' }}>
                <label htmlFor="f-take" className="form-label">My Honest Take</label>
                <textarea id="f-take" name="honestTake" className="form-textarea"
                  rows={3} value={form.honestTake} onChange={handleField}
                  placeholder="Why should people apply? Is pay competitive? Culture vibe?" />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--sp-md)' }}>
                <label htmlFor="f-redflags" className="form-label">⚑ Red Flags</label>
                <textarea id="f-redflags" name="redFlags" className="form-textarea"
                  rows={2} value={form.redFlags} onChange={handleField}
                  placeholder="Ambiguous pay? High overtime culture? List it honestly." />
              </div>

              <div className="form-group">
                <label htmlFor="f-scam" className="form-label">⚠️ Scam Alert Banner (leave blank if clean)</label>
                <input id="f-scam" name="scamAlertText" type="text" className="form-input"
                  value={form.scamAlertText} onChange={handleField}
                  placeholder="e.g. Paystack never asks for application fees." />
              </div>
            </div>

            {/* Section: Smart Categories */}
            <div className="panel" style={{ marginBottom: 'var(--sp-md)' }}>
              <SectionTitle icon="label" count={form.smartCategories.length}>
                Smart Categories
              </SectionTitle>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 'var(--sp-sm)',
              }}>
                {SMART_CATEGORIES.map(({ slug, emoji, label }) => {
                  const checked = form.smartCategories.includes(slug)
                  return (
                    <label
                      key={slug}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px var(--sp-md)',
                        border: `1px solid ${checked ? 'var(--primary)' : 'var(--outline-variant)'}`,
                        borderRadius: 'var(--r-full)',
                        background: checked ? 'var(--primary)' : 'transparent',
                        color: checked ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                        fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', userSelect: 'none',
                        transition: 'all 0.15s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCat(slug)}
                        style={{ accentColor: 'var(--primary)', width: 16, height: 16, flexShrink: 0 }}
                      />
                      {emoji} {label}
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Feedback */}
            {feedback.text && (
              <div
                className={`banner ${feedback.type === 'success' ? 'banner-success' : 'banner-error'}`}
                style={{ marginBottom: 'var(--sp-md)' }}
              >
                {feedback.text}
              </div>
            )}

            {/* Submit row */}
            <div style={{ display: 'flex', gap: 'var(--sp-md)' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={submitting}>
                {submitting
                  ? <><span className="spinner spinner-sm" /> Publishing…</>
                  : <><span className="material-symbols-outlined">publish</span> Publish Job</>
                }
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ flex: 1 }}
                disabled={submitting}
                onClick={() => { setForm({ ...EMPTY_FORM }); setFeedback({ type: '', text: '' }) }}
              >
                <span className="material-symbols-outlined">restart_alt</span>
                Clear
              </button>
            </div>

          </form>
        )}

        {/* ════════════════════════════════════════════
            TAB 2 — MANAGE LISTINGS
            ════════════════════════════════════════════ */}
        {tab === 'manage' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-md)' }}>
              <h2 className="t-h2">All Listings</h2>
              <button className="btn btn-ghost btn-sm" onClick={loadJobs} disabled={loadingJobs}>
                <span className="material-symbols-outlined">refresh</span>
                Refresh
              </button>
            </div>

            {loadingJobs && <div className="loader-wrap"><div className="spinner" /> Loading…</div>}

            {jobsError && (
              <div className="banner banner-error" style={{ marginBottom: 'var(--sp-md)' }}>
                <span className="material-symbols-outlined">error</span>
                {jobsError}
              </div>
            )}

            {!loadingJobs && !jobsError && jobs.length === 0 && (
              <div className="empty-state">
                <div className="empty-state__icon">📋</div>
                <h3>No listings yet</h3>
                <p>Go to "Post New Job" to add your first listing.</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
              {jobs.map(job => (
                <div
                  key={job._id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 'var(--sp-md)', padding: 'var(--sp-md)',
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--r-lg)',
                    transition: 'background 0.15s',
                  }}
                >
                  {/* Info */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      fontWeight: 700, fontSize: 15, color: 'var(--on-surface)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {job.title}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginTop: 2 }}>
                      {job.company} · {job.nigerianState} · {timeAgo(job.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span className={`badge ${job.isLive ? 'badge-live' : 'badge-hidden'}`}>
                      {job.isLive ? '● Live' : '○ Hidden'}
                    </span>
                    <button
                      className="btn btn-outline btn-sm"
                      title={job.isLive ? 'Hide listing' : 'Make live'}
                      onClick={() => handleToggle(job._id)}
                      disabled={actionId === job._id}
                    >
                      {actionId === job._id
                        ? <span className="spinner spinner-sm" />
                        : <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                            {job.isLive ? 'visibility_off' : 'visibility'}
                          </span>
                      }
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      title="Delete permanently"
                      onClick={() => handleDelete(job._id, job.title)}
                      disabled={actionId === job._id}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 17 }}>delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}