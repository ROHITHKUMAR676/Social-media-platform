import React, { forwardRef } from 'react'

const Input = forwardRef(function Input({
  label,
  error,
  hint,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  containerClassName = '',
  type = 'text',
  ...props
}, ref) {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-surface-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            input-base
            ${Icon ? 'pl-10' : ''}
            ${IconRight ? 'pr-10' : ''}
            ${error ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
        {IconRight && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-500">
            <IconRight className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-400 flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-xs text-surface-500">{hint}</p>}
    </div>
  )
})

export default Input

export function Textarea({ label, error, hint, className = '', rows = 4, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-surface-300">{label}</label>
      )}
      <textarea
        rows={rows}
        className={`
          input-base resize-none
          ${error ? 'border-red-500/50 focus:ring-red-500/30' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-surface-500">{hint}</p>}
    </div>
  )
}