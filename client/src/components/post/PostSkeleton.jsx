import React from 'react'
import { Skeleton, AvatarSkeleton, TextSkeleton } from '../common/Loader'

export default function PostSkeleton() {
  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3">
        <AvatarSkeleton size="md" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      {/* Content */}
      <TextSkeleton lines={3} />
      {/* Tags */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-lg" />
        <Skeleton className="h-6 w-20 rounded-lg" />
      </div>
      {/* Actions */}
      <div className="flex gap-4 pt-1 border-t border-dark-border">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  )
}