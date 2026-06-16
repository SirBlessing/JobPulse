/**
 * components/AppShell.jsx
 * Mobile-first shell — fixed top bar, slide-in drawer, bottom nav, site footer.
 * Desktop — fixed left sidebar replaces drawer + bottom nav.
 * Admin is NOT in public nav. Access /admin by typing the URL directly.
 */
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/',           icon: 'home',         label: 'Home'       },
  { to: '/saved',      icon: 'bookmark',      label: 'Saved'      },
  { to: '/categories', icon: 'grid_view',     label: 'Categories' },
  { to: '/alerts',     icon: 'notifications', label: 'Alerts'     },
]

const SIDEBAR_CATEGORIES = [
  { slug: 'no-experience',   emoji: '🔰', label: 'No Experience'   },
  { slug: 'remote-friendly', emoji: '💻', label: 'Remote-Friendly' },
  { slug: 'high-salary',     emoji: '💸', label: 'High Salary'     },
  { slug: 'low-stress',      emoji: '😌', label: 'Low Stress'      },
  { slug: 'entry-level',     emoji: '🎓', label: 'Entry Level'     },
  { slug: 'tech-roles',      emoji: '⚡', label: 'Tech Roles'      },
  { slug: 'global-remote',   emoji: '🌍', label: 'Global Remote'   },
  { slug: 'government-job',  emoji: '🏛️', label: 'Govt Jobs'      },
  { slug: 'internships',     emoji: '📝', label: 'Internships'     },
  { slug: 'sales-ops',       emoji: '📈', label: 'Sales / Ops'     },
]

/* ── Site footer — shown on all public pages ───────────────── */
function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span className="site-footer__logo">NaijaWork</span>
        <p className="site-footer__tagline">
          Real Talk, Real Jobs — Curated for the Nigerian Digital Landscape.
        </p>

        <nav className="site-footer__links" aria-label="Footer links">
          <Link to="/">Home</Link>
          <Link to="/categories">All Categories</Link>
          <Link to="/saved">Saved Jobs</Link>
          <Link to="/category/remote-friendly">Remote Jobs</Link>
          <Link to="/category/no-experience">No Experience</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>

        <div className="site-footer__divider" />

        <p className="site-footer__credit">
          Designed &amp; curated by <strong>NaijaWork</strong>
          {' · '}
          <a href="tel:+2348012345678">📞 +234 801 234 5678</a>
        </p>
        <p className="site-footer__copy">
          © {year} NaijaWork. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default function AppShell({ children }) {
  const { pathname } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isActive = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <div className="shell">

      {/* ═══════════════════════════════════════════
          DESKTOP SIDEBAR
          ═══════════════════════════════════════════ */}
      <aside className="sidebar" aria-label="Site navigation">
        <div className="sidebar__logo-wrap">
          <Link to="/" className="sidebar__logo">NaijaWork</Link>
          <span className="sidebar__tagline">Curated · Trusted · Nigerian</span>
        </div>

        <nav className="sidebar__nav">
          <p className="sidebar__section-label">Menu</p>
          {NAV_ITEMS.map(({ to, icon, label }) => {
            const active = isActive(to)
            return (
              <Link key={to} to={to}
                className={`sidebar__link${active ? ' sidebar__link--active' : ''}`}>
                <span className="material-symbols-outlined"
                  style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                  {icon}
                </span>
                {label}
              </Link>
            )
          })}

          <p className="sidebar__section-label" style={{ marginTop: 20 }}>Categories</p>
          {SIDEBAR_CATEGORIES.map(({ slug, emoji, label }) => {
            const active = pathname === `/category/${slug}`
            return (
              <Link key={slug} to={`/category/${slug}`}
                className={`sidebar__link sidebar__link--cat${active ? ' sidebar__link--active' : ''}`}>
                <span style={{ fontSize: 15, width: 20, textAlign: 'center', flexShrink: 0 }}>{emoji}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__trust-badge">
            <span className="material-symbols-outlined"
              style={{ fontSize: 18, fontVariationSettings: "'FILL' 1", color: 'var(--primary)', flexShrink: 0 }}>
              verified_user
            </span>
            <div>
              <p style={{ fontWeight: 700, fontSize: 12, color: 'var(--on-surface)' }}>Scam-Free Guarantee</p>
              <p style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginTop: 1 }}>Every listing manually reviewed</p>
            </div>
          </div>
          <p className="sidebar__credit">
            © {new Date().getFullYear()} NaijaWork<br />
            Designed by NaijaWork<br />
            📞 <a href="tel:+2348012345678" style={{ color: 'inherit' }}>+234 801 234 5678</a>
          </p>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════
          MAIN COLUMN
          ═══════════════════════════════════════════ */}
      <div className="shell__main">

        {/* Top bar */}
        <header className="topbar">
          <div className="topbar__mobile-left">
            <button className="icon-btn" aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
            <Link to="/" className="topbar__mobile-logo">NaijaWork</Link>
          </div>
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

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="mobile-menu-overlay" onClick={() => setDrawerOpen(false)}
            role="dialog" aria-modal="true" aria-label="Navigation menu">
            <div className="mobile-menu" onClick={e => e.stopPropagation()}>
              <div className="mobile-menu__header">
                <span className="mobile-menu__logo">NaijaWork</span>
                <button className="icon-btn" aria-label="Close menu"
                  onClick={() => setDrawerOpen(false)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <p className="mobile-menu__section">Browse</p>
              {NAV_ITEMS.map(({ to, icon, label }) => (
                <Link key={to} to={to} className="mobile-menu__item"
                  onClick={() => setDrawerOpen(false)}>
                  <span className="material-symbols-outlined"
                    style={{ color: 'var(--primary)', fontVariationSettings: isActive(to) ? "'FILL' 1" : "'FILL' 0" }}>
                    {icon}
                  </span>
                  {label}
                </Link>
              ))}

              <p className="mobile-menu__section">Job Categories</p>
              {SIDEBAR_CATEGORIES.map(({ slug, emoji, label }) => (
                <Link key={slug} to={`/category/${slug}`} className="mobile-menu__item"
                  onClick={() => setDrawerOpen(false)}>
                  <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>{emoji}</span>
                  {label}
                </Link>
              ))}

              <div style={{ marginTop: 'var(--sp-xl)', paddingTop: 'var(--sp-md)', borderTop: '1px solid var(--outline-variant)' }}>
                <p style={{ fontSize: 12, color: 'var(--outline)', lineHeight: 1.8 }}>
                  © {new Date().getFullYear()} NaijaWork<br />
                  Curated for the Nigerian Digital Landscape<br />
                  📞 <a href="tel:+2348012345678" style={{ color: 'var(--primary)', fontWeight: 700 }}>+234 801 234 5678</a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="page-main" id="main-content">
          {children}
        </main>

        {/* Site footer */}
        <SiteFooter />

        {/* Mobile bottom nav */}
        <nav className="bottom-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map(({ to, icon, label }) => {
            const active = isActive(to)
            return (
              <Link key={to} to={to}
                className={`nav-item${active ? ' nav-item--active' : ''}`}
                aria-current={active ? 'page' : undefined}>
                <span className="material-symbols-outlined"
                  style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                  {icon}
                </span>
                {label}
                {active && <span className="nav-item__pip" />}
              </Link>
            )
          })}
        </nav>

      </div>
    </div>
  )
}