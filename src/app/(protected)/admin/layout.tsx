'use client'
import { AppSidebar } from '@/components/common/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React, { Suspense } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    document.body.classList.add('admin-font')
    document.body.classList.add('font-normal')

    return () => {
      document.body.classList.remove('admin-font')
      document.body.classList.remove('font-normal')
    }
  }, [])

  return (
    <div className='admin-font font-normal'>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className='bg-admin-background flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1' />
              <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className='hidden md:block'>
                    <BreadcrumbLink href='#'>Products</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className='hidden md:block' />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Create new</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className='bg-admin-background flex flex-1 flex-col pt-0'>
            <Suspense fallback={<div>Admin Pages Loading - Phu Loc 52200103...</div>}>
              <div className='admin-page-container'>{children}</div>
            </Suspense>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
