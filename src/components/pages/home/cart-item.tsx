import { Product } from '@/features/product/types'
import { formatNumberToVnCurrency } from '@/utilts/client.utils'
import Image from 'next/image'
import Link from 'next/link'

export interface ISkuItem {
  _id: string
  sku: string
  product: Omit<Product, 'variants'> & { _id: string }
  barcode: string
  costPrice: number
  stockOnHand: number
  attributes: {
    value: string
    name: string
  }[]
  sellingPrice: number
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export interface ICartItem {
  sku: ISkuItem
  quantity: number
  createdAt: string
  updatedAt: string
}

interface Props {
  cartItem: ICartItem
}

export default function CartItem({ cartItem }: Props) {
  const { sku } = cartItem
  return (
    <Link
      href='#'
      className='border-b border-b-gray-200 pr-2 pb-2 duration-200 last:border-b-0 last:pb-0 hover:bg-gray-100'
    >
      <div className='flex items-start gap-x-2 p-1'>
        <div className='h-20 w-20 shrink-0'>
          <Image
            width={0}
            height={0}
            sizes='100vw'
            alt={sku.product.name}
            // src={sku.imageUrl || sku.product.imageUrl || '/placeholder-image.svg'}
            src={'/placeholder-image.svg'}
            className='h-full w-full object-contain'
          />
        </div>
        <div>
          <div className='line-clamp-2 font-semibold text-black'>{sku.product.name}</div>

          <div className='text-[13px] font-normal text-gray-600'>
            {sku.attributes.map((att) => att.value).join(' - ')}
          </div>

          <span className='mt-1 text-xs font-medium text-black'>x{cartItem.quantity}</span>
        </div>
      </div>
      <div className='text-right'>
        <div className='font-semibold text-black'>{formatNumberToVnCurrency(sku.sellingPrice)}</div>
        {/* Sale price */}
        {/* <span className="relative mt-0.5 font-extralight text-gray-500 before:absolute before:left-[50%] before:h-[0.75px] before:w-[100%] before:-translate-x-[50%] before:translate-y-2.5 before:bg-gray-500 before:content-['']">
                        {formatNumberToVnCurrencyV2(item.product.price)}
                      </span> */}
      </div>
    </Link>
  )
}
