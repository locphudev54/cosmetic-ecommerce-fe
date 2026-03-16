import { ROUTES } from '@/constants/route.constant'
import { Product } from '@/features/product/types'
import { formatNumberToVnCurrency } from '@/utilts/client.utils'
import { Eye, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  product: Product
}

export default function ProductCard(props: Props) {
  const { product } = props

  debugger

  return (
    <Link
      href={ROUTES.PRODUCTS.DETAIL(product.slug)}
      className='group block rounded-md border border-gray-100 bg-white p-1.5 text-center text-sm shadow-md transition-shadow duration-300 hover:border-gray-200 hover:shadow-lg'
    >
      <div className='relative'>
        {/* Thumbnail */}
        <div className='aspect-square'>
          <Image
            width={0}
            height={0}
            sizes='100vw'
            src={product.images?.[0]?.url || '/placeholder-image.png'}
            className='h-full w-full object-cover'
            alt={product.name}
          />
        </div>

        <div className='absolute top-[19%] left-[50%] flex h-10 w-10 -translate-x-[50%] items-center justify-center rounded-full bg-white text-lg text-[#6d6565] opacity-0 transition-all duration-500 group-hover:opacity-100 hover:bg-[#5e5656] hover:text-white'>
          <Eye size={18} />
        </div>

        {/* Discount percent */}
        {/* {product.discountPercentage > 0 && (
          <span className='bg-originalRed absolute left-0 top-0 rounded-sm px-1.5 py-1 text-xs text-white'>
            {product.discountPercentage + '%'}
          </span>
        )} */}

        {/* Brand */}
        <span className='mt-4 line-clamp-1 min-h-5 text-[13px] font-medium text-gray-400'>
          {product.brand?.name}
        </span>

        {/* Name */}
        <h3 className='mt-2 line-clamp-2 min-h-10 font-medium text-black'>{product.name}</h3>

        {/* basePrice */}
        <div className='text-business-secondary mt-2.5 font-bold'>
          {formatNumberToVnCurrency(+product.basePrice)}
        </div>

        {/* stockONHand */}
        {/* Original price */}
        {/* {product.salePrice < product.price && (
          <React.Fragment>
            <span className="relative font-extralight text-gray-400 before:absolute before:left-[50%] before:h-[0.75px] before:w-[100%] before:-translate-x-[50%] before:translate-y-2.5 before:bg-gray-400 before:content-['']">
              {formatNumberToVnCurrency(product.basePrice)}
            </span>
            <div className='mt-3 flex items-end gap-x-1'>
              <div className='aspect-[3/2] h-6 pl-1.5'>
                <Image
                  sizes='100vw'
                  width={0}
                  height={0}
                  className="h-full w-full object-cover animate-scale"
                  alt='sale-icon'
                  src={'/hot-deal-icon.webp'}
                />
              </div>
              <span className='ml-3 text-xs font-medium text-[#ff6f27]'>Chỉ còn {product.stockQuantity} sản phẩm</span>
            </div>
          </React.Fragment>
        )} */}

        {/* Add to cart */}
        <button className='mt-5 mb-2 inline-flex items-center gap-x-2 rounded-full border border-white pl-2.5 font-bold uppercase transition-colors duration-300 hover:border-black'>
          <span className='text-[12px]'>Thêm vào giỏ</span>
          <div className='flex h-9 w-9 items-center justify-center rounded-full bg-black'>
            <ShoppingBag color='white' size={16} />
          </div>
        </button>
      </div>
    </Link>
  )
}
