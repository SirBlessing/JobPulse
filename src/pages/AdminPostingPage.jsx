/**
 * pages/AdminPostingPage.jsx — Curator Admin Panel
 * Token-gated. Two tabs: Post New Job | Manage Listings
 */
import React, { useState, useEffect, useCallback } from 'react'
import { adminFetch, publicFetch } from '../utils/api.js'
import { timeAgo } from '../utils/format.js'

const NIGERIAN_STATES = [
  'Remote (Nigeria-wide)', 'Abuja (FCT)',
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa',
  'Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti',
  'Enugu','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina',
  'Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger',
  'Ogun','Ondo','Osun','Oyo (Ibadan)','Plateau',
  'Rivers (Port Harcourt)','Sokoto','Taraba','Yobe','Zamfara',
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
  applicationMethod: 'link',
  applicationLink: '', applicationEmail: '',
  closingDate: '',
  salaryNaira: '',
  realTalkBreakdown: '', honestTake: '',
  redFlags: '', scamAlertText: '',
  smartCategories: [],
}

function SectionTitle({ icon, children, count }) {
  return (
    <div className="form-section__title">
      <span className="material-symbols-outlined">{icon}</span>
      <span style={{ flex: 1 }}>{children}</span>
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

export default function AdminPostingPage() {
  const [token,       setToken]       = useState('')
  const [showToken,   setShowToken]   = useState(false)
  const [authed,      setAuthed]      = useState(false)
  const [authError,   setAuthError]   = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [form,        setForm]        = useState({ ...EMPTY_FORM })
  const [submitting,  setSubmitting]  = useState(false)
  const [feedback,    setFeedback]    = useState({ type: '', text: '' })
  const [jobs,        setJobs]        = useState([])
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [jobsError,   setJobsError]   = useState('')
  const [actionId,    setActionId]    = useState(null)
  const [tab,         setTab]         = useState('post')

  const loadJobs = useCallback(async () => {
    setLoadingJobs(true); setJobsError('')
    try { const d = await publicFetch('/jobs'); setJobs(d.jobs) }
    catch (err) { setJobsError(err.message) }
    finally { setLoadingJobs(false) }
  }, [])

  useEffect(() => { if (tab === 'manage' && authed) loadJobs() }, [tab, authed, loadJobs])

  const handleAuth = async e => {
    e.preventDefault(); setAuthError('')
    if (!token.trim()) { setAuthError('Please enter your admin token.'); return }
    setAuthLoading(true)
    try { await adminFetch('/jobs/__ping__', 'GET', null, token) }
    catch (err) {
      if (err.message === 'Route not found.') { setAuthed(true); setAuthLoading(false); return }
      setAuthError('Invalid token — access denied.')
    }
    setAuthLoading(false)
  }

  const handleField = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const toggleCat = slug => {
    setForm(prev => ({
      ...prev,
      smartCategories: prev.smartCategories.includes(slug)
        ? prev.smartCategories.filter(s => s !== slug)
        : [...prev.smartCategories, slug],
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault(); setSubmitting(true); setFeedback({ type: '', text: '' })
    try {
      await adminFetch('/jobs', 'POST', form, token)
      setFeedback({ type: 'success', text: '✅ Job published successfully!' })
      setForm({ ...EMPTY_FORM })
    } catch (err) {
      setFeedback({ type: 'error', text: `❌ ${err.message}` })
    } finally { setSubmitting(false) }
  }

  const handleToggle = async id => {
    setActionId(id)
    try {
      const d = await adminFetch(`/jobs/${id}/toggle`, 'PATCH', null, token)
      setJobs(prev => prev.map(j => j._id === id ? { ...j, isLive: d.isLive } : j))
    } catch (err) { alert(`Toggle failed: ${err.message}`) }
    finally { setActionId(null) }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently delete "${title}"?`)) return
    setActionId(id)
    try {
      await adminFetch(`/jobs/${id}`, 'DELETE', null, token)
      setJobs(prev => prev.filter(j => j._id !== id))
    } catch (err) { alert(`Delete failed: ${err.message}`) }
    finally { setActionId(null) }
  }

  /* ── Token gate ─────────────────────────────────────── */
  if (!authed) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 'var(--sp-md)',
        background: 'var(--surface-container-low)',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-xl)' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 'var(--r-full)',
              background: 'var(--primary)', display: 'grid', placeItems: 'center',
              margin: '0 auto var(--sp-md)',
            }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--on-primary)', fontSize: 30, fontVariationSettings: "'FILL' 1" }}>lock</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>NaijaWork Admin</h1>
            <p className="t-small" style={{ color: 'var(--on-surface-variant)' }}>Curator access only.</p>
          </div>
          <form onSubmit={handleAuth} className="panel" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <div className="form-group" style={{ marginBottom: 'var(--sp-md)' }}>
              <label htmlFor="admin-token" className="form-label">Admin Token</label>
              <div style={{ position: 'relative' }}>
                <input id="admin-token" type={showToken ? 'text' : 'password'}
                  className="form-input" value={token}
                  onChange={e => setToken(e.target.value)}
                  placeholder="Paste your secret token" autoComplete="off"
                  style={{ paddingRight: 48 }} />
                <button type="button" onClick={() => setShowToken(v => !v)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18 }}>
                  {showToken ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            {authError && (
              <div className="banner banner-error" style={{ marginBottom: 'var(--sp-md)' }}>
                <span className="material-symbols-outlined">error</span>{authError}
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
            Token verified on every request. Never stored locally.
          </p>
        </div>
      </div>
    )
  }

  /* ── Admin panel ─────────────────────────────────────── */
  return (
    <div className="admin-wrap">
      <header className="admin-topbar">
        <div className="admin-topbar__brand">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          NaijaWork Admin
          <span className="admin-topbar__badge">Curator</span>
        </div>
        <button className="btn btn-ghost btn-sm"
          style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.3)' }}
          onClick={() => { setAuthed(false); setToken('') }}>
          <span className="material-symbols-outlined">logout</span> Sign Out
        </button>
      </header>

      <div className="admin-content">
        {/* Tab switcher */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 'var(--sp-xl)',
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 'var(--r-lg)', padding: 4,
        }}>
          {[{ id: 'post', icon: 'add_circle', label: 'Post New Job' },
            { id: 'manage', icon: 'list_alt', label: 'Manage Listings' }
          ].map(({ id, icon, label }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, padding: '11px var(--sp-md)', borderRadius: 'var(--r)', border: 'none',
              background: tab === id ? 'var(--primary)' : 'transparent',
              color: tab === id ? 'var(--on-primary)' : 'var(--on-surface-variant)',
              fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* ══ TAB: POST NEW JOB ══ */}
        {tab === 'post' && (
          <form onSubmit={handleSubmit} noValidate>

            {/* Section 1: Core Info */}
            <div className="form-section">
              <SectionTitle icon="work">Core Listing Info</SectionTitle>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input name="title" type="text" className="form-input" required
                    value={form.title} onChange={handleField} placeholder="e.g. Senior Frontend Engineer" />
                </div>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input name="company" type="text" className="form-input" required
                    value={form.company} onChange={handleField} placeholder="e.g. Paystack" />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Nigerian State *</label>
                  <div className="form-select-wrap">
                    <select name="nigerianState" className="form-select" required
                      value={form.nigerianState} onChange={handleField}>
                      {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Salary / Compensation</label>
                  <input name="salaryNaira" type="text" className="form-input"
                    value={form.salaryNaira} onChange={handleField}
                    placeholder='e.g. "₦850k – ₦1.2M/mo" or "Competitive"' />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Application Closing Date</label>
                <input name="closingDate" type="date" className="form-input"
                  value={form.closingDate} onChange={handleField} />
                <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 4 }}>
                  Leave blank if no stated deadline. A countdown will show on the listing.
                </p>
              </div>
            </div>

            {/* Section 2: Application Method */}
            <div className="form-section">
              <SectionTitle icon="send">Application Method</SectionTitle>
              <div style={{ display: 'flex', gap: 'var(--sp-sm)', marginBottom: 'var(--sp-md)' }}>
                {[
                  { value: 'link',  icon: 'open_in_new', label: 'Apply via Link / Website' },
                  { value: 'email', icon: 'mail',        label: 'Send CV to Email'         },
                ].map(({ value, icon, label }) => (
                  <label key={value} style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                    padding: 'var(--sp-md)', border: `2px solid ${form.applicationMethod === value ? 'var(--primary)' : 'var(--outline-variant)'}`,
                    borderRadius: 'var(--r-lg)', cursor: 'pointer',
                    background: form.applicationMethod === value ? 'rgba(0,66,37,0.05)' : 'transparent',
                    fontWeight: 700, fontSize: 14,
                    color: form.applicationMethod === value ? 'var(--primary)' : 'var(--on-surface-variant)',
                    transition: 'all 0.15s',
                  }}>
                    <input type="radio" name="applicationMethod" value={value}
                      checked={form.applicationMethod === value} onChange={handleField}
                      style={{ accentColor: 'var(--primary)' }} />
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
                    {label}
                  </label>
                ))}
              </div>

              {form.applicationMethod === 'link' && (
                <div className="form-group">
                  <label className="form-label">Application URL *</label>
                  <input name="applicationLink" type="url" className="form-input"
                    required={form.applicationMethod === 'link'}
                    value={form.applicationLink} onChange={handleField}
                    placeholder="https://company.com/careers/role" />
                </div>
              )}
              {form.applicationMethod === 'email' && (
                <div className="form-group">
                  <label className="form-label">Application Email Address *</label>
                  <input name="applicationEmail" type="email" className="form-input"
                    required={form.applicationMethod === 'email'}
                    value={form.applicationEmail} onChange={handleField}
                    placeholder="hr@company.com or careers@company.com" />
                  <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 4 }}>
                    Applicants will see a "Copy Email" button and an "Open in Email App" button.
                  </p>
                </div>
              )}
            </div>

            {/* Section 3: Curator's Voice */}
            <div className="form-section">
              <SectionTitle icon="record_voice_over">Curator's Voice</SectionTitle>
              <div className="form-group" style={{ marginBottom: 'var(--sp-md)' }}>
                <label className="form-label">The Real Talk Breakdown</label>
                <textarea name="realTalkBreakdown" className="form-textarea" rows={4}
                  value={form.realTalkBreakdown} onChange={handleField}
                  placeholder="Break down the job description in plain English. What will they actually do day to day? What skills matter most? No corporate speak." />
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--sp-md)' }}>
                <label className="form-label">My Honest Take</label>
                <textarea name="honestTake" className="form-textarea" rows={3}
                  value={form.honestTake} onChange={handleField}
                  placeholder="Why should someone apply? Is the pay competitive for Lagos? What's the culture really like? Would you apply?" />
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--sp-md)' }}>
                <label className="form-label">⚑ Red Flags</label>
                <textarea name="redFlags" className="form-textarea" rows={2}
                  value={form.redFlags} onChange={handleField}
                  placeholder="Ambiguous pay? Excessive overtime culture? Vague requirements? Be honest." />
              </div>
              <div className="form-group">
                <label className="form-label">⚠️ Scam Alert Banner (leave blank if verified clean)</label>
                <input name="scamAlertText" type="text" className="form-input"
                  value={form.scamAlertText} onChange={handleField}
                  placeholder="e.g. This company never asks for application fees." />
              </div>
            </div>

            {/* Section 4: Smart Categories */}
            <div className="form-section">
              <SectionTitle icon="label" count={form.smartCategories.length}>Smart Categories</SectionTitle>
              <div className="cat-checkbox-grid">
                {SMART_CATEGORIES.map(({ slug, emoji, label }) => {
                  const checked = form.smartCategories.includes(slug)
                  return (
                    <label key={slug} className={`cat-checkbox-label${checked ? ' cat-checkbox-label--checked' : ''}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleCat(slug)}
                        style={{ accentColor: 'var(--primary)', width: 16, height: 16, flexShrink: 0 }} />
                      {emoji} {label}
                    </label>
                  )
                })}
              </div>
            </div>

            {feedback.text && (
              <div className={`banner ${feedback.type === 'success' ? 'banner-success' : 'banner-error'}`}
                style={{ marginBottom: 'var(--sp-md)' }}>
                {feedback.text}
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--sp-md)' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={submitting}>
                {submitting
                  ? <><span className="spinner spinner-sm" /> Publishing…</>
                  : <><span className="material-symbols-outlined">publish</span> Publish Job</>
                }
              </button>
              <button type="button" className="btn btn-ghost" style={{ flex: 1 }}
                disabled={submitting}
                onClick={() => { setForm({ ...EMPTY_FORM }); setFeedback({ type: '', text: '' }) }}>
                <span className="material-symbols-outlined">restart_alt</span> Clear
              </button>
            </div>
          </form>
        )}

        {/* ══ TAB: MANAGE LISTINGS ══ */}
        {tab === 'manage' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-md)' }}>
              <h2 className="t-h2">All Listings</h2>
              <button className="btn btn-ghost btn-sm" onClick={loadJobs} disabled={loadingJobs}>
                <span className="material-symbols-outlined">refresh</span> Refresh
              </button>
            </div>
            {loadingJobs && <div className="loader-wrap"><div className="spinner" /> Loading…</div>}
            {jobsError && (
              <div className="banner banner-error" style={{ marginBottom: 'var(--sp-md)' }}>
                <span className="material-symbols-outlined">error</span>{jobsError}
              </div>
            )}
            {!loadingJobs && !jobsError && jobs.length === 0 && (
              <div className="empty-state">
                <div className="empty-state__icon">📋</div>
                <h3>No listings yet</h3>
                <p>Switch to "Post New Job" to add your first listing.</p>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
              {jobs.map(job => (
                <div key={job._id} className="admin-job-row">
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {job.title}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginTop: 2 }}>
                      {job.company} · {job.nigerianState} ·{' '}
                      {job.applicationMethod === 'email' ? '📧 Email apply' : '🔗 Link apply'} ·{' '}
                      {job.closingDate ? `Closes ${new Date(job.closingDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}` : 'No deadline'} ·{' '}
                      {timeAgo(job.createdAt)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span className={`badge ${job.isLive ? 'badge-live' : 'badge-hidden'}`}>
                      {job.isLive ? '● Live' : '○ Hidden'}
                    </span>
                    <button className="btn btn-outline btn-sm" title={job.isLive ? 'Hide' : 'Make live'}
                      onClick={() => handleToggle(job._id)} disabled={actionId === job._id}>
                      {actionId === job._id
                        ? <span className="spinner spinner-sm" />
                        : <span className="material-symbols-outlined" style={{ fontSize: 17 }}>{job.isLive ? 'visibility_off' : 'visibility'}</span>
                      }
                    </button>
                    <button className="btn btn-danger btn-sm" title="Delete permanently"
                      onClick={() => handleDelete(job._id, job.title)} disabled={actionId === job._id}>
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