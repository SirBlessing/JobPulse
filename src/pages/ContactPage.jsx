/**
 * pages/ContactPage.jsx — Contact NaijaWork
 */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'

const TOPICS = [
  'Report a job scam',
  'Suggest a job listing',
  'Business enquiry',
  'Technical issue',
  'Privacy / data request',
  'Other',
]

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', topic: '', message: '' })
  const [status, setStatus]   = useState('') // '' | 'sending' | 'sent' | 'error'

  const handleField = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('sending')
    // mailto: fallback — opens the user's email client with the form pre-filled.
    // Replace with your own backend email endpoint when ready.
    const subject = encodeURIComponent(`[NaijaWork] ${form.topic || 'Contact'} — ${form.name}`)
    const body    = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nTopic: ${form.topic}\n\nMessage:\n${form.message}`
    )
    window.location.href = `mailto:hello@naijawork.ng?subject=${subject}&body=${body}`
    setTimeout(() => {
      setStatus('sent')
      setForm({ name: '', email: '', topic: '', message: '' })
    }, 800)
  }

  return (
    <AppShell>
      <div className="page-section">

        {/* Header */}
        <div className="page-section__header">
          <div className="t-micro" style={{ color: 'var(--primary)', marginBottom: 8 }}>Get in touch</div>
          <h1 className="t-h1">Contact NaijaWork</h1>
          <p className="t-body" style={{ color: 'var(--on-surface-variant)', marginTop: 6 }}>
            Got a question, scam report, or listing suggestion? We read every message.
          </p>
        </div>

        {/* Quick contact pills */}
        <div className="contact-pills">
          <a href="tel:+2348012345678" className="contact-pill">
            <span className="material-symbols-outlined">call</span>
            <div>
              <p className="contact-pill__label">Call / WhatsApp</p>
              <p className="contact-pill__value">+234 801 234 5678</p>
            </div>
          </a>
          <a href="mailto:hello@naijawork.ng" className="contact-pill">
            <span className="material-symbols-outlined">mail</span>
            <div>
              <p className="contact-pill__label">Email us</p>
              <p className="contact-pill__value">hello@naijawork.ng</p>
            </div>
          </a>
        </div>

        {/* Response time note */}
        <div className="info-notice">
          <span className="material-symbols-outlined" style={{ flexShrink: 0, color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>schedule</span>
          <p className="t-small">
            We typically respond within <strong>24 hours</strong> on weekdays. For urgent scam reports, please call or WhatsApp directly.
          </p>
        </div>

        {/* Contact form */}
        <div className="panel" style={{ marginTop: 'var(--sp-lg)' }}>
          <h2 className="t-h3" style={{ marginBottom: 'var(--sp-lg)' }}>Send a Message</h2>

          {status === 'sent' && (
            <div className="banner banner-success" style={{ marginBottom: 'var(--sp-lg)' }}>
              <span className="material-symbols-outlined">check_circle</span>
              Message sent! We'll get back to you within 24 hours.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid-2" style={{ marginBottom: 'var(--sp-md)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="c-name">Your Name *</label>
                <input id="c-name" name="name" type="text" className="form-input" required
                  value={form.name} onChange={handleField} placeholder="e.g. Adaeze Okonkwo" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="c-email">Email Address *</label>
                <input id="c-email" name="email" type="email" className="form-input" required
                  value={form.email} onChange={handleField} placeholder="you@email.com" />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 'var(--sp-md)' }}>
              <label className="form-label" htmlFor="c-topic">Topic</label>
              <div className="form-select-wrap">
                <select id="c-topic" name="topic" className="form-select"
                  value={form.topic} onChange={handleField}>
                  <option value="">Select a topic…</option>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 'var(--sp-lg)' }}>
              <label className="form-label" htmlFor="c-message">Message *</label>
              <textarea id="c-message" name="message" className="form-textarea" rows={5} required
                value={form.message} onChange={handleField}
                placeholder="Tell us what's on your mind. For scam reports, include the company name and any details you have." />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={status === 'sending'}>
              {status === 'sending'
                ? <><span className="spinner spinner-sm" /> Sending…</>
                : <><span className="material-symbols-outlined">send</span> Send Message</>
              }
            </button>
          </form>
        </div>

        {/* Scam reporting note */}
        <div className="panel" style={{ marginTop: 'var(--sp-md)', background: 'var(--error-container)', borderColor: 'transparent' }}>
          <div style={{ display: 'flex', gap: 'var(--sp-md)', alignItems: 'flex-start' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--error)', fontVariationSettings: "'FILL' 1", flexShrink: 0, fontSize: 28 }}>gpp_maybe</span>
            <div>
              <h3 className="t-h3" style={{ color: 'var(--error)', marginBottom: 6 }}>Reporting a Job Scam?</h3>
              <p className="t-small" style={{ color: 'var(--on-error-container)', lineHeight: 1.65 }}>
                Select <strong>"Report a job scam"</strong> in the topic above and include the company name, the suspicious requirement (e.g. "pay ₦5,000 for ID processing"), and a link to the listing if possible. We investigate and remove scam listings within hours.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'var(--sp-xl)' }}>
          <Link to="/" className="btn btn-ghost">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Jobs
          </Link>
        </div>

      </div>
    </AppShell>
  )
}