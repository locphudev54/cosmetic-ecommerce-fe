'use client'

import * as React from 'react'

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

function useIsBelowBreakpoint(breakpoint: number) {
  const [isBelow, setIsBelow] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const onChange = () => {
      setIsBelow(window.innerWidth < breakpoint)
    }
    mql.addEventListener('change', onChange)
    setIsBelow(window.innerWidth < breakpoint)
    return () => mql.removeEventListener('change', onChange)
  }, [breakpoint])

  return !!isBelow
}

function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  return useIsBelowBreakpoint(breakpoint)
}

function useIsTablet(breakpoint = TABLET_BREAKPOINT) {
  return useIsBelowBreakpoint(breakpoint)
}

export { useIsMobile, useIsTablet }
