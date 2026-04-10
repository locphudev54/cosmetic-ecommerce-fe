'use client'

import React from 'react'
import { ROUTES } from '@/constants/route.constant'
import { useAddToCart } from '@/features/cart/hooks/use-cart'
import ProductDetailDialog from '@/features/product/components/product-detail-dialog'
import { Product } from '@/features/product/types'
import { cn, handleApiError } from '@/lib/utils'
import { formatNumberToVnCurrency } from '@/utilts/client.utils'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { ProductDocument } from '@/features/search/types/search.types'

/**
 * Base type representing the minimum fields ProductCard needs.
 * Both `Product` (from PG via home page) and `ProductDocument` (from ES via collection page)
 * satisfy this type, so ProductCard works with both data sources.
 */
// export type ProductCardData = Pick<Product, 'slug' | 'name' | 'basePrice'> & {
//   brand?: { name: string } | null
//   images?: Array<{ url: string }> | null
// }

interface Props {
  product: ProductDocument
}

export default function ProductCard(props: Props) {
  const { product } = props
  // const lowestVariantSellingPrice =
  //   product.variants?.reduce((lowest, variant) => {
  //     const variantPrice = +variant.sellingPrice
  //     return variantPrice < lowest ? variantPrice : lowest
  //   }, Infinity) ?? 0

  const addToCartMutation = useAddToCart()
  const [isQuickViewOpen, setIsQuickViewOpen] = React.useState(false)

  const productImages = (product.images ?? []).map((image) => image.url).filter(Boolean)
  const variantImage = product.variants?.find((variant) => variant.imageUrl)?.imageUrl ?? null
  const primaryImage = productImages[0] ?? variantImage ?? '/placeholder-image.svg'
  const secondaryImage =
    productImages[1] ?? (productImages[0] ? variantImage : null) ?? '/placeholder-image.svg'

  const handleAddToCard = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await addToCartMutation.mutateAsync({
        productVariantId: product.variants?.[0]?.id || '', // For simplicity, we add the first variant. In real app, you'd let user choose.
        quantity: 1
      })
      toast.success('Sản phẩm đã được thêm vào giỏ hàng!')
    } catch (error) {
      handleApiError(error)
    }
  }

  return (
    <React.Fragment>
      <Link
        href={ROUTES.PRODUCTS.DETAIL(product.slug)}
        className='group block rounded-md border border-gray-100 bg-white p-1.5 text-center text-sm shadow-md transition-shadow duration-300 hover:border-gray-200 hover:shadow-lg'
      >
        <div className='relative'>
          {/* Thumbnail */}
          <div className='relative aspect-square overflow-hidden'>
            <div className='absolute inset-0 transform transition-transform duration-500 group-hover:-translate-x-full'>
              <Image
                width={0}
                height={0}
                sizes='100vw'
                src={primaryImage}
                className='h-full w-full object-cover'
                alt={product.name}
              />
            </div>
            <div className='absolute inset-0 translate-x-full transform transition-transform duration-500 group-hover:translate-x-0'>
              <Image
                width={0}
                height={0}
                sizes='100vw'
                src={secondaryImage}
                className='h-full w-full object-cover'
                alt={product.name}
              />
            </div>
          </div>

          <div
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsQuickViewOpen(true)
            }}
            role='button'
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                setIsQuickViewOpen(true)
              }
            }}
            aria-label='Xem nhanh sản phẩm'
            className='absolute top-[19%] left-[50%] flex aspect-square w-10 -translate-x-[50%] items-center justify-center rounded-full bg-white opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-[#5e5656]'
          >
            <div
              className={cn('aspect-square w-6 bg-[#5e5656] transition-colors hover:bg-white')}
              style={{
                WebkitMaskImage: `url(${'/eye.svg'})`,
                maskImage: `url(${'/eye.svg'})`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskPosition: 'center'
              }}
            />
          </div>

          {/* Brand */}
          <span className='text-tiny mt-4 line-clamp-1 min-h-5 font-medium text-gray-400'>
            {product.brand?.name}
          </span>

          {/* Name */}
          <h3 className='mt-2 line-clamp-2 min-h-10 font-medium text-black'>{product.name}</h3>

          {/* Base Price */}
          <div className='text-business-secondary mt-2.5 font-bold'>
            {formatNumberToVnCurrency(+product.basePrice)}
          </div>

          {/* Lowest Selling Price */}
          {/* <div className='text-business-secondary mt-2.5 font-bold'>
            {formatNumberToVnCurrency(lowestVariantSellingPrice)}
          </div> */}

          {/* basePrice */}
          {/* <div className='mt-2.5 font-normal text-gray-400/80 line-through'>
            {formatNumberToVnCurrency(+product.basePrice)}
          </div> */}

          {/* Add to cart */}
          <button
            onClick={handleAddToCard}
            className='mt-5 mb-2 inline-flex cursor-pointer items-center gap-x-2 rounded-full border border-white pl-2.5 font-bold uppercase transition-colors duration-300 hover:border-black'
          >
            <span className='text-[12px]'>Thêm vào giỏ</span>
            <div className='flex h-9 w-9 items-center justify-center rounded-full bg-black'>
              <div className='flex aspect-square w-4 items-center justify-center'>
                <div
                  className={cn('aspect-square w-4 bg-white')}
                  style={{
                    WebkitMaskImage: `url(${'/shopping-bag.svg'})`,
                    maskImage: `url(${'/shopping-bag.svg'})`,
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center'
                  }}
                />
              </div>
            </div>
          </button>
        </div>
      </Link>
      {/* <ProductDetailDialog
        product={product}
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
      /> */}
    </React.Fragment>
  )
}
