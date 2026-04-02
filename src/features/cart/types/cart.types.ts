import { ProductVariant, VariantAttributeValueItem } from '@/features/product/types'

// ==========================================
// Cart Types
// ==========================================

export interface Cart {
  id: string
  userId: string | null
  version: number
  totalPrice: string | number
  expiresAt: string | null
  items: CartItemType[]
  createdAt: string
  updatedAt: string | null
}

export interface CartItemType {
  id: string
  productVariantId: string
  cartId: string
  price: string | number // Snapshot price at time of adding
  quantity: number
  subtotal: string | number
  productVariant: CartProductVariant
  createdAt: string
  updatedAt: string | null

  // Enriched by server (price change detection)
  priceChanged?: boolean
  previousPrice?: number | null
  currentPrice?: number
}

export interface CartProductVariant {
  id: string
  productId: string
  sku: string
  name: string
  sellingPrice: string | number
  stockOnHand: number | null
  imageUrl: string
  isActive: boolean
  product: CartProduct
  attributeValues: CartVariantAttribute[]
}

export interface CartProduct {
  id: string
  name: string
  slug: string
  images: { url: string; altText?: string | null }[]
}

export interface CartVariantAttribute {
  id: string
  attributeValue: {
    id: string
    value: string
    attribute: {
      id: string
      name: string
    }
  }
}

// ==========================================
// Request DTOs
// ==========================================

export interface AddToCartRequest {
  productVariantId: string
  quantity: number
}

export interface UpdateCartItemRequest {
  newProductVariantId?: string
  quantity?: number
  version: number
}

export interface RemoveCartItemRequest {
  version: number
}

export interface BulkRemoveCartItemsRequest {
  itemIds: string[]
  version: number
}

// ==========================================
// Variant Swap Types
// ==========================================

export interface SwapVariantInfo {
  id: string
  sku: string
  name: string
  sellingPrice: string | number
  stockOnHand: number | null
  isActive: boolean
  imageUrl: string
  attributeValues: CartVariantAttribute[]
}
