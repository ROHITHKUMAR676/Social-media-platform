import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell, MessageSquare, Search, ChevronDown,
  User, LogOut, Zap, UserPlus, UserCheck, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import { userService } from '../../services/userService'
import { OnlineDot } from '../common/Badge'
import { formatRelativeTime } from '../../utils/helpers'
import UserAvatar from '../common/UserAvatar'

const getUserId = (user) => user?._id?.toString() || user?.id?.toString() || null

export default function Navbar() {
  const { user, isAuthenticated, logout, updateFollowing } = useAuth()
  const { unreadCount, notifications, markAsRead } = useNotifications()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [followLoadingId, setFollowLoadingId] = useState(null)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const menuRef = useRef(null)
  const notifRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearch('')
        setShowMobileSearch(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    const trimmed = search.trim()

    if (!trimmed) {
      setSearchResults([])
      setSearchLoading(false)
      return
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const res = await userService.searchUsers(trimmed)
        setSearchResults(res.users || [])
      } catch (err) {
        console.error(err)
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const followingIds = useMemo(
    () => new Set((user?.following || []).map((id) => id.toString())),
    [user]
  )

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleSearchFollow = async (targetUserId) => {
    if (!isAuthenticated || !targetUserId || followLoadingId) return

    const targetId = targetUserId.toString()
    setFollowLoadingId(targetId)

    try {
      const res = await userService.toggleFollow(targetId)
      updateFollowing(targetId, res.isFollowing)
    } catch (err) {
      console.error(err)
    } finally {
      setFollowLoadingId(null)
    }
  }

  const handleSelectProfile = (username) => {
    setSearch('')
    setShowMobileSearch(false)
    navigate(`/profile/${username}`)
  }

  const closeSearch = () => {
    setSearch('')
    setShowMobileSearch(false)
  }

  const notifIcons = {
    like: '❤️', comment: '💬', follow: '👤', forum_approved: '✅'
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-brand">
            <Zap className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-white text-lg hidden sm:block">
            Dev<span className="text-brand-400">Connect</span>
          </span>
        </Link>

        <div ref={searchRef} className="flex-1 max-w-sm hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search developers..."
              className="w-full bg-dark-bg border border-dark-border rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-surface-600 focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/30 transition-all"
            />

            {search.trim() && (
              <div className="absolute top-12 left-0 right-0 bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-up">
                {searchLoading ? (
                  <div className="px-4 py-4 text-sm text-surface-500">Searching developers...</div>
                ) : searchResults.length === 0 ? (
                  <div className="px-4 py-4 text-sm text-surface-500">
                    No developers found for "{search.trim()}".
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.map((person) => {
                      const personId = getUserId(person)
                      const isOwnProfile = getUserId(user) === personId
                      const isFollowingPerson = followingIds.has(personId)

                      return (
                        <div
                          key={personId}
                          className="px-4 py-3 border-b border-dark-border/50 last:border-b-0 flex items-center gap-3"
                        >
                          <button
                            onClick={() => handleSelectProfile(person.username)}
                            className="flex items-center gap-3 min-w-0 flex-1 text-left"
                          >
                            <UserAvatar user={person} size="sm" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate">{person.name}</p>
                              <p className="text-xs text-surface-500 truncate">
                                @{person.username}
                                {person.role ? ` · ${person.role}` : ''}
                              </p>
                            </div>
                          </button>

                          {!isOwnProfile && isAuthenticated && (
                            <button
                              onClick={() => handleSearchFollow(personId)}
                              disabled={followLoadingId === personId}
                              className={`text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                                isFollowingPerson
                                  ? 'bg-dark-hover text-surface-300'
                                  : 'bg-brand-600 text-white hover:bg-brand-500'
                              } ${followLoadingId === personId ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                              {followLoadingId === personId ? (
                                '...'
                              ) : isFollowingPerson ? (
                                <>
                                  <UserCheck className="w-3.5 h-3.5" />
                                  Following
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-3.5 h-3.5" />
                                  Follow
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => setShowMobileSearch(true)}
                className="p-2.5 rounded-xl text-surface-400 hover:text-white hover:bg-dark-hover transition-all md:hidden"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link to="/messages" className="relative p-2.5 rounded-xl text-surface-400 hover:text-white hover:bg-dark-hover transition-all">
                <MessageSquare className="w-5 h-5" />
              </Link>

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

      {showMobileSearch && (
        <div className="md:hidden border-t border-dark-border bg-dark-card px-4 py-3" ref={searchRef}>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search developers..."
                className="w-full bg-dark-bg border border-dark-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-surface-600 focus:outline-none focus:ring-1 focus:ring-brand-500/50 focus:border-brand-500/30 transition-all"
              />
            </div>
            <button
              type="button"
              onClick={closeSearch}
              className="p-2.5 rounded-xl text-surface-400 hover:text-white hover:bg-dark-hover transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {search.trim() && (
            <div className="mt-3 bg-dark-bg border border-dark-border rounded-2xl overflow-hidden">
              {searchLoading ? (
                <div className="px-4 py-4 text-sm text-surface-500">Searching developers...</div>
              ) : searchResults.length === 0 ? (
                <div className="px-4 py-4 text-sm text-surface-500">
                  No developers found for "{search.trim()}".
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.map((person) => {
                    const personId = getUserId(person)
                    const isOwnProfile = getUserId(user) === personId
                    const isFollowingPerson = followingIds.has(personId)

                    return (
                      <div
                        key={personId}
                        className="px-4 py-3 border-b border-dark-border/50 last:border-b-0 flex items-center gap-3"
                      >
                        <button
                          onClick={() => handleSelectProfile(person.username)}
                          className="flex items-center gap-3 min-w-0 flex-1 text-left"
                        >
                          <UserAvatar user={person} size="sm" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{person.name}</p>
                            <p className="text-xs text-surface-500 truncate">
                              @{person.username}
                              {person.role ? ` · ${person.role}` : ''}
                            </p>
                          </div>
                        </button>

                        {!isOwnProfile && isAuthenticated && (
                          <button
                            onClick={() => handleSearchFollow(personId)}
                            disabled={followLoadingId === personId}
                            className={`text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                              isFollowingPerson
                                ? 'bg-dark-hover text-surface-300'
                                : 'bg-brand-600 text-white hover:bg-brand-500'
                            } ${followLoadingId === personId ? 'opacity-60 cursor-not-allowed' : ''}`}
                          >
                            {followLoadingId === personId ? (
                              '...'
                            ) : isFollowingPerson ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                Following
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-3.5 h-3.5" />
                                Follow
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
