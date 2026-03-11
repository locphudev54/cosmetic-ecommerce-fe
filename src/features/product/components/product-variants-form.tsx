'use client'

import { ImageUploadButton } from '@/components/common/image-upload-button'
import InputNumber from '@/components/common/input-number'
import { TypographyMuted } from '@/components/common/typography/typography-muted'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useAttributes } from '@/features/product/hooks'
import {
  ProductAttributeType,
  ProductAttributeValueType,
  ProductVariantType
} from '@/features/product/types'
import { useUploadSingleImage } from '@/features/upload/hooks/use-upload'
import { ChevronDown, PenLine, Plus, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import { Switch } from 'radix-ui'
import React, { use } from 'react'
import { toast } from 'sonner'

interface Props {
  productVariantList?: ProductVariantType[]
  attrbutes?: ProductAttributeType[]
  onSubmit?: ({
    productVariants,
    attributes
  }: {
    productVariants: ProductVariantType[]
    attributes: ProductAttributeType[]
  }) => void
}

export default function ProductVariantsForm(props: Props) {
  const [attributes, setAttributes] = React.useState<ProductAttributeType[]>(
    props.attrbutes ?? [{ id: '', name: '', values: [] }]
  )

  const [productVariantList, setProductVariantList] = React.useState<ProductVariantType[]>(
    props.productVariantList ?? []
  )

  // Remote state - Queries
  const { data: attributesData } = useAttributes()
  const attributeList = attributesData?.data ?? []

  // Mutations
  const uploadSingleImageMutation = useUploadSingleImage()

  // React.useEffect(() => {
  //   if (
  //     !props.productVariantList ||
  //     props.productVariantList.length === 0 ||
  //     !props.attrbutes ||
  //     props.attrbutes.length === 0
  //   )
  //     return

  //   setAttributes(props.attrbutes)
  //   setProductVariantList(props.productVariantList)
  // }, [props.attrbutes, props.productVariantList])

  React.useEffect(() => {
    const attributeValuesList = attributes
      .map((att) => att.values)
      .filter((values) => values.length > 0)

    // Generate all possible combinations of attribute values (Cartesian product)
    const attributeValueCombinations = attributeValuesList.reduce<ProductAttributeValueType[][]>(
      (previousCombinations, currentAttributeValues) =>
        previousCombinations.flatMap((combination) =>
          currentAttributeValues.map((value) => [...combination, value])
        ),
      [[]] // Start with an empty combination
    )

    // Remove empty strings from combinations
    // attributeValueCombinations.forEach((combination, index) => {
    //   attributeValueCombinations[index] = combination.filter((value) => value !== '')
    // })

    const productVariantList: ProductVariantType[] = attributeValueCombinations.map(
      (attributeValuesCombination) => ({
        attributeValues: attributeValuesCombination,
        costPrice: 0,
        sellingPrice: 0,
        stockOnHand: 0,
        barcode: '',
        imageUrl: undefined,
        sku: attributeValuesCombination
          .map((attrValue) => attrValue.value)
          .join('-')
          .toUpperCase(),
        lowStockThreshold: 0,
        maxStockThreshold: 0,
        name: attributeValuesCombination.map((attrValue) => attrValue.value).join(' - '),
        isActive: true
      })
    )

    setProductVariantList(productVariantList)
  }, [attributes])

  function handleSelectAttributeName(attIndex: number, selectedAttValue: string) {
    // Nếu bỏ chọn thuộc tính (selectedAttValue = '' - empty string) thì sẽ xóa tên thuộc tính và giá trị của thuộc tính đó đi
    if (!selectedAttValue) {
      return setAttributes((prev) => {
        const targetAttribute = prev[attIndex]
        targetAttribute.id = ''
        targetAttribute.name = ''
        targetAttribute.values = []
        return [...prev]
      })
    }

    const { attributeName, attributeId } = JSON.parse(selectedAttValue)

    // Nếu đã tồn tại thuộc tính
    if (attributes.some((att) => att.name === attributeName)) {
      toast.error(
        <div>
          Thuộc tính <strong>{attributeName}</strong> đã tồn tại!
        </div>
      )
      return
    }

    setAttributes((prev) => {
      const targetAttribute = prev[attIndex]
      targetAttribute.id = attributeId
      targetAttribute.name = attributeName
      targetAttribute.values = []
      return [...prev]
    })
  }

  // Khi thêm mới thuộc tính cho sản phẩm thì nó sẽ đảm bảo là sẽ đc thêm một cách tuần tự theo thứ tự
  // tại index 0 (khi prev.length === 0), tại index 1 khi prev.length === 1
  function handleAddNewAttributeName() {
    setAttributes((prev) => {
      // Old way
      // prev.push({ name: '', values: [''] })

      prev.push({ id: '', name: '', values: [] })
      return [...prev]
    })
  }

  function handleRemoveAttribute(attIndex: number) {
    // Nếu có một thuộc tính VÀ thuộc tính này không có giá trị VÀ không có tên thì không làm gì hết
    // if (attributes.length === 1 && attributes[0].values.length === 0 && !attributes[0].name) {
    //   return
    // }

    // Has one attribute and this attribute has values (attValues)
    if (attributes.length === 1) {
      return setAttributes([{ id: '', name: '', values: [] }])
    }

    // Remove all attNames and attValues if remove from seconds attribute
    setAttributes((prev) => prev.filter((_, attIdx) => attIdx !== attIndex))
  }

  const handleChangeAttributeValues = (attIndex: number) => (selectedAttributeValues: string[]) => {
    setAttributes((prev) => {
      const targetAttribute = prev[attIndex]
      const parsedSelectedAttValues: ProductAttributeValueType[] = selectedAttributeValues.map(
        (item) => JSON.parse(item)
      )
      targetAttribute.values = parsedSelectedAttValues
      return [...prev]
    })
  }

  const handleCostPriceChange = (prodVariantIndex: number) => (value: number) => {
    setProductVariantList((prev) => {
      const targetSku = prev[prodVariantIndex]
      targetSku.costPrice = value
      return [...prev]
    })
  }

  const handleSellingPriceChange = (prodVariantIndex: number) => (value: number) => {
    setProductVariantList((prev) => {
      const targetSku = prev[prodVariantIndex]
      targetSku.sellingPrice = value
      return [...prev]
    })
  }

  const handleStockOnHandeChange = (prodVariantIndex: number) => (value: number) => {
    setProductVariantList((prev) => {
      const targetSku = prev[prodVariantIndex]
      targetSku.stockOnHand = value
      return [...prev]
    })
  }

  const handleRemoveProductVariant = (
    prodVariantIndex: number,
    attValues: ProductAttributeValueType[]
  ) => {
    // Remove product variant in productVariantList state
    const filteredProductVariant = productVariantList.filter((_, item) => item !== prodVariantIndex)
    setProductVariantList(filteredProductVariant)

    attValues.forEach((attValue, attIdx) => {
      // Check if need to remove attribute value in attributes state by checking if the removed product variant is the only one that has this attribute value,
      // if yes then remove this attribute value in attributes state
      const needRemoveAttValue = filteredProductVariant.every(
        (productVariant) => !productVariant.attributeValues.includes(attValue)
      )
      if (needRemoveAttValue) {
        setAttributes((prev) => {
          const targetAttribute = prev[attIdx]
          targetAttribute.values = targetAttribute.values.filter((value) => value !== attValue)

          // if (targetAttribute.values.length === 0) {
          //   targetAttribute.values = ['']
          // }

          return [...prev]
        })
      }
    })
  }

  const handleImmediateUpload = (productVariantIndex: number) => async (files: File[]) => {
    const file = files[0]
    const res = await uploadSingleImageMutation.mutateAsync({
      file,
      params: { folder: 'product-images' }
    })
    // Update product variant in productVariantList state with the uploaded image url
    setProductVariantList((prev) => {
      const targetProductVariant = prev[productVariantIndex]
      targetProductVariant.imageUrl = res.url
      return [...prev]
    })
  }

  const handleRemoveProductVariantImage = (productVariantIndex: number) => {
    setProductVariantList((prev) => {
      const targetProductVariant = prev[productVariantIndex]
      targetProductVariant.imageUrl = undefined
      return [...prev]
    })
  }

  // function onSubmit() {
  //   setAttributes([{ name: '', values: [] }])
  //   setProductVariantList([])
  //   props.onSubmit?.({ productVariants: productVariantList, attributes })
  // }

  return (
    <div>
      <FieldLabel className='mb-4'>
        <TypographyMuted>Variant Settings</TypographyMuted>
      </FieldLabel>

      <div className='grid grid-cols-12 items-start gap-x-3 gap-y-2'>
        {attributes.map((attribute, attributeIdx) => {
          // Get the coresponding attribute in attributeList to get its values for rendering options in combobox
          const attributeItem = attributeList.find((attItem) => attItem.id === attribute.id)
          const attributeItemValues = attributeItem?.values ?? []

          return (
            <React.Fragment key={attributeIdx}>
              <div className='col-span-3'>
                <Combobox
                  // Initial value get from state 'attributes' to show the selected attribute name when open combobox again
                  value={JSON.stringify({
                    attributeName: attribute.name,
                    attributeId: attribute.id
                  })}
                  onValueChange={(value) => handleSelectAttributeName(attributeIdx, value)}
                  // onFilter={onFilter}
                >
                  <ComboboxAnchor>
                    <ComboboxInput placeholder='Chọn thuộc tính' />
                    <ComboboxTrigger>
                      <ChevronDown className='h-4 w-4' />
                    </ComboboxTrigger>
                  </ComboboxAnchor>
                  <ComboboxContent>
                    <ComboboxEmpty>
                      <div>Không tìm thấy thuộc tính nào</div>
                    </ComboboxEmpty>
                    {/* Selecting option built from remote state - Attribute Remote State */}
                    {attributeList.map((attributeItem) => (
                      <ComboboxItem
                        key={attributeItem.id}
                        value={JSON.stringify({
                          attributeName: attributeItem.name,
                          attributeId: attributeItem.id
                        })}
                      >
                        <div className='group flex items-center justify-between'>
                          <span>{attributeItem.name}</span>
                          <Button
                            onClick={(e) => {
                              e.preventDefault()
                            }}
                            type='button'
                            className='cursor-pointer'
                            size={'icon-xs'}
                            variant={'ghost'}
                          >
                            <PenLine
                              className='size-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100'
                              strokeWidth={1.5}
                            />
                          </Button>
                        </div>
                      </ComboboxItem>
                    ))}
                    <Button variant={'ghost'} className='mt-1 w-full'>
                      <Plus />
                      <span>Thêm mới thuộc tính</span>
                    </Button>
                  </ComboboxContent>
                </Combobox>
              </div>
              <div className='col-span-8'>
                <Combobox
                  value={attribute.values.map((item) => JSON.stringify(item))}
                  onValueChange={handleChangeAttributeValues(attributeIdx)}
                  multiple
                  disabled={!attribute.name}
                  autoHighlight
                >
                  <ComboboxAnchor className='h-full min-h-10 flex-wrap px-3 py-2'>
                    <ComboboxBadgeList>
                      {/* {value.map((item) => {
                        const option = attributeItemValues.find((att) => att.value === item)
                        if (!option) return null

                        return (
                          <ComboboxBadgeItem key={item} value={item}>
                            {option.value}
                          </ComboboxBadgeItem>
                        )
                      })} */}
                      {attribute.values.map((item) => (
                        <ComboboxBadgeItem key={item.attributeValueId} value={JSON.stringify(item)}>
                          {item.value}
                        </ComboboxBadgeItem>
                      ))}
                    </ComboboxBadgeList>
                    <ComboboxInput
                      autoFocus
                      // onKeyDown={(e) => {
                      //   if (e.key === 'Enter') {
                      //     const attributeValue = e.currentTarget.value

                      //
                      //     // your logic here
                      //   }
                      // }}
                      placeholder='Chọn giá trị thuộc tính...'
                      className='h-auto min-w-20 flex-1'
                    />
                    <ComboboxTrigger className='absolute top-3 right-2'>
                      <ChevronDown className='h-4 w-4' />
                    </ComboboxTrigger>
                  </ComboboxAnchor>
                  <ComboboxContent>
                    <ComboboxEmpty>Không tìm thấy giá trị thuộc tính nào</ComboboxEmpty>
                    {attributeItemValues.map((attItemValue) => (
                      <ComboboxItem
                        key={attItemValue.id}
                        value={JSON.stringify({
                          attributeValueId: attItemValue.id,
                          value: attItemValue.value
                        })}
                      >
                        {attItemValue.value}
                      </ComboboxItem>
                    ))}
                    <Button variant={'ghost'} className='mt-1 w-full'>
                      <Plus />
                      <span>Thêm mới giá trị thuộc tính</span>
                    </Button>
                  </ComboboxContent>
                </Combobox>

                {/* <TagsInput
                  value={attribute.values}
                  onValueChange={handleChangeAttributeValues(attributeIdx)}
                  editable
                  addOnPaste
                  className='w-full'
                >
                  <TagsInputList className='custom-scrollbar max-h-30 overflow-y-auto'>
                    {attribute.values.map((value) => (
                      <TagsInputItem key={value} value={value}>
                        {value}
                      </TagsInputItem>
                    ))}
                    <TagsInputInput
                      disabled={!attribute.name}
                      placeholder={
                        attribute.values.length === 0
                          ? 'Nhập giá trị thuộc tính và nhấn enter...'
                          : ''
                      }
                    />
                  </TagsInputList>
                </TagsInput> */}
              </div>
              <div className='col-span-1'>
                <Button
                  type='button'
                  variant={'outline'}
                  className='cursor-pointer'
                  // disabled={attributes.length === 1 && !attribute.name}
                  onClick={() => {
                    handleRemoveAttribute(attributeIdx)
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            </React.Fragment>
          )
        })}
      </div>

      <Button
        type='button'
        variant={'link'}
        className='mt-2 cursor-pointer font-medium text-blue-600 hover:text-blue-700 hover:no-underline'
        onClick={handleAddNewAttributeName}
      >
        <Plus />
        <span>Thêm thuộc tính</span>
      </Button>

      {/* Product Variant Settings */}
      {productVariantList.length > 0 && !!productVariantList[0].attributeValues[0] && (
        <div>
          <h5 className='my-3 font-semibold'>Sản phẩm cùng loại ({productVariantList.length})</h5>
          <div className='custom-scrollbar overflow-x-auto py-2'>
            <Table className='w-max'>
              <TableHeader>
                <TableRow>
                  <TableHead className='min-w-32 text-center'>Hình ảnh</TableHead>
                  <TableHead className='min-w-32 truncate text-center'>Biến thể</TableHead>
                  <TableHead className='min-w-32 text-center'>Mã vạch</TableHead>
                  <TableHead className='min-w-32 text-center'>Giá vốn</TableHead>
                  <TableHead className='min-w-32 text-center'>Giá bán</TableHead>
                  <TableHead className='min-w-32 text-center'>Tồn kho</TableHead>
                  <TableHead className='min-w-32 text-center'>Tồn tối thiểu</TableHead>
                  <TableHead className='min-w-32 text-center'>Tồn tối đa</TableHead>
                  <TableHead className='min-w-32 text-center'>Hiện thị</TableHead>
                  <TableHead className='min-w-16 text-center'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='font-normal'>
                {productVariantList.map((prodVariant, prodVariantIdx) => (
                  <TableRow key={prodVariantIdx}>
                    <TableCell>
                      <div className='aspect-square w-24'>
                        {prodVariant.imageUrl ? (
                          <div className='group relative rounded-md border border-gray-300 bg-gray-100'>
                            <Image
                              width={0}
                              height={0}
                              sizes='100vw'
                              src={prodVariant.imageUrl}
                              alt={`Product Variant ${prodVariantIdx + 1}`}
                              className='aspect-square h-full w-full rounded-md object-cover transition-transform duration-200 group-hover:scale-105'
                            />
                            {/* Remove button */}
                            <Button
                              type='button'
                              variant={'destructive'}
                              size={'icon-xs'}
                              className='absolute top-1 right-1 cursor-pointer rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100'
                              onClick={() => handleRemoveProductVariantImage(prodVariantIdx)}
                            >
                              <X className='size-3' />
                            </Button>
                          </div>
                        ) : (
                          <ImageUploadButton
                            mode='immediate'
                            onUpload={handleImmediateUpload(prodVariantIdx)}
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type='text'
                        placeholder='Tên biến thể...'
                        value={prodVariant.name}
                        onChange={(e) => {
                          const value = e.currentTarget.value
                          setProductVariantList((prev) => {
                            const targetProductVariant = prev[prodVariantIdx]
                            targetProductVariant.name = value
                            return [...prev]
                          })
                        }}
                      />
                      {/* <div>
                        {prodVariant.attributeValues
                          .map((attrValue) => attrValue.value)
                          .join(' - ')}
                      </div> */}
                    </TableCell>
                    <TableCell>
                      <Input type='text' placeholder='Mã vạch...' />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        placeholder='Giá vốn...'
                        value={prodVariant.costPrice}
                        onValueChange={handleCostPriceChange(prodVariantIdx)}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        placeholder='Giá bán...'
                        value={prodVariant.sellingPrice}
                        onValueChange={handleSellingPriceChange(prodVariantIdx)}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        placeholder='Tồn kho...'
                        value={prodVariant.stockOnHand}
                        onValueChange={handleStockOnHandeChange(prodVariantIdx)}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        placeholder='Tồn tối thiểu...'
                        value={prodVariant.stockOnHand}
                        onValueChange={() => {}}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        placeholder='Tồn tối đa...'
                        value={prodVariant.stockOnHand}
                        onValueChange={() => {}}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={prodVariant.isActive}
                        onCheckedChange={(checked) => {
                          setProductVariantList((prev) => {
                            const targetProductVariant = prev[prodVariantIdx]
                            targetProductVariant.isActive = checked as boolean
                            return [...prev]
                          })
                        }}
                      />
                    </TableCell>
                    <TableCell className=''>
                      <Button
                        type='button'
                        variant={'outline'}
                        onClick={() => {
                          handleRemoveProductVariant(prodVariantIdx, prodVariant.attributeValues)
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
