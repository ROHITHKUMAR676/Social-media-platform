import React from 'react'

const variants = {
  default: 'bg-surface-800 text-surface-300 border border-surface-700',
  brand: 'bg-brand-600/15 text-brand-400 border border-brand-600/20',
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
  info: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
}

export default function Badge({ children, variant = 'default', className = '', dot = false }) {
  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'success' ? 'bg-emerald-400' :
          variant === 'danger' ? 'bg-red-400' :
          variant === 'warning' ? 'bg-yellow-400' :
          'bg-brand-400'
        }`} />
      )}
      {children}
    </span>
  )
}

export function SkillTag({ skill, size = 'sm' }) {
  return (
    <span className={`skill-tag ${size === 'xs' ? 'text-[11px] px-2 py-0.5' : ''}`}>
      {skill}
    </span>
  )
}

export function OnlineDot({ isOnline, className = '' }) {
  return (
    <span className={`
      w-2.5 h-2.5 rounded-full border-2 border-dark-card
      ${isOnline ? 'bg-emerald-400' : 'bg-surface-600'}
      ${className}
    `} />
  )
}