import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Code, CheckCheck, Send
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { userService } from '@/services/userService'
import { LoginPromptModal } from '../common/Modal'
import { SkillTag } from '../common/Badge'
import { postService } from '@/services/postService'
import { formatRelativeTime, formatNumber } from '../../utils/helpers'
import { MOCK_COMMENTS } from '@/data/mockData'
import UserAvatar from '../common/UserAvatar'

export default function PostCard({ post, onLike }) {
  const { isAuthenticated, user: currentUser, updateFollowing } = useAuth()
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [liked, setLiked] = useState(post.liked)
  const [commentCount, setCommentCount] = useState(post.comments || 0)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [bookmarked, setBookmarked] = useState(post.bookmarked)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [commentCount, setCommentCount] = useState(post.comments || 0)
  const [loadingComments, setLoadingComments] = useState(false)
  const [replyText, setReplyText] = useState('')
const [activeReply, setActiveReply] = useState(null)
  useEffect(() => {
  if (!showComments) return

  const fetchComments = async () => {
    setLoadingComments(true)

    try {
      const res = await postService.getComments(post.id)
      setComments(res.comments || [])
      setCommentCount(res.comments.length)
    } catch (err) {
      console.error(err)
      setComments([])
    }

    setLoadingComments(false)
  }

  fetchComments()
}, [showComments, post.id])
<<<<<<< HEAD

=======
>>>>>>> 2310d38 (doneee)
  const requireAuth = (action) => {
    if (!isAuthenticated) {
      setShowLogin(true)
      return false
    }
    return true
  }

 const [isLiking, setIsLiking] = useState(false)

const handleLike = async () => {
  if (!requireAuth()) return
  if (isLiking) return // 🔥 prevent spam clicks

  setIsLiking(true)

  const prevLiked = liked
  const prevCount = likeCount

  // ⚡ Optimistic UI
  setLiked(!prevLiked)
  setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1)

  try {
    const res = await postService.toggleLike(post.id)

    // ✅ sync with backend
    setLiked(res.liked)
    setLikeCount(res.likes)
  } catch (err) {
    console.error(err)

    // 🔁 FULL rollback (fixes your bug)
    setLiked(prevLiked)
    setLikeCount(prevCount)
  }

  setIsLiking(false)
}
const handleDoubleClick = () => {
  if (!liked) {
    handleLike()
  }
}

  const handleBookmark = () => {
    if (!requireAuth()) return
    setBookmarked(p => !p)
  }

  const handleComment = () => {
    if (!requireAuth()) return
    setShowComments(p => !p)
  }
  const handleReply = async (commentId) => {
  if (!replyText.trim()) return

  const text = replyText
  setReplyText('')

  try {
    const res = await postService.addReply(post.id, commentId, text)
    setComments(res.comments)
    setActiveReply(null)
  } catch (err) {
    console.error(err)
  }
}
const handleSendComment = async (e) => {
  e.preventDefault()
  if (!comment.trim()) return

  const text = comment
  setComment('')

  // 🔥 optimistic UI
  const tempComment = {
    id: Date.now(),
    author: currentUser,
    text,
    createdAt: new Date().toISOString(),
  }

<<<<<<< HEAD
  setComments(prev => [...prev, tempComment])
  
=======
setCommentCount(prev => prev + 1)

>>>>>>> 2310d38 (doneee)
  try {
    const res = await postService.addComment(post.id, text)

    // 🔥 SYNC WITH BACKEND (IMPORTANT)
    setComments(res.comments)
<<<<<<< HEAD
    setCommentCount(prev => prev + 1)
=======

>>>>>>> 2310d38 (doneee)
  } catch (err) {
    console.error(err)
  }
}
  const handleShare = () => {
    if (!requireAuth()) return
    navigator.clipboard?.writeText(window.location.origin + '/post/' + post.id)
  }
const [isFollowing, setIsFollowing] = useState(false)
const [followLoading, setFollowLoading] = useState(false)
useEffect(() => {
  if (!currentUser || !post.author?._id) return

  const isFollowingAuthor = currentUser.following?.some(
    id => id.toString() === post.author._id.toString()
  )

  setIsFollowing(isFollowingAuthor)
}, [currentUser, post.author])
const handleFollow = async () => {
  if (!post.author?._id) return
  if (followLoading) return

  setFollowLoading(true)

  try {
    const res = await userService.toggleFollow(post.author._id)

    setIsFollowing(res.isFollowing)

    // 🔥 GLOBAL SYNC
    updateFollowing(post.author._id, res.isFollowing)

  } catch (err) {
    console.error(err)
  }

  setFollowLoading(false)
}
const handleReply = async (commentId) => {
  if (!replyText.trim()) return

  const text = replyText
  setReplyText('')

  try {
    const res = await postService.addReply(post.id, commentId, text)
    setComments(res.comments)
    setActiveReply(null)
  } catch (err) {
    console.error(err)
  }
}
    return (
    <>
      <article 
       onDoubleClick={handleDoubleClick}
      className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-surface-700/60 transition-all duration-200 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3">
  {/* LEFT SIDE */}
  <div className="flex items-center gap-3">
    <Link to={`/profile/${post.author.username}`} className="flex-shrink-0">
      <UserAvatar user={post.author} size="md" />
    </Link>
    <div>
      <div className="flex items-center gap-1.5">
        <Link
          to={`/profile/${post.author.username}`}
          className="font-semibold text-white text-sm hover:text-brand-400 transition-colors"
        >
          {post.author.name}
        </Link>
        {post.author.verified && (
          <span className="text-brand-400">
            <CheckCheck className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
      <p className="text-xs text-surface-500">
        {post.author.role && <>{post.author.role} · </>}
        {formatRelativeTime(post.createdAt)}
      </p>
    </div>
  </div>

  {/* 🔥 RIGHT SIDE (FOLLOW + MENU) */}
  <div className="flex items-center gap-2">
    {/* FOLLOW BUTTON */}
    {currentUser?._id !== post.author?._id && (
      <button
        onClick={handleFollow}
        disabled={followLoading}
        className={`text-xs px-3 py-1.5 rounded-lg transition ${
          isFollowing
            ? 'bg-dark-hover text-surface-400'
            : 'bg-brand-600 text-white hover:bg-brand-500'
        }`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    )}

    {/* MENU BUTTON */}
    <button className="p-1.5 rounded-lg text-surface-600 hover:text-surface-300 hover:bg-dark-hover transition-all">
      <MoreHorizontal className="w-4 h-4" />
    </button>
  </div>
</div>
          <button className="p-1.5 rounded-lg text-surface-600 hover:text-surface-300 hover:bg-dark-hover transition-all">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        

        {/* Content */}
        <div className="px-5 pb-3">
          <p className="text-surface-200 text-sm leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        </div>

        {/* Code snippet */}
        {post.codeSnippet && (
          <div className="mx-5 mb-3 rounded-xl bg-dark-bg border border-dark-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-dark-border">
              <Code className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-xs text-surface-500 font-mono">code</span>
            </div>
            <pre className="p-4 text-xs font-mono text-green-400 overflow-x-auto leading-relaxed scrollbar-hide">
              {post.codeSnippet}
            </pre>
          </div>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="px-5 pb-3 flex flex-wrap gap-1.5">
            {post.tags.map(tag => (
              <SkillTag key={tag} skill={`#${tag}`} />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="px-5 pb-2 flex items-center gap-4 text-xs text-surface-600">
          <span>{formatNumber(likeCount)} likes</span>
          <span>{formatNumber(commentCount)} comments</span>
        </div>

        {/* Actions */}
        <div className="px-3 py-2 border-t border-dark-border flex items-center gap-1">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all duration-150
              ${liked
                ? 'text-red-400 bg-red-500/10 hover:bg-red-500/15'
                : 'text-surface-500 hover:text-surface-300 hover:bg-dark-hover'
              }`}
          >
            <Heart className={`w-4 h-4 transition-transform duration-150 ${liked ? 'fill-current scale-110' : ''}`} />
            <span className="hidden sm:inline">Like</span>
          </button>

          <button
            onClick={handleComment}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all duration-150
              ${showComments
                ? 'text-brand-400 bg-brand-600/10'
                : 'text-surface-500 hover:text-surface-300 hover:bg-dark-hover'
              }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Comment</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium text-surface-500 hover:text-surface-300 hover:bg-dark-hover transition-all duration-150"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={handleBookmark}
            className={`p-2 rounded-xl text-sm font-medium transition-all duration-150
              ${bookmarked
                ? 'text-yellow-400 bg-yellow-500/10'
                : 'text-surface-500 hover:text-surface-300 hover:bg-dark-hover'
              }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Comments section */}
<<<<<<< HEAD
=======
        {/* Comments section */}
>>>>>>> 2310d38 (doneee)
{showComments && (
  <div className="border-t border-dark-border animate-slide-up">

    {comments.length > 0 && (
      <div className="px-5 py-3 space-y-4 max-h-72 overflow-y-auto">

        {comments.map(c => (
          <div key={c._id || c.id} className="space-y-2">

            {/* 🔹 MAIN COMMENT */}
            <div className="flex gap-3">
              <UserAvatar user={c.user} size="sm" />

              <div className="flex-1 bg-dark-bg rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-white">
                    {c.user?.name}
                  </span>
                  <span className="text-xs text-surface-600">
                    {formatRelativeTime(c.createdAt)}
                  </span>
                </div>

                <p className="text-sm text-surface-300">{c.text}</p>

                {/* 🔥 REPLY BUTTON */}
                <button
                  onClick={() => setActiveReply(c._id)}
                  className="text-xs text-brand-400 mt-2 hover:underline"
                >
                  Reply
                </button>
              </div>
            </div>

            {/* 🔥 REPLIES */}
            {c.replies?.length > 0 && (
              <div className="ml-10 space-y-2">
                {c.replies.map(r => (
                  <div key={r._id} className="flex gap-3">
                    <UserAvatar user={r.user} size="sm" />

                    <div className="flex-1 bg-dark-bg rounded-xl p-2.5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-white">
                          {r.user?.name}
                        </span>
                        <span className="text-xs text-surface-600">
                          {formatRelativeTime(r.createdAt)}
                        </span>
                      </div>

                      <p className="text-sm text-surface-300">{r.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 🔥 REPLY INPUT */}
            {activeReply === c._id && (
              <div className="ml-10 flex items-center gap-2 mt-2">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm text-white"
                />

                <button
                  onClick={() => handleReply(c._id)}
                  className="px-3 py-1.5 text-xs bg-brand-600 text-white rounded-lg"
                >
                  Reply
                </button>
              </div>
            )}

          </div>
        ))}

      </div>
    )}

    {/* 🔥 ADD COMMENT */}
    {isAuthenticated && (
      <form
        onSubmit={handleSendComment}
        className="flex items-center gap-3 px-5 py-3 border-t border-dark-border"
      >
        <UserAvatar user={currentUser} size="sm" />

        <div className="flex-1 flex items-center gap-2">
          <input
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm text-white"
          />

          <button
            type="submit"
            disabled={!comment.trim()}
            className="p-2 rounded-xl bg-brand-600 text-white disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    )}

  </div>
)}
      </article>

      <LoginPromptModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={() => { setShowLogin(false); navigate('/login') }}
        onRegister={() => { setShowLogin(false); navigate('/register') }}
      />
    </>
  )
}