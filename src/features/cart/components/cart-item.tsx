import { ROUTES } from '@/constants/route.constant'
import { CartItemType } from '@/features/cart/types/cart.types'
import { formatNumberWithCommas } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  cartItem: CartItemType
}

export default function CartItem({ cartItem }: Props) {
  const { productVariant } = cartItem
  const product = productVariant.product
  const productImage =
    productVariant.imageUrl || product.images?.[0]?.url || '/placeholder-image.svg'

  const attributeString = productVariant.attributeValues
    ?.map((av) => av.attributeValue.value)
    .join(' - ')

  return (
    <Link
      href={ROUTES.PRODUCTS.DETAIL(product.slug)}
      className='border-b border-b-gray-200 pr-2 pb-2 duration-200 last:border-b-0 last:pb-0 hover:bg-gray-100'
    >
      <div className='flex items-start gap-x-2 p-1'>
        <div className='h-20 w-20 shrink-0'>
          <Image
            width={40}
            height={40}
            alt={product.name}
            src={productImage}
            className='h-full w-full object-contain'
          />
        </div>
        <div>
          <div className='text-tiny line-clamp-2 font-semibold text-black'>{product.name}</div>

          {attributeString && (
            <div className='text-xs font-normal text-gray-600'>{attributeString}</div>
          )}

          <span className='mt-1 text-xs font-medium text-black'>x{cartItem.quantity}</span>
        </div>
      </div>
      <div className='text-right'>
        <div className='font-semibold text-black'>
          ₫{formatNumberWithCommas(Number(productVariant.sellingPrice))}
        </div>
      </div>
    </Link>
  )
}
