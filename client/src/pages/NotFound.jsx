import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-600/15 border border-brand-600/20 flex items-center justify-center mb-6">
        <Zap className="w-8 h-8 text-brand-400" fill="currentColor" />
      </div>
      <h1 className="font-display font-bold text-white text-6xl mb-2">404</h1>
      <h2 className="font-display font-bold text-white text-2xl mb-3">Page not found</h2>
      <p className="text-surface-500 text-sm mb-8 max-w-xs">
        The page you're looking for doesn't exist or was moved.
      </p>
      <Link to="/" className="btn-primary">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  )
}