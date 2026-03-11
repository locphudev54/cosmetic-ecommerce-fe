'use client'

import NextJsImage from '@/components/common/next-js-image'
import { Button } from '@/components/ui/button'
import ProductImageThumbnail from '@/features/product/components/product-image-thumbnail'
import { CarouselImage } from '@/types/carousel'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { Upload } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useRef, useState } from 'react'
import type { RenderThumbnailProps } from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/plugins/captions.css'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/plugins/counter.css'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldLabel } from '@/components/ui/field'
import { TypographyMuted } from '@/components/common/typography'
import { ImageUploadButton } from '@/components/common/image-upload-button'
import { useUploadMultipleImages, useUploadSingleImage } from '@/features/upload/hooks/use-upload'
import { toast } from 'sonner'

// ── Dynamically import the heavy lightbox so it's excluded from initial bundle
const Lightbox = dynamic(() => import('yet-another-react-lightbox'), {
  ssr: false
})

export interface UploadedImage {
  id: string
  file: File
  preview: string
}

interface ImageUploadProps {
  maxImages?: number
}

const ORIGINAL_FIRST_ROW_IMAGES_QUANTITY = 5
const MAX_FIRST_ROW_IMAGES_QUANTITY = 7

export default function UploadProductImages({ maxImages = 5 }: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [showAllImages, setShowAllImages] = useState<boolean>(false)
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1) // -1 = closed
  const [selectImageIds, setSelectImageIds] = useState<string[]>([])
  // const inputRef = useRef<HTMLInputElement>(null)

  // const uploadSingleImageMutation = useUploadSingleImage()
  const uploadMultipleImagesMutation = useUploadMultipleImages()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

  // const handleFileSelect = (files: File[] | null) => {
  //   if (!files) return

  //   let uploadedImagesCount = 0

  //   Array.from(files).forEach((file) => {
  //     if (file.type.startsWith('image/') && images.length + uploadedImagesCount < maxImages) {
  //       const reader = new FileReader()
  //       reader.onload = (e) => {
  //         const preview = e.target?.result as string // preview URL of the image
  //         const uploadedImage: UploadedImage = {
  //           id: `${Date.now()}-${Math.random()}`,
  //           file,
  //           preview
  //         }
  //         setImages((prev) => {
  //           const updated = [...prev, uploadedImage]
  //           return updated
  //         })
  //       }
  //       reader.readAsDataURL(file)
  //       uploadedImagesCount++
  //     }
  //   })
  // }

  const handleRemoveImage = (ids: string[]) => {
    setImages((prev) => prev.filter((img) => !ids.includes(img.id)))
    setSelectImageIds((prev) => prev.filter((id) => !ids.includes(id)))
    // Turn off "show all images" mode if the number of images is less than or equal to the original first row quantity
    if (showAllImages && images.length - ids.length <= ORIGINAL_FIRST_ROW_IMAGES_QUANTITY) {
      setShowAllImages(false)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id)
      const newIndex = images.findIndex((img) => img.id === over.id)

      const newImages = arrayMove(images, oldIndex, newIndex)
      setImages(newImages)
    }
  }

  const toggleSelectImage = (id: string) => {
    setSelectImageIds((prev) =>
      prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]
    )
  }

  const handleImmediateUpload = async (files: File[]) => {
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images.`)
      return
    }

    // const uploadPromises = files.map((file) =>
    //   uploadSingleImageMutation.mutateAsync({ file, params: { folder: 'product-images' } })
    // )
    // const results = await Promise.all(uploadPromises)

    const results = await uploadMultipleImagesMutation.mutateAsync({
      files,
      params: { folder: 'product-images' }
    })

    // Map results to UploadedImage format and add to state
    const newUploadedImages: UploadedImage[] = results.map((result, index) => ({
      id: `${Date.now()}-${index}`,
      file: files[index],
      preview: result.url // Assuming the upload result contains the URL of the uploaded image
    }))
    setImages((prev) => [...prev, ...newUploadedImages])
  }

  const hasMaxImages = images.length >= maxImages
  const hasMoreImage = images.length > ORIGINAL_FIRST_ROW_IMAGES_QUANTITY
  const imageIds = images.map((img) => img.id)
  const primaryImage = images[0] // Always show the first image as the featured image
  const FIRST_ROW_IMAGE_QUANTITY = showAllImages
    ? MAX_FIRST_ROW_IMAGES_QUANTITY
    : ORIGINAL_FIRST_ROW_IMAGES_QUANTITY
  const remainingImages = showAllImages ? images.slice(FIRST_ROW_IMAGE_QUANTITY) : []
  const lightboxImages: CarouselImage[] = images.map((img) => ({
    src: img.preview,
    alt: img.file.name
  }))
  const isSelecteAllImages = selectImageIds.length === images.length && images.length > 0

  return (
    <div>
      {/* <input
        id='product_images'
        ref={inputRef}
        type='file'
        multiple
        accept='image/*'
        onChange={(e) => {
          handleFileSelect(e.target.files ? Array.from(e.target.files) : null)
          e.target.value = '' // Reset the input so the same file can be uploaded again if needed
        }}
        className='hidden'
      /> */}

      <div className='mb-3 h-5'>
        {selectImageIds.length === 0 ? (
          <FieldLabel htmlFor='product_images'>
            <TypographyMuted>Hình ảnh</TypographyMuted>
          </FieldLabel>
        ) : (
          <div className='flex items-center justify-between'>
            <div className='inline-flex items-center gap-x-2'>
              <Checkbox
                id='select_all_images'
                checked={isSelecteAllImages}
                className='size-4 cursor-pointer border-gray-400'
                onClick={() => {
                  if (!isSelecteAllImages) {
                    setSelectImageIds(images.map((img) => img.id))
                  } else {
                    setSelectImageIds([])
                  }
                }}
              />
              <label htmlFor='select_all_images' className='cursor-pointer text-sm font-normal'>
                {selectImageIds.length} ảnh đã chọn
              </label>
            </div>

            <div
              className='cursor-pointer text-sm font-normal text-red-600 hover:text-red-600'
              onClick={() => handleRemoveImage(selectImageIds)}
            >
              Xóa ({selectImageIds.length})
            </div>
          </div>
        )}
      </div>

      {/* Gallery Layout */}
      {images.length > 0 ? (
        <React.Fragment>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            // modifiers={[restrictToHorizontalAxis]}
          >
            <SortableContext items={imageIds} strategy={horizontalListSortingStrategy}>
              <div className='mb-2 grid grid-cols-5 gap-2'>
                {/* Primary Image */}
                <div className='col-span-2'>
                  <ProductImageThumbnail
                    key={primaryImage.id}
                    isPrimary
                    image={primaryImage}
                    isSelected={selectImageIds.includes(primaryImage.id)}
                    onSelect={() => toggleSelectImage(primaryImage.id)}
                    onZoomIn={() => setLightboxIndex(0)}
                  />
                </div>

                <div className='col-span-3'>
                  <div className='grid grid-cols-3 gap-2'>
                    {images
                      .slice(0, FIRST_ROW_IMAGE_QUANTITY)
                      .slice(1)
                      .map((image, idx) => (
                        <div key={image.id} className='col-span-1'>
                          <ProductImageThumbnail
                            key={image.id}
                            image={image}
                            isSelected={selectImageIds.includes(image.id)}
                            onZoomIn={() => {
                              setLightboxIndex(idx + 1)
                            }}
                            onSelect={() => toggleSelectImage(image.id)}
                          />
                        </div>
                      ))}

                    {/* Show more Button */}
                    {hasMoreImage && !showAllImages && (
                      <div className='col-span-1'>
                        <button
                          type='button'
                          onClick={() => {
                            setShowAllImages(true)
                          }}
                          className='border-muted-foreground/40 bg-muted/5 hover:bg-muted/10 hover:border-muted-foreground/80 flex aspect-square h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors'
                        >
                          <span className='text-muted-foreground/80 text-center text-sm font-medium'>
                            + {images.length - ORIGINAL_FIRST_ROW_IMAGES_QUANTITY} more
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Upload New Button */}
                    {!hasMaxImages && !showAllImages && (
                      <div className='col-span-1'>
                        {/* <button
                          type='button'
                          onClick={() => inputRef.current?.click()}
                          className='border-muted-foreground/40 bg-muted/5 hover:bg-muted/10 hover:border-muted-foreground/80 flex aspect-square h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors'
                          aria-label='Upload new image'
                        >
                          <Upload className='text-muted-foreground/80 mb-1 h-5 w-5' />
                          <span className='text-muted-foreground/80 text-center text-sm font-medium'>
                            Upload New Images
                          </span>
                        </button> */}
                        {/* <div
                          onClick={() => inputRef.current?.click()}
                          onDragOver={handleDragImages}
                          onDrop={handleDropImgaes}
                          className='border-muted-foreground/40 bg-muted/5 hover:bg-muted/10 hover:border-muted-foreground/80 flex aspect-square h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors'
                        >
                          <Upload className='text-muted-foreground/80 mb-1 h-5 w-5' />
                          <span className='text-muted-foreground/80 text-center text-sm font-medium'>
                            Upload New Images
                          </span>
                        </div> */}
                        <ImageUploadButton
                          multiple
                          label='Upload Images'
                          mode='immediate'
                          onUpload={handleImmediateUpload}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {showAllImages && (
                <div className='grid grid-cols-5 gap-2'>
                  {remainingImages.map((image, idx) => (
                    <div key={image.id} className='col-span-1'>
                      <ProductImageThumbnail
                        key={image.id}
                        image={image}
                        isSelected={selectImageIds.includes(image.id)}
                        onZoomIn={() => {
                          setLightboxIndex(idx + FIRST_ROW_IMAGE_QUANTITY)
                        }}
                        onSelect={() => toggleSelectImage(image.id)}
                      />
                    </div>
                  ))}

                  <div className='col-span-1'>
                    <button
                      type='button'
                      onClick={() => {
                        setShowAllImages(false)
                      }}
                      className='border-muted-foreground/30 bg-muted/5 hover:bg-muted/10 hover:border-muted-foreground/60 flex aspect-square h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors'
                    >
                      <TypographyMuted>Show less</TypographyMuted>
                    </button>
                  </div>

                  {/* Upload New Button */}
                  {!hasMaxImages && (
                    <div className='col-span-1'>
                      {/* <div
                        onClick={() => inputRef.current?.click()}
                        onDragOver={handleDragImages}
                        onDrop={handleDropImgaes}
                        className='border-muted-foreground/40 bg-muted/5 hover:bg-muted/10 hover:border-muted-foreground/80 flex aspect-square h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors'
                      >
                        <Upload className='text-muted-foreground/80 mb-1 h-5 w-5' />
                        <span className='text-muted-foreground/80 text-center text-sm font-medium'>
                          Upload New Images
                        </span>
                      </div> */}
                      <ImageUploadButton
                        label='Upload Images'
                        multiple
                        mode='default'
                        onChange={handleImmediateUpload}
                      />
                    </div>
                  )}
                </div>
              )}
            </SortableContext>
          </DndContext>

          <Lightbox
            open={lightboxIndex >= 0}
            index={lightboxIndex}
            close={() => setLightboxIndex(-1)}
            slides={lightboxImages}
            render={{
              slide: NextJsImage,
              thumbnail: ({ slide, rect }: RenderThumbnailProps) => (
                <NextJsImage slide={slide} offset={0} rect={rect} />
              )
            }}
            plugins={[Thumbnails, Captions, Counter, Zoom]}
            animation={{ fade: 300 }}
            carousel={{ finite: false }}
            controller={{ closeOnBackdropClick: true }}
            on={
              {
                // view: ({ index }) => {
                //   setLightboxIndex(index)
                // }
                // click: () => setLightboxIndex(-1)
              }
            }
            zoom={{
              maxZoomPixelRatio: 3,
              zoomInMultiplier: 2
            }}
            counter={{ container: { style: { top: 0, bottom: 'unset' } } }}
          />
        </React.Fragment>
      ) : (
        /* Empty State */
        <ImageUploadButton
          label='Upload Images'
          multiple
          className='h-36'
          mode='immediate'
          onUpload={handleImmediateUpload}
        />
        // <div
        //   onClick={() => inputRef.current?.click()}
        //   onDragOver={handleDragImages}
        //   onDrop={handleDropImgaes}
        //   className='border-muted-foreground/25 bg-muted/5 hover:bg-muted/10 hover:border-muted-foreground/40 cursor-pointer rounded-lg border-2 border-dashed py-4 transition-colors'
        // >
        //   <div className='flex flex-col items-center justify-center gap-2'>
        //     <div className='bg-primary/10 rounded-full p-3'>
        //       <Upload className='text-primary h-6 w-6' />
        //     </div>
        //     <div className='text-center'>
        //       <p className='text-foreground font-normal'>Upload Images</p>
        //     </div>
        //     <Button type='button' variant='outline' size='sm' className='mt-2'>
        //       Choose Images
        //     </Button>
        //   </div>
        // </div>
      )}
    </div>
  )
}
