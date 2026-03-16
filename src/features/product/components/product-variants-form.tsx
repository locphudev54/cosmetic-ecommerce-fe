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
import { Attribute, useAttributes } from '@/features/attributes'
import { useCategoryTreeStore } from '@/features/product/store/category-tree-store'
import {
  ProductAttributeType,
  ProductAttributeValueType,
  ProductVariantType
} from '@/features/product/types'
import { useUploadSingleImage } from '@/features/upload/hooks/use-upload'
import { useDialog } from '@/hooks/use-dialog'
import { generateVariantSku } from '@/utilts/client.utils'
import { ChevronDown, Minus, PenLine, Plus, Trash2, X, Zap } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { toast } from 'sonner'

interface Props {
  productVariantList: ProductVariantType[]
  attrbutes: ProductAttributeType[]
  productCode?: string
  onChange?: (variants: ProductVariantType[]) => void
}

export default function ProductVariantsForm({ onChange, ...props }: Props) {
  const dialog = useDialog()
  const primaryCategoryId = useCategoryTreeStore((state) => state.primaryCategoryId)

  const [attributes, setAttributes] = React.useState<ProductAttributeType[]>([
    { id: '', name: '', values: [] }
  ])

  const [productVariantList, setProductVariantList] = React.useState<ProductVariantType[]>(
    props.productVariantList ?? []
  )

  // Refs to control initialization from props (edit mode)
  const hasInitializedFromProps = React.useRef(false)
  const skipNextVariantRegen = React.useRef(false)

  // Remote state - Queries
  const { data: attributesData } = useAttributes({ getAll: true })
  const attributeList = React.useMemo(() => attributesData?.data ?? [], [attributesData?.data])

  const { data: categoryAttributesData } = useAttributes(
    { getAll: true, categoryId: primaryCategoryId ?? undefined },
    !!primaryCategoryId
  )
  const categoryAttributeList = React.useMemo(
    () => categoryAttributesData?.data ?? [],
    [categoryAttributesData?.data]
  )

  const isContainAllCategoryAttributes = React.useMemo(() => {
    return (
      categoryAttributeList.length > 0 &&
      categoryAttributeList.every((catAttr) => attributes.some((attr) => attr.id === catAttr.id))
    )
  }, [categoryAttributeList, attributes])

  // Mutations
  const uploadSingleImageMutation = useUploadSingleImage()

  // Sync productVariantList to the parent form field whenever it changes
  React.useEffect(() => {
    debugger
    onChange?.(productVariantList)
  }, [productVariantList, onChange])

  // Initialize from props in edit mode (runs once when initial data becomes available)
  React.useEffect(() => {
    debugger
    if (hasInitializedFromProps.current) return
    if (!props.productVariantList.length || !props.attrbutes.length) return

    hasInitializedFromProps.current = true
    // Skip the next variant regeneration that would be triggered by setAttributes
    skipNextVariantRegen.current = true
    setAttributes(props.attrbutes)
    setProductVariantList(props.productVariantList)
  }, [props.productVariantList, props.attrbutes])

  // Generate all possible combinations of attribute values (Cartesian product) - based on attribute state
  React.useEffect(() => {
    debugger
    // Skip regeneration once after initializing from props to preserve existing variant data
    // When component mouts first time
    if (skipNextVariantRegen.current) {
      skipNextVariantRegen.current = false
      return
    }

    // Remove empty attribute values to avoid generating variants for them - when firstly mount
    const attributeValuesList = attributes
      .map((att) => att.values)
      .filter((values) => values.length > 0)

    if (attributeValuesList.length === 0) {
      // setProductVariantList([])
      return
    }

    const attributeValueCombinations = attributeValuesList.reduce<ProductAttributeValueType[][]>(
      (previousCombinations, currentAttributeValues) =>
        previousCombinations.flatMap((combination) =>
          currentAttributeValues.map((value) => [...combination, value])
        ),
      [[]] // An empty combination
    )

    const newProductVariantList: ProductVariantType[] = attributeValueCombinations.map(
      (attributeValuesCombination) => {
        return {
          id: undefined, // new variant doesn't have id
          attributeValues: attributeValuesCombination,
          costPrice: 0,
          sellingPrice: 0,
          stockOnHand: 0,
          barcode: undefined,
          imageUrl: undefined,
          sku: props.productCode
            ? generateVariantSku(
                props.productCode,
                attributeValuesCombination.map((attrValue) => ({
                  attributeValueId: attrValue.attributeValueId,
                  value: attrValue.value
                }))
              )
            : undefined,
          lowStockThreshold: 0,
          maxStockThreshold: 0,
          name: attributeValuesCombination.map((attrValue) => attrValue.value).join(' - '),
          isActive: true
        }
      }
    )

    // Perserve existing variant data if the variant with the same attribute values combination already exists in the props.productVariantList (edit mode)
    const mergedProductVariantList = newProductVariantList.map((newVariant) => {
      const existingVariant = props.productVariantList.find((variant) => {
        // Check if the variant has the same attribute values combination
        return (
          variant.attributeValues.length === newVariant.attributeValues.length &&
          variant.attributeValues.every((attrValue) =>
            newVariant.attributeValues.some(
              (newAttrValue) => newAttrValue.attributeValueId === attrValue.attributeValueId
            )
          )
        )
      })

      return existingVariant
        ? {
            ...newVariant,
            ...existingVariant
            // The purpose of this is to preserve existing variant data (like id, costPrice, sellingPrice, etc.) if the attribute values combination matches
            // Otherwise use the new variant generated from the current attributes state.
            // This allows us to keep user input for existing variants when they make changes to attributes that don't affect those variants.
          }
        : newVariant
    })

    setProductVariantList(mergedProductVariantList)
  }, [attributes, props.productCode, props.productVariantList])

  async function handleSelectAttributeName(attIndex: number, selectedAttValue: string) {
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

    // Special case: if selecting "add-new-attribute", open the dialog
    if (attributeName === 'add-new-attribute') {
      const result = await dialog.open('upsert-attribute', { attribute: null })

      if (result && result.actionType === 'create' && result.data) {
        const newAttribute = result.data
        setAttributes((prev) => {
          const targetAttribute = prev[attIndex]
          targetAttribute.id = newAttribute.id
          targetAttribute.name = newAttribute.name
          targetAttribute.values = newAttribute.values.map((value) => ({
            attributeValueId: value.id,
            value: value.value
          }))
          return [...prev]
        })
      }

      return
    }

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

  const handleChangeAttributeValues =
    (attIndex: number) => async (selectedAttributeValues: string[]) => {
      const { attributeValueId }: ProductAttributeValueType =
        selectedAttributeValues.length > 0
          ? JSON.parse(selectedAttributeValues[selectedAttributeValues.length - 1])
          : {}

      const editingAttributeId = attributes[attIndex].id
      const editingAttribute = attributeList.find((att) => att.id === editingAttributeId)

      if (attributeValueId === 'edit-attribute-values') {
        const result = await dialog.open('upsert-attribute', {
          attribute: editingAttribute ?? null
        })

        if (result && result.actionType === 'update' && result.data) {
          const updatedAttribute = result.data

          setAttributes((prev) => {
            const targetAttribute = prev[attIndex]
            targetAttribute.values = updatedAttribute.values.map((value) => ({
              attributeValueId: value.id,
              value: value.value
            }))
            return [...prev]
          })
        }

        return
      }

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
          targetAttribute.values = targetAttribute.values.filter(
            (value) => value.attributeValueId !== attValue.attributeValueId
          )
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

  const handleQuicklyCreateProductVariantsByPrimaryCategory = async () => {
    const result = await dialog.open('confirm-action', {
      title: 'Xác nhận tạo nhanh biến thể',
      description:
        'Hành động này sẽ tạo nhanh biến thể dựa trên thuộc tính của danh mục chính. Bạn có chắc chắn muốn tiếp tục?',
      confirmLabel: 'Xác nhận',
      cancelLabel: 'Hủy'
    })

    if (result && !result.confirmed) {
      return
    }

    const remainingCategoryAttributes: ProductAttributeType[] = categoryAttributeList
      .filter((catAttr) => !attributes.some((attr) => attr.id === catAttr.id))
      .map((catAttr) => ({
        id: catAttr.id,
        name: catAttr.name,
        values: catAttr.values.map((value) => ({
          attributeValueId: value.id,
          value: value.value
        }))
      }))

    const mergedAttributes = [...attributes, ...remainingCategoryAttributes]
    setAttributes(mergedAttributes)

    // Don't need to set product variant here because the useEffect that generate product variant from attribute
    // setProductVariantList([])
    toast.success('Đã tạo nhanh biến thể dựa trên thuộc tính của danh mục chính!')
  }

  // function onSubmit() {
  //   setAttributes([{ name: '', values: [] }])
  //   setProductVariantList([])
  //   props.onSubmit?.({ productVariants: productVariantList, attributes })
  // }

  return (
    <div>
      <FieldLabel className='mb-4 flex w-full items-start justify-between'>
        <TypographyMuted>Biến thể sản phẩm</TypographyMuted>
        {categoryAttributeList.length > 0 &&
          primaryCategoryId &&
          !isContainAllCategoryAttributes && (
            <Button
              variant={'blue_gradient'}
              className=''
              type='button'
              onClick={handleQuicklyCreateProductVariantsByPrimaryCategory}
            >
              <Zap className='' />
              Tạo nhanh
            </Button>
          )}
      </FieldLabel>

      <div className='grid grid-cols-12 items-start gap-x-3 gap-y-2'>
        {attributes.map((attribute, attributeIdx) => {
          // Get the coresponding attribute in attributeList to get its values for rendering options in combobox
          const attributeItem: Attribute | undefined = attributeList.find(
            (attItem) => attItem.id === attribute.id
          )
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
                  inputValue={attribute.name}
                  // inputValue={attributeComboboxValues[attributeIdx]}
                  onInputValueChange={() => {}}
                  onValueChange={(value) => handleSelectAttributeName(attributeIdx, value)}
                  // manualFiltering
                >
                  <ComboboxAnchor>
                    <ComboboxInput placeholder='Chọn thuộc tính' />
                    <ComboboxTrigger>
                      <ChevronDown className='h-4 w-4' />
                    </ComboboxTrigger>
                  </ComboboxAnchor>
                  <ComboboxContent className='custom-scrollbar max-h-75 overflow-x-hidden overflow-y-auto'>
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
                              e.stopPropagation()
                              dialog.open('upsert-attribute', { attribute: attributeItem })
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
                    <ComboboxItem
                      key={'add-new-attribute'}
                      value={JSON.stringify({
                        attributeName: 'add-new-attribute',
                        attributeId: 'add-new-attribute'
                      })}
                    >
                      <div className='flex items-center gap-x-2 py-1 font-medium'>
                        <Plus size={16} />
                        <span>Thêm mới thuộc tính</span>
                      </div>
                    </ComboboxItem>
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

                    <ComboboxItem
                      key={'edit-attribute-values'}
                      value={JSON.stringify({
                        attributeValueId: 'edit-attribute-values',
                        value: 'edit-attribute-values'
                      })}
                    >
                      <div className='flex items-center gap-x-2 py-1 font-medium'>
                        <PenLine size={16} />
                        <span>Chỉnh sửa giá trị thuộc tính</span>
                      </div>
                    </ComboboxItem>

                    {/* <Button variant={'ghost'} className='mt-1 w-full'>
                      <Plus />
                      <span>Chỉnh sửa giá trị thuộc tính</span>
                    </Button> */}
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

      <div className='flex items-center justify-between'>
        <Button
          type='button'
          variant={'link'}
          className='mt-2 cursor-pointer font-medium text-blue-600 hover:text-blue-700 hover:no-underline'
          onClick={handleAddNewAttributeName}
        >
          <Plus />
          <span>Thêm thuộc tính</span>
        </Button>

        {productVariantList.length > 0 && !!productVariantList[0].attributeValues[0] && (
          <Button
            type='button'
            variant={'link'}
            className='mt-2 cursor-pointer font-medium text-red-600 hover:text-red-600 hover:no-underline'
            onClick={() => {
              setAttributes([{ id: '', name: '', values: [] }])
            }}
          >
            <Minus />
            <span>Xóa tất cả ({productVariantList.length})</span>
          </Button>
        )}
      </div>

      {/* Product Variant Settings */}
      {productVariantList.length > 0 && !!productVariantList[0].attributeValues[0] && (
        <React.Fragment>
          <div className='flex items-center justify-between'>
            <h5 className='my-3 font-semibold'>Sản phẩm cùng loại ({productVariantList.length})</h5>
          </div>
          <div className='space-y-3'>
            {productVariantList.map((prodVariant, prodVariantIdx) => (
              <div
                key={prodVariantIdx}
                className='bg-card rounded-lg border p-3 shadow-sm transition-shadow hover:shadow-md'
              >
                {/* Card header: variant name + actions */}
                <div className='mb-2 flex items-center justify-between gap-2'>
                  <span className='text-foreground truncate text-sm font-medium'>
                    {prodVariant.name || `Biến thể ${prodVariantIdx + 1}`}
                  </span>
                  <div className='flex shrink-0 items-center gap-2'>
                    <label className='text-muted-foreground flex cursor-pointer items-center gap-1.5 text-xs'>
                      <Checkbox
                        checked={prodVariant.isActive}
                        onCheckedChange={(checked) => {
                          setProductVariantList((prev) => {
                            const targetProductVariant = prev[prodVariantIdx]
                            targetProductVariant.isActive = checked as boolean
                            return [...prev]
                          })
                        }}
                        className='h-3.5 w-3.5'
                      />
                      Hiện thị
                    </label>
                    <Button
                      type='button'
                      variant={'ghost'}
                      size={'icon-xs'}
                      className='text-destructive hover:bg-destructive/10 hover:text-destructive h-7 w-7'
                      onClick={() => {
                        handleRemoveProductVariant(prodVariantIdx, prodVariant.attributeValues)
                      }}
                    >
                      <Trash2 className='h-3.5 w-3.5' />
                    </Button>
                  </div>
                </div>

                {/* Card body: image + fields grid */}
                <div className='flex gap-3'>
                  {/* Image */}
                  <div className='aspect-square w-16 shrink-0'>
                    {prodVariant.imageUrl ? (
                      <div className='group relative h-full rounded-md border border-gray-200 bg-gray-50'>
                        <Image
                          width={0}
                          height={0}
                          sizes='100vw'
                          src={prodVariant.imageUrl}
                          alt={`Product Variant ${prodVariantIdx + 1}`}
                          className='aspect-square h-full w-full rounded-md object-cover transition-transform duration-200 group-hover:scale-105'
                        />
                        <Button
                          type='button'
                          variant={'destructive'}
                          size={'icon-xs'}
                          className='absolute top-0.5 right-0.5 h-4 w-4 cursor-pointer rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100'
                          onClick={() => handleRemoveProductVariantImage(prodVariantIdx)}
                        >
                          <X className='size-2.5' />
                        </Button>
                      </div>
                    ) : (
                      <ImageUploadButton
                        mode='immediate'
                        onUpload={handleImmediateUpload(prodVariantIdx)}
                      />
                    )}
                  </div>

                  {/* Fields grid */}
                  <div className='grid min-w-0 flex-1 grid-cols-2 gap-x-2 gap-y-1.5 sm:grid-cols-3 lg:grid-cols-4'>
                    <div className='space-y-0.5'>
                      <label className='text-muted-foreground text-[11px]'>Tên biến thể</label>
                      <Input
                        type='text'
                        placeholder='Tên...'
                        className='h-7 text-xs'
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
                    </div>
                    <div className='space-y-0.5'>
                      <label className='text-muted-foreground text-[11px]'>Mã SKU</label>
                      <Input
                        type='text'
                        placeholder='SKU...'
                        className='h-7 text-xs'
                        value={prodVariant.sku}
                        onChange={(e) => {
                          const value = e.currentTarget.value
                          setProductVariantList((prev) => {
                            const targetProductVariant = prev[prodVariantIdx]
                            targetProductVariant.sku = value
                            return [...prev]
                          })
                        }}
                      />
                    </div>
                    <div className='space-y-0.5'>
                      <label className='text-muted-foreground text-[11px]'>Mã barcode</label>
                      <Input
                        type='text'
                        placeholder='Barcode...'
                        className='h-7 text-xs'
                        value={prodVariant.barcode ?? ''}
                        onChange={(e) => {
                          const value = e.currentTarget.value
                          setProductVariantList((prev) => {
                            const targetProductVariant = prev[prodVariantIdx]
                            targetProductVariant.barcode = value
                            return [...prev]
                          })
                        }}
                      />
                    </div>
                    <div className='space-y-0.5'>
                      <label className='text-muted-foreground text-[11px]'>Giá vốn</label>
                      <InputNumber
                        placeholder='0'
                        className='h-7 text-xs'
                        value={prodVariant.costPrice}
                        onValueChange={handleCostPriceChange(prodVariantIdx)}
                      />
                    </div>
                    <div className='space-y-0.5'>
                      <label className='text-muted-foreground text-[11px]'>Giá bán</label>
                      <InputNumber
                        placeholder='0'
                        className='h-7 text-xs'
                        value={prodVariant.sellingPrice}
                        onValueChange={handleSellingPriceChange(prodVariantIdx)}
                      />
                    </div>
                    <div className='space-y-0.5'>
                      <label className='text-muted-foreground text-[11px]'>Tồn kho</label>
                      <InputNumber
                        placeholder='0'
                        className='h-7 text-xs'
                        value={prodVariant.stockOnHand}
                        onValueChange={handleStockOnHandeChange(prodVariantIdx)}
                      />
                    </div>
                    <div className='space-y-0.5'>
                      <label className='text-muted-foreground text-[11px]'>Tồn tối thiểu</label>
                      <InputNumber
                        placeholder='0'
                        className='h-7 text-xs'
                        value={prodVariant.lowStockThreshold ?? 0}
                        onValueChange={(value) => {
                          setProductVariantList((prev) => {
                            const targetProductVariant = prev[prodVariantIdx]
                            targetProductVariant.lowStockThreshold = value
                            return [...prev]
                          })
                        }}
                      />
                    </div>
                    <div className='space-y-0.5'>
                      <label className='text-muted-foreground text-[11px]'>Tồn tối đa</label>
                      <InputNumber
                        placeholder='0'
                        className='h-7 text-xs'
                        value={prodVariant.maxStockThreshold ?? 0}
                        onValueChange={(value) => {
                          setProductVariantList((prev) => {
                            const targetProductVariant = prev[prodVariantIdx]
                            targetProductVariant.maxStockThreshold = value
                            return [...prev]
                          })
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  )
}
