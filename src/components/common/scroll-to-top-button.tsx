'use client'
import { cn } from '@/lib/utils'
import { ArrowUp } from 'lucide-react'
import React from 'react'
import { animateScroll as scroll, scrollSpy } from 'react-scroll'

export default function ScrollToTopButton() {
  const [showScrollButton, setShowScrollButton] = React.useState(false)

  React.useEffect(() => {
    scrollSpy.update()

    const handleScroll = () => {
      const scrollTop = window.scrollY
      setShowScrollButton(scrollTop > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    scroll.scrollToTop()
  }

  return (
    <button
      className={cn(
        'bg-business-primary fixed right-8 bottom-16 flex aspect-square w-12 items-center justify-center rounded-full font-semibold transition-opacity duration-200 ease-in-out lg:bottom-4',
        { 'pointer-events-none opacity-0': !showScrollButton, 'opacity-100': showScrollButton }
      )}
      onClick={scrollToTop}
    >
      <ArrowUp size={19} />
    </button>
  )
}
