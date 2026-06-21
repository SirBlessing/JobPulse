/**
 * utils/saved.js — Saved Jobs (localStorage, no account needed)
 *
 * Jobs are stored as a Set of job IDs in localStorage.
 * Full job objects are also cached so the Saved page can render
 * them without an extra API call.
 *
 * Storage keys:
 *   naijawork_saved_ids   → JSON array of job _id strings
 *   naijawork_saved_jobs  → JSON array of full job objects (cache)
 */

const IDS_KEY  = 'naijawork_saved_ids'
const JOBS_KEY = 'naijawork_saved_jobs'

/* Read saved IDs as a Set */
export function getSavedIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(IDS_KEY) || '[]'))
  } catch { return new Set() }
}

/* Read cached job objects */
export function getSavedJobs() {
  try {
    return JSON.parse(localStorage.getItem(JOBS_KEY) || '[]')
  } catch { return [] }
}

/* Check if a job is saved */
export function isSaved(id) {
  return getSavedIds().has(id)
}

/* Save a job (store ID + cache full object) */
export function saveJob(job) {
  const ids  = getSavedIds()
  const jobs = getSavedJobs()
  ids.add(job._id)
  // update or add full object
  const filtered = jobs.filter(j => j._id !== job._id)
  localStorage.setItem(IDS_KEY,  JSON.stringify([...ids]))
  localStorage.setItem(JOBS_KEY, JSON.stringify([...filtered, job]))
}

/* Remove a saved job */
export function unsaveJob(id) {
  const ids  = getSavedIds()
  const jobs = getSavedJobs()
  ids.delete(id)
  localStorage.setItem(IDS_KEY,  JSON.stringify([...ids]))
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs.filter(j => j._id !== id)))
}

/* Toggle — returns true if now saved, false if removed */
export function toggleSaved(job) {
  if (isSaved(job._id)) { unsaveJob(job._id); return false }
  saveJob(job); return true
}