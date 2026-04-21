import React, { useMemo, useState } from 'react'
import { Search, Compass } from 'lucide-react'
import Layout from '../components/layout/Layout'
import ForumCard from '../components/forum/ForumCard'
import { useForums } from '../context/ForumContext'
import { Skeleton } from '../components/common/Loader'

export default function Forums() {
  const { forums, isLoading } = useForums()
  const [search, setSearch] = useState('')

  const filteredForums = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return forums

    return forums.filter((forum) =>
      forum.name.toLowerCase().includes(query) ||
      forum.description.toLowerCase().includes(query) ||
      forum.skillsRequired.some((skill) => skill.toLowerCase().includes(query))
    )
  }, [forums, search])

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Compass className="w-6 h-6 text-brand-400" />
          <h1 className="font-display font-bold text-white text-2xl">Skill-Based Forums</h1>
        </div>
        <p className="text-surface-500 text-sm">
          Join communities that align with your skills and unlock posting access as your match improves.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by forum name, description, or skill..."
          className="w-full input-base pl-10"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden animate-pulse">
              <Skeleton className="h-16 rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredForums.length === 0 ? (
        <div className="text-center py-20 bg-dark-card border border-dark-border rounded-2xl">
          <Compass className="w-12 h-12 text-surface-700 mx-auto mb-4" />
          <h3 className="font-display font-bold text-white text-xl mb-2">No forums matched</h3>
          <p className="text-surface-500 text-sm">Try a different skill or keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredForums.map((forum) => (
            <ForumCard key={forum.id} forum={forum} />
          ))}
        </div>
      )}
    </Layout>
  )
}
