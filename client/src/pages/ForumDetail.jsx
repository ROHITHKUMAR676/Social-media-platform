import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, ArrowLeft } from 'lucide-react'
import Layout from '../components/layout/Layout'
import ForumHeader from '../components/forum/ForumHeader'
import ForumPost from '../components/forum/ForumPost'
import ForumMembers from '../components/forum/ForumMembers'
import ForumApplication from '../components/forum/ForumApplication'
import { useAuth } from '../context/AuthContext'
import { useForums } from '../context/ForumContext'
import { LoginPromptModal } from '../components/common/Modal'
import { Skeleton } from '../components/common/Loader'
import { calculateProfileMatch } from '../utils/helpers'
import { FORUM_POSTS } from '@/data/mockData'

export default function ForumDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { forums, applyToForum } = useForums()
  const [forum, setForum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [tab, setTab] = useState('posts')

  useEffect(() => {
    setTimeout(() => {
      setForum(forums.find(f => f.slug === slug) || null)
      setLoading(false)
    }, 400)
  }, [slug, forums])

  const handleApply = async () => {
    if (!isAuthenticated) { setShowLogin(true); return }
    setApplying(true)
    await applyToForum(forum.id)
    setForum(prev => ({ ...prev, memberStatus: 'applied' }))
    setApplying(false)
  }

  const matchPercent = calculateProfileMatch(user?.skills, forum?.requiredSkills)
  const forumPosts = FORUM_POSTS.filter(p => p.forumId === forum?.id)

  if (loading) {
    return (
      <Layout>
        <div className="space-y-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </Layout>
    )
  }

  if (!forum) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-surface-500">Community not found.</p>
          <button onClick={() => navigate('/forums')} className="btn-secondary mt-4 mx-auto">
            <ArrowLeft className="w-4 h-4" /> Back to Forums
          </button>
        </div>
      </Layout>
    )
  }

  const rightContent = (
    <div className="space-y-4">
      <ForumMembers forum={forum} />
      {isAuthenticated && forum.memberStatus === 'none' && (
        <ForumApplication forum={forum} onApplied={() => setForum(p => ({ ...p, memberStatus: 'applied' }))} />
      )}
    </div>
  )

  return (
    <>
      <Layout rightPanel={rightContent}>
        <div className="space-y-4">
          {/* Back */}
          <button
            onClick={() => navigate('/forums')}
            className="flex items-center gap-2 text-sm text-surface-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Communities
          </button>

          {/* Forum Header */}
          <ForumHeader
            forum={forum}
            onApply={handleApply}
            applying={applying}
            matchPercent={isAuthenticated ? matchPercent : 0}
          />

          {/* Tab bar */}
          <div className="flex gap-1 p-1 bg-dark-card border border-dark-border rounded-2xl">
            {['posts', 'members', 'about'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                  tab === t ? 'bg-brand-600 text-white' : 'text-surface-500 hover:text-white hover:bg-dark-hover'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Posts */}
          {tab === 'posts' && (
            <div className="space-y-4">
              {forum.memberStatus === 'approved' && (
                <button className="w-full flex items-center gap-3 p-4 bg-dark-card border border-dark-border rounded-2xl text-surface-500 hover:text-white hover:border-brand-500/30 transition-all text-sm">
                  <Plus className="w-4 h-4" /> Start a discussion in {forum.name}...
                </button>
              )}
              {forumPosts.length === 0 ? (
                <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center">
                  <p className="text-surface-500">No posts yet. Be the first to start a discussion!</p>
                </div>
              ) : (
                forumPosts.map(post => <ForumPost key={post.id} post={post} />)
              )}
            </div>
          )}

          {tab === 'members' && (
            <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
              <ForumMembers forum={forum} />
            </div>
          )}

          {tab === 'about' && (
            <div className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">About</h3>
                <p className="text-surface-400 text-sm leading-relaxed">{forum.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Category</h3>
                <span className="skill-tag">{forum.category}</span>
              </div>
            </div>
          )}
        </div>
      </Layout>

      <LoginPromptModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={() => { setShowLogin(false); navigate('/login') }}
        onRegister={() => { setShowLogin(false); navigate('/register') }}
      />
    </>
  )
}