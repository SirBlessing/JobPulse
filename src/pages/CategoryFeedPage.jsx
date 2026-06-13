/**
 * pages/CategoryFeedPage.jsx — Dynamic Category Feed
 * Reads :categorySlug from React Router, calls GET /api/jobs/category/:slug
 */
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import CuratedJobCard from '../components/CuratedJobCard.jsx'
import { publicFetch } from '../utils/api.js'
import { slugToLabel } from '../utils/format.js'

const CATEGORY_EMOJI = {
  'no-experience':   '🔰',
  'remote-friendly': '💻',
  'low-stress':      '😌',
  'high-salary':     '💸',
  'entry-level':     '🎓',
  'government-job':  '🏛️',
  'tech-roles':      '⚡',
  'sales-ops':       '📈',
  'global-remote':   '🌍',
  'internships':     '📝',
}

export default function CategoryFeedPage() {
  const { categorySlug } = useParams()
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!categorySlug) return
    setLoading(true)
    setError('')
    setJobs([])
    publicFetch(`/jobs/category/${categorySlug}`)
      .then(data => setJobs(data.jobs))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [categorySlug])

  const label = slugToLabel(categorySlug || '')
  const emoji = CATEGORY_EMOJI[categorySlug] || '📋'

  return (
    <AppShell>

      {/* Hero */}
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

      <div className="feed-layout" style={{ paddingBottom: 'var(--sp-xl)' }}>
        <div>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              color: 'var(--primary)', fontSize: 14, fontWeight: 700,
              marginBottom: 'var(--sp-md)', textDecoration: 'none',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
            All Jobs
          </Link>

          {loading && <div className="loader-wrap"><div className="spinner" />Loading {label} jobs…</div>}

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
              <div className="empty-state__icon">{emoji}</div>
              <h3>No {label} listings right now</h3>
              <p>New jobs are curated daily — check back soon.</p>
            </div>
          )}

          {!loading && jobs.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
              {jobs.map(job => <CuratedJobCard key={job._id} job={job} />)}
            </div>
          )}
        </div>

        {/* Right rail placeholder on category pages */}
        <aside className="right-rail">
          <div className="widget">
            <div className="widget__header">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
              <h3>Other Categories</h3>
            </div>
            <div className="widget__body">
              {[
                { slug: 'remote-friendly', emoji: '💻', label: 'Remote-Friendly' },
                { slug: 'high-salary',     emoji: '💸', label: 'High Salary'     },
                { slug: 'tech-roles',      emoji: '⚡', label: 'Tech Roles'      },
                { slug: 'no-experience',   emoji: '🔰', label: 'No Experience'   },
                { slug: 'internships',     emoji: '📝', label: 'Internships'     },
              ].filter(c => c.slug !== categorySlug).map(({ slug, emoji: e, label: l }) => (
                <Link
                  key={slug} to={`/category/${slug}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--outline-variant)',
                    fontSize: 14, fontWeight: 600, color: 'var(--on-surface-variant)',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--on-surface-variant)'}
                >
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