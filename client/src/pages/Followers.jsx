import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Users, UserPlus, UserCheck } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { SkillTag } from '../components/common/Badge'
import UserAvatar from '@/components/common/UserAvatar'
import { userService } from '../services/userService'

const getUserId = (user) => user?._id?.toString() || user?.id?.toString() || null

export default function Followers() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user: currentUser, isAuthenticated, updateFollowing } = useAuth()
  const [followers, setFollowers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [followLoadingId, setFollowLoadingId] = useState(null)

  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const targetUsername = params.get('user') || currentUser?.username || ''
  const isOwnList = Boolean(currentUser?.username && targetUsername === currentUser.username)

  const followingIds = useMemo(
    () => new Set((currentUser?.following || []).map((id) => id.toString())),
    [currentUser]
  )

  useEffect(() => {
    if (!targetUsername) {
      setFollowers([])
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchFollowers = async () => {
      setLoading(true)
      setError('')

      try {
        const res = await userService.getFollowers(targetUsername)

        if (!isMounted) return

        setFollowers(res.users || [])
      } catch (err) {
        if (!isMounted) return

        console.error(err)
        setError(err.message || 'Failed to load followers')
        setFollowers([])
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchFollowers()

    return () => {
      isMounted = false
    }
  }, [targetUsername])

  const handleFollowToggle = async (person) => {
    const personId = getUserId(person)

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (!personId || followLoadingId) return

    setFollowLoadingId(personId)

    try {
      const res = await userService.toggleFollow(personId)
      updateFollowing(personId, res.isFollowing)
    } catch (err) {
      console.error(err)
    } finally {
      setFollowLoadingId(null)
    }
  }

  const title = isOwnList ? 'Followers' : `${targetUsername}'s Followers`

  return (
    <Layout>
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-brand-400" />
        <h1 className="font-display font-bold text-white text-2xl">{title}</h1>
        {!loading && (
          <span className="text-surface-500 text-sm font-normal ml-1">({followers.length})</span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-dark-card border border-dark-border rounded-2xl p-4 flex items-start gap-4 animate-pulse"
            >
              <div className="w-14 h-14 rounded-xl bg-dark-hover flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-dark-hover rounded" />
                <div className="h-3 w-32 bg-dark-hover rounded" />
                <div className="h-3 w-full bg-dark-hover rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8 text-center">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      ) : followers.length === 0 ? (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center">
          <Users className="w-12 h-12 text-surface-700 mx-auto mb-4" />
          <h3 className="font-display font-bold text-white text-xl mb-2">No followers yet</h3>
          <p className="text-surface-500 text-sm">
            {isOwnList ? 'When people follow you, they will show up here.' : 'This user has no followers yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {followers.map((person) => {
            const personId = getUserId(person)
            const isOwnProfile = personId === getUserId(currentUser)
            const isFollowingPerson = followingIds.has(personId)

            return (
              <div
                key={personId}
                className="bg-dark-card border border-dark-border rounded-2xl p-4 flex items-start gap-4 hover:border-surface-700/60 transition-all"
              >
                <Link to={`/profile/${person.username}`} className="flex-shrink-0">
                  <UserAvatar user={person} size="lg" shape="rounded" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/profile/${person.username}`}>
                        <p className="font-semibold text-white hover:text-brand-400 transition-colors">
                          {person.name}
                        </p>
                      </Link>
                      <p className="text-xs text-surface-500 mb-1">
                        @{person.username}
                        {person.role ? ` - ${person.role}` : ''}
                      </p>
                      <p className="text-sm text-surface-400 line-clamp-1">
                        {person.bio || 'No bio added yet.'}
                      </p>
                    </div>
                    {!isOwnProfile && isAuthenticated && (
                      <button
                        onClick={() => handleFollowToggle(person)}
                        disabled={followLoadingId === personId}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isFollowingPerson
                            ? 'bg-dark-hover border border-dark-border text-surface-400'
                            : 'bg-brand-600 text-white hover:bg-brand-500 shadow-brand'
                        } ${followLoadingId === personId ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        {followLoadingId === personId ? (
                          '...'
                        ) : isFollowingPerson ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" /> Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" /> Follow
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(person.skills || []).slice(0, 3).map((skill) => (
                      <SkillTag key={skill} skill={skill} size="xs" />
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
