import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { CategoryTreeNodeType } from '@/features/categories/types/category.types'
import CategorySelectionItem from '@/features/product/components/category-selection-item'
import { useCategoryTreeStore } from '@/features/product/store/category-tree-store'

interface CategoryTreeNodeProps {
  node: CategoryTreeNodeType
}

export default function CategoryTreeNode({ node }: CategoryTreeNodeProps) {
  const isExpanded = useCategoryTreeStore((s) => s.isExpanded(node.id))
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className='my-1.5'>
      <div className='flex items-center gap-2 transition-colors'>
        {hasChildren ? (
          <Collapsible open={isExpanded} className='w-full'>
            <CategorySelectionItem node={node} />

            <CollapsibleContent className='border-muted-foreground/20 ml-3 space-y-1 border-l-2 pl-4'>
              {node.children?.map((child) => (
                <CategoryTreeNode key={child.id} node={child} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <div className='w-full'>
            <CategorySelectionItem node={node} />
          </div>
        )}
      </div>
    </div>
  )
}
