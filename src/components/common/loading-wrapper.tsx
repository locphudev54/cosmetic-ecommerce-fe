'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import TopLoader, { TopLoaderRef } from './top-loader'

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() // Show TopLoader on route changes
  // const searchParams = useSearchParams() // Uncomment if you want to track search params as well
  const loaderRef = useRef<TopLoaderRef>(null)

  useEffect(() => {
    // Start loading on route change
    loaderRef.current?.start()

    // Simulate progress
    const interval = setInterval(() => {
      loaderRef.current?.progress(Math.random() * 50 + 50)
    }, 200)

    // Complete after a short delay
    const timeout = setTimeout(() => {
      loaderRef.current?.complete()
      clearInterval(interval)
    }, 1000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [pathname])

  return (
    <>
      <TopLoader ref={loaderRef} />
      {children}
    </>
  )
}
