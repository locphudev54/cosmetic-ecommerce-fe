'use client'

import React from 'react'
import { motion, type Transition } from 'motion/react'
import { AdvancedSearchBar } from '@/components/common/advanced-search-bar'
import Cart from '@/features/cart/components/cart'
import UserMenu from '@/components/common/user-menu'
import { CircleCheckBig, Medal, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const SCROLL_TOP_THRESHOLD = 12
const SCROLL_DELTA = 6
const SCROLL_HIDE_DISTANCE = 32
const SCROLL_SHOW_DISTANCE = 24
const TOGGLE_COOLDOWN = 200
const TRANSITION: Transition = { duration: 0.68, ease: [0.16, 1, 0.3, 1] }

type HeaderMode = 'full' | 'compact'

function FullHeader({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <div className='bg-black py-5'>
      <div className='customer-page-container'>
        <div className='grid grid-cols-12'>
          <div className='col-span-2'>
            <Link href={'/'}>
              <Image
                alt='abbeauty-logo'
                height={55}
                width={210}
                className='h-14 w-52 object-cover'
                src={'/logo.webp'}
              />
            </Link>
          </div>

          <div className='col-span-6 col-start-4'>
            <AdvancedSearchBar
              onSearch={onSearch}
              placeholder="Try searching 'iPhone', 'laptop'...x"
            />

            <div className='text-business-primary mt-3 flex items-center gap-x-2 text-[13px] 2xl:gap-x-5'>
              <div className='flex items-center gap-x-1'>
                <Medal strokeWidth={1} size={16} />
                <span>Đảm bảo chất lượng</span>
              </div>
              <div className='flex items-center gap-x-1'>
                <Truck strokeWidth={1} size={16} />
                <span>Miễn phí vận chuyển</span>
              </div>
              <div className='flex items-center gap-x-1'>
                <CircleCheckBig strokeWidth={1} size={16} />
                <span>Mở hộp kiểm tra nhận hàng</span>
              </div>
            </div>
          </div>

          <div className='col-span-3'>
            <div className='text-business-primary flex items-center justify-end gap-x-3.5 text-sm font-normal'>
              <UserMenu />
              <Cart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompactHeader({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <div className='bg-black py-2'>
      <div className='customer-page-container'>
        <div className='grid grid-cols-12 items-center gap-y-2'>
          <div className='col-span-3'>
            <Link href={'/'}>
              <Image
                alt='abbeauty-logo'
                height={40}
                width={160}
                className='h-10 w-40 object-cover'
                src={'/logo.webp'}
              />
            </Link>
          </div>

          <div className='col-span-6'>
            <AdvancedSearchBar
              onSearch={onSearch}
              placeholder="Try searching 'iPhone', 'laptop'...x"
              className='max-w-[560px]'
            />
          </div>

          <div className='col-span-3'>
            <div className='text-business-primary flex items-center justify-end gap-x-3.5 text-sm font-normal'>
              <UserMenu />
              <Cart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Header() {
  const [mode, setMode] = React.useState<HeaderMode>('full')
  const [isHidden, setIsHidden] = React.useState(false)
  const [headerHeight, setHeaderHeight] = React.useState(0)
  const headerRef = React.useRef<HTMLDivElement>(null)
  const lastScrollY = React.useRef(0)
  const upTravel = React.useRef(0)
  const downTravel = React.useRef(0)
  const lastToggleTime = React.useRef(0)
  const modeRef = React.useRef<HeaderMode>('full')
  const isHiddenRef = React.useRef(false)

  const handleSearch = (query: string) => {
    console.log('Searching for:', query)
  }

  React.useEffect(() => {
    modeRef.current = mode
  }, [mode])

  React.useEffect(() => {
    isHiddenRef.current = isHidden
  }, [isHidden])

  React.useEffect(() => {
    if (!headerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setHeaderHeight(entry.contentRect.height)
      }
    })

    observer.observe(headerRef.current)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    lastScrollY.current = window.scrollY
    let ticking = false

    const updateScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastScrollY.current
      const absDelta = Math.abs(delta)

      if (absDelta < SCROLL_DELTA) {
        ticking = false
        return
      }

      if (currentY <= SCROLL_TOP_THRESHOLD) {
        upTravel.current = 0
        downTravel.current = 0
        setMode('full')
        setIsHidden(false)
      } else {
        const now = performance.now()
        const cooldownPassed = now - lastToggleTime.current > TOGGLE_COOLDOWN

        if (delta > 0) {
          downTravel.current += absDelta
          upTravel.current = 0

          if (
            downTravel.current >= SCROLL_HIDE_DISTANCE &&
            cooldownPassed &&
            !isHiddenRef.current
          ) {
            setIsHidden(true)
            lastToggleTime.current = now
          }
        } else {
          upTravel.current += absDelta
          downTravel.current = 0

          if (upTravel.current >= SCROLL_SHOW_DISTANCE && cooldownPassed) {
            if (modeRef.current !== 'compact') {
              setMode('compact')
            }

            if (isHiddenRef.current) {
              setIsHidden(false)
            }

            lastToggleTime.current = now
          }
        }
      }

      lastScrollY.current = currentY
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const hideOffset = headerHeight ? -headerHeight : -120
  const shouldCompact = mode === 'compact'

  return (
    <>
      <motion.div
        aria-hidden='true'
        className='w-full'
        animate={{ height: isHidden ? 0 : headerHeight }}
        transition={TRANSITION}
      />
      <motion.div
        ref={headerRef}
        className={`fixed top-0 left-0 z-50 w-full ${isHidden ? 'pointer-events-none' : ''}`}
        // animate={{ y: isHidden ? hideOffset : 0, opacity: isHidden ? 0 : 1 }}
        transition={TRANSITION}
      >
        {shouldCompact ? (
          <CompactHeader onSearch={handleSearch} />
        ) : (
          <FullHeader onSearch={handleSearch} />
        )}
      </motion.div>
    </>
  )
}
