import { AttributeType, ProductStatus } from '@/enums'
import { PaginationQueryParams } from '@/types/api.types'

export interface Product {
  id: string
  brandId: string
  countryOriginId: string
  code: string
  name: string
  slug: string
  description: string | null
  status: ProductStatus | null
  basePrice: string | number
  views: number | null
  brand?: Brand
  countryOfOrigin?: CountryOfOrigin
  categories?: ProductCategory[]
  variants?: ProductVariant[]
  attributes?: ProductAttribute[]
  images?: ProductImage[]
  createdAt: string | Date
  updatedAt: string | Date | null
}

export interface Brand {
  id: string
  code: string
  name: string
  slug: string
  description?: string | null
  logo?: string | null
  createdAt: string | Date
  updatedAt: string | Date | null
}

export interface CountryOfOrigin {
  id: string
  code: string
  name: string
  slug: string
  createdAt: string | Date
  updatedAt: string | Date | null
}

export interface ProductCategory {
  id: string
  productId: string
  categoryId: string
  category?: Category
  createdAt: string | Date
}

export interface Category {
  id: string
  code: string
  name: string
  slug: string
  description?: string | null
  parentId?: string | null
  level: number
  createdAt: string | Date
  updatedAt: string | Date | null
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  name: string
  price: string | number
  stock: number
  isDefault: boolean
  createdAt: string | Date
  updatedAt: string | Date | null
}

export interface ProductAttribute {
  id: string
  productId: string
  attributeId: string
  value: string
  createdAt: string | Date
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  altText?: string | null
  displayOrder: number
  isPrimary: boolean
  createdAt: string | Date
  updatedAt: string | Date | null
}

export interface FindAllProductsQueryParams extends PaginationQueryParams {
  search?: string
  status?: ProductStatus
  brandId?: string
  categoryId?: string
}

export interface FindAllAttributesQueryParams extends PaginationQueryParams {
  getAll?: boolean
}

export interface CreateProductDto {
  brandId: string
  countryOriginId: string
  name: string
  slug: string
  description?: string
  status?: ProductStatus
  basePrice: number
  categoryIds?: string[]
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

/**
 * The real ProductVariant object:
 *  {
      "sku": "TSHIRT-001-RED-S",
      "name": "Red - Small",
      "barcode": "8901234567890",
      "costPrice": 15.00,
      "sellingPrice": 29.99,
      "stockOnHand": 50,
      "imageUrl": "https://cdn.example.com/variants/tshirt-red-s.jpg",
      "lowStockThreshold": 10,
      "maxStockThreshold": 200,
      "isActive": true,
      "attributeValues": [
        {
          "attributeValueId": "03723340-c328-476a-a1c8-31d5825b9f0f"
        },
        {
          "attributeValueId": "4a94db09-5d94-4351-bbfa-b776b2a84042"
        },
        {
          "attributeValueId": "d119e0cd-82b5-4655-bb9b-1aea27891b27"
        }
      ],
        "images": [
            {
            "url": "https://cdn.example.com/variants/tshirt-red-s-front.jpg",
            "altText": "Red Small T-Shirt - Front"
            },
            {
            "url": "https://cdn.example.com/variants/tshirt-red-s-worn.jpg",
            "altText": "Red Small T-Shirt - Model Wearing"
        }
      ]
    }
 */

export type ProductVariantType = {
  sku?: string
  name?: string
  barcode?: string
  costPrice: number
  sellingPrice: number
  stockOnHand: number
  imageUrl?: string
  lowStockThreshold?: number
  maxStockThreshold?: number
  isActive?: boolean
  attributeValues: string[]
  // attributeValues: { attributeValueId: string }[]
  images?: {
    url: string
    altText?: string
  }[]
}

export interface ProductAttributeType {
  name: string
  values: string[]
}

export interface Attribute {
  id: string
  name: string
  slug: string
  type: AttributeType
  values: AttributeValue[]
  isGlobalFilter: boolean
  filterGroup?: string
  unit?: string
}

export interface AttributeValue {
  id: string
  attributeId: string
  value: string
}
