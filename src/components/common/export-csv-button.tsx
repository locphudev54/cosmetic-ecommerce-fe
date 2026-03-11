import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface ExportCsvButtonProps<T> {
  data: T[]
  filename?: string
  headers?: string[]
  fields?: (keyof T)[]
  transform?: (item: T) => Record<string, any>
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  children?: React.ReactNode
}

export function ExportCsvButton<T extends Record<string, any>>({
  data,
  filename = 'export.csv',
  headers,
  fields,
  transform,
  variant = 'outline',
  size = 'sm',
  disabled = false,
  children
}: ExportCsvButtonProps<T>) {
  const exportToCSV = () => {
    if (data.length === 0) return

    let csvHeaders: string[]
    let csvData: Record<string, any>[]

    if (transform) {
      csvData = data.map(transform)
      csvHeaders = headers || Object.keys(csvData[0] || {})
    } else {
      const selectedFields = fields || (Object.keys(data[0] || {}) as (keyof T)[])
      csvHeaders = headers || selectedFields.map(String)
      csvData = data.map((item) => {
        const obj: Record<string, any> = {}
        selectedFields.forEach((field, index) => {
          const key = headers ? headers[index] : String(field)
          obj[key] = item[field]
        })
        return obj
      })
    }

    const rows = csvData.map((row) =>
      csvHeaders
        .map((header) => {
          const value = row[header]
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          const stringValue = String(value ?? '')
          if (
            stringValue.includes(',') ||
            stringValue.includes('"') ||
            stringValue.includes('\n')
          ) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        .join(',')
    )

    const csvContent = [csvHeaders.join(','), ...rows].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  return (
    <Button onClick={exportToCSV} variant={variant} size={size} disabled={disabled}>
      <Download className='mr-2 h-4 w-4' />
      {children || 'Export'}
    </Button>
  )
}
