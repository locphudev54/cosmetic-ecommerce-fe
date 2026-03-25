'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { ProductStatus } from '@/enums'
import { useBrands } from '@/features/brands'
import { useCategories } from '@/features/categories/hooks'
import { useCountriesOfOrigin } from '@/features/country-of-origin'
import { useProductsInfiniteScroll } from '@/features/product/hooks/use-products'
import { FindAllProductsQueryParams } from '@/features/product/types/product.types'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { cn } from '@/lib/utils'
import { InfiniteFetchingMode, LayoutMode } from '@/types'
import type { DialogWrapperProps } from '@/types/dialog.types'
import { capitalizeString } from '@/utilts/client.utils'
import { Check, ChevronDown, Hand, LayoutGrid, List, Plus, Scroll, Search, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface ObjectFilterType<NameType = string> {
  key: string
  name: NameType
}

interface ProductFilters {
  searchQuery?: string
  brand?: ObjectFilterType[]
  countryOfOrigin?: ObjectFilterType[]
  status?: ObjectFilterType<ProductStatus>[]
  categories?: ObjectFilterType[]
}

const productFilterSelectOptions: { value: keyof ProductFilters; label: string }[] = [
  { value: 'categories', label: 'Danh mục' },
  { value: 'brand', label: 'Thương hiệu' },
  { value: 'countryOfOrigin', label: 'Xuất xứ' },
  { value: 'status', label: 'Trạng thái' }
]

const MAX_DISPLAYING_FILTER_VALUES = 2

interface ProductListRowProps {
  product: any
  isSelected: boolean
  onToggleSelect: () => void
}

const ProductListRow = ({ product, isSelected, onToggleSelect }: ProductListRowProps) => (
  <div className='flex items-center gap-4 border-b p-4 hover:bg-gray-50' onClick={onToggleSelect}>
    <Checkbox checked={isSelected} />
    <div className='aspect-square w-10 shrink-0'>
      {product.images && product.images.length > 0 && (
        <Image
          width={0}
          height={0}
          sizes='100vw'
          src={product.images[0].url}
          alt={product.name}
          className='aspect-square h-full w-full rounded-md object-cover'
        />
      )}
    </div>
    <div className='line-clamp-2 flex-1 text-sm'>{product.name}</div>
  </div>
)

interface ProductCardProps {
  product: any
  isSelected: boolean
  onToggleSelect: () => void
}

const ProductCard = ({ product, isSelected, onToggleSelect }: ProductCardProps) => (
  <div
    className='relative flex flex-col items-center gap-2 rounded-lg border p-4 hover:bg-gray-50'
    onClick={onToggleSelect}
  >
    <div className='aspect-square w-20 shrink-0'>
      {product.images && product.images.length > 0 && (
        <Image
          width={0}
          height={0}
          sizes='100vw'
          src={product.images[0].url}
          alt={product.name}
          className='aspect-square h-full w-full rounded-md object-cover'
        />
      )}
    </div>
    <Checkbox checked={isSelected} className='absolute top-3 right-3' />
    <div className='line-clamp-2 text-center text-sm'>{product.name}</div>
  </div>
)

export function BrowseProductDialog({ config, onClose }: DialogWrapperProps<'browse-products'>) {
  // These below states is used for rendering the UI
  const [productFilters, setProductFilters] = React.useState<ProductFilters>({})
  const [selectedProductFilterOption, setSelectedProductFilterOption] = React.useState<
    { value: keyof ProductFilters; label: string }[]
  >([])

  // Filter state - The below state is used for storing the actual filter values that will be sent to the API
  // We separate it from the UI state to avoid unnecessary API calls when the user is still selecting filter options/values.
  const [productQueryParams, setProductQueryParams] = React.useState<FindAllProductsQueryParams>({
    limit: 1
  })

  const [layout, setLayout] = React.useState<LayoutMode>('list')
  const [infiniteFetchingMode, setInfiniteFetchingMode] =
    React.useState<InfiniteFetchingMode>('manual')
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([])

  const { data: categoriesData } = useCategories()
  const { data: brandsData } = useBrands()
  const { data: countriesOfOriginData } = useCountriesOfOrigin()

  // const { data: productsData, isFetching: isProductsFetching } = useProducts(productQueryParams)

  const {
    items: productList,
    sentinelRef,
    isLoading: isProductListLoading,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isError,
    error
  } = useProductsInfiniteScroll({
    params: productQueryParams,
    mode: infiniteFetchingMode
    // enabled: Object.keys(productQueryParams).length > 0 // Only enable the infinite scroll when there are query params to avoid loading all products at once
  })

  // Duplicate the products data to simulate a larger dataset for testing the table's performance and UI with more items. In a real application, you would implement pagination or infinite scrolling instead of loading all products at once.
  // const productList = React.useMemo(() => {
  //   if (!productsData?.data) return []
  //   const duplicatedProducts = []
  //   for (let i = 0; i < 5; i++) {
  //     duplicatedProducts.push(...productsData.data)
  //   }
  //   return duplicatedProducts
  // }, [productsData])

  const categoriesList = categoriesData?.data || []
  const brandList = brandsData?.data || []
  const countriesOfOriginList = countriesOfOriginData?.data || []

  const debouncedSetsearchQueryFilter = useDebouncedCallback((query: string) => {
    if (query.trim()) {
      setProductQueryParams((prev) => ({ ...prev, searchQuery: query }))
    } else {
      setProductQueryParams((prev) => {
        const updatedParams = { ...prev }
        delete updatedParams.searchQuery
        return updatedParams
      })
    }
  }, 800)

  const debouncedSetFilterValues = useDebouncedCallback(() => {
    const brandIds = productFilters.brand?.map((b) => b.key)
    const countryIds = productFilters.countryOfOrigin?.map((c) => c.key)
    const status = productFilters.status?.map((s) => s.key as ProductStatus)
    const categoryIds = productFilters.categories?.map((c) => c.key)

    setProductQueryParams({
      searchQuery: productFilters.searchQuery,
      brandIds: brandIds && brandIds.length > 0 ? brandIds : undefined,
      countryIds: countryIds && countryIds.length > 0 ? countryIds : undefined,
      status: status && status.length > 0 ? status : undefined,
      categoryIds: categoryIds && categoryIds.length > 0 ? categoryIds : undefined
    })
  }, 800)

  const handlesearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setProductFilters((prev) => ({ ...prev, searchQuery: query }))
    debouncedSetsearchQueryFilter(query)
  }

  const handleSelectFilterOption = (option: { value: keyof ProductFilters; label: string }) => {
    setSelectedProductFilterOption((prev) => {
      if (prev.some((o) => o.value === option.value)) {
        return prev.filter((o) => o.value !== option.value)
      }
      return [...prev, option]
    })

    setProductFilters((prev) => {
      if (prev[option.value]) {
        const updatedFilters = { ...prev }
        delete updatedFilters[option.value]
        return updatedFilters
      }

      return { ...prev, [option.value]: [] }
    })
  }

  const handleSelectFilterValue = (
    optionValue: keyof ProductFilters,
    objectFilter: ObjectFilterType
  ) => {
    setProductFilters((prev) => {
      const currentValues = prev[optionValue] || []
      const isSelected = (currentValues as ObjectFilterType[]).some(
        (v) => v.key === objectFilter.key
      )

      if (isSelected) {
        return {
          ...prev,
          [optionValue]: (currentValues as ObjectFilterType[]).filter(
            (v) => v.key !== objectFilter.key
          )
        }
      } else {
        return { ...prev, [optionValue]: [...currentValues, objectFilter] }
      }
    })
    debouncedSetFilterValues()
  }

  const handleRemoveProductFilterOption = (optionValue: keyof ProductFilters) => {
    setSelectedProductFilterOption((prev) => prev.filter((o) => o.value !== optionValue))
    setProductFilters((prev) => {
      const updatedFilters = { ...prev }
      delete updatedFilters[optionValue]
      return updatedFilters
    })
    debouncedSetFilterValues()
  }

  const handleRemoveAllProductFilterOptions = () => {
    setSelectedProductFilterOption([])
    setProductFilters({})
    debouncedSetFilterValues()
  }

  const handleChangeLayoutMode = (mode: LayoutMode) => (e: Event) => {
    e.preventDefault()
    setLayout(mode)
  }

  const handleChangeFetchMode = (mode: InfiniteFetchingMode) => (e: Event) => {
    e.preventDefault()
    setInfiniteFetchingMode(mode)
  }

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent
        className='max-w-3xl!'
        onCloseAutoFocus={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Chọn sản phẩm</DialogTitle>
        </DialogHeader>

        {/* Search and Filter Options Section */}
        <div>
          <div className='flex items-center justify-between gap-x-3'>
            <div
              className={cn(
                'relative flex flex-3 shrink-0 items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-1 transition-all'
              )}
            >
              <Search className='h-5 w-5 text-gray-400' />
              <Input
                type='text'
                placeholder={'Search products...'}
                value={productFilters.searchQuery || ''}
                onChange={handlesearchQueryChange}
                className='h-6 border-0 p-0 focus-visible:ring-0'
                autoComplete='off'
              />
              {productFilters.searchQuery && (
                <Button
                  size={'icon-xs'}
                  variant={'ghost'}
                  onClick={() => {
                    setProductFilters((prev) => ({ ...prev, searchQuery: '' }))
                    debouncedSetsearchQueryFilter('')
                  }}
                  className='rounded p-1 text-gray-400 hover:bg-gray-100'
                >
                  <X className='h-4 w-4' />
                </Button>
              )}
            </div>

            {/* Dropdwn components for view mode and fetch mode: scroll or manual */}
            <div className='flex items-center justify-end gap-x-2'>
              {/* View mode dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='gap-x-0.5'>
                    {layout === 'grid' ? (
                      <LayoutGrid className='h-4 w-4' />
                    ) : (
                      <List className='h-4 w-4' />
                    )}
                    <ChevronDown className='h-2 w-2' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='min-w-40' align='end'>
                  {[
                    { value: 'list', icon: List },
                    { value: 'grid', icon: LayoutGrid }
                  ].map((option) => (
                    <DropdownMenuItem
                      className={cn(
                        'cursor-pointer',
                        layout === option.value ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                      )}
                      key={option.value}
                      onSelect={handleChangeLayoutMode(option.value as LayoutMode)}
                    >
                      {option.icon && <option.icon className='h-4 w-4' />}
                      <span>{capitalizeString(option.value)} view</span>
                      {option.value === layout && (
                        <Check className='ml-auto h-4 w-4 stroke-black' />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Fetch mode dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='gap-x-0.5'>
                    {infiniteFetchingMode === 'scroll' ? (
                      <Scroll className='h-4 w-4' />
                    ) : (
                      <Hand className='h-4 w-4' />
                    )}
                    <ChevronDown className='h-2 w-2' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='min-w-40' align='end'>
                  {[
                    { value: 'scroll', icon: Scroll },
                    { value: 'manual', icon: Hand }
                  ].map((option) => (
                    <DropdownMenuItem
                      className={cn(
                        'cursor-pointer',
                        infiniteFetchingMode === option.value
                          ? 'bg-gray-100 font-medium'
                          : 'hover:bg-gray-50'
                      )}
                      key={option.value}
                      onSelect={handleChangeFetchMode(option.value as InfiniteFetchingMode)}
                    >
                      {option.icon && <option.icon className='h-4 w-4' />}
                      <span>{capitalizeString(option.value)} mode</span>
                      {option.value === infiniteFetchingMode && (
                        <Check className='ml-auto h-4 w-4 stroke-black' />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className='mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5'>
            {/* Render filter badges */}
            {selectedProductFilterOption.map((option) => {
              const filterValues = productFilters[option.value] as ObjectFilterType[] | undefined

              if (filterValues === undefined) {
                return null
              }

              const filterValueNames = filterValues.map((v) => v.name).join(', ')

              // Limit the number of displayed filter values to MAX_DISPLAYING_FILTER_VALUES and add "..." if there are more
              const displayedFilterValueNames =
                filterValues.length > MAX_DISPLAYING_FILTER_VALUES
                  ? filterValues
                      .slice(0, MAX_DISPLAYING_FILTER_VALUES)
                      .map((v) => v.name)
                      .join(', ') +
                    `, + ${filterValues.length - MAX_DISPLAYING_FILTER_VALUES} more...`
                  : filterValueNames

              // Render the DropdownMenuTrigger as a badge when the filter value is an empty array or not-empty array
              return (
                <DropdownMenu
                  key={option.value}
                  defaultOpen={true}
                  onOpenChange={(open) => {
                    if (!open && filterValues.length === 0) {
                      handleRemoveProductFilterOption(option.value)
                    }
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <Badge
                      variant={'outline'}
                      className='cursor-pointer rounded-md font-normal transition-all duration-150'
                    >
                      {filterValues.length === 0
                        ? option.label
                        : `${option.label}: ${displayedFilterValueNames}`}

                      {filterValueNames.length === 0 ? (
                        <ChevronDown className='ml-1 h-3 w-3' />
                      ) : (
                        <span
                          onClick={(e) => {
                            // e.stopPropagation()
                            e.preventDefault()

                            handleRemoveProductFilterOption(option.value)
                          }}
                        >
                          <X className='pointer-events-auto ml-1 h-3 w-3' />
                        </span>
                      )}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start'>
                    {(() => {
                      switch (option.value) {
                        case 'brand':
                          return brandList.map((brand) => {
                            const isSelected = filterValues.some((v) => v.key === brand.id)
                            return (
                              <DropdownMenuItem
                                key={brand.id}
                                onSelect={(e) => {
                                  e.preventDefault()
                                  handleSelectFilterValue(option.value, {
                                    key: brand.id,
                                    name: brand.name
                                  })
                                }}
                              >
                                <div className='flex w-full items-center gap-x-2'>
                                  <Checkbox checked={isSelected} />
                                  <span>{brand.name}</span>
                                </div>
                              </DropdownMenuItem>
                            )
                          })

                        case 'countryOfOrigin':
                          return countriesOfOriginList.map((country) => {
                            const isSelected = filterValues.some((v) => v.key === country.id)
                            return (
                              <DropdownMenuItem
                                key={country.id}
                                onSelect={(e) => {
                                  e.preventDefault()

                                  handleSelectFilterValue(option.value, {
                                    key: country.id,
                                    name: country.name
                                  })
                                }}
                              >
                                <div className='flex w-full items-center gap-x-2'>
                                  <Checkbox checked={isSelected} />
                                  <span>{country.name}</span>
                                </div>
                              </DropdownMenuItem>
                            )
                          })

                        case 'categories':
                          return categoriesList.map((category) => {
                            const isSelected = filterValues.some((v) => v.key === category.id)
                            return (
                              <DropdownMenuItem
                                key={category.id}
                                onSelect={(e) => {
                                  e.preventDefault()
                                  handleSelectFilterValue(option.value, {
                                    key: category.id,
                                    name: category.name
                                  })
                                }}
                              >
                                <div className='flex w-full items-center gap-x-2'>
                                  <Checkbox checked={isSelected} />
                                  <span>{category.name}</span>
                                </div>
                              </DropdownMenuItem>
                            )
                          })

                        case 'status':
                          return Object.values(ProductStatus).map((status) => {
                            const isSelected = (filterValues as ObjectFilterType[]).some(
                              (v) => v.key === status
                            )
                            return (
                              <DropdownMenuItem
                                key={status}
                                onSelect={(e) => {
                                  e.preventDefault()
                                  handleSelectFilterValue(option.value, {
                                    key: status,
                                    name: status
                                  })
                                }}
                              >
                                <div className='flex w-full items-center gap-x-2'>
                                  <Checkbox checked={isSelected} />
                                  <span>{status}</span>
                                </div>
                              </DropdownMenuItem>
                            )
                          })
                        default:
                          return null
                      }
                    })()}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            })}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Badge
                  variant={'outline'}
                  className='cursor-pointer rounded-md border-dashed font-normal transition-all duration-150 hover:border-solid'
                >
                  <span>Add filter</span>
                  <Plus className='ml-1 h-3 w-3' />
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                {productFilterSelectOptions.map((option) => {
                  const isSelected = productFilters[option.value] !== undefined

                  return (
                    <DropdownMenuItem
                      disabled={isSelected}
                      key={option.value}
                      onSelect={() => handleSelectFilterOption(option)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedProductFilterOption.length > 0 && (
              <button
                onClick={handleRemoveAllProductFilterOptions}
                className='ml-2 cursor-pointer rounded text-xs hover:underline'
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Product Table */}
        <div className='custom-scrollbar h-[40vh] w-full overflow-auto'>
          {isError ? (
            <div className='flex h-full items-center justify-center'>
              <span className='text-sm text-red-500'>
                {error?.message || 'Failed to load products.'}
              </span>
            </div>
          ) : (
            <React.Fragment>
              {isProductListLoading || (isFetching && !isFetchingNextPage) ? (
                <div className='flex h-full items-center justify-center'>
                  <Spinner className='h-10 w-10' />
                </div>
              ) : (
                <React.Fragment>
                  {productList.length === 0 ? (
                    <div className='flex h-full items-center justify-center'>
                      Không tìm thấy sản phẩm
                    </div>
                  ) : layout === 'list' ? (
                    <div className='space-y-0'>
                      {productList.map((product) => (
                        <ProductListRow
                          key={product.id}
                          product={product}
                          isSelected={selectedProducts.includes(product.id)}
                          onToggleSelect={() => {
                            setSelectedProducts((prev) =>
                              prev.includes(product.id)
                                ? prev.filter((id) => id !== product.id)
                                : [...prev, product.id]
                            )
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
                      {productList.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isSelected={selectedProducts.includes(product.id)}
                          onToggleSelect={() => {
                            setSelectedProducts((prev) =>
                              prev.includes(product.id)
                                ? prev.filter((id) => id !== product.id)
                                : [...prev, product.id]
                            )
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Scroll mode or Manual mode based on infiniteFetchingMode */}
                  {infiniteFetchingMode === 'scroll' ? (
                    <>
                      {/* Sentinel observed by IntersectionObserver inside useInfiniteScroll */}
                      <div ref={sentinelRef} aria-hidden='true' />

                      {isFetchingNextPage && (
                        <div className='text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm'>
                          <Spinner className='h-4 w-4' />
                          Loading more…
                        </div>
                      )}

                      {!hasNextPage && !isFetchingNextPage && productList.length > 0 && (
                        <p className='text-muted-foreground py-6 text-center text-sm'>
                          Đã hiển thị tất cả sản phẩm
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      {/* View more button */}
                      {hasNextPage && (
                        <div className='mt-8 flex justify-center'>
                          <Button
                            variant={'outline'}
                            size={'sm'}
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className='hover:bg-accent rounded-lg border px-6 py-2 text-sm font-medium transition-colors disabled:opacity-50'
                          >
                            {isFetchingNextPage ? (
                              <div className='flex items-center gap-2'>
                                <Spinner className='h-4 w-4' />
                                <span>Loading…</span>
                              </div>
                            ) : (
                              <div className='flex items-center gap-x-1'>
                                <Plus className='h-4 w-4' />
                                <span>View more</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      )}

                      {!hasNextPage && productList.length > 0 && (
                        <p className='text-muted-foreground mt-8 text-center text-sm'>
                          Đã hiển thị tất cả sản phẩm
                        </p>
                      )}
                    </>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              Hủy
            </Button>
          </DialogClose>
          <Button>Lưu ({selectedProducts.length})</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
