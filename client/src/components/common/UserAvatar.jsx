import React from 'react'

// Same gradient palette used in CreateProfile so colours are always consistent
const GRADIENTS = [
  'from-brand-600 to-blue-500',
  'from-purple-600 to-pink-500',
  'from-emerald-600 to-cyan-500',
  'from-orange-500 to-red-500',
  'from-yellow-500 to-orange-500',
]

function gradient(name) {
  if (!name) return GRADIENTS[0]
  return GRADIENTS[name.charCodeAt(0) % GRADIENTS.length]
}

/**
 * UserAvatar — renders a real photo OR a gradient initial-letter fallback.
 *
 * Props:
 *   user          — object with { name, avatar, avatarFallback }
 *   size          — 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 *   className     — extra classes appended to the root element
 *   shape         — 'circle' | 'rounded'  (default: 'circle')
 */
export default function UserAvatar({
  user,
  size = 'md',
  className = '',
  shape = 'circle',
}) {
  const sizeMap = {
    xs: { box: 'w-6 h-6',   text: 'text-[10px]' },
    sm: { box: 'w-8 h-8',   text: 'text-sm'     },
    md: { box: 'w-10 h-10', text: 'text-base'   },
    lg: { box: 'w-14 h-14', text: 'text-xl'     },
    xl: { box: 'w-20 h-20', text: 'text-2xl'    },
  }
  const { box, text } = sizeMap[size] || sizeMap.md
  const radius = shape === 'rounded' ? 'rounded-xl' : 'rounded-full'
  const base   = `${box} ${radius} flex-shrink-0 overflow-hidden ${className}`

  // Show real photo only when avatar exists AND avatarFallback is falsy
  const showPhoto = user?.avatar && !user?.avatarFallback

  if (showPhoto) {
    return (
      <img
        src={user.avatar}
        alt={user?.name || 'User'}
        className={`${base} object-cover bg-dark-hover`}
      />
    )
  }

  // Initial-letter fallback
  const letter = (user?.name || '?')[0].toUpperCase()
  const grad   = gradient(user?.name)

  return (
    <div className={`${base} bg-gradient-to-br ${grad} flex items-center justify-center`}>
      <span className={`${text} font-display font-bold text-white leading-none select-none`}>
        {letter}
      </span>
    </div>
  )
}