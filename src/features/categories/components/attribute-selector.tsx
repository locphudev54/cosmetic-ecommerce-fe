'use client'

import { TypographyMuted } from '@/components/common/typography'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxBadgeItem,
  ComboboxBadgeList,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger
} from '@/components/ui/combobox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Attribute, useAttributes } from '@/features/attributes'
import { useDialog } from '@/hooks/use-dialog'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ChevronDown, Edit2, Plus, Trash2 } from 'lucide-react'
import React, { useDeferredValue } from 'react'

const MAX_DISPLAYED_ATTRIBUTE_VALUES = 2

interface AttributeSelectorProps {
  parentAttributes?: Attribute[]
  onChange?: (selectedAttributes: Attribute[]) => void
  onRemove?: (removedAttributeId: string) => void
}

export function AttributeSelector({
  parentAttributes,
  onChange,
  onRemove
}: AttributeSelectorProps) {
  const dialog = useDialog()
  const [selectedAttributes, setSelectedAttributes] = React.useState<Attribute[]>([])
  const [inputValue, setInputValue] = React.useState('')
  const [content, setContent] = React.useState<React.ComponentRef<'div'> | null>(null)
  const deferredInputValue = useDeferredValue(inputValue)

  const { data: attributesData } = useAttributes({ getAll: true })
  const attributeList = React.useMemo(() => attributesData?.data ?? [], [attributesData?.data])

  // Manual filtering by attribute name so search works correctly
  const filteredAttributes = React.useMemo(() => {
    if (!deferredInputValue) return attributeList
    const normalized = deferredInputValue.toLowerCase()
    return attributeList.filter((attr) => attr.name.toLowerCase().includes(normalized))
  }, [attributeList, deferredInputValue])

  const virtualizer = useVirtualizer({
    count: filteredAttributes.length,
    getScrollElement: () => content,
    estimateSize: () => 32,
    overscan: 20
  })

  const handleInputValueChange = React.useCallback(
    (value: string) => {
      setInputValue(value)
      if (content) {
        content.scrollTop = 0
        virtualizer.measure()
      }
    },
    [content, virtualizer]
  )

  React.useEffect(() => {
    if (content) {
      virtualizer.measure()
    }
  }, [content, filteredAttributes, virtualizer])

  React.useEffect(() => {
    if (parentAttributes) {
      setSelectedAttributes(parentAttributes)
    }
  }, [parentAttributes])

  const handleRemoveAttribute = (attributeId: string) => {
    const updatedAttributes = selectedAttributes.filter((attr) => attr.id !== attributeId)
    setSelectedAttributes(updatedAttributes)
    onRemove?.(attributeId)
  }

  const openUpsertAttributeDialog = async (attribute: Attribute | null) => {
    const result = await dialog.open('upsert-attribute', { attribute })

    if (result && result.data) {
      const upsertResult = result.data
      const actionType = result.actionType

      if (actionType === 'update') {
        // Update in-place
        setSelectedAttributes((prev) =>
          prev.map((attr) => (attr.id === upsertResult.id ? upsertResult : attr))
        )
      } else {
        // Add new
        setSelectedAttributes((prev) => [...prev, upsertResult])
      }
    }
  }

  const handleSelectAttributes = (attributes: Attribute[]) => {
    setSelectedAttributes(attributes)
    onChange?.(attributes)
  }

  return (
    <React.Fragment>
      <div className='flex items-center justify-between'>
        <TypographyMuted>Thuộc tính</TypographyMuted>
        <Button type='button' variant={'link'} onClick={() => openUpsertAttributeDialog(null)}>
          <Plus className='mr-1 h-4 w-4' />
          <span>Thêm thuộc tính</span>
        </Button>
      </div>

      <Combobox
        value={selectedAttributes.map((attributeItem) => JSON.stringify(attributeItem))}
        onValueChange={(value: string[]) => {
          const parsedAttributes: Attribute[] = value.map((item) => JSON.parse(item))
          handleSelectAttributes(parsedAttributes)
        }}
        inputValue={inputValue}
        onInputValueChange={handleInputValueChange}
        className='w-full'
        multiple
        autoHighlight
        manualFiltering
      >
        <ComboboxAnchor className='h-full min-h-10 flex-wrap px-3 py-2'>
          <ComboboxBadgeList>
            {selectedAttributes.map((attributeItem) => {
              return (
                <ComboboxBadgeItem key={attributeItem.id} value={JSON.stringify(attributeItem)}>
                  {attributeItem.name}
                </ComboboxBadgeItem>
              )
            })}
          </ComboboxBadgeList>
          <ComboboxInput placeholder='Chọn thuộc tính...' className='h-auto min-w-20 flex-1' />
          <ComboboxTrigger className='absolute top-3 right-2'>
            <ChevronDown className='h-4 w-4' />
          </ComboboxTrigger>
        </ComboboxAnchor>
        <ComboboxContent
          ref={(node) => setContent(node)}
          className='relative max-h-75 overflow-x-hidden overflow-y-auto'
        >
          <ComboboxEmpty>
            <div className='mb-5'>Không tìm thấy thuộc tính nào.</div>
            <Button variant='link' onClick={() => openUpsertAttributeDialog(null)}>
              <Plus className='mr-1 h-4 w-4' />
              <span>Thêm thuộc tính mới</span>
            </Button>
          </ComboboxEmpty>
          <div className='relative w-full' style={{ height: `${virtualizer.getTotalSize()}px` }}>
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const attribute = filteredAttributes[virtualItem.index]
              if (!attribute) return null
              return (
                <ComboboxItem
                  key={virtualItem.key}
                  value={JSON.stringify(attribute)}
                  className='absolute top-0 left-0 w-full'
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`
                  }}
                  outset
                >
                  {attribute.name}
                </ComboboxItem>
              )
            })}
          </div>
        </ComboboxContent>
      </Combobox>

      {selectedAttributes.length > 0 && (
        <React.Fragment>
          <div className='flex items-center justify-between'>
            <h5 className='my-3 font-semibold'>
              Thuộc tính danh mục ({selectedAttributes.length})
            </h5>
            <div
              className='cursor-pointer text-sm font-normal text-red-600 hover:text-red-600'
              onClick={() => {
                setSelectedAttributes([])
              }}
            >
              Xóa tất cả ({selectedAttributes.length})
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Thuộc tính</TableHead>
                <TableHead className='text-center'>Giá trị</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedAttributes.map((attributeItem, attributeItemIdx) => (
                <TableRow key={attributeItem.id}>
                  <TableCell>{attributeItemIdx + 1}</TableCell>
                  <TableCell className='font-medium'>{attributeItem.name}</TableCell>
                  <TableCell>
                    {attributeItem.values.slice(0, MAX_DISPLAYED_ATTRIBUTE_VALUES).map((value) => {
                      return (
                        <Badge key={value.id} variant='outline' className='mr-2 mb-2'>
                          {value.value}
                        </Badge>
                      )
                    })}

                    {attributeItem.values.length > MAX_DISPLAYED_ATTRIBUTE_VALUES && (
                      <Badge variant='outline' className='mb-2'>
                        +{attributeItem.values.length - MAX_DISPLAYED_ATTRIBUTE_VALUES} giá trị khác
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className='flex items-center justify-end gap-2'>
                    <Button
                      type='button'
                      variant='outline'
                      size='icon-sm'
                      onClick={() => openUpsertAttributeDialog(attributeItem)}
                    >
                      <Edit2 size={16} />
                    </Button>

                    <Button
                      type='button'
                      variant='outline'
                      size='icon-sm'
                      onClick={() => handleRemoveAttribute(attributeItem.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
