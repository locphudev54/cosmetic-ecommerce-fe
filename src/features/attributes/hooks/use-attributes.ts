import { attributeService } from '@/features/attributes/services/attribute.service'
import {
  CreateAttributeDto,
  FindAllAttributesQueryParams,
  UpdateAttributeDto
} from '@/features/attributes/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const ATTRIBUTE_QUERY_KEYS = {
  all: ['attributes'] as const,
  lists: () => [...ATTRIBUTE_QUERY_KEYS.all, 'list'] as const,
  list: (params?: FindAllAttributesQueryParams) =>
    [...ATTRIBUTE_QUERY_KEYS.lists(), params] as const,
  details: () => [...ATTRIBUTE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ATTRIBUTE_QUERY_KEYS.details(), id] as const
}

export const useAttributes = (params?: FindAllAttributesQueryParams, enabled?: boolean) => {
  return useQuery({
    queryKey: ATTRIBUTE_QUERY_KEYS.list(params),
    queryFn: () => attributeService.getAttributes(params),
    enabled
  })
}

export const useAttribute = (id: string) => {
  return useQuery({
    queryKey: ATTRIBUTE_QUERY_KEYS.detail(id),
    queryFn: () => attributeService.getAttributeById(id),
    enabled: !!id
  })
}

export const useCreateAttribute = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAttributeDto) => attributeService.createAttribute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTRIBUTE_QUERY_KEYS.lists() })
    }
  })
}

export const useUpdateAttribute = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAttributeDto }) =>
      attributeService.updateAttribute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTRIBUTE_QUERY_KEYS.lists() })
    }
  })
}

export const useDeleteAttribute = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => attributeService.deleteAttribute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTRIBUTE_QUERY_KEYS.lists() })
    }
  })
}

export const useBulkDeleteAttributes = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => attributeService.bulkDeleteAttributes(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTRIBUTE_QUERY_KEYS.lists() })
    }
  })
}
