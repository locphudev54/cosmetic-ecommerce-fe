import { createParser } from 'nuqs/server'
import { z } from 'zod'

import { OrderStatus } from '@/features/orders/types/order.types'

const statusArraySchema = z.array(z.nativeEnum(OrderStatus))

export const getOrderStatusParser = () => {
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

const searchSchema = z.string().optional()

export const getOrderSearchParser = () => {
  return createParser({
    parse: (value) => {
      const result = searchSchema.safeParse(value)
      return result.success ? result.data || '' : ''
    },
    serialize: (value) => value || '',
    eq: (a, b) => a === b
  })
}
