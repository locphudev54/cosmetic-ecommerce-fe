import { categoryService } from '@/features/categories/services/category.service'
import {
  CreateCategoryDto,
  FindAllCategoriesQueryParams,
  GetCategoryTreeQueryParams,
  UpdateCategoryDto
} from '@/features/categories/types'
import { DateRangeQueryParams } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const CATEGORY_QUERY_KEYS = {
  all: ['categories'] as const,
  lists: () => [...CATEGORY_QUERY_KEYS.all, 'list'] as const,
  tree: (params?: GetCategoryTreeQueryParams) =>
    [...CATEGORY_QUERY_KEYS.all, 'tree', params] as const,
  list: (params?: FindAllCategoriesQueryParams) =>
    [...CATEGORY_QUERY_KEYS.lists(), params] as const,
  details: () => [...CATEGORY_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CATEGORY_QUERY_KEYS.details(), id] as const
}

export const useCategories = (
  params?: FindAllCategoriesQueryParams & DateRangeQueryParams,
  enabled?: boolean
) => {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.list(params),
    queryFn: () => categoryService.getCategories(params),
    enabled
  })
}

export const useCategoryTree = (params: GetCategoryTreeQueryParams) => {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.tree(),
    queryFn: () => categoryService.getCategoryTree(params)
  })
}

export const useCategory = (id?: string) => {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.detail(id!),
    queryFn: () => categoryService.getCategoryById(id!),
    enabled: !!id
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.tree() })
    }
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.tree() })
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.detail(variables.id) })
    }
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.tree() })
    }
  })
}

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => categoryService.bulkDeleteCategories(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.tree() })
    }
  })
}
