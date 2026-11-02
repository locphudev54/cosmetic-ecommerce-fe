import { TypographyH3 } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ChevronDown, Grid, LayoutGrid, List, Upload } from 'lucide-react'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxBadgeItem,
  ComboboxBadgeList,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger
} from '@/components/ui/combobox'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro']

export default function MediaManagementPanel() {
  return (
    <Card>
      <CardContent className='flex flex-col gap-y-3'>
        <CardTitle>
          <div className='flex items-center justify-between'>
            <TypographyH3>Thư viện ảnh</TypographyH3>
            <Button variant={'outline'}>
              <Upload className='' />
              Thêm file
            </Button>
          </div>
        </CardTitle>
        <Separator className='my-1.5 h-[0.5px]' />

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-x-3'>
            <Input placeholder='Tìm kiếm toàn bộ...' />
            <Combobox>
              <ComboboxAnchor>
                <ComboboxInput placeholder='Chọn thuộc tính' />
                <ComboboxTrigger>
                  <ChevronDown className='h-4 w-4' />
                </ComboboxTrigger>
              </ComboboxAnchor>
              <ComboboxContent className='custom-scrollbar max-h-75 overflow-x-hidden overflow-y-auto'>
                <ComboboxEmpty>
                  <div>Không tìm thấy thuộc tính nào</div>
                </ComboboxEmpty>
                {/* Selecting option built from remote state - Attribute Remote State */}
                {frameworks.map((item) => (
                  <ComboboxItem key={item} value={item}>
                    <span>{item}</span>
                  </ComboboxItem>
                ))}
              </ComboboxContent>
            </Combobox>
          </div>
          <div className='flex items-center gap-x-2'>
            {/* Grid and Row view modes buttons */}
            <Button variant={'outline'} size={'icon'}>
              <LayoutGrid className='' />
            </Button>
            <Button variant={'outline'} size={'icon'}>
              <List className='' />
            </Button>
          </div>
        </div>
        <Separator className='my-1.5 h-[1.5px]!' />

        <div className='grid grid-cols-7'>
          <div className='col-span-1'>Folder trê</div>
          <div className='col-span-6'>
            <div className='flex items-center justify-between'>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href='#'>Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size='icon-sm' variant='ghost'>
                          <BreadcrumbEllipsis />
                          <span className='sr-only'>Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='start'>
                        <DropdownMenuGroup>
                          <DropdownMenuItem>Documentation</DropdownMenuItem>
                          <DropdownMenuItem>Themes</DropdownMenuItem>
                          <DropdownMenuItem>GitHub</DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href='#'>Components</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className='flex items-center gap-x-2'>
                <Input placeholder='Tìm kiếm trong thư mục...' />
                <Button>Xóa file</Button>
              </div>
            </div>
            <div className='mt-4 grid grid-cols-6'>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
