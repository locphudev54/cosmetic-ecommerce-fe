'use client'

import { useProductVariants } from '@/features/cart/hooks/use-cart'
import { SwapVariantInfo } from '@/features/cart/types/cart.types'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatNumberWithCommas } from '@/lib/utils'
import { Check, Loader2, RefreshCw } from 'lucide-react'
import { ReactNode, useState } from 'react'

interface Props {
  productId: string
  currentVariantId: string
  onSwap: (newVariantId: string) => void
  trigger: ReactNode
}

export default function VariantSwapPopover({
  productId,
  currentVariantId,
  onSwap,
  trigger
}: Props) {
  const [open, setOpen] = useState(false)
  const { data: variants, isLoading } = useProductVariants(open ? productId : null)

  const handleSelect = (variantId: string) => {
    if (variantId === currentVariantId) return
    onSwap(variantId)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation() // prevents bubbling to Link
          e.preventDefault() // prevents navigation
          setOpen((prev) => !prev)
        }}
      >
        {trigger}
      </PopoverTrigger>
      <PopoverContent align='start' className='w-[320px] p-0' sideOffset={8}>
        <div className='border-b border-gray-100 px-4 py-3'>
          <div className='flex items-center gap-x-2 text-sm font-semibold'>
            <RefreshCw size={14} />
            <span>Đổi sản phẩm</span>
          </div>
        </div>

        <div className='custom-scrollbar max-h-[280px] overflow-y-auto'>
          {isLoading ? (
            <div className='flex items-center justify-center py-8'>
              <Loader2 size={20} className='animate-spin text-gray-400' />
            </div>
          ) : !variants || variants.length === 0 ? (
            <div className='py-6 text-center text-sm text-gray-400'>
              Không có phân loại nào khác
            </div>
          ) : (
            <div className='p-2'>
              {variants.map((variant: SwapVariantInfo) => {
                const isCurrent = variant.id === currentVariantId
                const isOutOfStock = variant.stockOnHand !== null && variant.stockOnHand <= 0
                const attributeString = variant.attributeValues
                  ?.map((av) => av.attributeValue.value)
                  .join(' / ')

                return (
                  <button
                    key={variant.id}
                    onClick={() => handleSelect(variant.id)}
                    disabled={isOutOfStock || isCurrent}
                    className={`flex w-full items-center gap-x-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                      isCurrent
                        ? 'bg-gray-50 font-medium'
                        : isOutOfStock
                          ? 'cursor-not-allowed opacity-50'
                          : 'cursor-pointer hover:bg-gray-50'
                    }`}
                  >
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center gap-x-2'>
                        <span className='truncate font-medium'>
                          {attributeString || variant.name}
                        </span>
                        {isCurrent && <Check size={14} className='shrink-0 text-green-500' />}
                      </div>
                      <div className='mt-0.5 flex items-center gap-x-2 text-xs text-gray-500'>
                        <span>₫{formatNumberWithCommas(Number(variant.sellingPrice))}</span>
                        <span>·</span>
                        <span>
                          {isOutOfStock
                            ? 'Hết hàng'
                            : variant.stockOnHand !== null
                              ? `Còn ${variant.stockOnHand}`
                              : 'Còn hàng'}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
