import slugify from 'slugify'
import { isClient } from '@/lib/utils'

export function slugifyString(text: string): string {
  return slugify(text, { lower: true, strict: true })
}

export function generateProductCode(productName: string): string {
  const clean = productName
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean)

  // Build prefix from first 2 words
  const prefix = clean
    .slice(0, 2)
    .map((word) => word.slice(0, 2))
    .join('')

  // Create short hash (base36)
  let hash = 0
  for (let i = 0; i < productName.length; i++) {
    hash = (hash << 5) - hash + productName.charCodeAt(i)
    hash |= 0
  }

  const unique = Math.abs(hash).toString(36).substring(0, 4).toUpperCase()

  return `${prefix}-${unique}`
}

export function generateVariantSku(
  productCode: string,
  attributeValues: {
    attributeValueId: string
    value: string
  }[]
): string {
  const sorted = [...attributeValues].sort((a, b) =>
    a.attributeValueId.localeCompare(b.attributeValueId)
  )

  const attributePart = sorted
    .map((attr) =>
      attr.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 3)
    )
    .join('-')

  return `${productCode}-${attributePart}`
}

export function getSearchHistory(): string[] {
  if (!isClient) return []
  try {
    const saved = localStorage.getItem('searchHistory')
    return saved ? JSON.parse(saved) : []
  } catch (e) {
    console.error('Failed to parse search history', e)
    return []
  }
}

export function saveSearchHistory(history: string[]): void {
  if (!isClient) return
  localStorage.setItem('searchHistory', JSON.stringify(history))
}

export const formatNumberToVnCurrency = (number: number) => {
  return formatNumberWithCommas(number) + ' VNĐ'
}

export function formatNumberWithCommas(number: number): string {
  return number.toLocaleString('en-US')
}

export function capitalizeString(str: string): string {
  if (str.length === 0) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// ─── Grid helpers ────────────────────────────────────────────────────────────

/**
 * Given a flat item list and a column count, returns a 2-D array of rows.
 * The last row may be shorter than `columns`.
 *
 * e.g. groupIntoRows([a,b,c,d,e], 3) → [[a,b,c],[d,e]]
 */
export function groupIntoRows<T>(items: T[], columns: number): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns))
  }
  return rows
}

// ─── Shared near-end detection ────────────────────────────────────────────────

/**
 * Returns true when the virtualizer has scrolled close enough to the last
 * rendered item that we should pre-fetch the next page.
 */
export function isNearEnd(
  lastVirtualItemIndex: number,
  totalCount: number,
  overscan: number
): boolean {
  return lastVirtualItemIndex >= totalCount - 1 - overscan
}
