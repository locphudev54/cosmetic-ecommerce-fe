import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const SearchSkeleton: React.FC = () => (
  <div className="space-y-2 p-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-3">
        <Skeleton className="w-12 h-12 rounded flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    ))}
  </div>
)
