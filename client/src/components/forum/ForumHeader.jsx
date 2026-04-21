import React from 'react'
import { Users, FileText, Calendar, CheckCircle2, Lock, MessageSquare, PenSquare } from 'lucide-react'
import { SkillTag } from '../common/Badge'
import { formatNumber } from '../../utils/helpers'
import { format } from 'date-fns'

export default function ForumHeader({ forum, onJoin, joining, matchPercent }) {
  const accessBadge = forum.permissions?.canPost
    ? { icon: PenSquare, label: 'Can create posts', className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
    : forum.permissions?.canComment
      ? { icon: MessageSquare, label: 'Can comment', className: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' }
      : { icon: Lock, label: 'View only', className: 'text-red-400 bg-red-500/10 border-red-500/20' }

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-brand-500 to-cyan-500 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-5 flex items-end gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 border-2 border-dark-card flex items-center justify-center shadow-xl">
            <span className="text-white font-display font-bold text-2xl">{forum.name[0]}</span>
          </div>
          <div className="mb-1">
            <h1 className="font-display font-bold text-white text-2xl drop-shadow">{forum.name}</h1>
            <p className="text-white/70 text-sm">Skill-based community</p>
          </div>
        </div>
        {typeof matchPercent === 'number' && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-white">
            {matchPercent}% profile match
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-surface-400 text-sm leading-relaxed mb-4">{forum.description}</p>

        <div className="flex flex-wrap items-center gap-5 mb-4 text-sm text-surface-500">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-surface-600" />
            <strong className="text-white">{formatNumber(forum.membersCount || 0)}</strong> members
          </span>
          <span className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-surface-600" />
            <strong className="text-white">{formatNumber(forum.postsCount || 0)}</strong> posts
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-surface-600" />
            Created {format(new Date(forum.createdAt), 'MMM yyyy')}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Required Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {forum.skillsRequired.map((skill) => (
              <SkillTag key={skill} skill={skill} />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-2">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${accessBadge.className}`}>
              <accessBadge.icon className="w-4 h-4" />
              {accessBadge.label}
            </span>
            {forum.missingSkills?.length > 0 && (
              <p className="text-sm text-surface-500">
                Improve your match by learning: <span className="text-surface-300">{forum.missingSkills.join(', ')}</span>
              </p>
            )}
          </div>

          {forum.joined ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
              Joined forum
            </span>
          ) : (
            <button
              onClick={onJoin}
              disabled={joining}
              className="btn-primary text-sm"
            >
              {joining ? 'Joining...' : 'Join Forum'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
