import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import LogoutButton from '@/features/auth/components/logout-button'
import { ChevronDown, User } from 'lucide-react'
import Link from 'next/link'

export default function UserMenu() {
  const isLoggedIn = false // Replace with actual authentication logic

  return (
    <div className='border-l border-l-gray-700 pl-7'>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {isLoggedIn ? (
            <div className='flex cursor-pointer items-center gap-x-1 py-0.5 text-left'>
              <div>
                <div>Xin chào:</div>
                <div className='max- line-clamp-1'>Pham Phu Loc</div>
              </div>
              <ChevronDown size={15} />
            </div>
          ) : (
            <div className='flex cursor-pointer items-center gap-x-2 font-normal'>
              <User strokeWidth={1} size={24} />
              <div>
                <div>Đăng nhập/Đăng ký</div>
                <div className='mt-[2px] flex items-center gap-x-1'>
                  <span className='mr-2'>Tài khoản của tôi</span>
                  <ChevronDown size={15} />
                </div>
              </div>
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!isLoggedIn && (
            <DropdownMenuItem>
              <Link href='#' className='w-full'>
                Đăng nhập
              </Link>
            </DropdownMenuItem>
          )}
          {/* {session?.user?.role !== Role.Customer && (
            <DropdownMenuItem>
              <Link href={managePath.dashboard} className='w-full'>
                Quản lý
              </Link>
            </DropdownMenuItem>
          )} */}
          {isLoggedIn && <LogoutButton />}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
