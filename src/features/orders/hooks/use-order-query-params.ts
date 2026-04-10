import { ColumnDef } from '@tanstack/react-table'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import * as React from 'react'

import { SortOrder } from '@/enums'
import { getOrderSearchParser, getOrderStatusParser } from '@/features/orders/lib/query-parsers'
import { getSortingStateParser } from '@/lib/parsers'

export const useOrderQueryParams = (columns: ColumnDef<any, any>[]) => {
  const columnIds = React.useMemo(() => {
    return new Set(columns.map((column) => column.id).filter(Boolean) as string[])
  }, [columns])

  const schema = React.useMemo(
    () => ({
      page: parseAsInteger.withDefault(1),
      perPage: parseAsInteger.withDefault(10),
      sort: getSortingStateParser(columnIds).withDefault([]),
      status: getOrderStatusParser().withDefault([]),
      code: getOrderSearchParser().withDefault(''),
      startDate: parseAsString,
      endDate: parseAsString,
      timezone: parseAsString
    }),
    [columnIds]
  )

  const [query] = useQueryStates(schema)

  const {
    page,
    perPage,
    sort: sorting,
    status,
    code: search,
    startDate: startDateRaw,
    endDate: endDateRaw,
    timezone: timezoneRaw
  } = query

  const startDate = startDateRaw || undefined
  const endDate = endDateRaw || undefined
  const timezone = timezoneRaw || undefined

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined
  const sortOrder =
    sorting.length > 0 ? ((sorting[0].desc ? 'desc' : 'asc') as SortOrder) : undefined

  return {
    page,
    perPage,
    sorting,
    status,
    search,
    sortBy,
    sortOrder,
    startDate,
    endDate,
    timezone
  }
}
