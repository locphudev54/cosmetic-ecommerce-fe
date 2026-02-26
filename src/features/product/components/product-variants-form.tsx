'use client'

import InputNumber from '@/components/common/input-number'
import { TypographyMuted } from '@/components/common/typography/typography-muted'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger
} from '@/components/ui/combobox'
import { FieldLabel } from '@/components/ui/field'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputList } from '@/components/ui/tags-input'
import { useAttributes } from '@/features/product/hooks'
import { ProductAttributeType, ProductVariantType } from '@/features/product/types'
import { ChevronDown, Image, Plus, Trash2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const tricks = [
  'Kickflip',
  'Heelflip',
  'Tre Flip',
  'FS 540',
  'Casper flip 360 flip',
  'Kickflip Backflip',
  '360 Varial McTwist',
  'The 900'
]

interface Props {
  onSubmit?: ({
    productVariants,
    attributes
  }: {
    productVariants: ProductVariantType[]
    attributes: ProductAttributeType[]
  }) => void
  productVariantList?: ProductVariantType[]
  attrbutes?: ProductAttributeType[]
}

export default function ProductVariantsForm(props: Props) {
  const [productVariantList, setProductVariantList] = React.useState<ProductVariantType[]>(
    props.productVariantList ?? []
  )

  const [attributes, setAttributes] = React.useState<ProductAttributeType[]>(
    props.attrbutes ?? [{ name: '', values: [] }]
  )

  const { data: attributesData } = useAttributes()
  const attributeList = attributesData?.data ?? []

  const [value, setValue] = React.useState<string[]>([])

  React.useEffect(() => {
    if (
      !props.productVariantList ||
      props.productVariantList.length === 0 ||
      !props.attrbutes ||
      props.attrbutes.length === 0
    )
      return

    setAttributes(props.attrbutes)
    setProductVariantList(props.productVariantList)
  }, [props.attrbutes, props.productVariantList])

  React.useEffect(() => {
    const attributeValuesList = attributes
      .map((att) => att.values)
      .filter((values) => values.length > 0)

    // Generate all possible combinations of attribute values (Cartesian product)
    const attributeValueCombinations = attributeValuesList.reduce<string[][]>(
      (previousCombinations, currentAttributeValues) =>
        previousCombinations.flatMap((combination) =>
          currentAttributeValues.map((value) => [...combination, value])
        ),
      [[]] // Start with an empty combination
    )

    // Remove empty strings from combinations
    attributeValueCombinations.forEach((combination, index) => {
      attributeValueCombinations[index] = combination.filter((value) => value !== '')
    })

    const productVariantList: ProductVariantType[] = attributeValueCombinations.map(
      (attributeValues) => ({
        attributeValues,
        costPrice: 0,
        sellingPrice: 0,
        stockOnHand: 0
      })
    )

    setProductVariantList(productVariantList)
  }, [attributes])

  console.log(productVariantList)
  function handleSelectAttributeName(attIndex: number, attName: string) {
    // Nếu đã tồn tại thuộc tính
    if (attributes.some((att) => att.name === attName)) {
      toast.error(
        <div>
          Thuộc tính <strong>{attName}</strong> đã tồn tại!
        </div>
      )
      return
    }

    setAttributes((prev) => {
      const targetAttribute = prev[attIndex]
      targetAttribute.name = attName
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

      prev.push({ name: '', values: [] })
      return [...prev]
    })
  }

  function handleRemoveAttribute(attIndex: number) {
    debugger
    // Nếu có một thuộc tính VÀ thuộc tính này không có giá trị VÀ không có tên thì không làm gì hết
    // if (attributes.length === 1 && attributes[0].values.length === 0 && !attributes[0].name) {
    //   return
    // }

    // Has one attribute and this attribute has values (attValues)
    if (attributes.length === 1) {
      return setAttributes([{ name: '', values: [] }])
    }

    // Remove all attNames and attValues if remove from seconds attribute
    setAttributes((prev) => prev.filter((_, attIdx) => attIdx !== attIndex))
  }

  const handleChangeAttributeValues = (attIndex: number) => (attValues: string[]) => {
    setAttributes((prev) => {
      const targetAttribute = prev[attIndex]
      targetAttribute.values = attValues

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

  const handleRemoveProductVariant = (prodVariantIndex: number, attValues: string[]) => {
    const filteredSkus = productVariantList.filter((_, skuIdx) => skuIdx !== prodVariantIndex)
    setProductVariantList(filteredSkus)

    attValues.forEach((attValue, attIdx) => {
      // Có cần xóa giá trị của thuộc tính 'values' của state 'attributes' hay không
      const needRemoveAttValue = filteredSkus.every(
        (sku) => !sku.attributeValues.includes(attValue)
      )
      if (needRemoveAttValue) {
        setAttributes((prev) => {
          const targetAttribute = prev[attIdx]
          targetAttribute.values = targetAttribute.values.filter((value) => value !== attValue)

          if (targetAttribute.values.length === 0) {
            targetAttribute.values = ['']
          }

          return [...prev]
        })
      }
    })
  }

  // function onSubmit() {
  //   setAttributes([{ name: '', values: [] }])
  //   setProductVariantList([])
  //   props.onSubmit?.({ productVariants: productVariantList, attributes })
  // }

  return (
    <div className='min-h-96'>
      <div className='mb-4 flex items-center justify-between'>
        <FieldLabel>
          <TypographyMuted>Variant Settings</TypographyMuted>
        </FieldLabel>
      </div>

      <div className='grid grid-cols-12 items-start gap-x-3 gap-y-2'>
        {attributes.map((attribute, attributeIdx) => {
          return (
            <React.Fragment key={attributeIdx}>
              <div className='col-span-3'>
                <Combobox
                  value={attribute.name}
                  onValueChange={(value) =>
                    handleSelectAttributeName(attributeIdx, value.split('-')[0])
                  }
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
                    {attributeList.map((attribute) => (
                      <ComboboxItem key={attribute.id} value={`${attribute.name}-${attribute.id}`}>
                        {attribute.name}
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
                {/* <Combobox value={value} onValueChange={setValue} multiple>
                  <ComboboxAnchor asChild>
                    <TagsInput
                      className='relative flex h-full min-h-10 w-full flex-row flex-wrap items-center justify-start gap-1.5 px-2.5 py-2'
                      value={value}
                      onValueChange={setValue}
                    >
                      {value.map((item) => (
                        <TagsInputItem key={item} value={item}>
                          {item}
                        </TagsInputItem>
                      ))}
                      <ComboboxInput className='h-fit flex-1 p-0' asChild>
                        <TagsInputInput placeholder='Tricks...' />
                      </ComboboxInput>
                      <ComboboxTrigger className='absolute top-2.5 right-2'>
                        <ChevronDown className='text-muted-foreground h-4 w-4' />
                      </ComboboxTrigger>
                    </TagsInput>
                  </ComboboxAnchor>
                  <ComboboxContent sideOffset={5}>
                    <ComboboxEmpty>No tricks found.</ComboboxEmpty>
                    <ComboboxGroup>
                      <ComboboxGroupLabel>Tricks</ComboboxGroupLabel>
                      {tricks.map((trick) => (
                        <ComboboxItem key={trick} value={trick} outset>
                          {trick}
                        </ComboboxItem>
                      ))}
                    </ComboboxGroup>
                  </ComboboxContent>
                </Combobox> */}

                <TagsInput
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
                </TagsInput>
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

      {/* Hàng hóa cùng loại */}
      {productVariantList.length > 0 && !!productVariantList[0].attributeValues[0] && (
        <div className='mt-6 px-0.5'>
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead>Mã SKU</TableHead> */}
                <TableHead className='truncate text-center'>Hình ảnh</TableHead>
                <TableHead className='truncate text-center'>Biến thể</TableHead>
                {/* <TableHead className='text-center'>Mã vạch</TableHead> */}
                <TableHead className='text-center'>Giá vốn (VNĐ)</TableHead>
                <TableHead className='text-center'>Giá bán (VNĐ)</TableHead>
                <TableHead className='text-center'>Tồn kho</TableHead>
                <TableHead className='text-center'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='font-normal'>
              {productVariantList.map((prodVariant, prodVariantIdx) => (
                <TableRow key={prodVariantIdx}>
                  <TableCell>
                    <div className='h-16 w-16 overflow-hidden rounded-md bg-gray-100'>
                      <Image className='h-full w-full' color='blue' strokeWidth={1} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className=''>{prodVariant.attributeValues.join(' - ')}</div>
                  </TableCell>
                  {/* <TableCell>
                    <Input type='text' disabled placeholder='Tự động' />
                  </TableCell> */}
                  {/* <TableCell>
                    <Input type='text' />
                  </TableCell> */}
                  <TableCell>
                    <InputNumber
                      value={prodVariant.costPrice}
                      // onValueChange={handleCostPriceChange(prodVariantIdx)}
                    />
                  </TableCell>
                  <TableCell>
                    <InputNumber
                      value={prodVariant.sellingPrice}
                      // onValueChange={handleSellingPriceChange(prodVariantIdx)}
                    />
                  </TableCell>
                  <TableCell>
                    <InputNumber
                      value={prodVariant.stockOnHand}
                      // onValueChange={handleStockOnHandeChange(prodVariantIdx)}
                    />
                  </TableCell>
                  <TableCell className=''>
                    <Button
                      type='button'
                      variant={'red_gradient'}
                      onClick={() => {
                        // handleRemoveProductVariant(prodVariantIdx, prodVariant.attributeValues)
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
      )}
    </div>
  )
}
