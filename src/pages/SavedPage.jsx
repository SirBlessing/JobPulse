/**
 * pages/SavedPage.jsx — Saved Jobs
 *
 * No account needed. Jobs are stored in localStorage.
 * Users tap the bookmark on any job card to save it.
 * This page reads the cache and shows saved jobs.
 * They can unsave directly from here too.
 */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import CuratedJobCard from '../components/CuratedJobCard.jsx'
import { getSavedJobs } from '../utils/saved.js'

export default function SavedPage() {
  const [jobs, setJobs] = useState([])

  // Read from localStorage every time the page mounts
  useEffect(() => {
    setJobs(getSavedJobs().reverse()) // newest saved first
  }, [])

  // When a job is unsaved from the card, remove it from the list
  const handleUnsave = (id) => {
    setJobs(prev => prev.filter(j => j._id !== id))
  }

  return (
    <AppShell>
      <div className="page-section">

        {/* Header */}
        <div className="page-section__header">
          <h1 className="t-h1">
            <span className="material-symbols-outlined" style={{ fontSize: 28, verticalAlign: 'middle', marginRight: 8, color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>bookmark</span>
            Saved Jobs
          </h1>
          <p className="t-small" style={{ color: 'var(--on-surface-variant)', marginTop: 6 }}>
            {jobs.length > 0
              ? `${jobs.length} job${jobs.length !== 1 ? 's' : ''} saved on this device — no account needed.`
              : 'Your saved jobs appear here. Tap the bookmark on any listing to save it.'}
          </p>
        </div>

        {/* No saved jobs */}
        {jobs.length === 0 && (
          <div className="empty-state">
            <div className="empty-state__icon">🔖</div>
            <h3>No saved jobs yet</h3>
            <p>Browse listings and tap <strong>Save</strong> on any job to keep it here.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: 'var(--sp-lg)', display: 'inline-flex' }}>
              <span className="material-symbols-outlined">search</span>
              Browse Jobs
            </Link>
          </div>
        )}

        {/* How it works notice */}
        {jobs.length > 0 && (
          <div className="info-notice">
            <span className="material-symbols-outlined" style={{ flexShrink: 0, color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>info</span>
            <p className="t-small">
              Saved jobs are stored on <strong>this device only</strong>. No account needed — but clearing your browser data will remove them.
            </p>
          </div>
        )}

        {/* Job cards */}
        {jobs.length > 0 && (
          <div className="card-stack">
            {jobs.map(job => (
              <CuratedJobCard key={job._id} job={job} onUnsave={handleUnsave} />
            ))}
          </div>
        )}

      </div>
    </AppShell>
  )
}