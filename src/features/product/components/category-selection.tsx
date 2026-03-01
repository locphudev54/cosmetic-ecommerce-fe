'use client'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CategoryTreeNodeType } from '@/features/categories/types/category.types'
import { CategoryTree } from '@/features/product/components/category-tree'
import SelectedCategoryItem from '@/features/product/components/selected-category-item'
import { useCategoryTreeStore } from '@/features/product/store/category-tree-store'
import { Plus, Settings2 } from 'lucide-react'
import React, { useState } from 'react'

const mockCategories: CategoryTreeNodeType[] = [
  {
    id: '11e8b83c-afee-4569-815d-92b8dcb80bec',
    name: 'Beauty & Health',
    slug: 'beauty-health',
    path: '/beauty-health/',
    depth: 0,
    isActive: true,
    productCount: 245,
    children: [
      {
        id: 'be5aef3f-c8a9-4974-b8ef-af733b93bde9',
        name: 'Fragrance',
        slug: 'fragrance',
        path: '/beauty-health/fragrance/',
        depth: 1,
        isActive: true,
        productCount: 89,
        children: []
      },
      {
        id: '2b1c3d4e-5f6g-7h8i-9j0k-1l2m3n4o5p6q',
        name: 'Skincare',
        slug: 'skincare',
        path: '/beauty-health/skincare/',
        depth: 1,
        isActive: true,
        productCount: 156,
        children: [
          {
            id: '3c2d4e5f-6g7h-8i9j-0k1l-2m3n4o5p6q7r',
            name: 'Face Care',
            slug: 'face-care',
            path: '/beauty-health/skincare/face-care/',
            depth: 2,
            isActive: true,
            productCount: 87,
            children: []
          },
          {
            id: '4d3e5f6g-7h8i-9j0k-1l2m-3n4o5p6q7r8s',
            name: 'Body Care',
            slug: 'body-care',
            path: '/beauty-health/skincare/body-care/',
            depth: 2,
            isActive: true,
            productCount: 69,
            children: []
          }
        ]
      }
    ]
  },
  {
    id: 'ef786dfa-4df9-407a-82ad-81797903b3a9',
    name: 'Electronics',
    slug: 'electronics',
    path: '/electronics/',
    depth: 0,
    isActive: true,
    productCount: 512,
    children: [
      {
        id: 'fd565488-73ca-4613-8180-6d9199a14cdf',
        name: 'Computers & Laptops',
        slug: 'computers-laptops',
        path: '/electronics/computers-laptops/',
        depth: 1,
        isActive: true,
        productCount: 234,
        children: [
          {
            id: '6258a2ae-5af9-4528-a318-c44c0aec2a9e',
            name: 'Desktop Computers',
            slug: 'desktop-computers',
            path: '/electronics/computers-laptops/desktop-computers/',
            depth: 2,
            isActive: true,
            productCount: 145,
            children: []
          },
          {
            id: '7369b3bf-6bg0-5639-b429-d55d1bfd3b0f',
            name: 'Laptops',
            slug: 'laptops',
            path: '/electronics/computers-laptops/laptops/',
            depth: 2,
            isActive: true,
            productCount: 89,
            children: []
          }
        ]
      },
      {
        id: '8g47a4cg-7ch1-6740-c53a-e66e2cge4c1g',
        name: 'Smartphones',
        slug: 'smartphones',
        path: '/electronics/smartphones/',
        depth: 1,
        isActive: true,
        productCount: 178,
        children: [
          {
            id: '9h58b5dh-8di2-7851-d64b-f77f3dhf5d2h',
            name: 'Apple iPhones',
            slug: 'apple-iphones',
            path: '/electronics/smartphones/apple-iphones/',
            depth: 2,
            isActive: true,
            productCount: 45,
            children: []
          },
          {
            id: '0i69c6ei-9ej3-8962-e75c-g88g4eig6e3i',
            name: 'Samsung Phones',
            slug: 'samsung-phones',
            path: '/electronics/smartphones/samsung-phones/',
            depth: 2,
            isActive: true,
            productCount: 67,
            children: []
          },
          {
            id: '1j7ad7fj-0fk4-9a73-f86d-h99h5fjh7f4j',
            name: 'Other Brands',
            slug: 'other-brands',
            path: '/electronics/smartphones/other-brands/',
            depth: 2,
            isActive: false,
            productCount: 66,
            children: []
          }
        ]
      }
    ]
  },
  {
    id: '2k8be8gk-1gl5-0b84-g97e-i00i6gki8g5k',
    name: 'Fashion',
    slug: 'fashion',
    path: '/fashion/',
    depth: 0,
    isActive: true,
    productCount: 892,
    children: [
      {
        id: '3l9cf9hl-2hm6-1c95-h08f-j11j7hlj9h6l',
        name: "Men's Clothing",
        slug: 'mens-clothing',
        path: '/fashion/mens-clothing/',
        depth: 1,
        isActive: true,
        productCount: 445,
        children: []
      },
      {
        id: '4m0dg0im-3in7-2d06-i19g-k22k8imk0i7m',
        name: "Women's Clothing",
        slug: 'womens-clothing',
        path: '/fashion/womens-clothing/',
        depth: 1,
        isActive: true,
        productCount: 447,
        children: []
      }
    ]
  }
]

export default function CategorySelection() {
  const [selectedCategories, setSelectedCategories] = useState<CategoryTreeNodeType[]>([])

  // Instead of maintaining local selection state in CategoryTree component and binding the callback from here to sync with the store,
  //  we can directly read the selected categories from the store here and pass it down to CategoryTree as a prop.
  // This way, we have a single source of truth for the selection state in the store, and we can avoid potential issues with syncing local state and store state
  const selectedCategoriesFromStore = useCategoryTreeStore((s) => s.selectedCategories)
  const toggleSelect = useCategoryTreeStore((s) => s.toggleSelect)
  const [open, setOpen] = useState(false)

  // Sync selection changes to the store
  // React.useEffect(() => {
  //   selectedCategories.forEach((id) => toggleSelect(id))
  // }, [selectedCategories, toggleSelect])

  return (
    <React.Fragment>
      <Popover
        open={open}
        onOpenChange={(open) => {
          setOpen(open)

          // When popover closes, sync the current selection from the store to local state
          if (!open) {
            setSelectedCategories(selectedCategoriesFromStore)
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button variant={'outline'}>
            {selectedCategories.length === 0 ? (
              <>
                <Plus />
                <span>Chọn danh mục</span>
              </>
            ) : (
              <>
                <Settings2 />
                <span>{selectedCategories.length} danh mục đã chọn</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-96' align='end'>
          <CategoryTree
            categories={mockCategories}
            multiSelect={true}
            // showProductCount={true}
          />
        </PopoverContent>
      </Popover>
      {selectedCategories.length > 0 && (
        <React.Fragment>
          {selectedCategories.map((cat) => {
            return (
              <SelectedCategoryItem
                key={cat.id}
                node={cat}
                onClick={() => setOpen(true)}
                onRemove={() => {
                  setSelectedCategories((prev) => prev.filter((c) => c.id !== cat.id))
                  toggleSelect(cat.id)
                }}
              />
            )
          })}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
