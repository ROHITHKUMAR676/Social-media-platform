import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className={`
        relative w-full ${sizes[size]} bg-dark-card border border-dark-border
        rounded-2xl shadow-2xl animate-slide-up overflow-hidden
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
          <h3 className="font-display font-semibold text-white text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-surface-500 hover:text-white hover:bg-dark-hover transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-dark-border flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function LoginPromptModal({ isOpen, onClose, onLogin, onRegister }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center py-2">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-600/15 border border-brand-600/20 flex items-center justify-center">
          <span className="font-display font-bold text-brand-400 text-2xl">DC</span>
        </div>
        <h3 className="font-display font-bold text-white text-xl mb-2">Join DevConnect</h3>
        <p className="text-surface-400 text-sm mb-6">
          Sign in to like, comment, follow developers and join communities.
        </p>
        <div className="space-y-3">
          <button
            onClick={onLogin}
            className="w-full btn-primary justify-center py-3"
          >
            Sign in
          </button>
          <button
            onClick={onRegister}
            className="w-full btn-secondary justify-center py-3"
          >
            Create account
          </button>
        </div>
        <p className="text-surface-600 text-xs mt-4">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </Modal>
  )
}