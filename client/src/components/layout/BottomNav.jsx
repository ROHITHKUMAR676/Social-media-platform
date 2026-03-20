import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Compass, MessageSquare, Bell, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'

export default function BottomNav() {
  const { isAuthenticated, user } = useAuth()
  const { unreadCount } = useNotifications()

  const items = isAuthenticated
    ? [
        { icon: Home, label: 'Home', to: '/', end: true },
        { icon: Compass, label: 'Forums', to: '/forums' },
        { icon: MessageSquare, label: 'Chat', to: '/messages' },
        { icon: Bell, label: 'Alerts', to: '/notifications', badge: unreadCount },
        { icon: User, label: 'Profile', to: `/profile/${user?.username}` },
      ]
    : [
        { icon: Home, label: 'Home', to: '/', end: true },
        { icon: Compass, label: 'Forums', to: '/forums' },
      ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-dark-border lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map(({ icon: Icon, label, to, badge, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-brand-400 bg-brand-600/10'
                  : 'text-surface-500 hover:text-surface-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-brand-500 text-white text-[8px] font-bold flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}