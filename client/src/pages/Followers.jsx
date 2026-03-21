import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, UserPlus, UserCheck } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { MOCK_USERS } from '@/data/mockData'
import { useAuth } from '../context/AuthContext'
import { SkillTag } from '../components/common/Badge'
import UserAvatar from "@/components/common/UserAvatar";
export default function Followers() {
  const { isAuthenticated } = useAuth()
  const [followed, setFollowed] = useState({})

  const toggleFollow = (id) => setFollowed(p => ({ ...p, [id]: !p[id] }))

  return (
    <Layout>
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-brand-400" />
        <h1 className="font-display font-bold text-white text-2xl">Followers</h1>
        <span className="text-surface-500 text-sm font-normal ml-1">· {MOCK_USERS.length}</span>
      </div>

      <div className="space-y-3">
        {MOCK_USERS.map(user => (
          <div key={user.id} className="bg-dark-card border border-dark-border rounded-2xl p-4 flex items-start gap-4 hover:border-surface-700/60 transition-all">
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
                {isAuthenticated && (
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      followed[user.id]
                        ? 'bg-dark-hover border border-dark-border text-surface-400'
                        : 'bg-brand-600 text-white hover:bg-brand-500 shadow-brand'
                    }`}
                  >
                    {followed[user.id] ? <><UserCheck className="w-3.5 h-3.5" /> Following</> : <><UserPlus className="w-3.5 h-3.5" /> Follow</>}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {user.skills.slice(0, 3).map(s => <SkillTag key={s} skill={s} size="xs" />)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}