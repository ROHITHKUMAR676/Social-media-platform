import React, { useState } from 'react'
import { Search, Filter, Compass } from 'lucide-react'
import Layout from '../components/layout/Layout'
import ForumCard from '../components/forum/ForumCard'
import { useForums } from '../context/ForumContext'
import { Skeleton } from '../components/common/Loader'

const CATEGORIES = ['All', 'Frontend', 'Backend', 'AI/ML', 'Infrastructure', 'Business']

export default function Forums() {
  const { forums, isLoading } = useForums()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = forums.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || f.category === category
    return matchSearch && matchCat
  })

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Compass className="w-6 h-6 text-brand-400" />
          <h1 className="font-display font-bold text-white text-2xl">Communities</h1>
        </div>
        <p className="text-surface-500 text-sm">Discover and join tech communities that match your skills.</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search communities..."
            className="w-full input-base pl-10"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              category === cat
                ? 'bg-brand-600 text-white shadow-brand'
                : 'bg-dark-card border border-dark-border text-surface-400 hover:text-white hover:border-surface-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
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
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Compass className="w-12 h-12 text-surface-700 mx-auto mb-4" />
          <h3 className="font-display font-bold text-white text-xl mb-2">No communities found</h3>
          <p className="text-surface-500 text-sm">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(forum => (
            <ForumCard key={forum.id} forum={forum} />
          ))}
        </div>
      )}
    </Layout>
  )
}