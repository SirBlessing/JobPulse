/**
 * utils/format.js — display helpers
 */

/**
 * formatNaira
 * If the value is already a descriptive string (e.g. "Competitive"),
 * return it as-is. Otherwise format as ₦1,200,000.
 */
export function formatNaira(value) {
  if (!value) return ''
  const stripped = String(value).replace(/[₦,\s]/g, '')
  const num = Number(stripped)
  if (isNaN(num)) return String(value)
  return '₦' + num.toLocaleString('en-NG')
}

/**
 * timeAgo — relative time from a Date or ISO string
 */
export function timeAgo(dateInput) {
  const date = new Date(dateInput)
  const diff = Date.now() - date.getTime()
  const secs = Math.floor(diff / 1000)
  const mins = Math.floor(secs / 60)
  const hrs  = Math.floor(mins / 60)
  const days = Math.floor(hrs / 24)

  if (secs < 60)  return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hrs < 24)   return `${hrs}h ago`
  if (days < 7)   return `${days}d ago`
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
}

/**
 * slugToLabel — "remote-friendly" → "Remote Friendly"
 */
export function slugToLabel(slug) {
  return String(slug)
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}