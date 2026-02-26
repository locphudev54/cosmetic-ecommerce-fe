import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  description: z.string().optional()

  //   code: z.string().min(1, 'Mã sản phẩm không được để trống'),

  //   status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'], {
  //     message: 'Trạng thái không hợp lệ'
  //   }),

  //   basePrice: z
  //     .number({
  //       error: 'Giá cơ bản phải là số'
  //     })
  //     .nonnegative('Giá cơ bản phải lớn hơn hoặc bằng 0'),

  //   brandId: z.string().uuid('brandId phải là UUID hợp lệ'),
  //   countryOriginId: z.string().uuid('countryOriginId phải là UUID hợp lệ'),

  //   categories: z
  //     .array(
  //       z.object({
  //         categoryId: z.string().uuid('categoryId phải là UUID hợp lệ'),
  //         isPrimary: z.boolean({
  //           error: 'isPrimary phải là boolean'
  //         })
  //       })
  //     )
  //     .min(1, 'Phải có ít nhất 1 danh mục'),

  //   images: z
  //     .array(
  //       z.object({
  //         url: z.string().url('URL hình ảnh không hợp lệ'),
  //         altText: z.string().optional()
  //       })
  //     )
  //     .optional(),

  //   attributes: z
  //     .array(
  //       z.object({
  //         attributeId: z.string().uuid('attributeId phải là UUID hợp lệ'),
  //         isRequired: z.boolean({
  //           error: 'isRequired phải là boolean'
  //         })
  //       })
  //     )
  //     .optional(),

  //   variants: z
  //     .array(
  //       z.object({
  //         sku: z.string().min(1, 'SKU không được để trống'),
  //         name: z.string().min(1, 'Tên biến thể không được để trống'),

  //         barcode: z.string().optional(),

  //         costPrice: z
  //           .number({
  //             error: 'Giá nhập phải là số'
  //           })
  //           .nonnegative('Giá nhập phải >= 0'),

  //         sellingPrice: z
  //           .number({
  //             error: 'Giá bán phải là số'
  //           })
  //           .nonnegative('Giá bán phải >= 0'),

  //         stockOnHand: z
  //           .number({
  //             error: 'Tồn kho phải là số'
  //           })
  //           .int('Tồn kho phải là số nguyên')
  //           .nonnegative('Tồn kho phải >= 0'),

  //         imageUrl: z.string().url('URL ảnh biến thể không hợp lệ').optional(),

  //         lowStockThreshold: z
  //           .number({
  //             error: 'Ngưỡng tồn thấp phải là số'
  //           })
  //           .int('Ngưỡng tồn thấp phải là số nguyên')
  //           .nonnegative('Ngưỡng tồn thấp phải >= 0')
  //           .optional(),

  //         maxStockThreshold: z
  //           .number({
  //             error: 'Ngưỡng tồn tối đa phải là số'
  //           })
  //           .int('Ngưỡng tồn tối đa phải là số nguyên')
  //           .nonnegative('Ngưỡng tồn tối đa phải >= 0')
  //           .optional(),

  //         isActive: z.boolean({
  //           error: 'isActive phải là boolean'
  //         }),

  //         attributeValues: z
  //           .array(
  //             z.object({
  //               attributeValueId: z.string().uuid('attributeValueId phải là UUID hợp lệ')
  //             })
  //           )
  //           .min(1, 'Biến thể phải có ít nhất 1 thuộc tính'),

  //         images: z
  //           .array(
  //             z.object({
  //               url: z.string().url('URL hình ảnh không hợp lệ'),
  //               altText: z.string().optional()
  //             })
  //           )
  //           .optional()
  //       })
  //     )
  //     .min(1, 'Phải có ít nhất 1 biến thể')
  // })
  // .superRefine((data, ctx) => {
  //   // Rule 1: Chỉ 1 category isPrimary = true
  //   const primaryCategories = data.categories.filter((c) => c.isPrimary)
  //   if (primaryCategories.length !== 1) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: 'Phải có đúng 1 danh mục chính (isPrimary = true)',
  //       path: ['categories']
  //     })
  //   }

  //   //  Rule 2: SKU phải unique
  //   const skuSet = new Set()
  //   data.variants.forEach((variant, index) => {
  //     if (skuSet.has(variant.sku)) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         message: 'SKU bị trùng',
  //         path: ['variants', index, 'sku']
  //       })
  //     }
  //     skuSet.add(variant.sku)
  //   })

  //   // Rule 3: sellingPrice >= costPrice
  //   data.variants.forEach((variant, index) => {
  //     if (variant.sellingPrice < variant.costPrice) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         message: 'Giá bán phải lớn hơn hoặc bằng giá nhập',
  //         path: ['variants', index, 'sellingPrice']
  //       })
  //     }
  //   })

  //   // Rule 4: lowStockThreshold <= maxStockThreshold
  //   data.variants.forEach((variant, index) => {
  //     if (
  //       variant.lowStockThreshold !== undefined &&
  //       variant.maxStockThreshold !== undefined &&
  //       variant.lowStockThreshold > variant.maxStockThreshold
  //     ) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         message: 'Ngưỡng tồn thấp không được lớn hơn ngưỡng tồn tối đa',
  //         path: ['variants', index, 'lowStockThreshold']
  //       })
  //     }
  //   })

  //   // rule 5: attributeValues không được trùng trong 1 variant
  //   data.variants.forEach((variant, index) => {
  //     const attrSet = new Set()
  //     variant.attributeValues.forEach((attr, attrIndex) => {
  //       if (attrSet.has(attr.attributeValueId)) {
  //         ctx.addIssue({
  //           code: z.ZodIssueCode.custom,
  //           message: 'Thuộc tính bị trùng trong biến thể',
  //           path: ['variants', index, 'attributeValues', attrIndex]
  //         })
  //       }
  //       attrSet.add(attr.attributeValueId)
  //     })
  //   })
})

export type CreateProductFormValues = z.infer<typeof createProductSchema>
