/**
 * pages/CategoriesPage.jsx — All categories grid
 * Tapping a category card goes to CategoryFeedPage.
 */
import React from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'

const ALL_CATS = [
  { slug: 'no-experience',   emoji: '🔰', label: 'No Experience Needed', desc: 'Zero work history required. Perfect for fresh graduates and career switchers.' },
  { slug: 'remote-friendly', emoji: '💻', label: 'Remote-Friendly',        desc: 'Work from home, Ibadan, Abuja — anywhere with internet. Real remote, not "hybrid in disguise".' },
  { slug: 'high-salary',     emoji: '💸', label: 'High Salary',            desc: 'Above-market pay verified by the curator. No vague "competitive" promises.' },
  { slug: 'low-stress',      emoji: '😌', label: 'Low Stress',             desc: 'Good work-life balance, manageable hours, structured teams.' },
  { slug: 'entry-level',     emoji: '🎓', label: 'Entry Level',            desc: '0–2 years experience. Ideal for NYSC members and recent graduates.' },
  { slug: 'government-job',  emoji: '🏛️', label: 'Government / Public Sector', desc: 'Federal, state and parastatal roles across Nigeria.' },
  { slug: 'tech-roles',      emoji: '⚡', label: 'Tech Roles',             desc: 'Engineering, product, design and data roles at Nigerian and global tech companies.' },
  { slug: 'sales-ops',       emoji: '📈', label: 'Sales & Operations',     desc: 'Growth, logistics, HR and operations roles that keep businesses running.' },
  { slug: 'global-remote',   emoji: '🌍', label: 'Global Remote',          desc: 'Foreign companies hiring Nigerians. Often USD-denominated pay.' },
  { slug: 'internships',     emoji: '📝', label: 'Internships',            desc: 'Paid internships and industrial training (IT) at reputable companies.' },
]

export default function CategoriesPage() {
  return (
    <AppShell>
      <div className="page-section">

        <div className="page-section__header">
          <h1 className="t-h1">Browse by Category</h1>
          <p className="t-body" style={{ color: 'var(--on-surface-variant)', marginTop: 6 }}>
            Every listing is tagged by the curator. Pick a category and see only what's relevant to you.
          </p>
        </div>

        <div className="categories-grid">
          {ALL_CATS.map(({ slug, emoji, label, desc }) => (
            <Link key={slug} to={`/category/${slug}`} className="cat-card">
              <div className="cat-card__emoji">{emoji}</div>
              <div className="cat-card__body">
                <h2 className="cat-card__title">{label}</h2>
                <p className="cat-card__desc">{desc}</p>
              </div>
              <span className="material-symbols-outlined cat-card__arrow">arrow_forward</span>
            </Link>
          ))}
        </div>

      </div>
    </AppShell>
  )
}