import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
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
  )
}
