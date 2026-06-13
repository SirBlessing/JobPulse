/**
 * utils/api.js
 *
 * How the API URL is resolved (in order):
 *  1. VITE_API_URL env variable if set  (e.g. production server)
 *  2. Vite proxy path '/api'            (works when vite.config.js proxy is active)
 *  3. Direct URL fallback               (http://localhost:5000/api)
 *
 * For local dev the safest approach is to call the backend directly
 * on port 5000 so we never depend on the Vite proxy being read correctly.
 * Set VITE_API_URL in frontend/.env to override for production.
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * publicFetch — unauthenticated GET
 * @param {string} path  e.g. "/jobs" or "/jobs/category/remote-friendly"
 */
export async function publicFetch(path) {
  let res
  try {
    res = await fetch(`${BASE}${path}`)
  } catch {
    throw new Error(
      'Cannot reach the backend. Make sure it is running: cd backend && npm run dev'
    )
  }

  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error(
      'Backend returned unexpected response. Check that the backend is running on port 5000.'
    )
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed.')
  return data
}

/**
 * adminFetch — authenticated request
 * Token is held only in React state — never stored persistently.
 *
 * @param {string} path    API path
 * @param {string} method  HTTP verb
 * @param {object|null} body  Payload or null
 * @param {string} token   Admin secret from password field
 */
export async function adminFetch(path, method, body, token) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error(
      'Cannot reach the backend. Make sure it is running: cd backend && npm run dev'
    )
  }

  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('Backend returned unexpected response.')
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Admin request failed.')
  return data
}