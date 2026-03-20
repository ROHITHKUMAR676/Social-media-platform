import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Users, ArrowRight } from 'lucide-react'
import { MOCK_USERS, MOCK_FORUMS } from '@/data/mockData'
import { formatNumber } from '../../utils/helpers'
import { SkillTag } from '../common/Badge'
import { useAuth } from '../../context/AuthContext'
import UserAvatar from '../common/UserAvatar'
export default function RightPanel() {
  const { isAuthenticated, user } = useAuth()

  return (
    <aside className="w-72 flex-shrink-0 hidden xl:block">
      <div className="sticky top-20 space-y-4">

        {/* Trending Tags */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-brand-400" />
            <h3 className="font-display font-semibold text-white text-sm">Trending</h3>
          </div>
          <div className="space-y-3">
            {[
              { tag: '#ReactServerComponents', posts: 284 },
              { tag: '#AIEngineering', posts: 512 },
              { tag: '#RustLang', posts: 178 },
              { tag: '#KubernetesKrisis', posts: 89 },
              { tag: '#TypeScriptTips', posts: 341 },
            ].map(({ tag, posts }) => (
              <button key={tag} className="w-full flex items-center justify-between group text-left">
                <div>
                  <p className="text-sm font-medium text-surface-300 group-hover:text-brand-400 transition-colors">{tag}</p>
                  <p className="text-xs text-surface-600">{formatNumber(posts)} posts</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-surface-700 group-hover:text-brand-400 transition-all group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Who to follow */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-400" />
              <h3 className="font-display font-semibold text-white text-sm">Who to Follow</h3>
            </div>
          </div>
          <div className="space-y-3">
            {MOCK_USERS.slice(0, 4).map(u => (
              <div key={u.id} className="flex items-center gap-3">
                <Link to={`/profile/${u.username}`} className="flex-shrink-0">
                  <UserAvatar user={u} size="sm" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${u.username}`}>
                    <p className="text-sm font-medium text-white hover:text-brand-400 transition-colors truncate">{u.name}</p>
                  </Link>
                  <p className="text-xs text-surface-500 truncate">{u.role}</p>
                </div>
                {isAuthenticated && (
                  <button className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors flex-shrink-0 border border-brand-600/30 rounded-lg px-2.5 py-1 hover:bg-brand-600/10">
                    Follow
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Forums */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-white text-sm">Active Communities</h3>
            <Link to="/forums" className="text-xs text-brand-400 hover:text-brand-300">See all</Link>
          </div>
          <div className="space-y-2.5">
            {MOCK_FORUMS.slice(0, 3).map(forum => (
              <Link
                key={forum.id}
                to={`/forums/${forum.slug}`}
                className="flex items-center gap-3 group"
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${forum.coverColor} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs font-bold">{forum.name[0]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-surface-300 group-hover:text-white transition-colors truncate">{forum.name}</p>
                  <p className="text-xs text-surface-600">{formatNumber(forum.members)} members</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-surface-700 px-1 pb-4">
          © 2024 DevConnect · Privacy · Terms
        </p>
      </div>
    </aside>
  )
}