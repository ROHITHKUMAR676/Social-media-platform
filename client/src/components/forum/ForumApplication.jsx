import React, { useState } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useForums } from '../../context/ForumContext'
import { calculateProfileMatch } from '../../utils/helpers'
import { SkillTag } from '../common/Badge'

export default function ForumApplication({ forum, onApplied }) {
  const { user } = useAuth()
  const { applyToForum } = useForums()
  const [note, setNote] = useState('')
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  const match = calculateProfileMatch(user?.skills, forum.requiredSkills)
  const userSkills = user?.skills || []
  const matchedSkills = forum.requiredSkills.filter(s =>
    userSkills.some(us => us.toLowerCase() === s.toLowerCase())
  )
  const missingSkills = forum.requiredSkills.filter(s =>
    !userSkills.some(us => us.toLowerCase() === s.toLowerCase())
  )

  const handleApply = async () => {
    setApplying(true)
    await applyToForum(forum.id)
    setApplied(true)
    setApplying(false)
    onApplied?.()
  }

  if (applied) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-2xl p-5 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="font-semibold text-white mb-1">Application Sent!</h3>
        <p className="text-sm text-surface-500">The admin will review your application.</p>
      </div>
    )
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-4">
      <h3 className="font-display font-semibold text-white">Apply to Join</h3>

      {/* Profile match */}
      <div className="p-3 rounded-xl bg-dark-bg border border-dark-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-surface-400">Profile match</span>
          <span className={`text-sm font-bold ${match >= 60 ? 'text-emerald-400' : match >= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
            {match}%
          </span>
        </div>
        <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${match >= 60 ? 'bg-emerald-500' : match >= 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${match}%` }}
          />
        </div>
      </div>

      {/* Skills breakdown */}
      {matchedSkills.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-emerald-400 mb-1.5">✓ Matched skills</p>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map(s => (
              <SkillTag key={s} skill={s} />
            ))}
          </div>
        </div>
      )}

      {missingSkills.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-surface-500 mb-1.5">Missing skills</p>
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.map(s => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-dark-bg border border-dark-border text-surface-500 font-mono">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      <div>
        <label className="block text-xs font-medium text-surface-400 mb-1.5">
          Why do you want to join? <span className="text-surface-600">(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Briefly introduce yourself..."
          rows={3}
          className="input-base resize-none text-xs"
        />
      </div>

      <button
        onClick={handleApply}
        disabled={applying}
        className="w-full btn-primary justify-center"
      >
        {applying ? 'Sending Application...' : 'Send Application'}
      </button>
    </div>
  )
}