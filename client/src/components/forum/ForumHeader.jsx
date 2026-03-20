import React from 'react'
import { Link } from 'react-router-dom'
import { Users, FileText, Calendar, CheckCircle2, Clock } from 'lucide-react'
import { SkillTag } from '../common/Badge'
import { formatNumber } from '../../utils/helpers'
import { format } from 'date-fns'
import UserAvatar from '../common/UserAvatar'
export default function ForumHeader({ forum, onApply, applying, matchPercent }) {
  const statusConfig = {
    approved: { label: 'You\'re a Member', icon: CheckCircle2, className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    applied: { label: 'Application Pending', icon: Clock, className: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
    none: null,
  }
  const statusInfo = statusConfig[forum.memberStatus]

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
      {/* Cover */}
      <div className={`h-32 bg-gradient-to-r ${forum.coverColor} relative`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-5 flex items-end gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${forum.coverColor} border-2 border-dark-card flex items-center justify-center shadow-xl`}>
            <span className="text-white font-display font-bold text-2xl">{forum.name[0]}</span>
          </div>
          <div className="mb-1">
            <h1 className="font-display font-bold text-white text-2xl drop-shadow">{forum.name}</h1>
            <p className="text-white/70 text-sm">{forum.category}</p>
          </div>
        </div>
        {matchPercent > 0 && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-white">
            ✨ {matchPercent}% profile match
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-surface-400 text-sm leading-relaxed mb-4">{forum.description}</p>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-5 mb-4 text-sm text-surface-500">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-surface-600" />
            <strong className="text-white">{formatNumber(forum.members)}</strong> members
          </span>
          <span className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-surface-600" />
            <strong className="text-white">{formatNumber(forum.posts)}</strong> posts
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-surface-600" />
            Created {format(new Date(forum.createdAt), 'MMM yyyy')}
          </span>
        </div>

        {/* Required skills */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Required Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {forum.requiredSkills.map(skill => (
              <SkillTag key={skill} skill={skill} />
            ))}
          </div>
        </div>

        {/* Admin */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <p className="text-xs text-surface-600">Admin:</p>
            <Link to={`/profile/${forum.admin.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <UserAvatar user={forum.admin} size="xs" />
              <span className="text-sm font-medium text-surface-300">{forum.admin.name}</span>
            </Link>
          </div>

          {/* Action button */}
          {statusInfo ? (
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${statusInfo.className}`}>
              <statusInfo.icon className="w-4 h-4" />
              {statusInfo.label}
            </span>
          ) : (
            <button
              onClick={onApply}
              disabled={applying}
              className="btn-primary text-sm"
            >
              {applying ? 'Applying...' : 'Apply to Join'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}