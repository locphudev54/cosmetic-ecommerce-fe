'use client'

import { BookOpen, GalleryVerticalEnd, Package2, Settings2 } from 'lucide-react'
import * as React from 'react'

import { NavMain } from '@/components/common/nav-main'
import { NavUser } from '@/components/common/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'
import { ROUTES } from '@/constants/route.constant'
import Link from 'next/link'

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Link href={ROUTES.HOME}>
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <GalleryVerticalEnd className='size-4' />
                </div>
              </Link>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>Phu Loc</span>
                <span className='truncate text-xs'>E-commerce</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={[
            {
              title: 'Sản phẩm',
              url: ROUTES.ADMIN.PRODUCT.HOME,
              icon: Package2,
              isActive: true,
              items: [
                {
                  title: 'Danh sách',
                  url: ROUTES.ADMIN.PRODUCT.HOME
                },
                {
                  title: 'Tạo mới',
                  url: ROUTES.ADMIN.PRODUCT.NEW
                },
                {
                  title: 'Thuộc tính',
                  url: ROUTES.ADMIN.ATTRIBUTE.HOME
                },
                {
                  title: 'Thương hiệu',
                  url: ROUTES.ADMIN.BRAND.HOME
                },
                {
                  title: 'Xuất xứ',
                  url: ROUTES.ADMIN.COUNTRY_OF_ORIGIN.HOME
                }
              ]
            },
            {
              title: 'Danh mục',
              url: ROUTES.ADMIN.CATEGORY.HOME,
              icon: BookOpen,
              isActive: true,
              items: [
                {
                  title: 'Danh sách',
                  url: ROUTES.ADMIN.CATEGORY.HOME
                },
                {
                  title: 'Tạo mới',
                  url: ROUTES.ADMIN.CATEGORY.NEW
                }
              ]
            },
            {
              title: 'Bộ sưu tập',
              url: ROUTES.ADMIN.COLLECTION.HOME,
              icon: Settings2,
              isActive: true,
              items: [
                {
                  title: 'Danh sách',
                  url: ROUTES.ADMIN.COLLECTION.HOME
                },
                {
                  title: 'Tạo mới',
                  url: ROUTES.ADMIN.COLLECTION.NEW
                }
              ]
            }
          ]}
        />
        {/* <NavProjects
          projects={[
            {
              name: 'Design Engineering',
              url: '#',
              icon: Frame
            },
            {
              name: 'Sales & Marketing',
              url: '#',
              icon: PieChart
            },
            {
              name: 'Travel',
              url: '#',
              icon: PieChart
              // icon: Map
            }
          ]}
        /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: 'shadcn',
            email: 'm@example.com',
            avatar: '/avatars/shadcn.jpg'
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
