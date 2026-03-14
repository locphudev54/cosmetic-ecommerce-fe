'use client'

import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger
} from '@/components/ui/combobox'
import { useBrands } from '@/features/brands/hooks'
import { useDialog } from '@/hooks/use-dialog'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ChevronDown, PenLine, Plus } from 'lucide-react'
import React, { useDeferredValue } from 'react'

interface SelectBrandComboboxProps {
  value?: string
  onChange?: (brandId: string) => void
}

export function SelectBrandCombobox({ value, onChange }: SelectBrandComboboxProps) {
  const dialog = useDialog()
  const [inputValue, setInputValue] = React.useState('')
  const [content, setContent] = React.useState<React.ComponentRef<'div'> | null>(null)
  const deferredInputValue = useDeferredValue(inputValue)

  const { data: brandsData } = useBrands({ getAll: true })

  const brandList = React.useMemo(() => brandsData?.data ?? [], [brandsData?.data])

  const filteredBrands = React.useMemo(() => {
    if (!deferredInputValue) return brandList
    const normalized = deferredInputValue.toLowerCase()
    return brandList.filter((brand) => brand.name.toLowerCase().includes(normalized))
  }, [brandList, deferredInputValue])

  const virtualizer = useVirtualizer({
    count: filteredBrands.length,
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
  }, [content, filteredBrands, virtualizer])

  const selectedBrand = React.useMemo(
    () => brandList.find((b) => b.id === value),
    [brandList, value]
  )

  const comboboxValue = selectedBrand
    ? JSON.stringify({ brandName: selectedBrand.name, brandId: selectedBrand.id })
    : ''

  const handleValueChange = async (val: string) => {
    if (!val) {
      onChange?.('')
      setInputValue('')
      return
    }

    try {
      const parsed = JSON.parse(val)
      if (parsed.brandId === 'add-new-brand') {
        const result = await dialog.open('upsert-brand', { brand: null })
        if (result && result.actionType === 'create' && result.data) {
          onChange?.(result.data.id)
          setInputValue(result.data.name)
        }
        return
      }
      onChange?.(parsed.brandId)
      setInputValue(parsed.brandName)
    } catch {
      // ignore parse errors
    }
  }

  return (
    <Combobox
      value={comboboxValue}
      inputValue={selectedBrand ? selectedBrand.name : inputValue}
      onInputValueChange={handleInputValueChange}
      onValueChange={handleValueChange}
      manualFiltering
    >
      <ComboboxAnchor>
        <ComboboxInput placeholder='Chọn thương hiệu' />
        <ComboboxTrigger>
          <ChevronDown className='h-4 w-4' />
        </ComboboxTrigger>
      </ComboboxAnchor>
      <ComboboxContent
        ref={(node) => setContent(node)}
        className='custom-scrollbar relative max-h-75 overflow-x-hidden overflow-y-auto'
      >
        <ComboboxEmpty>
          <div>Không tìm thấy thương hiệu nào</div>
        </ComboboxEmpty>
        <div className='relative w-full' style={{ height: `${virtualizer.getTotalSize()}px` }}>
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const brand = filteredBrands[virtualItem.index]
            return (
              <ComboboxItem
                key={brand.id}
                value={JSON.stringify({ brandName: brand.name, brandId: brand.id })}
                className='absolute top-0 left-0 w-full'
                style={{ transform: `translateY(${virtualItem.start}px)` }}
              >
                <div className='group flex items-center justify-between'>
                  <span>{brand.name}</span>
                  <Button
                    onClick={async (e) => {
                      e.stopPropagation()
                      const result = await dialog.open('upsert-brand', { brand })
                      // If the updated brand is the currently selected one, refresh the display name
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
          key='add-new-brand'
          value={JSON.stringify({ brandName: 'add-new-brand', brandId: 'add-new-brand' })}
        >
          <div className='flex items-center gap-x-2 py-1 font-medium'>
            <Plus size={16} />
            <span>Thêm mới thương hiệu</span>
          </div>
        </ComboboxItem>
      </ComboboxContent>
    </Combobox>
  )
}
