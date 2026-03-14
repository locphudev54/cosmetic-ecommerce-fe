import slugify from 'slugify'

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
