import React from 'react'
import { Bell, Heart, MessageCircle, UserPlus, CheckCircle2, CheckCheck } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useNotifications } from '../context/NotificationContext'
import { formatRelativeTime } from '../utils/helpers'
import UserAvatar from "@/components/common/UserAvatar";
const ICON_MAP = {
  like: { icon: Heart, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  comment: { icon: MessageCircle, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  follow: { icon: UserPlus, color: 'text-brand-400 bg-brand-600/10 border-brand-600/20' },
  forum_approved: { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
}

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  const groupedByRead = {
    unread: notifications.filter(n => !n.read),
    earlier: notifications.filter(n => n.read),
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Bell className="w-5 h-5 text-brand-400" />
            <h1 className="font-display font-bold text-white text-2xl">Notifications</h1>
            {unreadCount > 0 && (
              <span className="badge bg-brand-600 text-white">{unreadCount} new</span>
            )}
          </div>
          <p className="text-surface-500 text-sm">Stay updated on your activity.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-3xl bg-dark-card border border-dark-border flex items-center justify-center mb-5">
            <Bell className="w-8 h-8 text-surface-700" />
          </div>
          <h3 className="font-display font-bold text-white text-xl mb-2">All caught up!</h3>
          <p className="text-surface-500 text-sm">Your notifications will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByRead.unread.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">New</p>
              <div className="space-y-1">
                {groupedByRead.unread.map(n => (
                  <NotifItem key={n.id} notif={n} onRead={markAsRead} />
                ))}
              </div>
            </div>
          )}
          {groupedByRead.earlier.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Earlier</p>
              <div className="space-y-1">
                {groupedByRead.earlier.map(n => (
                  <NotifItem key={n.id} notif={n} onRead={markAsRead} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}

function NotifItem({ notif, onRead }) {
  const cfg = ICON_MAP[notif.type] || ICON_MAP.like
  const Icon = cfg.icon

  return (
    <button
      onClick={() => !notif.read && onRead(notif.id)}
      className={`w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all ${
        !notif.read
          ? 'bg-brand-600/5 border border-brand-600/10 hover:bg-brand-600/10'
          : 'hover:bg-dark-card border border-transparent'
      }`}
    >
      {/* Actor avatar + icon */}
      <div className="relative flex-shrink-0">
        <UserAvatar user={notif.actor} size="md" />
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border border-dark-bg flex items-center justify-center ${cfg.color.split(' ').slice(1).join(' ')}`}>
          <Icon className={`w-2.5 h-2.5 ${cfg.color.split(' ')[0]}`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-surface-300 leading-snug">
          <span className="font-semibold text-white">{notif.actor.name}</span>{' '}
          {notif.content}
        </p>
        <p className="text-xs text-surface-600 mt-1">{formatRelativeTime(notif.createdAt)}</p>
      </div>

      {/* Unread dot */}
      {!notif.read && (
        <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1.5" />
      )}
    </button>
  )
}