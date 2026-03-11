'use client'

import { DateInput } from '@/components/common/date-input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { parseAsString, useQueryStates } from 'nuqs'
import * as React from 'react'

export interface DateRange {
  from: Date
  to: Date | undefined
}

interface Preset {
  name: string
  label: string
}

const PRESETS: Preset[] = [
  { name: 'today', label: 'Today' },
  { name: 'yesterday', label: 'Yesterday' },
  { name: 'last7', label: 'Last 7 days' },
  { name: 'last14', label: 'Last 14 days' },
  { name: 'last30', label: 'Last 30 days' },
  { name: 'thisWeek', label: 'This Week' },
  { name: 'lastWeek', label: 'Last Week' },
  { name: 'thisMonth', label: 'This Month' },
  { name: 'lastMonth', label: 'Last Month' }
]

export interface DateRangePickerProps {
  onUpdate?: (values: { range: DateRange }) => void
  initialDateFrom?: Date | string
  initialDateTo?: Date | string
  align?: 'start' | 'center' | 'end'
  locale?: string
  className?: string
}

const formatDate = (date: Date, locale = 'en-us'): string => {
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatToUrl = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === 'string') {
    const parts = dateInput.split('-').map((part) => Number.parseInt(part, 10))
    return new Date(parts[0], parts[1] - 1, parts[2])
  }
  return dateInput
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
  initialDateTo,
  onUpdate,
  align = 'center',
  locale = 'en-US',
  className
}) => {
  const schema = React.useMemo(
    () => ({
      startDate: parseAsString,
      endDate: parseAsString,
      timezone: parseAsString
    }),
    []
  )

  const [query, setQuery] = useQueryStates(schema)

  const [isOpen, setIsOpen] = React.useState(false)
  const [range, setRange] = React.useState<DateRange>({
    from: getDateAdjustedForTimezone(initialDateFrom),
    to: initialDateTo
      ? getDateAdjustedForTimezone(initialDateTo)
      : getDateAdjustedForTimezone(initialDateFrom)
  })

  React.useEffect(() => {
    if (query.startDate) {
      const from = new Date(query.startDate)
      const to = query.endDate ? new Date(query.endDate) : undefined
      setRange({ from, to })
    }
  }, [query.startDate, query.endDate])

  const openedRangeRef = React.useRef<DateRange>(range)
  const [selectedPreset, setSelectedPreset] = React.useState<string | undefined>(undefined)
  const [calendarMonths, setCalendarMonths] = React.useState<[Date, Date]>(() => {
    const now = new Date()
    const nextMonth = new Date(now)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    return [now, nextMonth]
  })

  const getPresetRange = React.useCallback((presetName: string): DateRange => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()) // Start of today

    switch (presetName) {
      case 'today':
        return {
          from: new Date(today),
          to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
        }
      case 'yesterday': {
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        return {
          from: new Date(yesterday),
          to: new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate(),
            23,
            59,
            59,
            999
          )
        }
      }
      case 'last7': {
        const from = new Date(today)
        from.setDate(from.getDate() - 6)
        return {
          from,
          to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
        }
      }
      case 'last14': {
        const from = new Date(today)
        from.setDate(from.getDate() - 13)
        return {
          from,
          to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
        }
      }
      case 'last30': {
        const from = new Date(today)
        from.setDate(from.getDate() - 29)
        return {
          from,
          to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
        }
      }
      case 'thisWeek': {
        const dayOfWeek = today.getDay() // 0 = Sunday
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - dayOfWeek)
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        endOfWeek.setHours(23, 59, 59, 999)
        return { from: startOfWeek, to: endOfWeek }
      }
      case 'lastWeek': {
        const dayOfWeek = today.getDay()
        const startOfLastWeek = new Date(today)
        startOfLastWeek.setDate(today.getDate() - dayOfWeek - 7)
        const endOfLastWeek = new Date(startOfLastWeek)
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6)
        endOfLastWeek.setHours(23, 59, 59, 999)
        return { from: startOfLastWeek, to: endOfLastWeek }
      }
      case 'thisMonth': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)
        return { from: startOfMonth, to: endOfMonth }
      }
      case 'lastMonth': {
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999)
        return { from: startOfLastMonth, to: endOfLastMonth }
      }
      default:
        throw new Error(`Unknown date range preset: ${presetName}`)
    }
  }, [])

  const setPreset = (preset: string): void => {
    const newRange = getPresetRange(preset)
    setRange(newRange)
    setSelectedPreset(preset)
    if (newRange.from) {
      const from = newRange.from
      const nextMonth = new Date(from)
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      setCalendarMonths([from, nextMonth])
    }
  }

  const checkPreset = React.useCallback(() => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name)
      if (
        presetRange.from.getTime() === range.from.getTime() &&
        presetRange.to?.getTime() === range.to?.getTime()
      ) {
        setSelectedPreset(preset.name)
        return
      }
    }
    setSelectedPreset(undefined)
  }, [range, getPresetRange])

  const resetValues = (): void => {
    setRange({
      from: getDateAdjustedForTimezone(initialDateFrom),
      to: initialDateTo
        ? getDateAdjustedForTimezone(initialDateTo)
        : getDateAdjustedForTimezone(initialDateFrom)
    })
    setSelectedPreset(undefined)
    const now = new Date()
    const nextMonth = new Date(now)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCalendarMonths([now, nextMonth])
  }

  React.useEffect(() => {
    checkPreset()
  }, [checkPreset])

  const PresetButton = ({
    preset,
    label,
    isSelected
  }: {
    preset: string
    label: string
    isSelected: boolean
  }) => (
    <Button
      className={cn('justify-start', isSelected && 'bg-muted')}
      variant='ghost'
      onClick={() => setPreset(preset)}
    >
      <CheckIcon className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
      {label}
    </Button>
  )

  const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
    if (!a || !b) return a === b
    return (
      a.from.getTime() === b.from.getTime() && (!a.to || !b.to || a.to.getTime() === b.to.getTime())
    )
  }

  React.useEffect(() => {
    if (!isOpen) {
      openedRangeRef.current = range
    }
  }, [isOpen, range])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-full justify-start text-left text-xs font-normal text-wrap sm:w-[300px]',
            className
          )}
        >
          {formatDate(range.from, locale)}
          {range.to && (
            <>
              <ChevronDownIcon className='mx-2 h-4 w-4' />
              {formatDate(range.to, locale)}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align={align} sideOffset={4}>
        <div className='flex flex-col gap-4 p-4 lg:flex-row'>
          {/* Calendar Section */}
          <div className='space-y-4'>
            <div className='hidden space-x-4 lg:flex'>
              {/* Two calendars side by side for desktop */}
              <Calendar
                mode='range'
                selected={range}
                onSelect={(newRange) => newRange && setRange(newRange as DateRange)}
                month={calendarMonths[0]}
                onMonthChange={(month) => {
                  const nextMonth = new Date(month)
                  nextMonth.setMonth(nextMonth.getMonth() + 1)
                  setCalendarMonths([month, nextMonth])
                }}
                className='rounded-md border'
              />
              <Calendar
                mode='range'
                selected={range}
                onSelect={(newRange) => newRange && setRange(newRange as DateRange)}
                month={calendarMonths[1]}
                onMonthChange={(month) => {
                  const prevMonth = new Date(month)
                  prevMonth.setMonth(prevMonth.getMonth() - 1)
                  setCalendarMonths([prevMonth, month])
                }}
                className='rounded-md border'
              />
            </div>

            {/* Single calendar for mobile */}
            <div className='lg:hidden'>
              <Calendar
                mode='range'
                selected={range}
                onSelect={(newRange) => newRange && setRange(newRange as DateRange)}
                className='rounded-md border'
              />
            </div>

            <div className='flex items-center justify-between'>
              <DateInput
                value={range.from}
                onChange={(date) => {
                  const toDate = range.to == null || date > range.to ? date : range.to
                  setRange((prevRange) => ({
                    ...prevRange,
                    from: date,
                    to: toDate
                  }))
                }}
              />
              <ChevronDownIcon className='mx-2 h-4 w-4' />
              <DateInput
                value={range.to}
                onChange={(date) => {
                  const fromDate = date < range.from ? date : range.from
                  setRange((prevRange) => ({
                    ...prevRange,
                    from: fromDate,
                    to: date
                  }))
                }}
              />
            </div>
          </div>

          {/* Presets Section */}
          <div className='space-y-2 lg:border-l lg:pl-4'>
            <h3 className='text-sm font-medium'>Presets</h3>
            <div className='grid grid-cols-2 gap-1 lg:grid-cols-1'>
              {PRESETS.map((preset) => (
                <PresetButton
                  key={preset.name}
                  preset={preset.name}
                  label={preset.label}
                  isSelected={selectedPreset === preset.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className='flex items-center justify-end gap-2 border-t p-4'>
          <Button
            variant='ghost'
            onClick={() => {
              setIsOpen(false)
              resetValues()
              setQuery({
                startDate: formatToUrl(getDateAdjustedForTimezone(initialDateFrom)),
                endDate: initialDateTo
                  ? formatToUrl(getDateAdjustedForTimezone(initialDateTo))
                  : undefined,
                // America/Los_Angeles in in UMT-7 or UTC-8. So if server is in Vietnam (UMT+7) and client is in Los Angeles
                // => We need to add or increase timezone by 14 hours to get the correct date range for the server
                // But if client is also in Vietnam, we can just use the local timezone because the server will interpret the date range as local time
                // timezone: 'America/Los_Angeles'
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
              })
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false)
              if (!areRangesEqual(range, openedRangeRef.current)) {
                onUpdate?.({ range })
              }
              setQuery({
                startDate: formatToUrl(range.from),
                endDate: range.to ? formatToUrl(range.to) : undefined,
                // timezone: 'America/Los_Angeles'
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
              })
            }}
          >
            Update
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

DateRangePicker.displayName = 'DateRangePicker'
