import { ColumnDef } from '@tanstack/react-table'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import * as React from 'react'

import { SortOrder } from '@/enums'
import { getSortingStateParser } from '@/lib/parsers'

export const useBrandQueryParams = (columns: ColumnDef<any, any>[]) => {
  const columnIds = React.useMemo(() => {
    return new Set(columns.map((column) => column.id).filter(Boolean) as string[])
  }, [columns])

  const schema = React.useMemo(
    () => ({
      page: parseAsInteger.withDefault(1),
      perPage: parseAsInteger.withDefault(10),
      sort: getSortingStateParser(columnIds).withDefault([]),
      name: parseAsString.withDefault('')
    }),
    [columnIds]
  )

  const [query] = useQueryStates(schema)

  const { page, perPage, sort: sorting, name: search } = query

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined
  const sortOrder =
    sorting.length > 0 ? ((sorting[0].desc ? 'desc' : 'asc') as SortOrder) : undefined

  return {
    page,
    perPage,
    sorting,
    search,
    sortBy,
    sortOrder
  }
}
