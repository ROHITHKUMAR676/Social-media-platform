import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Lock, MessageSquare, PenSquare } from 'lucide-react'
import Layout from '../components/layout/Layout'
import ForumHeader from '../components/forum/ForumHeader'
import PostCard from '../components/post/PostCard'
import CreatePost from '../components/post/CreatePost'
import { LoginPromptModal } from '../components/common/Modal'
import { Skeleton } from '../components/common/Loader'
import { useAuth } from '../context/AuthContext'
import { useForums } from '../context/ForumContext'
import { postService } from '../services/postService'

export default function ForumDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { forums, isLoading: forumsLoading, joinForum } = useForums()
  const [forum, setForum] = useState(null)
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [joining, setJoining] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const matchedForum = forums.find((item) => item.id === id) || null
    if (matchedForum) {
      setForum(matchedForum)
    }
  }, [forums, id])

  useEffect(() => {
    const fetchForumPosts = async () => {
      setLoadingPosts(true)
      try {
        const res = await postService.getForumPosts(id)
        setForum(res.forum)
        setPosts(res.posts)
      } catch (err) {
        console.error(err)
        setPosts([])
      } finally {
        setLoadingPosts(false)
      }
    }

    fetchForumPosts()
  }, [id])

  const handleJoin = async () => {
    if (!isAuthenticated) {
      setShowLogin(true)
      return
    }

    setJoining(true)
    try {
      const updatedForum = await joinForum(id)
      setForum(updatedForum)
    } finally {
      setJoining(false)
    }
  }

  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev])
    setForum((prev) => prev ? { ...prev, postsCount: (prev.postsCount || 0) + 1 } : prev)
  }

  const permissionMessage = useMemo(() => {
    if (!forum) return ''
    if (forum.permissions?.canPost) return 'You can post and comment in this forum.'
    if (forum.permissions?.canComment) return 'You can comment here. Reach 71%+ match to create posts.'
    return 'View only. Reach at least 40% skill match to comment.'
  }, [forum])

  const permissionIcon = forum?.permissions?.canPost
    ? PenSquare
    : forum?.permissions?.canComment
      ? MessageSquare
      : Lock

  if (forumsLoading && !forum) {
    return (
      <Layout>
        <div className="space-y-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </Layout>
    )
  }

  if (!forum && !loadingPosts) {
    return (
      <Layout>
        <div className="text-center py-20 bg-dark-card border border-dark-border rounded-2xl">
          <p className="text-surface-500">Forum not found.</p>
          <button onClick={() => navigate('/forums')} className="btn-secondary mt-4 mx-auto">
            <ArrowLeft className="w-4 h-4" /> Back to Forums
          </button>
        </div>
      </Layout>
    )
  }

  const PermissionIcon = permissionIcon

  return (
    <>
      <Layout>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/forums')}
            className="flex items-center gap-2 text-sm text-surface-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Forums
          </button>

          {forum && (
            <ForumHeader
              forum={forum}
              onJoin={handleJoin}
              joining={joining}
              matchPercent={isAuthenticated ? forum.matchPercent : null}
            />
          )}

          {forum && (
            <div className="bg-dark-card border border-dark-border rounded-2xl p-4 flex items-start gap-3">
              <div className={`mt-0.5 p-2 rounded-xl ${
                forum.permissions?.canPost
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : forum.permissions?.canComment
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-red-500/10 text-red-400'
              }`}>
                <PermissionIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Participation level</p>
                <p className="text-sm text-surface-500">{permissionMessage}</p>
              </div>
            </div>
          )}

          {forum?.permissions?.canPost && (
            <CreatePost
              onPost={handleNewPost}
              placeholder={`Start a conversation in ${forum.name}...`}
              submitLabel="Publish"
              postPayload={{ forumId: forum.id }}
              typeOptions={[
                { label: 'Post', value: 'post' },
                { label: 'Question', value: 'question' },
              ]}
            />
          )}

          {loadingPosts ? (
            <div className="space-y-4">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center">
              <p className="text-surface-500">No forum posts yet. Once someone starts the first discussion, it’ll show up here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  canComment={Boolean(forum?.permissions?.canComment)}
                  commentPermissionMessage={forum?.permissions?.canComment ? '' : 'Commenting is locked until you reach a 40% skill match for this forum.'}
                />
              ))}
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
