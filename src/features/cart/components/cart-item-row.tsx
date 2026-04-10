'use client'

import PriceChangeBanner from '@/features/cart/components/price-change-banner'
import VariantSwapPopover from '@/features/cart/components/variant-swap-popover'
import { useRemoveCartItem, useUpdateCartItem } from '@/features/cart/hooks/use-cart'
import { useCartSelectionStore } from '@/features/cart/store/cart-selection-store'
import type { CartItemType, UpdateCartItemRequest } from '@/features/cart/types/cart.types'
import QuantitySelect from '@/features/product/components/quantity-select'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { formatNumberWithCommas, handleApiError } from '@/lib/utils'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useShallow } from 'zustand/react/shallow'

interface Props {
  item: CartItemType
  cartVersion: number
}

export default function CartItemRow({ item, cartVersion }: Props) {
  const { productVariant } = item
  const product = productVariant.product
  const productSlug = product.slug
  const productImage =
    productVariant.imageUrl || product.images?.[0]?.url || '/placeholder-image.svg'
  const attributeString = productVariant.attributeValues
    ?.map((av) => av.attributeValue.value)
    .join(' / ')

  const { toggleItem, isSelected } = useCartSelectionStore(
    useShallow((state) => ({
      toggleItem: state.toggleItem,
      isSelected: state.isSelected
    }))
  )
  const selected = isSelected(item.id)
  const updateMutation = useUpdateCartItem()
  const removeMutation = useRemoveCartItem()

  const handleUpdate = async (data: UpdateCartItemRequest) => {
    try {
      await updateMutation.mutateAsync({ itemId: item.id, data })
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleQuantityChange = useDebouncedCallback((newQuantity: number) => {
    handleUpdate({ quantity: newQuantity, version: cartVersion })
  }, 500)

  const handleRemove = async () => {
    try {
      await removeMutation.mutateAsync({
        itemId: item.id,
        data: { version: cartVersion }
      })
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleVariantSwap = (newVariantId: string) => {
    handleUpdate({ newProductVariantId: newVariantId, version: cartVersion })
  }

  return (
    <div className='grid grid-cols-12 items-center border-b border-b-gray-200 py-4 first:pt-0 last:border-b-0'>
      {/* Left: Checkbox + Product Info */}
      <div className='col-span-6'>
        <div className='flex items-center gap-x-4 text-[15px]'>
          <input
            type='checkbox'
            checked={selected}
            onChange={() => toggleItem(item.id)}
            className='h-4 w-4 cursor-pointer rounded-none accent-black'
          />
          <Link href={`/products/${productSlug}`} className='flex gap-x-3 rounded-sm'>
            <div className='h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-100'>
              <Image
                width={80}
                height={80}
                alt={product.name}
                src={productImage}
                className='h-full w-full object-cover'
              />
            </div>
            <div className='flex flex-col justify-center'>
              <h3 className='mb-1 line-clamp-2 max-w-72 text-sm font-medium'>{product.name}</h3>
              {attributeString && (
                <div className='flex items-center gap-x-1'>
                  <span className='text-xs text-gray-500'>Phân loại:</span>
                  <VariantSwapPopover
                    productId={productVariant.productId}
                    currentVariantId={productVariant.id}
                    onSwap={handleVariantSwap}
                    trigger={
                      <button className='cursor-pointer text-xs font-medium text-blue-600 hover:underline'>
                        {attributeString}
                      </button>
                    }
                  />
                </div>
              )}
              {/* Price change notification */}
              {item.priceChanged && (
                <PriceChangeBanner
                  previousPrice={item.previousPrice!}
                  currentPrice={item.currentPrice!}
                />
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Right: Price + Quantity + Subtotal + Actions */}
      <div className='col-span-6'>
        <div className='grid grid-cols-5 items-center text-[15px] text-gray-500'>
          {/* Unit Price */}
          <div className='col-span-1 text-right font-semibold text-black'>
            <span>₫{formatNumberWithCommas(Number(productVariant.sellingPrice))}</span>
          </div>

          {/* Quantity */}
          <div className='col-span-2'>
            <div className='flex justify-center'>
              <QuantitySelect
                initialValue={item.quantity}
                classNameInput='text-black font-medium'
                max={productVariant.stockOnHand ?? undefined}
                min={1}
                onChange={handleQuantityChange}
              />
            </div>
          </div>

          {/* Subtotal */}
          <div className='text-fourth col-span-1 font-semibold'>
            ₫{formatNumberWithCommas(Number(item.subtotal))}
          </div>

          {/* Delete */}
          <div className='col-span-1 text-center'>
            <button
              onClick={handleRemove}
              disabled={removeMutation.isPending}
              className='cursor-pointer rounded-md p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
