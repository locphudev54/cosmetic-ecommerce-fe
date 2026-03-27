import { ProductStatus } from '@/enums'
import { z } from 'zod'

const productImageSchema = z.object({
  url: z.url('URL hình ảnh không hợp lệ'),
  displayOrder: z
    .number()
    .int('Thứ tự hiển thị phải là số nguyên')
    .positive('Thứ tự hiển thị phải lớn hơn 0')
    .optional(),
  altText: z.string().max(255, 'Văn bản thay thế không được vượt quá 255 ký tự').optional()
})

const variantAttributeValueSchema = z.object({
  attributeValueId: z.uuid('ID giá trị thuộc tính không hợp lệ'),
  value: z
    .string()
    .min(1, 'Giá trị không được để trống')
    .max(255, 'Giá trị không được vượt quá 255 ký tự')
})

const productVariantSchema = z.object({
  id: z.uuid('ID biến thể không hợp lệ').optional(), // present in edit mode for existing variants
  sku: z
    .string()
    .min(1, 'SKU không được để trống')
    .max(100, 'SKU không được vượt quá 100 ký tự')
    .optional(),
  name: z
    .string()
    .min(1, 'Tên biến thể không được để trống')
    .max(255, 'Tên biến thể không được vượt quá 255 ký tự'),
  barcode: z
    .string()
    // .min(1, 'Mã vạch không được để trống')
    .max(100, 'Mã vạch không được vượt quá 100 ký tự')
    .optional(),
  costPrice: z.number().min(0, 'Giá vốn phải lớn hơn hoặc bằng 0'),
  sellingPrice: z.number().min(0, 'Giá bán phải lớn hơn hoặc bằng 0'),
  stockOnHand: z
    .number()
    .int('Số lượng tồn kho phải là số nguyên')
    .min(0, 'Số lượng tồn kho phải lớn hơn hoặc bằng 0')
    .optional(),
  imageUrl: z
    .url('URL hình ảnh không hợp lệ')
    .max(500, 'URL hình ảnh không được vượt quá 500 ký tự')
    .optional(),
  lowStockThreshold: z
    .number()
    .int('Ngưỡng tồn kho thấp phải là số nguyên')
    .min(0, 'Ngưỡng tồn kho thấp phải lớn hơn hoặc bằng 0')
    .optional(),
  maxStockThreshold: z
    .number()
    .int('Ngưỡng tồn kho cao phải là số nguyên')
    .min(0, 'Ngưỡng tồn kho cao phải lớn hơn hoặc bằng 0')
    .optional(),
  isActive: z.boolean().optional(),
  attributeValues: z
    .array(variantAttributeValueSchema)
    .min(1, 'Phải có ít nhất một giá trị thuộc tính')
})

const productCategorySchema = z.object({
  categoryId: z.uuid('ID danh mục không hợp lệ'),
  isPrimary: z.boolean()
})

export const productSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Tên sản phẩm không được để trống')
      .max(255, 'Tên sản phẩm không được vượt quá 255 ký tự'),
    slug: z
      .string()
      .min(1, 'Slug không được để trống')
      .max(255, 'Slug không được vượt quá 255 ký tự')
      .optional(),
    description: z.string().max(10000, 'Mô tả không được vượt quá 10000 ký tự').optional(),
    status: z
      .enum([ProductStatus.PUBLISHED, ProductStatus.DRAFT, ProductStatus.ARCHIVED])
      .optional(),
    basePrice: z.number().min(0, 'Giá cơ bản phải lớn hơn hoặc bằng 0'),
    code: z
      .string()
      .min(1, 'Mã sản phẩm không được để trống')
      .max(50, 'Mã sản phẩm không được vượt quá 50 ký tự')
      .optional(),
    brandId: z.uuid('ID thương hiệu không hợp lệ'),
    countryOriginId: z.uuid('ID quốc gia xuất xứ không hợp lệ'),
    categories: z.array(productCategorySchema).min(1, { error: 'Phải có ít nhất một danh mục' }),
    images: z.array(productImageSchema).min(1, { error: 'Phải có ít nhất một hình ảnh' }),
    variants: z.array(productVariantSchema).optional()
  })
  .refine(
    (data) => {
      // Validate that exactly one category is marked as primary
      const primaryCount = data.categories.filter((cat) => cat.isPrimary).length
      return primaryCount === 1
    },
    {
      message: 'Phải có chính xác một danh mục được đánh dấu là danh mục chính',
      path: ['categories']
    }
  )
  .refine(
    (data) => {
      // Check for duplicate SKUs across variants
      if (!data.variants) return true
      const skus = data.variants.map((v) => v.sku).filter(Boolean)
      const uniqueSkus = new Set(skus)
      return skus.length === uniqueSkus.size
    },
    {
      message: 'Tìm thấy SKU trùng lặp trong các biến thể',
      path: ['variants']
    }
  )
  .refine(
    (data) => {
      // Check for duplicate barcodes across variants
      if (!data.variants) return true
      const barcodes = data.variants.map((v) => v.barcode).filter(Boolean)
      const uniqueBarcodes = new Set(barcodes)
      return barcodes.length === uniqueBarcodes.size
    },
    {
      message: 'Tìm thấy mã vạch trùng lặp trong các biến thể',
      path: ['variants']
    }
  )
  .refine(
    (data) => {
      // Validate price logic: sellingPrice >= costPrice for each variant
      if (!data.variants) return true
      return data.variants.every((variant) => variant.sellingPrice >= variant.costPrice)
    },
    {
      message: 'Giá bán phải lớn hơn hoặc bằng giá vốn cho tất cả các biến thể',
      path: ['variants']
    }
  )

export type UpsertProductFormValues = z.infer<typeof productSchema>
