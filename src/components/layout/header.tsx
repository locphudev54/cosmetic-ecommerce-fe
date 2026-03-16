'use client'

import { AdvancedSearchBar } from '@/components/common/advanced-search-bar'
import Cart from '@/components/pages/home/cart'
import UserMenu from '@/components/pages/home/user-menu'
import { Product } from '@/features/product/types'
import { CircleCheckBig, Medal, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query)
  }

  const handleProductSelect = (product: Product) => {
    console.log('Product selected:', product)
  }

  return (
    <div className='bg-black py-5'>
      <div className='customer-page-container'>
        <div className='grid grid-cols-12'>
          <div className='col-span-2'>
            <Link href={'/'}>
              <Image
                alt='abbeauty-logo'
                height={55}
                width={210}
                className='h-14 w-52 object-cover'
                src={'/logo.webp'}
              />
            </Link>
          </div>

          <div className='col-span-6 col-start-4'>
            {/* <Search Bar /> */}
            <AdvancedSearchBar
              onSearch={handleSearch}
              onProductSelect={handleProductSelect}
              placeholder="Try searching 'iPhone', 'laptop'..."
            />

            <div className='text-business-primary mt-3 flex items-center gap-x-2 text-[13px] 2xl:gap-x-5'>
              <div className='flex items-center gap-x-1'>
                <Medal strokeWidth={1} size={16} />
                <span>Đảm bảo chất lượng</span>
              </div>
              <div className='flex items-center gap-x-1'>
                <Truck strokeWidth={1} size={16} />
                <span>Miễn phí vận chuyển</span>
              </div>
              <div className='flex items-center gap-x-1'>
                <CircleCheckBig strokeWidth={1} size={16} />
                <span>Mở hộp kiểm tra nhận hàng</span>
              </div>
            </div>
          </div>

          {/* User Menu Dropdown */}
          <div className='col-span-3'>
            <div className='text-business-primary flex items-center justify-end gap-x-3.5 text-sm font-normal'>
              <UserMenu />
              <Cart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
