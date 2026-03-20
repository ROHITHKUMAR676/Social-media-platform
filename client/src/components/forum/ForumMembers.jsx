import React from 'react'
import { Link } from 'react-router-dom'
import { Crown } from 'lucide-react'
import { MOCK_USERS } from '@/data/mockData'
import { OnlineDot } from '../common/Badge'
import UserAvatar from '../common/UserAvatar'
export default function ForumMembers({ forum }) {
  const members = [forum.admin, ...MOCK_USERS.filter(u => u.id !== forum.admin.id).slice(0, 6)]

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-4">
      <h3 className="font-display font-semibold text-white text-sm mb-3">
        Members <span className="text-surface-600 font-normal">({forum.members.toLocaleString()})</span>
      </h3>
      <div className="space-y-2.5">
        {members.map((member, i) => (
          <Link
            key={member.id}
            to={`/profile/${member.username}`}
            className="flex items-center gap-3 group"
          >
            <div className="relative flex-shrink-0">
              <UserAvatar user={member} size="sm" />
              <OnlineDot isOnline={member.isOnline} className="absolute -bottom-0.5 -right-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-surface-300 group-hover:text-white transition-colors truncate">{member.name}</p>
                {i === 0 && <Crown className="w-3 h-3 text-yellow-400 flex-shrink-0" />}
              </div>
              <p className="text-xs text-surface-600 truncate">{member.role}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}