import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, FileText, CheckCircle2, Clock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useForums } from '../../context/ForumContext'
import { LoginPromptModal } from '../common/Modal'
import { SkillTag } from '../common/Badge'
import { formatNumber, calculateProfileMatch } from '../../utils/helpers'

export default function ForumCard({ forum }) {
  const { isAuthenticated, user } = useAuth()
  const { applyToForum } = useForums()
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [applying, setApplying] = useState(false)
  const [status, setStatus] = useState(forum.memberStatus)

  const matchPercent = calculateProfileMatch(user?.skills, forum.requiredSkills)

  const handleApply = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) { setShowLogin(true); return }
    if (status !== 'none') return
    setApplying(true)
    await applyToForum(forum.id)
    setStatus('applied')
    setApplying(false)
  }

  const statusConfig = {
    approved: {
      label: 'Member',
      icon: CheckCircle2,
      className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    },
    applied: {
      label: 'Applied',
      icon: Clock,
      className: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    },
    none: null,
  }
  const statusInfo = statusConfig[status]

  return (
    <>
      <Link to={`/forums/${forum.slug}`} className="block group">
        <div className="
          bg-dark-card border border-dark-border rounded-2xl
          overflow-hidden
          hover:border-surface-600/50 hover:shadow-card-hover
          transition-all duration-200
          flex flex-col
        ">
          {/* ── Cover banner ─────────────────────────────────────────
              Uses a fixed height and does NOT bleed into card body.
              The forum-letter avatar sits INSIDE the card body below,
              so there is zero overlap with bg-dark-card.             */}
          <div className={`h-16 flex-shrink-0 bg-gradient-to-r ${forum.coverColor} relative`}>
            <div className="absolute inset-0 bg-black/20" />

            {/* % match pill — top-right of banner */}
            {isAuthenticated && matchPercent > 0 && (
              <div className="
                absolute top-2 right-2
                bg-black/50 backdrop-blur-sm
                rounded-full px-2 py-0.5
                text-xs font-semibold text-white
              ">
                {matchPercent}% match
              </div>
            )}
          </div>

          {/* ── Card body ──────────────────────────────────────────── */}
          <div className="p-4 flex flex-col gap-3 bg-dark-card">

            {/* Row: avatar icon  +  status badge */}
            <div className="flex items-center justify-between">
              {/* Letter avatar — solid bg, no negative margin */}
              <div className={`
                w-11 h-11 rounded-xl flex-shrink-0
                bg-gradient-to-br ${forum.coverColor}
                border-2 border-dark-border
                flex items-center justify-center shadow-md
              `}>
                <span className="text-white font-display font-bold text-base leading-none">
                  {forum.name[0]}
                </span>
              </div>

              {/* Status badge */}
              {statusInfo && (
                <span className={`
                  inline-flex items-center gap-1
                  px-2.5 py-1 rounded-full
                  text-xs font-semibold
                  ${statusInfo.className}
                `}>
                  <statusInfo.icon className="w-3 h-3" />
                  {statusInfo.label}
                </span>
              )}
            </div>

            {/* Name + description */}
            <div>
              <h3 className="
                font-display font-bold text-white text-base
                group-hover:text-brand-400 transition-colors
                line-clamp-1 leading-snug
              ">
                {forum.name}
              </h3>
              <p className="text-surface-500 text-xs leading-relaxed mt-1 line-clamp-2">
                {forum.description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-surface-600">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {formatNumber(forum.members)} members
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {formatNumber(forum.posts)} posts
              </span>
            </div>

            {/* Required skills */}
            <div className="flex flex-wrap gap-1">
              {forum.requiredSkills.slice(0, 3).map(skill => (
                <SkillTag key={skill} skill={skill} size="xs" />
              ))}
              {forum.requiredSkills.length > 3 && (
                <span className="text-xs text-surface-600 self-center">
                  +{forum.requiredSkills.length - 3}
                </span>
              )}
            </div>

            {/* Apply button */}
            {status === 'none' && (
              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full btn-primary text-xs py-2 justify-center"
              >
                {applying ? 'Applying...' : 'Apply to Join'}
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