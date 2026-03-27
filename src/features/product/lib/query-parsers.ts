import { createParser } from 'nuqs/server'
import { z } from 'zod'

import { ProductSortBy, ProductStatus, SortOrder } from '@/enums'

// ─── Status Array Parser ────────────────────────────────────────────────────

const statusArraySchema = z.array(z.nativeEnum(ProductStatus))

export const getStatusParser = () => {
  return createParser({
    parse: (value) => {
      if (!value) return []
      const parts = value.split(',')
      const result = statusArraySchema.safeParse(parts)
      if (!result.success) return []
      return result.data
    },
    serialize: (value) => value.join(','),
    eq: (a, b) => a.length === b.length && a.every((status, index) => status === b[index])
  })
}

// ─── Search String Parser ───────────────────────────────────────────────────

const searchSchema = z.string().optional()

export const getSearchParser = () => {
  return createParser({
    parse: (value) => {
      const result = searchSchema.safeParse(value)
      return result.success ? result.data || '' : ''
    },
    serialize: (value) => value || '',
    eq: (a, b) => a === b
  })
}

// ─── UUID Array Parser (for brandIds, categoryIds, countryIds) ──────────────

const uuidSchema = z.string().uuid()

export const getUuidArrayParser = () => {
  return createParser({
    parse: (value) => {
      if (!value) return []
      const parts = value.split(',').filter(Boolean)
      const validated = parts.filter((part) => uuidSchema.safeParse(part).success)
      return validated
    },
    serialize: (value) => value.join(','),
    eq: (a, b) => a.length === b.length && a.every((id, index) => id === b[index])
  })
}

// ─── Positive Number Parser (for minPrice, maxPrice, etc.) ──────────────────

const positiveNumberSchema = z.number().min(0)

export const getPositiveNumberParser = () => {
  return createParser({
    parse: (value) => {
      if (!value) return null
      const num = Number(value)
      const result = positiveNumberSchema.safeParse(num)
      return result.success ? result.data : null
    },
    serialize: (value) => String(value),
    eq: (a, b) => a === b
  })
}

// ─── Positive Integer Parser (for minStock, maxStock) ───────────────────────

const positiveIntSchema = z.number().int().min(0)

export const getPositiveIntParser = () => {
  return createParser({
    parse: (value) => {
      if (!value) return null
      const num = Number(value)
      const result = positiveIntSchema.safeParse(num)
      return result.success ? result.data : null
    },
    serialize: (value) => String(value),
    eq: (a, b) => a === b
  })
}

// ─── Boolean Filter Parser (for inStock, hasActiveVariants) ─────────────────

export const getBooleanFilterParser = () => {
  return createParser({
    parse: (value) => {
      if (value === 'true') return true
      if (value === 'false') return false
      return null
    },
    serialize: (value) => String(value),
    eq: (a, b) => a === b
  })
}

// ─── Sort By Parser (validated against ProductSortBy enum) ──────────────────

const sortBySchema = z.nativeEnum(ProductSortBy)

export const getSortByParser = () => {
  return createParser({
    parse: (value) => {
      if (!value) return null
      const result = sortBySchema.safeParse(value)
      return result.success ? result.data : null
    },
    serialize: (value) => value,
    eq: (a, b) => a === b
  })
}

// ─── Sort Order Parser (validated against SortOrder enum) ───────────────────

const sortOrderSchema = z.nativeEnum(SortOrder)

export const getSortOrderParser = () => {
  return createParser({
    parse: (value) => {
      if (!value) return null
      const result = sortOrderSchema.safeParse(value)
      return result.success ? result.data : null
    },
    serialize: (value) => value,
    eq: (a, b) => a === b
  })
}

// ─── Attributes Parser (AttributeFilter[]) ──────────────────────────────────
// URL format: ?attributes=[{"attributeId":"uuid","valueIds":["uuid1","uuid2"]}]
// Each entry is validated: attributeId must be UUID, valueIds must be UUID array.

const attributeFilterSchema = z.array(
  z.object({
    attributeId: z.string().uuid(),
    valueIds: z.array(z.string().uuid()).min(1)
  })
)

export const getAttributesParser = () => {
  return createParser({
    parse: (value) => {
      if (!value) return []
      try {
        const parsed = JSON.parse(value)
        const result = attributeFilterSchema.safeParse(parsed)
        return result.success ? result.data : []
      } catch {
        return []
      }
    },
    serialize: (value) => {
      if (!value || value.length === 0) return ''
      return JSON.stringify(value)
    },
    eq: (a, b) => {
      if (a.length !== b.length) return false
      return a.every((filterA, i) => {
        const filterB = b[i]
        return (
          filterA.attributeId === filterB.attributeId &&
          filterA.valueIds.length === filterB.valueIds.length &&
          filterA.valueIds.every((id, j) => id === filterB.valueIds[j])
        )
      })
    }
  })
}
