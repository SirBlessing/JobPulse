/**
 * pages/LiveFeedPage.jsx — Main public feed
 * Mobile-first: category chips scroll horizontally, single-column cards.
 * Desktop: two-column feed + right rail.
 */
import React, { useState, useEffect } from 'react'
import AppShell from '../components/AppShell.jsx'
import CuratedJobCard from '../components/CuratedJobCard.jsx'
import { Link } from 'react-router-dom'
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

function RightRail() {
  return (
    <>
      {/* Scam Shield */}
      <div className="widget">
        <div className="widget__header">
          <span className="material-symbols-outlined"
            style={{ color: 'var(--error)', fontVariationSettings: "'FILL' 1" }}>gpp_maybe</span>
          <h3>Scam Shield</h3>
        </div>
        <div className="widget__body">
          <div className="scam-tip">
            <div className="scam-tip__dot" />
            <span>Legit companies <strong>never</strong> ask for "processing fees" or "training materials" money to apply.</span>
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

      {/* Hot jobs */}
      <div className="widget">
        <div className="widget__header">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
          <h3>Hot Jobs This Week</h3>
        </div>
        <div className="widget__body">
          {[
            { title: 'Frontend Intern (React)', company: 'Paystack',       n: 142 },
            { title: 'Customer Success Lead',  company: 'Kuda Bank',       n: 89  },
            { title: 'Logistics Coordinator',  company: 'GIG Logistics',   n: 67  },
          ].map((j, i) => (
            <div key={i} className="hot-job">
              <div className="hot-job__rank">{i + 1}</div>
              <div>
                <p className="hot-job__title">{j.title}</p>
                <p className="hot-job__company">{j.company} · {j.n} applicants</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="newsletter-widget">
        <h3>The Sunday Filter</h3>
        <p>The 10 best jobs of the week, curated and honest. Straight to your inbox.</p>
        <input type="email" placeholder="you@email.com" />
        <button className="btn-sub">Keep Me Informed</button>
      </div>
    </>
  )
}

export default function LiveFeedPage() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    publicFetch('/jobs')
      .then(d => setJobs(d.jobs))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AppShell>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-section__pill">
          <span className="live-dot" />
          {loading ? 'Loading…' : `${jobs.length} live listing${jobs.length !== 1 ? 's' : ''} today`}
        </div>
        <h1 className="t-display">
          Real Talk,{' '}
          <span style={{ color: 'var(--primary)' }}>Real Jobs.</span>
        </h1>
        <p className="t-body hero-section__sub">
          No corporate fluff. Curated for the Nigerian digital landscape — honest breakdowns, scam-free guarantee.
        </p>
      </section>

      {/* Category chips — horizontal scroll on mobile */}
      <nav className="chip-row no-scrollbar" aria-label="Browse by category">
        <div className="chip-row__inner">
          {QUICK_CATS.map(({ slug, emoji, label }) => (
            <Link key={slug} to={`/category/${slug}`} className="chip">
              {emoji} {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Feed + right rail */}
      <div className="feed-layout">
        <div className="feed-col">
          {loading && (
            <div className="loader-wrap">
              <div className="spinner" />
              Fetching fresh listings…
            </div>
          )}
          {error && (
            <div className="banner banner-error">
              <span className="material-symbols-outlined">error</span>
              <div>
                <strong>Could not load jobs</strong>
                <p style={{ fontWeight: 400, marginTop: 3, fontSize: 13 }}>{error}</p>
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
            <div className="card-stack">
              {jobs.map(job => <CuratedJobCard key={job._id} job={job} />)}
            </div>
          )}
        </div>
        <aside className="right-rail">
          <RightRail />
        </aside>
      </div>

    </AppShell>
  )
}