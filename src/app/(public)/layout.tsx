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
      <main className='grow'>
        <React.Suspense
          fallback={
            <div className='flex min-h-[50vh] items-center justify-center'>
              Vui lòng truy cập lại website sau khoảng 5 phút nếu có lỗi xảy ra
            </div>
          }
        >
          {children}
        </React.Suspense>
      </main>
      <Footer />
    </React.Fragment>
  )
}
