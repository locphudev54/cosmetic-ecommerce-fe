import React from 'react'
import { Clock, X } from 'lucide-react'

interface HistoryItemProps {
  query: string
  onSelect: (query: string) => void
  onRemove: (query: string) => void
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ query, onSelect, onRemove }) => (
  <button
    onClick={() => onSelect(query)}
    className='flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-slate-100'
  >
    <div className='flex items-center gap-2'>
      <Clock className='h-4 w-4 text-gray-400' />
      {query}
    </div>
    <button
      onClick={(e) => {
        e.stopPropagation()
        onRemove(query)
      }}
      className='rounded p-1 hover:bg-slate-200'
    >
      <X className='h-4 w-4 text-gray-400' />
    </button>
  </button>
)
