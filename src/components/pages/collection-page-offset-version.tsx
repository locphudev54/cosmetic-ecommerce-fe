'use client'
import { CollapsibleFilter, FilterItem } from '@/components/common/collapsible-filter'
import { Pagination } from '@/components/common/pagination'
import { useBrands } from '@/features/brands'
import { useCollectionDetailBySlug } from '@/features/collections'
import { useCountriesOfOrigin } from '@/features/country-of-origin'
import { useProducts } from '@/features/product/hooks'
import { useProductFilterParams } from '@/features/product/hooks/use-product-filter-params'
import React from 'react'

interface CollectionOffsetVersionPageProps {
  slug: string
}

export default function CollectionOffsetVersionPage({ slug }: CollectionOffsetVersionPageProps) {
  // ─── URL-synced filter state ──────────────────────────────────────────
  const { queryParams, setQueryParams, debouncedQueryParams, resetFilters } =
    useProductFilterParams({
      // overrides: { categorySlug: slug },
      debounceMs: 400
    })

  // ─── Remote data ──────────────────────────────────────────────────────
  const { data: brandsData } = useBrands({ getAll: true })
  const { data: countriesOfOriginData } = useCountriesOfOrigin({ getAll: true })
  const { data: collectionData } = useCollectionDetailBySlug(slug)

  // ─── Offset-based pagination with debounced filter params ─────────────
  const { data: productData, isLoading, isFetching } = useProducts(debouncedQueryParams)

  const [locValue, setLocValue] = React.useState(0)

  const products = productData?.data ?? []
  const totalPages = productData?.meta?.totalPages ?? 0
  const currentPage = queryParams.page

  // ─── Filter items for the UI ──────────────────────────────────────────
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

  const categoryFilterItems: FilterItem[] = collectionData?.categories
    ? collectionData.categories.map(({ category }) => ({
        id: category.id,
        name: category.name
      }))
    : []

  const hasActiveFilters =
    queryParams.brandIds.length > 0 ||
    queryParams.countryIds.length > 0 ||
    queryParams.searchQuery !== '' ||
    queryParams.status.length > 0 ||
    queryParams.categoryIds.length > 0

  return (
    <div className='customer-page-container'>
      <div className='grid grid-cols-12 gap-x-4 py-10'>
        <div className='col-span-3'>
          <div className='flex flex-col gap-y-4 text-sm'>
            <CollapsibleFilter
              title='Thương hiệu'
              items={brandFilterItems}
              selectedIds={queryParams.brandIds}
              onSelectionChange={(ids) => setQueryParams({ brandIds: ids as string[] })}
            />

            <CollapsibleFilter
              title='Xuất xứ thương hiệu'
              items={originFilterItems}
              selectedIds={queryParams.countryIds}
              onSelectionChange={(ids) => setQueryParams({ countryIds: ids as string[] })}
            />

            <CollapsibleFilter
              title='Danh mục'
              items={categoryFilterItems}
              selectedIds={queryParams.categoryIds}
              onSelectionChange={(ids) => setQueryParams({ categoryIds: ids as string[] })}
            />

            {/* Attribute Filter */}
            {collectionData?.attributes &&
              collectionData.attributes.map(({ attribute }) => {
                const attributeFilterItems: FilterItem[] = attribute.values.map(
                  (attributeValue) => ({
                    id: attributeValue.id,
                    name: attributeValue.value
                  })
                )

                const selectedValueIds = queryParams.attributes
                  ? queryParams.attributes
                      .filter((attr) => attr.attributeId === attribute.id)
                      .flatMap((attr) => attr.valueIds)
                  : []

                return (
                  <CollapsibleFilter
                    key={attribute.id}
                    title={attribute.name}
                    items={attributeFilterItems}
                    selectedIds={selectedValueIds}
                    onSelectionChange={(ids) =>
                      setQueryParams({
                        attributes: [{ attributeId: attribute.id, valueIds: ids as string[] }]
                      })
                    }
                  />
                )
              })}

            {/* Reset all filters */}
            {hasActiveFilters && (
              <button
                type='button'
                onClick={resetFilters}
                className='text-muted-foreground text-sm underline-offset-4 hover:underline'
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>
        </div>
        <div className='col-span-9'>
          {/* Product Grid */}
          {isLoading ? (
            <div className='flex items-center justify-center py-20'>
              <p className='text-muted-foreground'>Đang tải sản phẩm...</p>
            </div>
          ) : products.length === 0 ? (
            <div className='flex items-center justify-center py-20'>
              <p className='text-muted-foreground'>Không tìm thấy sản phẩm nào.</p>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
                {products.map((product) => (
                  <div key={product.id} className='rounded-lg border p-3'>
                    <h3 className='text-sm font-medium'>{product.name}</h3>
                    <p className='text-muted-foreground text-sm'>
                      {Number(product.basePrice).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                ))}
              </div>

              {/* Offset pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setQueryParams({ page })}
                disabled={isFetching}
                siblingCount={1}
                boundaryCount={1}
                className='mt-8'
              />
              {/* <LocComponent value={locValue} onChange={setLocValue} /> */}
            </>
          )}

          {/* Debug Output */}
          {process.env.NODE_ENV === 'development' && (
            <div className='mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4'>
              <h2 className='mb-2 font-semibold text-blue-900'>Debug: Active Filters</h2>
              <pre className='overflow-x-auto text-sm text-blue-800'>
                {JSON.stringify(debouncedQueryParams, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
