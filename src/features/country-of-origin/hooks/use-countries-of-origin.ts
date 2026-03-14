import { countryOfOriginService } from '@/features/country-of-origin/services/country-of-origin.service'
import {
  CreateCountryOfOriginDto,
  FindAllCountriesOfOriginQueryParams,
  UpdateCountryOfOriginDto
} from '@/features/country-of-origin/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const COUNTRY_OF_ORIGIN_QUERY_KEYS = {
  all: ['country-of-origin'] as const,
  lists: () => [...COUNTRY_OF_ORIGIN_QUERY_KEYS.all, 'list'] as const,
  list: (params?: FindAllCountriesOfOriginQueryParams) =>
    [...COUNTRY_OF_ORIGIN_QUERY_KEYS.lists(), params] as const,
  details: () => [...COUNTRY_OF_ORIGIN_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...COUNTRY_OF_ORIGIN_QUERY_KEYS.details(), id] as const
}

export const useCountriesOfOrigin = (
  params?: FindAllCountriesOfOriginQueryParams,
  enabled?: boolean
) => {
  return useQuery({
    queryKey: COUNTRY_OF_ORIGIN_QUERY_KEYS.list(params),
    queryFn: () => countryOfOriginService.getCountriesOfOrigin(params),
    enabled
  })
}

export const useCountryOfOrigin = (id: string) => {
  return useQuery({
    queryKey: COUNTRY_OF_ORIGIN_QUERY_KEYS.detail(id),
    queryFn: () => countryOfOriginService.getCountryOfOriginById(id),
    enabled: !!id
  })
}

export const useCreateCountryOfOrigin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCountryOfOriginDto) =>
      countryOfOriginService.createCountryOfOrigin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUNTRY_OF_ORIGIN_QUERY_KEYS.lists() })
    }
  })
}

export const useUpdateCountryOfOrigin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCountryOfOriginDto }) =>
      countryOfOriginService.updateCountryOfOrigin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUNTRY_OF_ORIGIN_QUERY_KEYS.lists() })
    }
  })
}

export const useDeleteCountryOfOrigin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => countryOfOriginService.deleteCountryOfOrigin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUNTRY_OF_ORIGIN_QUERY_KEYS.lists() })
    }
  })
}
