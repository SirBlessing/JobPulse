/**
 * App.jsx — Route definitions
 *
 *   /                        → LiveFeedPage
 *   /job/:id                 → JobDetailPage  (NEW)
 *   /category/:categorySlug  → CategoryFeedPage
 *   /admin                   → AdminPostingPage (URL-only, not in nav)
 *   *                        → redirect to /
 */
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LiveFeedPage     from './pages/LiveFeedPage.jsx'
import JobDetailPage    from './pages/JobDetailPage.jsx'
import CategoryFeedPage from './pages/CategoryFeedPage.jsx'
import AdminPostingPage from './pages/AdminPostingPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/"                       element={<LiveFeedPage />} />
      <Route path="/job/:id"                element={<JobDetailPage />} />
      <Route path="/category/:categorySlug" element={<CategoryFeedPage />} />
      <Route path="/admin"                  element={<AdminPostingPage />} />
      <Route path="*"                       element={<Navigate to="/" replace />} />
    </Routes>
  )
}