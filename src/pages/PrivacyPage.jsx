/**
 * pages/PrivacyPage.jsx — Privacy Policy
 */
import React from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'

const SECTIONS = [
  {
    title: '1. Who We Are',
    body: `NaijaWork is a curated job board operated for the Nigerian digital landscape. We are not a recruitment agency. We curate publicly available job listings and add editorial commentary to help job seekers make informed decisions. Our contact number is +234 801 234 5678.`,
  },
  {
    title: '2. What Information We Collect',
    body: `We collect minimal information to operate this platform:\n\n• Saved Jobs: When you save a job listing, the job data is stored only in your browser's localStorage on your own device. We do not transmit or store this on our servers.\n\n• Newsletter (if you subscribe): We collect your email address solely to send you curated job roundups. We do not sell or share your email with third parties.\n\n• Contact Form: If you submit a message via our contact page, we collect your name, email address and message in order to respond to you.`,
  },
  {
    title: '3. What We Do NOT Collect',
    body: `• We do not require you to create an account to use NaijaWork.\n• We do not track your browsing behaviour across other websites.\n• We do not use advertising trackers or sell your data to advertisers.\n• We do not store payment information — NaijaWork is free for job seekers.`,
  },
  {
    title: '4. Cookies',
    body: `NaijaWork uses no advertising cookies. We may use a single session cookie to maintain your preferences during a visit. We use localStorage (not cookies) for saved jobs. You can clear this at any time through your browser settings.`,
  },
  {
    title: '5. Third-Party Links',
    body: `Job listings on NaijaWork link to third-party employer websites and application portals. Once you leave NaijaWork, this Privacy Policy no longer applies. We are not responsible for the privacy practices of employer websites. We strongly advise you never to pay fees to apply for any job — this is always a scam.`,
  },
  {
    title: '6. Data Security',
    body: `Because we store almost no personal data on our servers, your risk is minimal. Your saved jobs never leave your device. Any email address you provide for our newsletter is stored securely and used only for that purpose.`,
  },
  {
    title: '7. Your Rights',
    body: `You have the right to:\n• Access any personal data we hold about you.\n• Request deletion of your data at any time.\n• Unsubscribe from our newsletter at any time using the link in any email we send.\n• Clear your saved jobs by clearing your browser's localStorage or using the unsave button on each listing.\n\nTo exercise these rights, contact us at the details below.`,
  },
  {
    title: '8. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. We will post the updated version on this page with a revised date. Continued use of NaijaWork after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '9. Contact Us',
    body: `If you have any questions about this Privacy Policy, please contact us:\n📞 +234 801 234 5678\n📧 hello@naijawork.ng\n\nOr use the form on our Contact page.`,
  },
]

export default function PrivacyPage() {
  const lastUpdated = 'June 2025'
  return (
    <AppShell>
      <div className="page-section">

        <div className="page-section__header">
          <div className="t-micro" style={{ color: 'var(--primary)', marginBottom: 8 }}>Legal</div>
          <h1 className="t-h1">Privacy Policy</h1>
          <p className="t-small" style={{ color: 'var(--on-surface-variant)', marginTop: 6 }}>
            Last updated: {lastUpdated}
          </p>
          <div className="info-notice" style={{ marginTop: 'var(--sp-md)' }}>
            <span className="material-symbols-outlined" style={{ flexShrink: 0, color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <p className="t-small">
              <strong>Short version:</strong> We don't require accounts, we don't sell your data, and your saved jobs stay on your own device. We keep it simple.
            </p>
          </div>
        </div>

        <div className="prose-stack">
          {SECTIONS.map(({ title, body }) => (
            <div key={title} className="prose-section">
              <h2 className="prose-section__title">{title}</h2>
              <div className="prose-section__body">
                {body.split('\n').filter(Boolean).map((line, i) => (
                  <p key={i} style={{ marginBottom: line.startsWith('•') ? 4 : 0 }}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'var(--sp-xl)', display: 'flex', gap: 'var(--sp-sm)', flexWrap: 'wrap' }}>
          <Link to="/contact" className="btn btn-primary">
            <span className="material-symbols-outlined">mail</span>
            Contact Us
          </Link>
          <Link to="/" className="btn btn-ghost">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Jobs
          </Link>
        </div>

      </div>
    </AppShell>
  )
}