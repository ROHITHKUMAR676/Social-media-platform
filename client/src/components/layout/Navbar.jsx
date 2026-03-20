import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell, MessageSquare, Search, ChevronDown,
  User, Settings, LogOut, Zap
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import { OnlineDot } from '../common/Badge'
import { formatRelativeTime } from '../../utils/helpers'
import UserAvatar from '../common/UserAvatar'
export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { unreadCount, notifications, markAsRead } = useNotifications()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [search, setSearch] = useState('')
  const menuRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const notifIcons = {
    like: '❤️', comment: '💬', follow: '👤', forum_approved: '✅'
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-brand">
            <Zap className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-white text-lg hidden sm:block">
            Dev<span className="text-brand-400">Connect</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-sm hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search developers, posts, forums..."
              className="w-full bg-dark-bg border border-dark-border rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-surface-600 focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/30 transition-all"
            />
          </div>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              {/* Messages */}
              <Link to="/messages" className="relative p-2.5 rounded-xl text-surface-400 hover:text-white hover:bg-dark-hover transition-all">
                <MessageSquare className="w-5 h-5" />
              </Link>

              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifs(p => !p)}
                  className="relative p-2.5 rounded-xl text-surface-400 hover:text-white hover:bg-dark-hover transition-all"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce-subtle">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 top-12 w-80 bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border">
                      <span className="font-semibold text-white text-sm">Notifications</span>
                      <button
                        onClick={() => { navigate('/notifications'); setShowNotifs(false) }}
                        className="text-xs text-brand-400 hover:text-brand-300"
                      >
                        View all
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.slice(0, 5).map(n => (
                        <button
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-dark-hover transition-all text-left ${!n.read ? 'bg-brand-600/5' : ''}`}
                        >
                          <span className="text-lg flex-shrink-0 mt-0.5">{notifIcons[n.type]}</span>
                          <div className="min-w-0">
                            <p className="text-sm text-surface-300 leading-snug">
                              <span className="text-white font-medium">{n.actor.name}</span> {n.content}
                            </p>
                            <p className="text-xs text-surface-600 mt-0.5">{formatRelativeTime(n.createdAt)}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(p => !p)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-dark-hover transition-all"
                >
                  <div className="relative">
                    <UserAvatar user={user} size="sm" />
                    <OnlineDot isOnline className="absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-surface-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-52 bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up z-50">
                    <div className="px-4 py-3 border-b border-dark-border">
                      <p className="font-semibold text-white text-sm truncate">{user?.name}</p>
                      <p className="text-xs text-surface-500 truncate">@{user?.username}</p>
                    </div>
                    <div className="py-1.5">
                      <Link
                        to={`/profile/${user?.username}`}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-300 hover:text-white hover:bg-dark-hover transition-all"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-dark-hover transition-all"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm px-4 py-2">Sign in</Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2">Get started</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}