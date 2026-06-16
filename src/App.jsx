/**
 * App.jsx — All routes
 */
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LiveFeedPage     from './pages/LiveFeedPage.jsx'
import JobDetailPage    from './pages/JobDetailPage.jsx'
import CategoryFeedPage from './pages/CategoryFeedPage.jsx'
import CategoriesPage   from './pages/CategoriesPage.jsx'
import SavedPage        from './pages/SavedPage.jsx'
import PrivacyPage      from './pages/PrivacyPage.jsx'
import ContactPage      from './pages/ContactPage.jsx'
import AdminPostingPage from './pages/AdminPostingPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/"                       element={<LiveFeedPage />} />
      <Route path="/job/:id"                element={<JobDetailPage />} />
      <Route path="/category/:categorySlug" element={<CategoryFeedPage />} />
      <Route path="/categories"             element={<CategoriesPage />} />
      <Route path="/saved"                  element={<SavedPage />} />
      <Route path="/privacy"                element={<PrivacyPage />} />
      <Route path="/contact"                element={<ContactPage />} />
      <Route path="/admin"                  element={<AdminPostingPage />} />
      <Route path="*"                       element={<Navigate to="/" replace />} />
    </Routes>
  )
}