import { collectionService } from '@/features/collections/services/collection.service'
import {
  CreateCollectionDto,
  FindAllCollectionsQueryParams,
  UpdateCollectionDto
} from '@/features/collections/types'
import { DateRangeQueryParams } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const COLLECTION_QUERY_KEYS = {
  all: ['collections'] as const,
  lists: () => [...COLLECTION_QUERY_KEYS.all, 'list'] as const,
  list: (params?: FindAllCollectionsQueryParams) =>
    [...COLLECTION_QUERY_KEYS.lists(), params] as const,
  details: () => [...COLLECTION_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...COLLECTION_QUERY_KEYS.details(), id] as const
}

export const useCollections = (params?: FindAllCollectionsQueryParams & DateRangeQueryParams) => {
  return useQuery({
    queryKey: COLLECTION_QUERY_KEYS.list(params),
    queryFn: () => collectionService.getCollections(params)
  })
}

export const useCollection = (id?: string) => {
  return useQuery({
    queryKey: COLLECTION_QUERY_KEYS.detail(id!),
    queryFn: () => collectionService.getCollectionById(id!),
    enabled: !!id
  })
}

export const useCollectionDetailBySlug = (slug?: string, enabled?: boolean) => {
  return useQuery({
    queryKey: COLLECTION_QUERY_KEYS.detail(slug!),
    queryFn: () => collectionService.getCollectionBySlug(slug!),
    enabled: !!slug && enabled !== false
  })
}

export const useCreateCollection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCollectionDto) => collectionService.createCollection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.lists() })
    }
  })
}

export const useUpdateCollection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCollectionDto }) =>
      collectionService.updateCollection(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.detail(variables.id) })
    }
  })
}

export const useDeleteCollection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => collectionService.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.lists() })
    }
  })
}

export const useBulkDeleteCollections = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => collectionService.bulkDeleteCollections(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.lists() })
    }
  })
}
