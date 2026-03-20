import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserCheck, UserMinus } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { MOCK_USERS } from '@/data/mockData'
import { SkillTag } from '../components/common/Badge'
import UserAvatar from '../common/UserAvatar'
export default function Following() {
  const following = MOCK_USERS.slice(0, 3)
  const [unfollowed, setUnfollowed] = useState({})

  return (
    <Layout>
      <div className="flex items-center gap-2 mb-6">
        <UserCheck className="w-5 h-5 text-brand-400" />
        <h1 className="font-display font-bold text-white text-2xl">Following</h1>
        <span className="text-surface-500 text-sm font-normal ml-1">· {following.length}</span>
      </div>

      {following.length === 0 ? (
        <div className="text-center py-20">
          <UserCheck className="w-12 h-12 text-surface-700 mx-auto mb-4" />
          <h3 className="font-display font-bold text-white text-xl mb-2">Not following anyone yet</h3>
          <p className="text-surface-500 text-sm">Discover developers to follow on your home feed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {following.map(user => (
            <div
              key={user.id}
              className={`bg-dark-card border border-dark-border rounded-2xl p-4 flex items-start gap-4 transition-all ${
                unfollowed[user.id] ? 'opacity-50' : 'hover:border-surface-700/60'
              }`}
            >
              <Link to={`/profile/${user.username}`} className="flex-shrink-0">
                <UserAvatar user={user} size="lg" shape="rounded" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/profile/${user.username}`}>
                      <p className="font-semibold text-white hover:text-brand-400 transition-colors">{user.name}</p>
                    </Link>
                    <p className="text-xs text-surface-500 mb-1">@{user.username} · {user.role}</p>
                    <p className="text-sm text-surface-400 line-clamp-1">{user.bio}</p>
                  </div>
                  <button
                    onClick={() => setUnfollowed(p => ({ ...p, [user.id]: !p[user.id] }))}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-dark-hover border border-dark-border text-surface-400 hover:text-red-400 hover:border-red-500/20 transition-all"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    {unfollowed[user.id] ? 'Unfollowed' : 'Unfollow'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {user.skills.slice(0, 3).map(s => <SkillTag key={s} skill={s} size="xs" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}