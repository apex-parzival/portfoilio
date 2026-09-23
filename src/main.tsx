import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Detail pages are a secondary path — keep them out of the initial bundle.
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.tsx'))
const Book = lazy(() => import('./pages/book/Book.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/projects/:slug"
          element={
            <Suspense fallback={<div className="bg-background min-h-screen" />}>
              <ProjectDetail />
            </Suspense>
          }
        />
        <Route
          path="/book"
          element={
            <Suspense fallback={<div className="bg-background min-h-screen" />}>
              <Book />
            </Suspense>
          }
        />
        {/* Anything else falls back to the portfolio rather than a blank page. */}
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
