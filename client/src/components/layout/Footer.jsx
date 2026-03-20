import React from 'react'
import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="hidden lg:block border-t border-dark-border py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-surface-500 text-sm">DevConnect</span>
        </div>
        <p className="text-xs text-surface-700">© 2024 DevConnect. Built for developers.</p>
      </div>
    </footer>
  )
}