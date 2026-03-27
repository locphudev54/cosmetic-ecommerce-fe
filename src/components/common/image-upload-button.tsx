'use client'

import { TypographyMuted } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import React, { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

export type UploadMode = 'immediate' | 'preview'

export interface ImageUploadButtonProps {
  mode?: UploadMode
  multiple?: boolean
  disabled?: boolean
  className?: string
  uploadedImageUrls?: string[]
  label?: string
  maxFiles?: number
  onUpload?: (files: File[]) => Promise<void>
  onChange?: (files: File[]) => void
}

export const ImageUploadButton = ({
  mode = 'preview',
  multiple = false,
  onUpload,
  onChange,
  disabled = false,
  className,
  uploadedImageUrls,
  maxFiles,
  label
}: ImageUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  React.useEffect(() => {
    // Clean up object URLs when component unmounts or previews change
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [previews])

  // Sync uploadedImageUrls to previews in preview mode
  React.useEffect(() => {
    if (mode === 'preview' && uploadedImageUrls && uploadedImageUrls.length > 0) {
      setPreviews(uploadedImageUrls)
    }
  }, [uploadedImageUrls, mode])

  const generatePreviewUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const fileArray = Array.from(files)
      const imageFiles = fileArray.filter((file) => file.type.startsWith('image/'))

      if (imageFiles.length === 0) {
        toast.error('Please select valid image files')
        return
      }

      if (!multiple && imageFiles.length > 1) {
        toast.error('Please select only one image')
        return
      }

      if (maxFiles && imageFiles.length > maxFiles) {
        toast.error(`You can only upload up to ${maxFiles} images`)
        return
      }

      try {
        if (mode === 'immediate') {
          setIsUploading(true)
          await onUpload?.(imageFiles)

          toast.success(
            `${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} uploaded successfully`
          )
        } else {
          // Preview mode
          const previewUrls = await Promise.all(imageFiles.map((file) => generatePreviewUrl(file)))

          if (multiple) {
            // setSelectedFiles((prev) => [...prev, ...imageFiles])
            setPreviews((prev) => [...prev, ...previewUrls])
          } else {
            // setSelectedFiles(imageFiles)
            setPreviews(previewUrls)
          }

          onChange?.(imageFiles)
          // onChange?.(multiple ? [...selectedFiles, ...imageFiles] : imageFiles)
          toast.success('Images added to preview')
        }
      } catch (error) {
        toast.error('Failed to process images')
        console.error('Upload error:', error)
      } finally {
        setIsUploading(false)
      }

      // Reset input
      // if (fileInputRef.current) {
      //   fileInputRef.current.value = ''
      // }
    },
    [generatePreviewUrl, maxFiles, mode, multiple, onChange, onUpload]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemovePreview = (index: number) => {
    // const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    // setSelectedFiles(newFiles)
    setPreviews(newPreviews)
    // onChange?.(newFiles)
  }

  const handleClearAll = () => {
    // setSelectedFiles([])
    setPreviews([])
    onChange?.([])
  }

  return (
    <div className={cn('aspect-square w-full', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all',
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input
          ref={fileInputRef}
          type='file'
          max={maxFiles}
          multiple={multiple}
          accept='image/*'
          onChange={handleInputChange}
          disabled={disabled || isUploading}
          className='hidden'
        />

        {isUploading ? (
          <>
            <Spinner className='h-4 w-4' />
            <span>
              <TypographyMuted>Uploading...</TypographyMuted>
            </span>
          </>
        ) : (
          <div className='flex flex-col items-center gap-2'>
            <Upload className='text-muted-foreground mb-3 size-5' strokeWidth={1.5} />
            <TypographyMuted className='line-clamp-1 truncate'>{label}</TypographyMuted>
          </div>
        )}

        {/* <div className='text-muted-foreground font-medium'>{label}</div> */}
        {/* <Button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className='gap-2'
        >
          {isUploading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              Uploading...
            </>
          ) : (
            <>
              <Upload className='h-4 w-4' />
              {label}
            </>
          )}
        </Button> */}

        {/* Preview Section (only in preview mode) */}
        {mode === 'preview' && previews.length > 0 && (
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              {/* <h3 className='text-sm font-semibold'>Preview ({previews.length})</h3> */}
              {multiple && previews.length > 1 && (
                <Button type='button' variant='ghost' size='sm' onClick={handleClearAll}>
                  Clear All
                </Button>
              )}
            </div>

            {previews.length === 1 &&
              previews.map((preview, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className='group bg-muted absolute inset-0 h-full w-full overflow-hidden rounded-lg'
                >
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className='h-full w-full object-cover transition-transform group-hover:scale-105'
                    sizes='100vw'
                    width={0}
                    height={0}
                  />
                  <Button
                    type='button'
                    size={'icon-xs'}
                    variant={'destructive'}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemovePreview(index)
                    }}
                    className='absolute top-1 right-1 cursor-pointer rounded-full p-1 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ))}
          </div>
        )}

        {/* Hidden metadata for form submission in preview mode */}
        {/* {mode === 'preview' && selectedFiles.length > 0 && (
        <input
          type='hidden'
          name='uploadedFiles'
          value={JSON.stringify(selectedFiles.map((f) => ({ name: f.name, size: f.size })))}
        />
      )} */}
      </div>

      {previews.length > 1 && (
        <div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4'>
          {previews.map((preview, index) => (
            <div
              key={index}
              className='group bg-muted relative aspect-square overflow-hidden rounded-lg'
            >
              <Image
                sizes='100vw'
                height={0}
                width={0}
                src={preview}
                alt={`Preview ${index + 1}`}
                className='h-full w-full object-cover transition-transform group-hover:scale-105'
              />
              <Button
                type='button'
                size={'icon-xs'}
                variant={'destructive'}
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemovePreview(index)
                }}
                className='absolute top-1 right-1 cursor-pointer rounded-full p-1 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
