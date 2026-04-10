'use client'

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle
} from '@/components/ui/responsive-dialog'
import type { Product } from '@/features/product/types'
import { cn } from '@/lib/utils'
import { formatNumberToVnCurrency } from '@/utilts/client.utils'
import Image from 'next/image'
import React from 'react'

interface GalleryImage {
  id: string
  src: string
  alt: string
}

interface ProductDetailDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProductDetailDialog({
  product,
  open,
  onOpenChange
}: ProductDetailDialogProps) {
  const galleryImages = React.useMemo<GalleryImage[]>(() => {
    const productImages = (product.images ?? []).map((image) => ({
      id: image.id,
      src: image.url,
      alt: image.altText ?? product.name ?? 'product-image'
    }))

    const variantImages = (product.variants ?? [])
      .filter((variant) => !!variant.imageUrl)
      .map((variant) => ({
        id: `variant-${variant.id}`,
        src: variant.imageUrl as string,
        alt: variant.name || product.name || 'variant-image'
      }))

    const seen = new Set<string>()
    const merged = [...productImages, ...variantImages].filter((image) => {
      if (seen.has(image.src)) return false
      seen.add(image.src)
      return true
    })

    return merged.length > 0
      ? merged
      : [
          {
            id: 'placeholder',
            src: '/placeholder-image.svg',
            alt: product.name ?? 'product-image'
          }
        ]
  }, [product.images, product.name, product.variants])

  const [selectedIndex, setSelectedIndex] = React.useState(0)

  React.useEffect(() => {
    if (!open) return
    setSelectedIndex(0)
  }, [open, product.id])

  React.useEffect(() => {
    if (selectedIndex >= galleryImages.length) {
      setSelectedIndex(0)
    }
  }, [galleryImages.length, selectedIndex])

  const selectedImage = galleryImages[selectedIndex] ?? galleryImages[0]
  const stockOnHand = product.variants?.[0]?.stockOnHand ?? 0
  const sellingPrice = product.variants?.[0]?.sellingPrice ?? product.basePrice

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className='max-w-5xl'>
        <div className='grid gap-6 md:grid-cols-2'>
          <div>
            <div className='relative aspect-square overflow-hidden rounded-md border border-gray-100 bg-white'>
              <Image
                src={selectedImage?.src ?? '/placeholder-image.svg'}
                className='h-full w-full object-contain'
                alt={selectedImage?.alt ?? product.name}
                width={0}
                height={0}
                sizes='100vw'
              />
            </div>

            <div className='custom-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1'>
              {galleryImages.map((image, index) => (
                <button
                  key={`${image.id}-thumb`}
                  type='button'
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    'aspect-square w-20 shrink-0 cursor-pointer overflow-hidden rounded-md border bg-white',
                    index === selectedIndex ? 'border-business-secondary' : 'border-gray-100'
                  )}
                >
                  <Image
                    src={image.src}
                    className='h-full w-full object-contain'
                    alt={image.alt}
                    width={0}
                    height={0}
                    sizes='100vw'
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <ResponsiveDialogHeader className='text-left'>
              <ResponsiveDialogTitle className='text-2xl font-bold capitalize'>
                {product.name}
              </ResponsiveDialogTitle>
            </ResponsiveDialogHeader>

            <div className='mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px]'>
              <div className='flex items-center gap-x-1 border-r border-r-gray-100 pr-3'>
                <span>Mã sản phẩm:</span>
                <span className='font-bold'>{product.code}</span>
              </div>
              <div className='flex items-center gap-x-1 border-r border-r-gray-100 pr-3'>
                <span>Tình trạng:</span>
                <span className='font-bold'>{stockOnHand > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
              </div>
              <div className='flex items-center gap-x-1'>
                <span>Thương hiệu:</span>
                <span className='font-bold'>{product.brand?.name ?? 'Đang cập nhật'}</span>
              </div>
            </div>

            <div className='mt-4 rounded-md bg-gray-50 px-4 py-5'>
              <div className='flex items-center gap-x-2'>
                <span className='text-business-secondary text-2xl font-bold'>
                  {formatNumberToVnCurrency(Number(sellingPrice))}
                </span>
                <span className='text-sm font-medium text-gray-500'>(Đã bao gồm VAT)</span>
              </div>
              <div className='mt-0.5 text-[15px] font-bold text-gray-500'>
                Giá hãng {formatNumberToVnCurrency(Number(product.basePrice))}
              </div>
            </div>
          </div>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
