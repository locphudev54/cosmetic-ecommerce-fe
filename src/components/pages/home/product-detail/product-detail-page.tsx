'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import NextJsImage from '@/components/common/next-js-image'
import { ROUTES } from '@/constants/route.constant'
import RichTextDescription from '@/components/common/rich-text-description'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import QuantitySelect from '@/features/product/components/quantity-select'
import { useProductBySlug } from '@/features/product/hooks'
import type { ProductVariant } from '@/features/product/types'
import { cn } from '@/lib/utils'
import type { CarouselImage } from '@/types/carousel'
import { formatNumberToVnCurrency } from '@/utilts/client.utils'
import { Box, Phone, Truck } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import type { RenderThumbnailProps } from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

const Lightbox = dynamic(() => import('yet-another-react-lightbox'), {
  ssr: false
})

interface ProductDetailPageProps {
  slug: string
}

type AttributeValueOption = {
  id: string
  value: string
}

type AttributeOption = {
  id: string
  name: string
  values: AttributeValueOption[]
}

type GalleryImage = {
  id: string
  src: string
  alt: string
  type: 'product' | 'variant'
  variantId?: string
  attributes?: Record<string, string>
}

export default function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const { data: product, isLoading } = useProductBySlug(slug)

  const variants = React.useMemo(() => product?.variants ?? [], [product?.variants])

  const attributes = React.useMemo<AttributeOption[]>(() => {
    const attributeMap = new Map<string, AttributeOption>()

    variants.forEach((variant) => {
      variant.attributeValues?.forEach((item) => {
        const attribute = item.attributeValue?.attribute
        const value = item.attributeValue

        if (!attribute?.id || !value?.id) return

        if (!attributeMap.has(attribute.id)) {
          attributeMap.set(attribute.id, {
            id: attribute.id,
            name: attribute.name,
            values: []
          })
        }

        const entry = attributeMap.get(attribute.id)
        if (!entry) return

        if (!entry.values.some((option) => option.id === value.id)) {
          entry.values.push({ id: value.id, value: value.value })
        }
      })
    })

    return Array.from(attributeMap.values())
  }, [variants])

  const [selectedAttributes, setSelectedAttributes] = React.useState<Record<string, string>>({})
  const [buyCount, setBuyCount] = React.useState<number>(1)
  const [galleryApi, setGalleryApi] = React.useState<CarouselApi | null>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [lightboxIndex, setLightboxIndex] = React.useState(-1)

  React.useEffect(() => {
    if (!variants.length) return

    const firstVariant = variants[0]
    const initialSelection: Record<string, string> = {}

    firstVariant.attributeValues?.forEach((item) => {
      const attributeId = item.attributeValue?.attribute?.id
      const valueId = item.attributeValue?.id

      if (attributeId && valueId) {
        initialSelection[attributeId] = valueId
      }
    })

    setSelectedAttributes(initialSelection)
  }, [variants])

  const matchesSelection = React.useCallback(
    (variant: ProductVariant, selection: Record<string, string>) => {
      const variantValues = variant.attributeValues ?? []
      return Object.entries(selection).every(([attributeId, valueId]) =>
        variantValues.some(
          (item) =>
            item.attributeValue?.id === valueId &&
            item.attributeValue?.attribute?.id === attributeId
        )
      )
    },
    []
  )

  const selectedVariant = React.useMemo(() => {
    if (!variants.length) return null
    return variants.find((variant) => matchesSelection(variant, selectedAttributes)) ?? variants[0]
  }, [matchesSelection, selectedAttributes, variants])

  const buildVariantSelection = React.useCallback((variant: ProductVariant) => {
    const selection: Record<string, string> = {}

    variant.attributeValues?.forEach((item) => {
      const attributeId = item.attributeValue?.attribute?.id
      const valueId = item.attributeValue?.id

      if (attributeId && valueId) {
        selection[attributeId] = valueId
      }
    })

    return selection
  }, [])

  const galleryImages = React.useMemo<GalleryImage[]>(() => {
    const productImages = (product?.images ?? []).map((image) => ({
      id: image.id,
      src: image.url,
      alt: image.altText ?? product?.name ?? 'product-image',
      type: 'product' as const
    }))

    const variantImages = variants
      .filter((variant) => !!variant.imageUrl)
      .map((variant) => ({
        id: `variant-${variant.id}`,
        src: variant.imageUrl as string,
        alt: variant.name || product?.name || 'variant-image',
        type: 'variant' as const,
        variantId: variant.id,
        attributes: buildVariantSelection(variant)
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
            alt: product?.name ?? 'product-image',
            type: 'product' as const
          }
        ]
  }, [buildVariantSelection, product?.images, product?.name, variants])

  const lightboxImages = React.useMemo<CarouselImage[]>(
    () =>
      galleryImages.map((image) => ({
        src: image.src,
        alt: image.alt
      })),
    [galleryImages]
  )

  const isValueDisabled = React.useCallback(
    (attributeId: string, valueId: string) => {
      if (!variants.length) return true

      return !variants.some((variant) => {
        const variantValues = variant.attributeValues ?? []
        const hasValue = variantValues.some((item) => item.attributeValue?.id === valueId)

        if (!hasValue) return false

        return Object.entries(selectedAttributes)
          .filter(([selectedAttributeId]) => selectedAttributeId !== attributeId)
          .every(([selectedAttributeId, selectedValueId]) =>
            variantValues.some(
              (item) =>
                item.attributeValue?.id === selectedValueId &&
                item.attributeValue?.attribute?.id === selectedAttributeId
            )
          )
      })
    },
    [selectedAttributes, variants]
  )

  React.useEffect(() => {
    if (!galleryApi) return

    const handleSelect = () => {
      const index = galleryApi.selectedScrollSnap()
      setSelectedIndex(index)

      const image = galleryImages[index]
      if (image?.type === 'variant' && image.attributes) {
        setSelectedAttributes(image.attributes)
      }
    }

    handleSelect()
    galleryApi.on('select', handleSelect)
    return () => {
      galleryApi.off('select', handleSelect)
    }
  }, [galleryApi, galleryImages])

  React.useEffect(() => {
    if (!galleryApi || !selectedVariant) return
    const variantIndex = galleryImages.findIndex((image) => image.variantId === selectedVariant.id)

    if (variantIndex >= 0 && variantIndex !== selectedIndex) {
      galleryApi.scrollTo(variantIndex)
    }
  }, [galleryApi, galleryImages, selectedIndex, selectedVariant])

  if (isLoading) {
    return <div className='customer-page-container min-h-screen py-10'>Đang tải...</div>
  }

  if (!product) {
    return (
      <div className='customer-page-container min-h-screen py-10'>Không tìm thấy sản phẩm.</div>
    )
  }

  const stockOnHand = selectedVariant?.stockOnHand ?? 0
  const sellingPrice = selectedVariant?.sellingPrice ?? product.basePrice

  return (
    <div className='customer-page-container min-h-screen pb-16'>
      <Breadcrumb className='py-2 font-normal'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={ROUTES.HOME}>Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/products'>Sản phẩm</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className='capitalize'>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='mt-3 grid grid-cols-12 gap-x-6'>
        <div className='col-span-12 lg:col-span-4'>
          <div className='border-r border-r-gray-100 p-2 pr-4'>
            <Carousel className='relative' setApi={setGalleryApi}>
              <CarouselContent>
                {galleryImages.map((image, index) => (
                  <CarouselItem key={image.id}>
                    <button
                      type='button'
                      onClick={() => setLightboxIndex(index)}
                      className='aspect-square w-full overflow-hidden rounded-md border border-gray-100 bg-white'
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
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='top-1/2 left-3 h-9 w-9 -translate-y-1/2 rounded-full bg-white/90 shadow' />
              <CarouselNext className='top-1/2 right-3 h-9 w-9 -translate-y-1/2 rounded-full bg-white/90 shadow' />
            </Carousel>

            <div className='custom-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1'>
              {galleryImages.map((image, index) => (
                <button
                  key={`${image.id}-thumb`}
                  type='button'
                  onClick={() => galleryApi?.scrollTo(index)}
                  className={cn(
                    'aspect-square w-20 shrink-0 overflow-hidden rounded-md border bg-white',
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

          <Lightbox
            open={lightboxIndex >= 0}
            index={lightboxIndex}
            close={() => setLightboxIndex(-1)}
            slides={lightboxImages}
            render={{
              slide: NextJsImage,
              thumbnail: ({ slide, rect }: RenderThumbnailProps) => (
                <NextJsImage slide={slide} offset={0} rect={rect} />
              )
            }}
            plugins={[Thumbnails, Zoom]}
            carousel={{ finite: false }}
            controller={{ closeOnBackdropClick: true }}
            zoom={{ maxZoomPixelRatio: 3, zoomInMultiplier: 2 }}
            on={{
              view: ({ index }) => {
                setLightboxIndex(index)
                galleryApi?.scrollTo(index)
              }
            }}
          />
        </div>

        <div className='col-span-12 lg:col-span-8'>
          <div className='grid grid-cols-3'>
            <div className='col-span-2'>
              <div className='p-4'>
                <h1 className='line-clamp-2 text-2xl font-bold capitalize'>{product.name}</h1>

                <div className='mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px]'>
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

                <div className='mt-4 flex items-center gap-x-1 text-sm text-gray-500'>
                  <span className='text-business-secondary font-semibold'>
                    {product.views ?? 0}
                  </span>{' '}
                  lượt xem
                </div>

                <div className='mt-4 rounded-md bg-gray-50 px-4 py-5'>
                  <div className='flex items-center gap-x-2'>
                    <span className='text-business-secondary text-2xl font-bold'>
                      {/* {formatNumberToVnCurrency(Number(sellingPrice))} */}
                      {formatNumberToVnCurrency(
                        Number(+product.basePrice + +product.basePrice * 0.1)
                      )}
                      {/* giả sử giá bán cao hơn giá hãng 10% */}
                    </span>
                    <span className='text-sm font-medium text-gray-500'>(Đã bao gồm VAT)</span>
                  </div>
                  <div className='mt-0.5 text-[15px] font-bold text-gray-500'>
                    Giá hãng {formatNumberToVnCurrency(Number(product.basePrice))}
                  </div>
                </div>

                {/* Variant Selection */}
                {attributes.length > 0 && (
                  <div className='mt-6 space-y-4'>
                    {attributes.map((attribute) => (
                      <div key={attribute.id}>
                        <div className='text-sm font-semibold uppercase'>{attribute.name}</div>
                        <div className='mt-2 flex flex-wrap gap-2'>
                          {attribute.values.map((value) => {
                            const isSelected = selectedAttributes[attribute.id] === value.id
                            const disabled = isValueDisabled(attribute.id, value.id)

                            return (
                              <button
                                key={value.id}
                                type='button'
                                disabled={disabled}
                                onClick={() =>
                                  setSelectedAttributes((prev) => ({
                                    ...prev,
                                    [attribute.id]: value.id
                                  }))
                                }
                                className={cn(
                                  'relative flex min-w-[120px] items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition',
                                  isSelected
                                    ? 'border-red-500 text-red-500'
                                    : 'border-gray-200 text-gray-900 hover:border-red-300',
                                  disabled &&
                                    'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                                )}
                              >
                                <span className='line-clamp-2 text-center'>{value.value}</span>
                                {isSelected && (
                                  <span className='absolute right-0 bottom-0 h-5 w-5 rounded-tl-md bg-red-500'>
                                    <span className='absolute right-1 bottom-1 h-2 w-1.5 rotate-45 border-r-2 border-b-2 border-white' />
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selector buy count input */}
                {
                  // selectedSku.stockOnHand > 0
                  true && (
                    <div className='mt-6 flex items-center gap-x-6 pl-4'>
                      <span className='text-sm font-semibold'>Số lượng:</span>
                      <QuantitySelect
                        initialValue={buyCount}
                        // max={selectedSku.stockOnHand}
                        max={10}
                        min={1}
                        onChange={(value) => {
                          setBuyCount(value)
                        }}
                      />
                    </div>
                  )
                }

                <div className='mt-9 grid grid-cols-2 gap-x-4'>
                  {
                    // selectedSku.stockOnHand > 0
                    true ? (
                      <React.Fragment>
                        <div className='col-span-1'>
                          <button
                            // disabled={addToCartMutation.isPending}
                            onClick={() => {
                              // handleAddToCart()
                            }}
                            className='border-business-secondary text-business-secondary before:bg-business-secondary relative w-full overflow-hidden rounded-[5px] border bg-white py-2.5 text-[15px] font-bold uppercase transition-all before:absolute before:top-0 before:bottom-0 before:left-0 before:z-0 before:h-full before:w-0 before:transition-all before:duration-500 hover:text-white hover:before:left-0 hover:before:w-full'
                          >
                            <span className='relative z-10'>Thêm vào giỏ hàng</span>
                          </button>
                        </div>
                        <div className='col-span-1'>
                          <button
                            // disabled={addToCartMutation.isPending}
                            onClick={() => {
                              // handleAddToCart(selectedSku._id)
                            }}
                            className={cn(
                              'bg-business-secondary w-full rounded-[5px] border py-2.5 text-[15px] font-bold text-white uppercase transition-opacity duration-300 hover:opacity-70',
                              {
                                'cursor-not-allowed': false
                                //  addToCartMutation.isPending
                              }
                            )}
                          >
                            Mua ngay
                          </button>
                        </div>
                      </React.Fragment>
                    ) : (
                      <div className='text-base font-semibold text-gray-500'>Tạm thời hết hàng</div>
                    )
                  }
                </div>
              </div>
            </div>
            <div className='col-span-3'>
              <div className='mt-10 grid grid-cols-3 gap-x-6 gap-y-3.5 border-t border-t-gray-100 py-6'>
                <div className='col-span-1'>
                  <div className='flex items-center gap-x-3'>
                    <div className='text-2xl text-gray-400'>
                      <Box size={30} strokeWidth={1} />
                    </div>
                    <span className='text-sm text-gray-600'>Cam kết chất lượng chính hãng</span>
                  </div>
                </div>
                <div className='col-span-1'>
                  <div className='flex items-center gap-x-3'>
                    <div className='text-gray-400'>
                      <Truck size={30} strokeWidth={1} />
                    </div>
                    <span className='text-sm text-gray-600'>
                      Miễn phí giao hàng nội thành HCM từ 179.000đ
                    </span>
                  </div>
                </div>
                <div className='col-span-1'>
                  <div className='flex items-center gap-x-3'>
                    <div className='text-2xl text-gray-400'>
                      <Phone size={30} strokeWidth={1} />
                    </div>
                    <div className='text-sm text-gray-600'>
                      Hotline
                      <span className='ml-2 font-bold'>1900 88 68 99</span>
                    </div>
                  </div>
                </div>
                <div className='col-span-1'>
                  <div className='flex items-center gap-x-3'>
                    <div className='aspect-square w-8'>
                      <Image
                        alt='like'
                        width={0}
                        height={0}
                        sizes='100vw'
                        src={'/like-icon.webp'}
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className='text-sm text-gray-600'>ĐỒNG KIỂM với Shipper</div>
                  </div>
                </div>
                <div className='col-span-1'>
                  <div className='flex items-center gap-x-3'>
                    <div className='aspect-square w-8'>
                      <Image
                        alt='like'
                        width={0}
                        height={0}
                        sizes='100vw'
                        src={'/turn-back-icon.webp'}
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className='text-sm text-gray-600'>
                      Hỗ trợ đổi hàng trong
                      <span className='ml-1.5 font-bold'>48 giờ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-12'>
        <div className="relative border-b-[2px] border-b-gray-200 pb-3 before:absolute before:bottom-[-2px] before:left-0 before:h-[2px] before:w-[12%] before:bg-black before:content-['']">
          <div className='font-bold uppercase'>Mô tả sản phẩm</div>
        </div>
        <div className='py-5'>
          <RichTextDescription content={product.description} hasExpandButton />
        </div>
      </div>
    </div>
  )
}
