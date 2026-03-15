'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import React from 'react'

interface RichTextDescriptionProps {
  content?: string | null
  hasExpandButton?: boolean
  collapsedHeight?: number
  className?: string
}

export default function RichTextDescription({
  content,
  hasExpandButton = false,
  collapsedHeight = 220,
  className
}: RichTextDescriptionProps) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = React.useState(false)
  const [measuredHeight, setMeasuredHeight] = React.useState(0)
  const [isCollapsible, setIsCollapsible] = React.useState(false)

  React.useLayoutEffect(() => {
    if (!contentRef.current) return
    const height = contentRef.current.scrollHeight
    setMeasuredHeight(height)
    setIsCollapsible(height > collapsedHeight)
  }, [content, collapsedHeight])

  if (!content) {
    return <div className={cn('text-sm text-gray-700', className)}>Chua co mo ta.</div>
  }

  const showToggle = hasExpandButton && isCollapsible
  const targetHeight = !showToggle || expanded ? measuredHeight : collapsedHeight

  return (
    <div className={cn('relative', className)}>
      <motion.div
        initial={false}
        animate={{ height: targetHeight }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className='overflow-hidden'
      >
        <div
          ref={contentRef}
          className='space-y-3 text-sm leading-7 text-gray-700'
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </motion.div>

      {showToggle && !expanded && (
        <div className='pointer-events-none absolute inset-x-0 bottom-9 h-16 bg-gradient-to-t from-white to-transparent' />
      )}

      {showToggle && (
        <div className='mt-3 flex items-center justify-center'>
          <Button type='button' onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? 'Thu gọn' : 'Xem thêm'}
          </Button>
        </div>
      )}
    </div>
  )
}
