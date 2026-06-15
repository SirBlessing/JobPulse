/**
 * pages/CategoryFeedPage.jsx — Dynamic Category Feed
 */
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import CuratedJobCard from '../components/CuratedJobCard.jsx'
import { publicFetch } from '../utils/api.js'
import { slugToLabel } from '../utils/format.js'

const EMOJI = {
  'no-experience':   '🔰', 'remote-friendly': '💻', 'low-stress':    '😌',
  'high-salary':     '💸', 'entry-level':     '🎓', 'government-job':'🏛️',
  'tech-roles':      '⚡', 'sales-ops':       '📈', 'global-remote': '🌍',
  'internships':     '📝',
}

const OTHER_CATS = [
  { slug: 'remote-friendly', emoji: '💻', label: 'Remote-Friendly' },
  { slug: 'high-salary',     emoji: '💸', label: 'High Salary'     },
  { slug: 'tech-roles',      emoji: '⚡', label: 'Tech Roles'      },
  { slug: 'no-experience',   emoji: '🔰', label: 'No Experience'   },
  { slug: 'internships',     emoji: '📝', label: 'Internships'     },
  { slug: 'low-stress',      emoji: '😌', label: 'Low Stress'      },
]

export default function CategoryFeedPage() {
  const { categorySlug } = useParams()
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!categorySlug) return
    setLoading(true); setError(''); setJobs([])
    publicFetch(`/jobs/category/${categorySlug}`)
      .then(d => setJobs(d.jobs))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [categorySlug])

  const label = slugToLabel(categorySlug || '')
  const emoji = EMOJI[categorySlug] || '📋'

  return (
    <AppShell>

      {/* Category hero — full bleed emerald */}
      <div className="category-hero">
        <div className="category-hero__inner">
          <p className="category-hero__eyebrow">Smart Category</p>
          <h1 className="category-hero__title">{emoji} {label}</h1>
          {!loading && (
            <div className="category-hero__count">
              <span className="live-dot" style={{ background: 'white' }} />
              {jobs.length} listing{jobs.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>
      </div>

      <div className="feed-layout">
        <div className="feed-col">
          <Link to="/" className="back-link">
            <span className="material-symbols-outlined">arrow_back</span>
            All Jobs
          </Link>

          {loading && <div className="loader-wrap"><div className="spinner" />Loading {label} jobs…</div>}

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
              <div className="empty-state__icon">{emoji}</div>
              <h3>No {label} listings right now</h3>
              <p>New jobs curated daily — check back soon.</p>
            </div>
          )}

          {!loading && jobs.length > 0 && (
            <div className="card-stack">
              {jobs.map(job => <CuratedJobCard key={job._id} job={job} />)}
            </div>
          )}
        </div>

        {/* Right rail: other categories */}
        <aside className="right-rail">
          <div className="widget">
            <div className="widget__header">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
              <h3>Other Categories</h3>
            </div>
            <div className="widget__body" style={{ padding: 0 }}>
              {OTHER_CATS.filter(c => c.slug !== categorySlug).map(({ slug, emoji: e, label: l }) => (
                <Link key={slug} to={`/category/${slug}`} className="other-cat-link">
                  <span>{e} {l}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

    </AppShell>
  )
}