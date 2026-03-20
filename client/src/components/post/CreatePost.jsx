import React, { useState } from 'react'
import { Image, Code, Hash, X, Send } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import UserAvatar from '../common/UserAvatar'
export default function CreatePost({ onPost }) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [code, setCode] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [focused, setFocused] = useState(false)

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const tag = tagInput.trim().replace(/^#/, '')
      if (tag && !tags.includes(tag) && tags.length < 5) {
        setTags(p => [...p, tag])
      }
      setTagInput('')
    }
  }

  const removeTag = (tag) => setTags(p => p.filter(t => t !== tag))

  const handlePost = async () => {
    if (!content.trim()) return
    setIsPosting(true)
    await new Promise(r => setTimeout(r, 600))
    const newPost = {
      id: 'p' + Date.now(),
      author: user,
      content,
      codeSnippet: showCode && code ? code : null,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      tags,
      liked: false,
      bookmarked: false,
    }
    onPost?.(newPost)
    setContent('')
    setCode('')
    setTags([])
    setShowCode(false)
    setFocused(false)
    setIsPosting(false)
  }

  return (
    <div className={`bg-dark-card border rounded-2xl transition-all duration-200 ${
      focused ? 'border-brand-500/30 shadow-glow' : 'border-dark-border'
    }`}>
      <div className="p-4">
        <div className="flex gap-3">
          <UserAvatar user={user} size="md" />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Share something with the dev community..."
              rows={focused ? 4 : 2}
              className="w-full bg-transparent text-white placeholder-surface-600 text-sm resize-none focus:outline-none leading-relaxed transition-all"
            />
          </div>
        </div>

        {/* Code block */}
        {showCode && (
          <div className="mt-3 rounded-xl bg-dark-bg border border-dark-border overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between px-4 py-2 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-brand-400" />
                <span className="text-xs text-surface-500 font-mono">code snippet</span>
              </div>
              <button onClick={() => { setShowCode(false); setCode('') }} className="text-surface-600 hover:text-surface-300">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="// Paste your code here..."
              rows={5}
              className="w-full bg-transparent px-4 py-3 text-xs font-mono text-green-400 placeholder-surface-700 focus:outline-none resize-none"
            />
          </div>
        )}

        {/* Tags */}
        {(focused || tags.length > 0) && (
          <div className="mt-3 animate-slide-up">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map(tag => (
                <span key={tag} className="skill-tag flex items-center gap-1">
                  #{tag}
                  <button onClick={() => removeTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-surface-600 flex-shrink-0" />
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="Add tags (press Enter)..."
                className="flex-1 bg-transparent text-sm text-surface-300 placeholder-surface-700 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      {focused && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-dark-border animate-slide-up">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowCode(p => !p)}
              className={`p-2 rounded-lg transition-all text-sm font-medium flex items-center gap-1.5 ${
                showCode ? 'text-brand-400 bg-brand-600/10' : 'text-surface-500 hover:text-surface-300 hover:bg-dark-hover'
              }`}
            >
              <Code className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">Code</span>
            </button>
            <button className="p-2 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-dark-hover transition-all">
              <Image className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${content.length > 900 ? 'text-red-400' : 'text-surface-600'}`}>
              {content.length}/1000
            </span>
            <button
              onClick={handlePost}
              disabled={!content.trim() || isPosting || content.length > 1000}
              className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
            >
              {isPosting ? (
                <span className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Posting...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  Post
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}