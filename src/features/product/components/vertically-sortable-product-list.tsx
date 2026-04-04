import { Separator } from '@/components/ui/separator'
import { ProductRowOverlay } from '@/features/product/components/product-row-overlay'
import SortableProductListRow from '@/features/product/components/sortable-product-list-row'
import { PartialProduct, Product } from '@/features/product/types'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Tag } from 'lucide-react'
import React from 'react'

interface VerticallySortableProductListProps {
  initialProducts?: PartialProduct[]
  onChange?: (products: PartialProduct[]) => void
}

export default function VerticallySortableProductList({
  initialProducts,
  onChange
}: VerticallySortableProductListProps) {
  const [products, setProducts] = React.useState<PartialProduct[]>(initialProducts ?? [])
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }
    })
  )

  const activeProduct = activeId ? products.find((p) => p.id === activeId) : null
  const activeIndex = activeId ? products.findIndex((p) => p.id === activeId) : -1

  React.useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts)
    }
  }, [initialProducts])

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over || active.id === over.id) return
    const oldIndex = products.findIndex((p) => p.id === active.id)
    const newIndex = products.findIndex((p) => p.id === over.id)
    const reordered = arrayMove(products, oldIndex, newIndex)
    setProducts(reordered)
    onChange?.(reordered)
  }

  function handleRemove(id: string) {
    const updated = products.filter((p) => p.id !== id)
    setProducts(updated)
    onChange?.(updated)
  }

  return (
    <div className='custom-scrollbar mx-auto h-100 w-full overflow-y-auto p-2'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext items={products.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className='flex flex-col gap-1.5'>
            {products.map((product, index) => (
              <SortableProductListRow
                key={product.id}
                product={product}
                index={index}
                onRemove={handleRemove}
                isDragging={product.id === activeId}
              />
            ))}
          </div>
        </SortableContext>

        {/* Floating drag overlay */}
        <DragOverlay
          dropAnimation={{
            duration: 220,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          {activeProduct && (
            <ProductRowOverlay
              product={activeProduct}
              index={activeIndex}
              onRemove={handleRemove}
            />
          )}
        </DragOverlay>
      </DndContext>

      {products.length === 0 && (
        <div className='flex flex-col items-center justify-center py-12 text-gray-400'>
          <Tag className='h-12 w-12 rotate-90 stroke-1 font-normal' fontWeight={200} />
          <p className='mt-5 max-w-md text-center'>
            Không có sản phẩm nào trong bộ sưu tập này. Tìm kiếm hoặc duyệt để thêm sản phẩm.
          </p>
        </div>
      )}
    </div>
  )
}
