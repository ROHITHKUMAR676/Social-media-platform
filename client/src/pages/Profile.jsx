import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  MapPin, Link as LinkIcon, Calendar, Users, FileText,
  MessageSquare, UserPlus, UserCheck, Edit, CheckCheck,
  Briefcase, Code2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/layout/Layout'
import PostCard from '../components/post/PostCard'
import PostSkeleton from '../components/post/PostSkeleton'
import { SkillTag } from '../components/common/Badge'
import { formatNumber } from '../utils/helpers'
import { userService } from '@/services/userService'
import { postService } from '@/services/postService'
import { format } from 'date-fns'
import UserAvatar from '../components/common/UserAvatar'

export default function Profile() {
  const { username } = useParams()
  const { user: currentUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [profileUser, setProfileUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const [tab, setTab] = useState('posts')

  const isOwnProfile = currentUser?.username === username
 const handleFollow = async () => {
  if (!profileUser?._id) return

  try {
    const res = await userService.toggleFollow(profileUser._id)
    setFollowing(res.isFollowing)

    // update followers count
    setProfileUser(prev => ({
      ...prev,
      followers: res.followers
    }))
  } catch (err) {
    console.error(err)
  }
}
 useEffect(() => {
  const fetchProfile = async () => {
    setLoading(true)

    try {
      let userData

      if (isOwnProfile) {
        const res = await userService.getMe()
        userData = res.user
      } else {
        const res = await userService.getUserByUsername(username)
        userData = res.user
      }
      setProfileUser(userData)
      if (!isOwnProfile && currentUser) {
  const isFollowingUser = userData.followers?.includes(currentUser._id)
  setFollowing(isFollowingUser)
}
      // fetch posts
      const postRes = await postService.getUserPosts(username)
      setUserPosts(postRes.posts || [])

    } catch (err) {
      console.error(err)
      setProfileUser(null)
    }

    setLoading(false)
  }

  fetchProfile()
}, [username, isOwnProfile])

  if (loading) {
    return (
      <Layout>
        <div className="space-y-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden animate-pulse">
            <div className="h-32 bg-dark-hover" />
            <div className="p-5 space-y-3">
              <div className="w-20 h-20 rounded-full bg-dark-hover -mt-12 border-4 border-dark-card" />
              <div className="h-5 w-40 bg-dark-hover rounded" />
              <div className="h-4 w-64 bg-dark-hover rounded" />
            </div>
          </div>
          {[1,2].map(i => <PostSkeleton key={i} />)}
        </div>
      </Layout>
    )
  }

  if (!profileUser) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-surface-500">User not found.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-4">
        {/* Profile Card */}
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          {/* Cover */}
          <div className="h-28 bg-gradient-to-br from-brand-900 via-brand-950 to-dark-bg relative">
            <div className="absolute inset-0 opacity-30"
              style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(97,114,245,0.4) 0%, transparent 60%)' }}
            />
          </div>

          <div className="px-5 pb-5">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="relative">
                <UserAvatar
                  user={profileUser}
                  size="xl"
                  shape="rounded"
                  className="border-4 border-dark-card"
                />
                {profileUser.isOnline && (
                  <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-dark-card" />
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                {isOwnProfile ? (
                  <Link to="/create-profile" className="btn-secondary text-xs px-3 py-1.5 gap-1.5">
                    <Edit className="w-3.5 h-3.5" /> Edit Profile
                  </Link>
                ) : isAuthenticated ? (
                  <>
                    <button
                      onClick={() => navigate('/messages')}
                      className="btn-secondary text-xs px-3 py-1.5 gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Message
                    </button>
                    <button
                      onClick={handleFollow}
                      className={following ? 'btn-secondary text-xs px-3 py-1.5 gap-1.5' : 'btn-primary text-xs px-3 py-1.5 gap-1.5'}
                    >
                      {following ? (
                        <><UserCheck className="w-3.5 h-3.5" /> Following</>
                      ) : (
                        <><UserPlus className="w-3.5 h-3.5" /> Follow</>
                      )}
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            {/* Name & role */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="font-display font-bold text-white text-xl">{profileUser.name}</h1>
                {profileUser.verified && <CheckCheck className="w-4 h-4 text-brand-400" />}
              </div>
              <p className="text-surface-500 text-sm">@{profileUser.username}</p>
              {profileUser.role && (
                <p className="text-surface-300 text-sm mt-1 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-surface-600" />
                  {profileUser.role}{profileUser.company && ` @ ${profileUser.company}`}
                </p>
              )}
            </div>

            {/* Bio */}
            {profileUser.bio && (
              <p className="text-surface-300 text-sm leading-relaxed mb-3">{profileUser.bio}</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4 text-xs text-surface-500">
              {profileUser.location && (
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profileUser.location}</span>
              )}
              {profileUser.website && (
                <a href={profileUser.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-brand-400 hover:text-brand-300 transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  {profileUser.website.replace(/https?:\/\//, '')}
                </a>
              )}
              {profileUser.joined && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {format(new Date(profileUser.joined), 'MMM yyyy')}
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mb-4 pb-4 border-b border-dark-border">
              <Link to="/followers" className="text-center group">
                <p className="font-display font-bold text-white text-lg group-hover:text-brand-400 transition-colors">
                  {formatNumber(profileUser.followers?.length || 0)}
                </p>
                <p className="text-xs text-surface-600">Followers</p>
              </Link>
              <Link to="/following" className="text-center group">
                <p className="font-display font-bold text-white text-lg group-hover:text-brand-400 transition-colors">
                  {formatNumber(profileUser.following?.length || 0)}
                </p>
                <p className="text-xs text-surface-600">Following</p>
              </Link>
              <div className="text-center">
                <p className="font-display font-bold text-white text-lg">{userPosts.length}</p>
                <p className="text-xs text-surface-600">Posts</p>
              </div>
            </div>

            {/* Skills */}
            {profileUser.skills?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4 text-surface-600" />
                  <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Skills</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profileUser.skills.map(skill => <SkillTag key={skill} skill={skill} />)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-dark-card border border-dark-border rounded-2xl">
          {['posts', 'activity'].map(t => (
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
            {userPosts.length === 0 ? (
              <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center">
                <FileText className="w-10 h-10 text-surface-700 mx-auto mb-3" />
                <p className="text-surface-500">No posts yet.</p>
              </div>
            ) : (
              userPosts.map(post => <PostCard key={post.id} post={post} />)
            )}
          </div>
        )}

        {tab === 'activity' && (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-8 text-center">
            <p className="text-surface-500 text-sm">Activity feed coming soon.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}