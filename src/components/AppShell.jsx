/**
 * components/AppShell.jsx
 *
 * Responsive layout shell:
 *  Mobile  (<768px) — fixed top header + fixed bottom nav (4 items, NO admin)
 *  Desktop (>=768px) — persistent left sidebar + top bar + wide content area
 *
 * Admin is NOT exposed in public navigation. The admin panel lives
 * at /admin and is only accessible by typing the URL directly.
 */
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

/* Public nav items — Admin deliberately excluded */
const NAV_ITEMS = [
  { to: '/',           icon: 'home',            label: 'Home'       },
  { to: '/saved',      icon: 'bookmark',         label: 'Saved'      },
  { to: '/categories', icon: 'grid_view',        label: 'Categories' },
  { to: '/alerts',     icon: 'notifications',    label: 'Alerts'     },
]

const SIDEBAR_CATEGORIES = [
  { slug: 'no-experience',   emoji: '🔰', label: 'No Experience'  },
  { slug: 'remote-friendly', emoji: '💻', label: 'Remote-Friendly' },
  { slug: 'high-salary',     emoji: '💸', label: 'High Salary'    },
  { slug: 'low-stress',      emoji: '😌', label: 'Low Stress'     },
  { slug: 'entry-level',     emoji: '🎓', label: 'Entry Level'    },
  { slug: 'tech-roles',      emoji: '⚡', label: 'Tech Roles'     },
  { slug: 'global-remote',   emoji: '🌍', label: 'Global Remote'  },
  { slug: 'government-job',  emoji: '🏛️', label: 'Govt Jobs'     },
  { slug: 'internships',     emoji: '📝', label: 'Internships'    },
]

export default function AppShell({ children }) {
  const { pathname } = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (to) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <div className="shell">

      {/* ════════════════════════════════════════════════
          DESKTOP SIDEBAR (hidden on mobile)
          ════════════════════════════════════════════════ */}
      <aside className="sidebar">
        <div className="sidebar__logo-wrap">
          <Link to="/" className="sidebar__logo">NaijaWork</Link>
          <span className="sidebar__tagline">Curated · Trusted · Nigerian</span>
        </div>

        <nav className="sidebar__nav" aria-label="Main navigation">
          <p className="sidebar__section-label">Browse</p>
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`sidebar__link${isActive(to) ? ' sidebar__link--active' : ''}`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isActive(to) ? "'FILL' 1" : "'FILL' 0" }}
              >
                {icon}
              </span>
              {label}
            </Link>
          ))}

          <p className="sidebar__section-label" style={{ marginTop: 24 }}>Categories</p>
          {SIDEBAR_CATEGORIES.map(({ slug, emoji, label }) => (
            <Link
              key={slug}
              to={`/category/${slug}`}
              className={`sidebar__link sidebar__link--cat${pathname === `/category/${slug}` ? ' sidebar__link--active' : ''}`}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{emoji}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__trust-badge">
            <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1", color: 'var(--primary)' }}>verified_user</span>
            <div>
              <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--on-surface)' }}>Scam-Free Guarantee</p>
              <p style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>Every listing is manually reviewed</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════
          MAIN COLUMN
          ════════════════════════════════════════════════ */}
      <div className="shell__main">

        {/* ── Top Bar ───────────────────────────────────── */}
        <header className="topbar">
          {/* Mobile: hamburger + logo */}
          <div className="topbar__mobile-left">
            <button
              className="icon-btn"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(v => !v)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <Link to="/" className="topbar__mobile-logo">NaijaWork</Link>
          </div>

          {/* Desktop: page context label */}
          <div className="topbar__desktop-left">
            <span className="live-dot" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface-variant)' }}>
              Live Feed — Updated hourly
            </span>
          </div>

          <div className="topbar__actions">
            <button className="icon-btn" aria-label="Search">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="icon-btn" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        {/* ── Mobile slide-in menu ──────────────────────── */}
        {mobileMenuOpen && (
          <div
            className="mobile-menu-overlay"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="mobile-menu" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--primary)' }}>NaijaWork</span>
                <button className="icon-btn" onClick={() => setMobileMenuOpen(false)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              {SIDEBAR_CATEGORIES.map(({ slug, emoji, label }) => (
                <Link
                  key={slug}
                  to={`/category/${slug}`}
                  className="mobile-menu__item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {emoji} {label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Page content ──────────────────────────────── */}
        <main className="page-main">
          {children}
        </main>

        {/* ── Mobile Bottom Nav (no Admin) ──────────────── */}
        <nav className="bottom-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-item${isActive(to) ? ' nav-item--active' : ''}`}
              aria-current={isActive(to) ? 'page' : undefined}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isActive(to) ? "'FILL' 1" : "'FILL' 0" }}
              >
                {icon}
              </span>
              {label}
            </Link>
          ))}
        </nav>

      </div>
    </div>
  )
}