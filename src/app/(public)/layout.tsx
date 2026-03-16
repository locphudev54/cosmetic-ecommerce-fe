import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import NavMenu from '@/components/pages/home/nav-menu'
import React from 'react'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <Header />
      <div className='bg-business-primary'>
        <div className='customer-page-container'>
          <NavMenu />
        </div>
      </div>
      <main className='gorw'>
        <React.Suspense fallback={'Loading homepage'}>{children}</React.Suspense>
      </main>
      <Footer />
    </React.Fragment>
  )
}
