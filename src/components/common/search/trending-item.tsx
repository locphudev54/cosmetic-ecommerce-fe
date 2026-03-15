import React from 'react'
import { TrendingUp } from 'lucide-react'

interface TrendingItemProps {
  query: string
  count: number
  onSelect: (query: string) => void
}

export const TrendingItem: React.FC<TrendingItemProps> = ({ query, count, onSelect }) => (
  <button
    onClick={() => onSelect(query)}
    className='flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100'
  >
    <div className='flex items-center gap-2'>
      <TrendingUp className='h-4 w-4 text-orange-500' />
      <span className='text-gray-700'>{query}</span>
    </div>
    <span className='text-xs text-gray-400'>{count.toLocaleString()}</span>
  </button>
)
