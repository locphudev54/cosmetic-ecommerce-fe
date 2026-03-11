'use client'

import { BookOpen, Bot, GalleryVerticalEnd, Settings2, SquareTerminal } from 'lucide-react'
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher
          teams={[
            {
              name: 'Acme Inc',
              logo: GalleryVerticalEnd,
              plan: 'Enterprise'
            }
          ]}
        /> */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <GalleryVerticalEnd className='size-4' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>Acme Inc</span>
                <span className='truncate text-xs'>Enterprise</span>
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
              icon: SquareTerminal,
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
                  title: 'Danh mục',
                  url: ROUTES.ADMIN.CATEGORY.HOME
                },
                {
                  title: 'Thuộc tính',
                  url: '#'
                }
              ]
            },
            {
              title: 'Models',
              url: '#',
              icon: Bot,
              items: [
                {
                  title: 'Genesis',
                  url: '#'
                },
                {
                  title: 'Explorer',
                  url: '#'
                },
                {
                  title: 'Quantum',
                  url: '#'
                }
              ]
            },
            {
              title: 'Documentation',
              url: '#',
              icon: BookOpen,
              items: [
                {
                  title: 'Introduction',
                  url: '#'
                },
                {
                  title: 'Get Started',
                  url: '#'
                },
                {
                  title: 'Tutorials',
                  url: '#'
                },
                {
                  title: 'Changelog',
                  url: '#'
                }
              ]
            },
            {
              title: 'Settings',
              url: '#',
              icon: Settings2,
              items: [
                {
                  title: 'General',
                  url: '#'
                },
                {
                  title: 'Team',
                  url: '#'
                },
                {
                  title: 'Billing',
                  url: '#'
                },
                {
                  title: 'Limits',
                  url: '#'
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
              icon: Map
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
