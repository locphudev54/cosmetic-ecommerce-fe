import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/constants/route.constant'
import { UserRole } from '@/enums'
import LogoutButton from '@/features/auth/components/logout-button'
import { useAuthStore } from '@/stores/auth-store'
import { ChevronDown, User } from 'lucide-react'
import Link from 'next/link'

export default function UserMenu() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <div className='border-l border-l-gray-700 pl-7'>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {isAuthenticated ? (
            <div className='flex cursor-pointer items-center gap-x-1 py-0.5 text-left'>
              <div>
                <div>Xin chào:</div>
                <div className='max- line-clamp-1'>{user?.fullName}</div>
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
          {!isAuthenticated && (
            <DropdownMenuItem>
              <Link href={ROUTES.AUTH.LOGIN} className='w-full'>
                Đăng nhập
              </Link>
            </DropdownMenuItem>
          )}
          {isAuthenticated && user?.role !== UserRole.CUSTOMER && (
            <DropdownMenuItem>
              <Link href={ROUTES.ADMIN.HOME} className='w-full'>
                Trang quản trị
              </Link>
            </DropdownMenuItem>
          )}
          {isAuthenticated && <LogoutButton />}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
