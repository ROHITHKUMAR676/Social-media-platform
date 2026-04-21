import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, FileText, CheckCircle2, Lock, MessageSquare, PenSquare } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useForums } from '../../context/ForumContext'
import { LoginPromptModal } from '../common/Modal'
import { SkillTag } from '../common/Badge'
import { formatNumber } from '../../utils/helpers'

export default function ForumCard({ forum }) {
  const { isAuthenticated } = useAuth()
  const { joinForum } = useForums()
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(forum.joined)

  const matchPercent = isAuthenticated ? (forum.matchPercent || 0) : 0
  const matchTone = matchPercent > 70
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : matchPercent >= 40
      ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      : 'text-red-400 bg-red-500/10 border-red-500/20'

  const accessInfo = forum.permissions?.canPost
    ? { icon: PenSquare, label: 'Can post' }
    : forum.permissions?.canComment
      ? { icon: MessageSquare, label: 'Can comment' }
      : { icon: Lock, label: 'View only' }

  const handleJoin = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      setShowLogin(true)
      return
    }
    if (joined) return

    setJoining(true)
    try {
      await joinForum(forum.id)
      setJoined(true)
    } finally {
      setJoining(false)
    }
  }

  return (
    <>
      <Link to={`/forums/${forum.id}`} className="block group">
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-surface-600/50 hover:shadow-card-hover transition-all duration-200 flex flex-col">
          <div className="h-16 flex-shrink-0 bg-gradient-to-r from-brand-500 to-cyan-500 relative">
            <div className="absolute inset-0 bg-black/20" />
            {isAuthenticated && (
              <div className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-semibold border backdrop-blur-sm bg-black/40 ${matchTone}`}>
                {matchPercent}% match
              </div>
            )}
          </div>

          <div className="p-4 flex flex-col gap-3 bg-dark-card">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl flex-shrink-0 bg-gradient-to-br from-brand-500 to-cyan-500 border-2 border-dark-border flex items-center justify-center shadow-md">
                <span className="text-white font-display font-bold text-base leading-none">
                  {forum.name[0]}
                </span>
              </div>

              {joined && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Joined
                </span>
              )}
            </div>

            <div>
              <h3 className="font-display font-bold text-white text-base group-hover:text-brand-400 transition-colors line-clamp-1 leading-snug">
                {forum.name}
              </h3>
              <p className="text-surface-500 text-xs leading-relaxed mt-1 line-clamp-2">
                {forum.description}
              </p>
            </div>

            {isAuthenticated && (
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${matchTone}`}>
                  <accessInfo.icon className="w-3 h-3" />
                  {accessInfo.label}
                </span>
                {forum.missingSkills?.length > 0 && (
                  <span className="text-surface-500 truncate">
                    Learn {forum.missingSkills.slice(0, 2).join(', ')}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-surface-600">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {formatNumber(forum.membersCount || 0)} members
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {formatNumber(forum.postsCount || 0)} posts
              </span>
            </div>

            <div className="flex flex-wrap gap-1">
              {forum.skillsRequired.slice(0, 3).map((skill) => (
                <SkillTag key={skill} skill={skill} size="xs" />
              ))}
              {forum.skillsRequired.length > 3 && (
                <span className="text-xs text-surface-600 self-center">
                  +{forum.skillsRequired.length - 3}
                </span>
              )}
            </div>

            {!joined && (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full btn-primary text-xs py-2 justify-center"
              >
                {joining ? 'Joining...' : 'Join Forum'}
              </button>
            )}
          </div>
        </div>
      </Link>

      <LoginPromptModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={() => { setShowLogin(false); navigate('/login') }}
        onRegister={() => { setShowLogin(false); navigate('/register') }}
      />
    </>
  )
}
