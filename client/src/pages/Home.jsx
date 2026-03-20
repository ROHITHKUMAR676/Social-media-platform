import React, { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Globe } from 'lucide-react'
import Layout from '../components/layout/Layout'
import RightPanel from '../components/layout/RightPanel'
import PostCard from '../components/post/PostCard'
import CreatePost from '../components/post/CreatePost'
import PostSkeleton from '../components/post/PostSkeleton'
import { useAuth } from '../context/AuthContext'
import { MOCK_POSTS } from '@/data/mockData'

const TABS = [
  { id: 'smart', label: 'For You', icon: Sparkles },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'global', label: 'Global', icon: Globe },
]

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('smart')

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const sorted = [...MOCK_POSTS].sort((a, b) => {
        if (tab === 'trending') return b.likes - a.likes
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
      setPosts(sorted)
      setLoading(false)
    }, 800)
  }, [tab])

  const handleNewPost = (post) => {
    setPosts(prev => [post, ...prev])
  }

  return (
    <Layout rightPanel={<RightPanel />}>
      {/* Tab bar */}
      <div className="flex items-center gap-1 p-1 bg-dark-card border border-dark-border rounded-2xl mb-5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              tab === id
                ? 'bg-brand-600 text-white shadow-brand'
                : 'text-surface-500 hover:text-surface-300 hover:bg-dark-hover'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Create post */}
      {isAuthenticated && user?.profileCompleted && (
        <div className="mb-5">
          <CreatePost onPost={handleNewPost} />
        </div>
      )}

      {/* Guest banner */}
      {!isAuthenticated && (
        <div className="mb-5 p-4 bg-gradient-to-r from-brand-950 to-dark-card border border-brand-900/30 rounded-2xl">
          <h3 className="font-display font-bold text-white mb-1">Join the conversation 🚀</h3>
          <p className="text-surface-400 text-sm mb-3">Connect with thousands of developers, share knowledge, and grow your career.</p>
          <div className="flex gap-2">
            <a href="/register" className="btn-primary text-sm px-4 py-2">Get started free</a>
            <a href="/login" className="btn-secondary text-sm px-4 py-2">Sign in</a>
          </div>
        </div>
      )}

      {/* Feed */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
        ) : posts.length === 0 ? (
          <EmptyFeed />
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </Layout>
  )
}

function EmptyFeed() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-3xl bg-dark-card border border-dark-border flex items-center justify-center mb-5 shadow-card">
        <Sparkles className="w-9 h-9 text-brand-400" />
      </div>
      <h3 className="font-display font-bold text-white text-xl mb-2">Your feed awaits</h3>
      <p className="text-surface-500 text-sm max-w-xs">
        Follow developers and join communities to personalize your feed.
      </p>
    </div>
  )
}