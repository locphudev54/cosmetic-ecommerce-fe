import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='grow'>
      <React.Suspense fallback={<div>Cart Page loading...</div>}>
        <div className='customer-page-container'>{children}</div>
      </React.Suspense>
    </main>
  )
}
