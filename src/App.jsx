/**
 * App.jsx — Route definitions
 *
 * Routes:
 *   /                        → LiveFeedPage     (public)
 *   /category/:categorySlug  → CategoryFeedPage (public, dynamic)
 *   /admin                   → AdminPostingPage (token-gated inside component)
 *   *                        → redirect to /
 */
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LiveFeedPage from './pages/LiveFeedPage.jsx'
import CategoryFeedPage from './pages/CategoryFeedPage.jsx'
import AdminPostingPage from './pages/AdminPostingPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/"                       element={<LiveFeedPage />} />
      <Route path="/category/:categorySlug" element={<CategoryFeedPage />} />
      <Route path="/admin"                  element={<AdminPostingPage />} />
      <Route path="*"                       element={<Navigate to="/" replace />} />
    </Routes>
  )
}