import React, { createContext, useContext, useEffect, useState } from 'react'
import { forumService } from '../services/forumService'
import { useAuth } from './AuthContext'

const ForumContext = createContext(null)

export function ForumProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [forums, setForums] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadForums = async () => {
    setIsLoading(true)
    try {
      const data = await forumService.getForums()
      setForums(data)
    } catch (err) {
      console.error(err)
      setForums([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadForums()
  }, [isAuthenticated])

  const joinForum = async (forumId) => {
    const updatedForum = await forumService.joinForum(forumId)
    setForums((prev) => prev.map((forum) => (forum.id === forumId ? updatedForum : forum)))
    return updatedForum
  }

  return (
    <ForumContext.Provider value={{ forums, isLoading, joinForum, refreshForums: loadForums }}>
      {children}
    </ForumContext.Provider>
  )
}

export const useForums = () => {
  const ctx = useContext(ForumContext)
  if (!ctx) throw new Error('useForums must be used within ForumProvider')
  return ctx
}
