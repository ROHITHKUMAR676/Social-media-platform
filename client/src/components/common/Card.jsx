import React from 'react'

export default function Card({ children, className = '', hover = false, onClick, padding = true }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-dark-card border border-dark-border rounded-2xl shadow-card
        ${padding ? 'p-5' : ''}
        ${hover ? 'card-hover' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}