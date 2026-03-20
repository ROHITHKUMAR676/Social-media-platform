import React, { createContext, useContext, useState, useEffect } from 'react'
import { forumService } from '../services/forumService'
import { useAuth } from './AuthContext'

const ForumContext = createContext(null)

export function ForumProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [forums, setForums] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    forumService.getForums().then(data => {
      setForums(data)
      setIsLoading(false)
    })
  }, [])

  const applyToForum = async (forumId) => {
    const result = await forumService.applyToForum(forumId)
    if (result.success) {
      setForums(prev =>
        prev.map(f => f.id === forumId ? { ...f, memberStatus: 'applied' } : f)
      )
    }
    return result
  }

  return (
    <ForumContext.Provider value={{ forums, isLoading, applyToForum }}>
      {children}
    </ForumContext.Provider>
  )
}

export const useForums = () => {
  const ctx = useContext(ForumContext)
  if (!ctx) throw new Error('useForums must be used within ForumProvider')
  return ctx
}