'use client'

import {
  Combobox,
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger
} from '@/components/ui/combobox'
import { Button } from '@/components/ui/button'
import { useCountriesOfOrigin } from '@/features/country-of-origin/hooks'
import { CountryOfOrigin } from '@/features/country-of-origin/types'
import { useDialog } from '@/hooks/use-dialog'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ChevronDown, PenLine, Plus } from 'lucide-react'
import React, { useDeferredValue } from 'react'

interface SelectCountryOfOriginComboboxProps {
  value?: string
  onChange?: (countryId: string) => void
}

export function SelectCountryOfOriginCombobox({
  value,
  onChange
}: SelectCountryOfOriginComboboxProps) {
  const dialog = useDialog()
  const [inputValue, setInputValue] = React.useState('')
  const [content, setContent] = React.useState<React.ComponentRef<'div'> | null>(null)
  const deferredInputValue = useDeferredValue(inputValue)

  const { data: countriesData } = useCountriesOfOrigin({ getAll: true })

  const countryList = React.useMemo(() => countriesData?.data ?? [], [countriesData?.data])

  const filteredCountries = React.useMemo(() => {
    if (!deferredInputValue) return countryList
    const normalized = deferredInputValue.toLowerCase()
    return countryList.filter((country) => country.name.toLowerCase().includes(normalized))
  }, [countryList, deferredInputValue])

  const virtualizer = useVirtualizer({
    count: filteredCountries.length,
    getScrollElement: () => content,
    estimateSize: () => 32,
    overscan: 20
  })

  const handleInputValueChange = React.useCallback(
    (val: string) => {
      setInputValue(val)
      if (content) {
        content.scrollTop = 0
        virtualizer.measure()
      }
    },
    [content, virtualizer]
  )

  React.useEffect(() => {
    if (content) virtualizer.measure()
  }, [content, filteredCountries, virtualizer])

  const selectedCountry = React.useMemo(
    () => countryList.find((c) => c.id === value),
    [countryList, value]
  )

  const comboboxValue = selectedCountry
    ? JSON.stringify({ countryName: selectedCountry.name, countryId: selectedCountry.id })
    : ''

  const handleValueChange = async (val: string) => {
    if (!val) {
      onChange?.('')
      setInputValue('')
      return
    }

    try {
      const parsed = JSON.parse(val)
      if (parsed.countryId === 'add-new-country') {
        const result = await dialog.open('upsert-country-of-origin', { countryOfOrigin: null })
        if (result && result.actionType === 'create' && result.data) {
          onChange?.(result.data.id)
          setInputValue(result.data.name)
        }
        return
      }
      onChange?.(parsed.countryId)
      setInputValue(parsed.countryName)
    } catch {
      // ignore parse errors
    }
  }

  return (
    <Combobox
      value={comboboxValue}
      inputValue={selectedCountry ? selectedCountry.name : inputValue}
      onInputValueChange={handleInputValueChange}
      onValueChange={handleValueChange}
      manualFiltering
    >
      <ComboboxAnchor>
        <ComboboxInput placeholder='Chọn xuất xứ' />
        <ComboboxTrigger>
          <ChevronDown className='h-4 w-4' />
        </ComboboxTrigger>
      </ComboboxAnchor>
      <ComboboxContent
        ref={(node) => setContent(node)}
        className='custom-scrollbar relative max-h-75 overflow-x-hidden overflow-y-auto'
      >
        <ComboboxEmpty>
          <div>Không tìm thấy xuất xứ nào</div>
        </ComboboxEmpty>
        <div className='relative w-full' style={{ height: `${virtualizer.getTotalSize()}px` }}>
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const country = filteredCountries[virtualItem.index]
            return (
              <ComboboxItem
                key={country.id}
                value={JSON.stringify({ countryName: country.name, countryId: country.id })}
                className='absolute top-0 left-0 w-full'
                style={{ transform: `translateY(${virtualItem.start}px)` }}
              >
                <div className='group flex items-center justify-between'>
                  <span>{country.name}</span>
                  <Button
                    onClick={async (e) => {
                      e.stopPropagation()
                      const result = await dialog.open('upsert-country-of-origin', {
                        countryOfOrigin: country
                      })
                      // If the updated country is the currently selected one, refresh the display name
                      if (result && result.actionType === 'update' && result.data?.id === value) {
                        setInputValue(result.data.name)
                      }
                    }}
                    type='button'
                    className='cursor-pointer'
                    size={'icon-xs' as any}
                    variant={'ghost'}
                  >
                    <PenLine
                      className='size-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100'
                      strokeWidth={1.5}
                    />
                  </Button>
                </div>
              </ComboboxItem>
            )
          })}
        </div>
        <ComboboxItem
          key='add-new-country'
          value={JSON.stringify({ countryName: 'add-new-country', countryId: 'add-new-country' })}
        >
          <div className='flex items-center gap-x-2 py-1 font-medium'>
            <Plus size={16} />
            <span>Thêm mới xuất xứ</span>
          </div>
        </ComboboxItem>
      </ComboboxContent>
    </Combobox>
  )
}
