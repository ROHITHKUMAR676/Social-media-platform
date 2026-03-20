import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Pin } from 'lucide-react'
import { SkillTag } from '../common/Badge'
import { formatRelativeTime, formatNumber } from '../../utils/helpers'
import UserAvatar from '../common/UserAvatar'
export default function ForumPost({ post }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)

  const handleLike = (e) => {
    e.preventDefault()
    setLiked(p => !p)
    setLikeCount(p => liked ? p - 1 : p + 1)
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 hover:border-surface-700/60 transition-all duration-200">
      {post.pinned && (
        <div className="flex items-center gap-1.5 text-xs text-brand-400 mb-3">
          <Pin className="w-3.5 h-3.5" />
          <span className="font-medium">Pinned</span>
        </div>
      )}

      <div className="flex gap-3">
        <Link to={`/profile/${post.author.username}`} className="flex-shrink-0">
          <<UserAvatar user={post.author} size="sm" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link to={`/profile/${post.author.username}`} className="text-sm font-semibold text-white hover:text-brand-400 transition-colors">
              {post.author.name}
            </Link>
            <span className="text-xs text-surface-600">{formatRelativeTime(post.createdAt)}</span>
          </div>

          <h3 className="text-base font-semibold text-surface-100 mb-1.5 hover:text-white transition-colors cursor-pointer">
            {post.title}
          </h3>
          <p className="text-sm text-surface-400 leading-relaxed mb-3 line-clamp-2">{post.content}</p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map(tag => (
              <SkillTag key={tag} skill={`#${tag}`} size="xs" />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                liked ? 'text-red-400' : 'text-surface-500 hover:text-surface-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{formatNumber(likeCount)}</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-300 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{formatNumber(post.comments)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}