/**
 * pages/LiveFeedPage.jsx — Main public job feed
 *
 * Desktop: two-column layout (feed + right rail with scam corner + hot jobs)
 * Mobile:  single column with category chips
 */
import React, { useState, useEffect } from 'react'
import AppShell from '../components/AppShell.jsx'
import CuratedJobCard from '../components/CuratedJobCard.jsx'
import { publicFetch } from '../utils/api.js'

const QUICK_CATS = [
  { slug: 'no-experience',   emoji: '🔰', label: 'No Experience'  },
  { slug: 'remote-friendly', emoji: '💻', label: 'Remote'         },
  { slug: 'high-salary',     emoji: '💸', label: 'High Salary'    },
  { slug: 'low-stress',      emoji: '😌', label: 'Low Stress'     },
  { slug: 'entry-level',     emoji: '🎓', label: 'Entry Level'    },
  { slug: 'global-remote',   emoji: '🌍', label: 'Global Remote'  },
  { slug: 'tech-roles',      emoji: '⚡', label: 'Tech'           },
  { slug: 'internships',     emoji: '📝', label: 'Internships'    },
]

/* Right rail — static trusted content */
function ScamCorner() {
  return (
    <div className="widget">
      <div className="widget__header">
        <span className="material-symbols-outlined" style={{ color: 'var(--error)', fontVariationSettings: "'FILL' 1" }}>gpp_maybe</span>
        <h3>Scam Shield</h3>
      </div>
      <div className="widget__body" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div className="scam-tip">
          <div className="scam-tip__dot" />
          <span>Legit companies <strong>never</strong> ask for "processing fees" or "training materials" money.</span>
        </div>
        <div className="scam-tip" style={{ borderBottom: 'none' }}>
          <div className="scam-tip__dot" style={{ background: 'var(--primary)' }} />
          <span><strong>NaijaWork Shield</strong> manually reviews every listing before it goes live.</span>
        </div>
        <button className="btn btn-outline btn-full" style={{ marginTop: 'var(--sp-md)', fontSize: 13 }}>
          <span className="material-symbols-outlined">report</span>
          Report a Scam
        </button>
      </div>
    </div>
  )
}

function HotJobs() {
  const HOT = [
    { title: 'Frontend Intern (React)', company: 'Paystack', applicants: 142 },
    { title: 'Customer Success Lead',  company: 'Kuda Bank', applicants: 89 },
    { title: 'Logistics Coordinator',  company: 'GIG Logistics', applicants: 67 },
  ]
  return (
    <div className="widget">
      <div className="widget__header">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
        <h3>Hot Jobs This Week</h3>
      </div>
      <div className="widget__body" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {HOT.map((j, i) => (
          <div key={i} className="hot-job">
            <div className="hot-job__rank">{i + 1}</div>
            <div>
              <p className="hot-job__title">{j.title}</p>
              <p className="hot-job__company">{j.company} · {j.applicants} applicants</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NewsletterWidget() {
  return (
    <div className="newsletter-widget">
      <h3>The Sunday Filter</h3>
      <p>The 10 best jobs of the week, curated and honest. Straight to your inbox.</p>
      <input type="email" placeholder="you@email.com" />
      <button className="btn-sub">Keep Me Informed</button>
    </div>
  )
}

export default function LiveFeedPage() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    publicFetch('/jobs')
      .then(data => setJobs(data.jobs))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AppShell>

      {/* ── Hero strip ────────────────────────────────────── */}
      <section style={{ padding: 'var(--sp-xl) var(--sp-md) var(--sp-md)', maxWidth: 720, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--primary-fixed)', color: 'var(--on-primary-fixed-variant)',
          borderRadius: 'var(--r-full)', padding: '4px 14px',
          fontSize: 12, fontWeight: 700, marginBottom: 'var(--sp-sm)',
        }}>
          <span className="live-dot" />
          {loading ? 'Loading…' : `${jobs.length} live listings today`}
        </div>
        <h1 className="t-display" style={{ marginBottom: 10 }}>
          Real Talk,{' '}
          <span style={{ color: 'var(--primary)' }}>Real Jobs.</span>
        </h1>
        <p className="t-body" style={{ color: 'var(--on-surface-variant)', maxWidth: 460 }}>
          No corporate fluff. Curated for the Nigerian digital landscape — honest breakdowns, scam-free guarantee.
        </p>
      </section>

      {/* ── Category chips (mobile / tablet) ─────────────── */}
      <nav
        aria-label="Browse by category"
        className="no-scrollbar"
        style={{ overflowX: 'auto', paddingInline: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}
      >
        <div style={{ display: 'flex', gap: 8, width: 'max-content', paddingBottom: 4 }}>
          {QUICK_CATS.map(({ slug, emoji, label }) => (
            <a
              key={slug}
              href={`/category/${slug}`}
              className="quick-chip"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 14px',
                background: 'var(--surface-container-high)',
                color: 'var(--on-surface)',
                borderRadius: 'var(--r-full)',
                fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                textDecoration: 'none',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--primary)'
                e.currentTarget.style.color = 'var(--on-primary)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--surface-container-high)'
                e.currentTarget.style.color = 'var(--on-surface)'
              }}
            >
              {emoji} {label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Two-column layout (desktop) ───────────────────── */}
      <div className="feed-layout" style={{ paddingTop: 'var(--sp-sm)', paddingBottom: 'var(--sp-xl)' }}>

        {/* Main feed */}
        <div>
          {loading && (
            <div className="loader-wrap">
              <div className="spinner" />
              Fetching fresh listings…
            </div>
          )}

          {error && (
            <div className="banner banner-error" style={{ marginBottom: 'var(--sp-md)' }}>
              <span className="material-symbols-outlined">error</span>
              <div>
                <strong>Could not load jobs</strong>
                <p style={{ fontWeight: 400, marginTop: 2, fontSize: 13 }}>{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div className="empty-state">
              <div className="empty-state__icon">📋</div>
              <h3>No listings yet</h3>
              <p>New jobs are curated daily — check back soon.</p>
            </div>
          )}

          {!loading && jobs.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
              {jobs.map(job => (
                <CuratedJobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>

        {/* Right rail (only renders at 1024px+ via CSS) */}
        <aside className="right-rail">
          <ScamCorner />
          <HotJobs />
          <NewsletterWidget />
        </aside>
      </div>

    </AppShell>
  )
}