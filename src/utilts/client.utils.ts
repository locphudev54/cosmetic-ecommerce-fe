import slugify from 'slugify'

export function slugifyString(text: string): string {
  return slugify(text, { lower: true, strict: true })
}
