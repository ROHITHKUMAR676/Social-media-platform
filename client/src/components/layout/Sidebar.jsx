import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  Home, Users, MessageSquare, Bell, Compass,
  UserPlus, UserCheck, Bookmark, Hash, Zap, Plus
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import { OnlineDot } from '../common/Badge'
import UserAvatar from '../common/UserAvatar'
const NAV_ITEMS_GUEST = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: Compass, label: 'Forums', to: '/forums' },
]

const NAV_ITEMS_AUTH = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: Compass, label: 'Forums', to: '/forums' },
  { icon: MessageSquare, label: 'Messages', to: '/messages' },
  { icon: Bell, label: 'Notifications', to: '/notifications', badge: true },
  { icon: UserCheck, label: 'Following', to: '/following' },
  { icon: Users, label: 'Followers', to: '/followers' },
]

export default function Sidebar() {
  const { user, isAuthenticated } = useAuth()
  const { unreadCount } = useNotifications()
  const navItems = isAuthenticated ? NAV_ITEMS_AUTH : NAV_ITEMS_GUEST

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-60 border-r border-dark-border bg-dark-bg flex flex-col overflow-y-auto scrollbar-hide hidden lg:flex">
      <div className="flex-1 px-3 py-4 space-y-1">
        {/* Nav Links */}
        {navItems.map(({ icon: Icon, label, to, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 flex-shrink-0" />
              {badge && unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            {label}
          </NavLink>
        ))}

        {/* Divider */}
        <div className="my-3 border-t border-dark-border" />

        {/* Quick Links */}
        <p className="px-3 py-1 text-xs font-semibold text-surface-600 uppercase tracking-wider">Discover</p>
        {[
          { icon: Hash, label: 'React', to: '/forums' },
          { icon: Hash, label: 'AI/ML', to: '/forums' },
          { icon: Hash, label: 'DevOps', to: '/forums' },
        ].map(({ icon: Icon, label, to }) => (
          <Link
            key={label}
            to={to}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-surface-500 hover:text-surface-300 hover:bg-dark-hover transition-all text-sm"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </div>

      {/* User Profile Card */}
      {isAuthenticated && user && (
        <div className="p-3 border-t border-dark-border">
          <Link
            to={`/profile/${user.username}`}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-hover transition-all"
          >
            <div className="relative flex-shrink-0">
              <UserAvatar user={user} size="sm" />
              <OnlineDot isOnline className="absolute -bottom-0.5 -right-0.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-surface-500 truncate">@{user.username}</p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  )
}