import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
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
      <HoverCard>
        <HoverCardTrigger asChild>
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
        </HoverCardTrigger>
        <HoverCardContent align='end' className='w-48 p-0'>
          <div className='px-3 py-2 text-sm font-medium'>Tài khoản của tôi</div>
          <div className='bg-border h-px' />
          <div className='py-1'>
            {!isAuthenticated && (
              <Link
                href={ROUTES.AUTH.LOGIN}
                className='hover:bg-accent hover:text-accent-foreground block w-full px-3 py-2 text-sm'
              >
                Đăng nhập
              </Link>
            )}
            {isAuthenticated && user?.role !== UserRole.CUSTOMER && (
              <Link
                href={ROUTES.ADMIN.HOME}
                className='hover:bg-accent hover:text-accent-foreground block w-full px-3 py-2 text-sm'
              >
                Trang quản trị
              </Link>
            )}
            {isAuthenticated && <LogoutButton />}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
