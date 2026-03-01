export interface CategoryTreeNodeType {
  id: string
  name: string
  slug: string
  path: string
  depth: number
  isActive: boolean
  productCount?: number
  children?: CategoryTreeNodeType[]
}
