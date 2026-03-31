'use client'
import { CollapsibleFilter, FilterItem } from '@/components/common/collapsible-filter'
import { TypographyH3 } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Spinner } from '@/components/ui/spinner'
import { ProductSortBy, SortOrder } from '@/enums'
import { useAttributes } from '@/features/attributes'
import { useBrands } from '@/features/brands'
import { useCategories } from '@/features/categories/hooks'
import { useCollectionDetailBySlug } from '@/features/collections'
import { useCountriesOfOrigin } from '@/features/country-of-origin'
import ProductCard from '@/features/product/components/product-card'
import SelectedProductFilterBadge from '@/features/product/components/selected-product-filter-badge'
import { useProductFilterParams } from '@/features/product/hooks/use-product-filter-params'
import { ProuctSortingOptionType } from '@/features/product/types'
import { useSearchProductsInfiniteScroll } from '@/features/search/hooks/use-search'
import { cn } from '@/lib/utils'
import { ArrowDownAZ, Check, ChevronDown } from 'lucide-react'
import Image from 'next/image'

interface CollectionPageProps {
  slug: string
  isInAllCollectionsPage?: boolean
  productIds: string[]
}

const productSortingOptions: ProuctSortingOptionType[] = [
  {
    label: 'Giá: Tăng dần',
    value: `${ProductSortBy.PRICE}-${SortOrder.ASC}`
  },
  {
    label: 'Giá: Giảm dần',
    value: `${ProductSortBy.PRICE}-${SortOrder.DESC}`
  },
  {
    label: 'Tên: A-Z',
    value: `${ProductSortBy.NAME}-${SortOrder.ASC}`
  },
  {
    label: 'Tên: Z-A',
    value: `${ProductSortBy.NAME}-${SortOrder.DESC}`
  },
  {
    label: 'Mới nhất',
    value: `${ProductSortBy.CREATED_AT}-${SortOrder.DESC}`
  },
  {
    label: 'Cũ nhất',
    value: `${ProductSortBy.CREATED_AT}-${SortOrder.ASC}`
  }
]

export default function CollectionPage({
  slug,
  isInAllCollectionsPage = false,
  productIds
}: CollectionPageProps) {
  // ─── URL-synced filter state ──────────────────────────────────────────
  const { queryParams, setQueryParams, debouncedQueryParams, resetFilters } =
    useProductFilterParams({
      overrides: { page: undefined }, // Disable page param for infinite scroll
      debounceMs: 800
    })

  const sortQueryParam = `${queryParams.sortBy}-${queryParams.sortOrder}`

  const hasActiveFilters =
    queryParams.brandIds.length > 0 ||
    queryParams.countryIds.length > 0 ||
    queryParams.searchQuery !== '' ||
    queryParams.status.length > 0 ||
    queryParams.categoryIds.length > 0 ||
    queryParams.attributes.length > 0

  // ─── Remote data ──────────────────────────────────────────────────────
  const { data: brandsData } = useBrands({ getAll: true })
  const { data: countriesOfOriginData } = useCountriesOfOrigin({ getAll: true })
  const { data: collectionData } = useCollectionDetailBySlug(slug, !isInAllCollectionsPage)

  // --- Queries for all collection page (to show all available filter options) ---
  const { data: allCategoriesData } = useCategories({ getAll: true }, isInAllCollectionsPage)
  const { data: allAttributesData } = useAttributes(
    { getAll: true, isGlobalFilter: true },
    isInAllCollectionsPage
  )

  // // ─── Transform debounced filter params → ES search params ─────────────
  // const searchParams: Omit<SearchProductsParams, 'cursor'> = {
  //   searchQuery: debouncedQueryParams.searchQuery || undefined,
  //   brandIds: debouncedQueryParams.brandIds,
  //   countryIds: debouncedQueryParams.countryIds,
  //   categoryIds: debouncedQueryParams.categoryIds,
  //   status: debouncedQueryParams.status,
  //   minPrice: debouncedQueryParams.minPrice,
  //   maxPrice: debouncedQueryParams.maxPrice,
  //   attributes: debouncedQueryParams.attributes,
  //   inStock: debouncedQueryParams.inStock ?? undefined,
  //   hasActiveVariants: debouncedQueryParams.hasActiveVariants ?? undefined,
  //   sortBy: debouncedQueryParams.sortBy,
  //   sortOrder: debouncedQueryParams.sortOrder,
  //   limit: debouncedQueryParams.limit
  // }

  // ─── ES-powered infinite scroll ───────────────────────────────────────
  const {
    items: productList,
    isLoading: isProductListLoading,
    isFetchingNextPage,
    isFetching: isProductListFetching,
    hasNextPage,
    totalItems,
    fetchNextPage
  } = useSearchProductsInfiniteScroll({
    params: { ...debouncedQueryParams, productIds },
    mode: 'manual'
  })

  // ─── Filter items for the UI Filter panel ──────────────────────────────────────────
  const brandFilterItems: FilterItem[] = brandsData
    ? brandsData.data.map((brand) => ({
        id: brand.id,
        name: brand.name
      }))
    : []

  const originFilterItems: FilterItem[] = countriesOfOriginData
    ? countriesOfOriginData.data.map((origin) => ({
        id: origin.id,
        name: origin.name
      }))
    : []

  const categoryFilterItems: FilterItem[] = !isInAllCollectionsPage
    ? collectionData?.categories
      ? collectionData.categories.map(({ category }) => ({
          id: category.id,
          name: category.name
        }))
      : []
    : allCategoriesData
      ? allCategoriesData.data.map((category) => ({
          id: category.id,
          name: category.name
        }))
      : []

  const attributeFilterItemsList: {
    attributeId: string
    attributeName: string
    items: FilterItem[]
  }[] = !isInAllCollectionsPage
    ? collectionData?.attributes
      ? collectionData.attributes.map(({ attribute }) => ({
          attributeId: attribute.id,
          attributeName: attribute.name,
          items: attribute.values.map((attributeValue) => ({
            id: attributeValue.id,
            name: attributeValue.value
          }))
        }))
      : []
    : allAttributesData
      ? allAttributesData.data.map((attribute) => ({
          attributeId: attribute.id,
          attributeName: attribute.name,
          items: attribute.values.map((attributeValue) => ({
            id: attributeValue.id,
            name: attributeValue.value
          }))
        }))
      : []

  // Selected Filter items for the Badge list of active filters
  const selectedBrandFilterItems: FilterItem[] = brandFilterItems.filter((item) =>
    queryParams.brandIds.includes(item.id)
  )
  const selectedOriginFilterItems: FilterItem[] = originFilterItems.filter((item) =>
    queryParams.countryIds.includes(item.id)
  )
  const selectedCategoryFilterItems: FilterItem[] = categoryFilterItems.filter((item) =>
    queryParams.categoryIds.includes(item.id)
  )

  const selectedAttributeFilterItemsList: {
    attributeName: string
    selectedValues: FilterItem[]
  }[] = queryParams.attributes
    .map(({ attributeId, valueIds }) => {
      const attribute = attributeFilterItemsList.find((attr) => attr.attributeId === attributeId)
      if (!attribute) return null

      const selectedValues = attribute.items.filter((item) => valueIds.includes(item.id))
      return {
        attributeName: attribute.attributeName,
        selectedValues
      }
    })
    .filter((attr) => attr !== null)

  const handleAttributeFilterChange = (attributeId: string, valueIds: string[]) => {
    const targetAttributeFilter = queryParams.attributes || []
    const remainingAttributeFilters = targetAttributeFilter.filter(
      (attr) => attr.attributeId !== attributeId
    )

    const mergedAttributeFilters = [...remainingAttributeFilters, { attributeId, valueIds }]

    setQueryParams({ attributes: mergedAttributeFilters })
  }

  const handleSortProducts = (sortOption: string) => (e: Event) => {
    e.preventDefault()
    const [sortBy, sortOrder] = sortOption.split('-')
    setQueryParams({ sortBy: sortBy as ProductSortBy, sortOrder: sortOrder as SortOrder })
  }

  return (
    <div className='mt-4 grid grid-cols-12 gap-x-7'>
      {/* Filter Sidebar */}
      <div className='col-span-3'>
        <div className='flex flex-col gap-y-4 text-sm'>
          <CollapsibleFilter
            title='Thương hiệu'
            items={brandFilterItems}
            selectedIds={queryParams.brandIds}
            onSelectionChange={(ids) => setQueryParams({ brandIds: ids })}
            defaultExpanded
          />

          <CollapsibleFilter
            title='Xuất xứ thương hiệu'
            items={originFilterItems}
            selectedIds={queryParams.countryIds}
            onSelectionChange={(ids) => setQueryParams({ countryIds: ids })}
            defaultExpanded
          />

          <CollapsibleFilter
            title='Loại sản phẩm'
            items={categoryFilterItems}
            selectedIds={queryParams.categoryIds}
            onSelectionChange={(ids) => setQueryParams({ categoryIds: ids })}
            defaultExpanded
          />

          {/* Attribute Filter */}
          {attributeFilterItemsList.map(({ attributeId, attributeName, items }) => (
            <CollapsibleFilter
              key={attributeId}
              title={attributeName}
              items={items}
              selectedIds={
                queryParams.attributes?.find((attr) => attr.attributeId === attributeId)
                  ?.valueIds || []
              }
              onSelectionChange={(ids) => handleAttributeFilterChange(attributeId, ids)}
            />
          ))}
        </div>
      </div>
      <div className='col-span-9'>
        {/* Banner Collection */}
        <div className='aspect-16/6'>
          <Image
            src={collectionData?.imageUrl || '/banner-collections.jpg'}
            alt='banner-collections'
            width={0}
            sizes='100vw'
            height={0}
            className='h-full w-full object-cover'
          />
        </div>

        {/* Filter Result and Sort Dropdown */}
        <div className='flex items-center justify-between py-4'>
          <div className='flex items-center gap-x-6'>
            <TypographyH3 className='font-extrabold'>Tất cả sản phẩm</TypographyH3>
            <div className='text-sm font-normal'>
              <strong className=''>{totalItems}</strong>
              <span className='ml-2'>sản phẩm</span>
            </div>
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='min-w-48 justify-between gap-x-0.5 rounded-none font-semibold'
              >
                <div className='flex items-center gap-x-2'>
                  <ArrowDownAZ />
                  <span>Sắp xếp</span>
                </div>
                <ChevronDown className='h-2 w-2' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='min-w-48 rounded-none' sideOffset={0}>
              {productSortingOptions.map((option) => {
                const isSelected = sortQueryParam === option.value
                return (
                  <DropdownMenuItem
                    className={cn(
                      'cursor-pointer',
                      isSelected ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                    )}
                    key={option.value}
                    onSelect={handleSortProducts(option.value)}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className='ml-auto h-4 w-4 stroke-black' />}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Badge List of Active Filters */}
        {hasActiveFilters && (
          <div className='flex flex-wrap gap-2 py-0 pb-6 text-sm'>
            {selectedBrandFilterItems.length > 0 && (
              <SelectedProductFilterBadge
                selectedItems={selectedBrandFilterItems}
                onClear={() => setQueryParams({ brandIds: [] })}
              />
            )}

            {selectedOriginFilterItems.length > 0 && (
              <SelectedProductFilterBadge
                selectedItems={selectedOriginFilterItems}
                onClear={() => setQueryParams({ countryIds: [] })}
              />
            )}

            {selectedCategoryFilterItems.length > 0 && (
              <SelectedProductFilterBadge
                selectedItems={selectedCategoryFilterItems}
                onClear={() => setQueryParams({ categoryIds: [] })}
              />
            )}

            {selectedAttributeFilterItemsList.map(({ attributeName, selectedValues }) => (
              <SelectedProductFilterBadge
                key={attributeName}
                selectedItems={selectedValues}
                onClear={() => {
                  const targetAttribute = allAttributesData?.data.find(
                    (attr) => attr.name === attributeName
                  )
                  if (!targetAttribute) return

                  handleAttributeFilterChange(targetAttribute.id, [])
                }}
              />
            ))}

            <Button
              variant='link'
              type='button'
              onClick={resetFilters}
              className='text-muted-foreground underline underline-offset-4'
            >
              Xóa hết
            </Button>
          </div>
        )}

        {/* Product List */}
        {productList.length === 0 && (
          <p className='text-sm text-gray-500'>Không tìm thấy kết quả. Vui lòng thử lại!</p>
        )}

        <div className='grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
          {productList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {hasNextPage && (
          <div className='mt-8 flex justify-center'>
            <Button
              variant='outline'
              size={'lg'}
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className='rounded-md'
            >
              {isFetchingNextPage ? (
                <>
                  <Spinner className='mr-2' />
                  Đang tải...
                </>
              ) : (
                'Xem thêm'
              )}
            </Button>
          </div>
        )}

        {!hasNextPage && productList.length > 0 && !isFetchingNextPage && (
          <p className='mt-8 text-center text-sm text-gray-700'>Đã hiển thị tất cả sản phẩm</p>
        )}
      </div>
    </div>
  )
}
