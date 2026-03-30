import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { ROUTES } from '@/constants/route.constant'
import CollectionPageLoadingSkeleton from '@/features/product/components/collection-page-loading-skeleton'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='grow'>
      <React.Suspense
        fallback={
          <div className='customer-page-container'>
            <CollectionPageLoadingSkeleton />
          </div>
        }
      >
        <div className='customer-page-container'>
          {/* Breadcums */}
          <Breadcrumb className='py-2 font-normal'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='#'>Danh mục</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {/* Active */}
                <BreadcrumbLink href={ROUTES.COLLECTIONS.ALL}>
                  <BreadcrumbPage>Tất cả sản phẩm</BreadcrumbPage>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className=''>{children}</div>
        </div>
      </React.Suspense>
    </main>
  )
}
