import { brandService } from '@/features/brands/services/brand.service'
import { CreateBrandDto, FindAllBrandsQueryParams, UpdateBrandDto } from '@/features/brands/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const BRAND_QUERY_KEYS = {
  all: ['brands'] as const,
  lists: () => [...BRAND_QUERY_KEYS.all, 'list'] as const,
  list: (params?: FindAllBrandsQueryParams) => [...BRAND_QUERY_KEYS.lists(), params] as const,
  details: () => [...BRAND_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...BRAND_QUERY_KEYS.details(), id] as const
}

export const useBrands = (params?: FindAllBrandsQueryParams, enabled?: boolean) => {
  return useQuery({
    queryKey: BRAND_QUERY_KEYS.list(params),
    queryFn: () => brandService.getBrands(params),
    enabled
  })
}

export const useBrand = (id: string) => {
  return useQuery({
    queryKey: BRAND_QUERY_KEYS.detail(id),
    queryFn: () => brandService.getBrandById(id),
    enabled: !!id
  })
}

export const useCreateBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBrandDto) => brandService.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEYS.lists() })
    }
  })
}

export const useUpdateBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandDto }) =>
      brandService.updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEYS.lists() })
    }
  })
}

export const useDeleteBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => brandService.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEYS.lists() })
    }
  })
}
