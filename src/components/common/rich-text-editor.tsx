'use client'

import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

// ── Custom Image Blot (BlockEmbed) ──────────────────────────────────
// Quill's default image is an inline Embed, so block-level alignment
// (center, right) has no effect on it. We register a BlockEmbed-based
// image blot so the alignment toolbar buttons work on images.
const BlockEmbed = Quill.import('blots/block/embed') as typeof import('parchment').EmbedBlot

class ImageBlot extends BlockEmbed {
  static blotName = 'image'
  static tagName = 'img'

  static create(value: string) {
    const node = super.create() as HTMLImageElement
    node.setAttribute('src', value)
    node.setAttribute('alt', '')
    return node
  }

  static value(node: HTMLImageElement) {
    return node.getAttribute('src')
  }

  static formats(node: HTMLImageElement) {
    const formats: Record<string, string> = {}
    if (node.hasAttribute('alt')) formats.alt = node.getAttribute('alt')!
    if (node.hasAttribute('width')) formats.width = node.getAttribute('width')!
    if (node.hasAttribute('height')) formats.height = node.getAttribute('height')!
    if (node.style.width) formats.width = node.style.width
    if (node.style.height) formats.height = node.style.height
    return formats
  }

  format(name: string, value: string) {
    if (['alt', 'width', 'height'].includes(name)) {
      if (value) {
        ;(this as any).domNode.setAttribute(name, value)
      } else {
        ;(this as any).domNode.removeAttribute(name)
      }
    } else {
      super.format(name, value)
    }
  }
}

Quill.register(ImageBlot, true)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Upload, Lock, Unlock } from 'lucide-react'
import { useUploadSingleImage } from '@/features/upload/hooks/use-upload'

export interface RichTextEditorHandle {
  getHTML: () => string
  getContents: () => object
}

interface Props {
  defaultValue?: string
  onChange?: (html: string) => void
  onBlur?: () => void
  placeholder?: string
  uploadFolder?: string
}

interface EditingImage {
  element: HTMLImageElement
  src: string
  width: number
  height: number
  naturalWidth: number
  naturalHeight: number
  alt: string
}

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  ['link', 'custom-image', 'video', 'formula'],

  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],

  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],

  ['clean']
]

const RichTextEditor = forwardRef<RichTextEditorHandle, Props>(
  (
    { defaultValue = '', onChange, onBlur, placeholder = 'Write something...', uploadFolder },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const quillRef = useRef<Quill | null>(null)

    // Dialog states
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editingImage, setEditingImage] = useState<EditingImage | null>(null)
    const [aspectLocked, setAspectLocked] = useState(true)
    const [editWidth, setEditWidth] = useState(0)
    const [editHeight, setEditHeight] = useState(0)
    const [editAlt, setEditAlt] = useState('')

    // Refs for callbacks used inside Quill (avoids stale closures)
    const openUploadDialogRef = useRef<() => void>(() => {})
    const handleImageClickRef = useRef<(e: MouseEvent) => void>(() => {})

    const uploadMutation = useUploadSingleImage()

    useImperativeHandle(ref, () => ({
      getHTML: () => quillRef.current?.root.innerHTML ?? '',
      getContents: () => quillRef.current?.getContents() ?? {}
    }))

    // Keep refs updated
    openUploadDialogRef.current = () => setUploadDialogOpen(true)
    handleImageClickRef.current = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG') {
        e.preventDefault()
        e.stopPropagation()
        const img = target as HTMLImageElement

        // Wait for natural dimensions to load
        const openDialog = () => {
          const imgData: EditingImage = {
            element: img,
            src: img.src,
            width: img.width || img.naturalWidth,
            height: img.height || img.naturalHeight,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            alt: img.alt || ''
          }
          setEditingImage(imgData)
          setEditWidth(imgData.width)
          setEditHeight(imgData.height)
          setEditAlt(imgData.alt)
          setAspectLocked(true)
          setEditDialogOpen(true)
        }

        if (img.naturalWidth > 0) {
          openDialog()
        } else {
          img.onload = openDialog
        }
      }
    }

    // Track whether initial defaultValue was already applied during Quill init
    const defaultValueAppliedRef = useRef(false)

    useEffect(() => {
      if (!containerRef.current || quillRef.current) return

      quillRef.current = new Quill(containerRef.current, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              'custom-image': () => {
                openUploadDialogRef.current()
              }
            }
          }
        }
      })

      if (defaultValue) {
        quillRef.current.root.innerHTML = defaultValue
        defaultValueAppliedRef.current = true
      }

      quillRef.current.on('text-change', () => {
        onChange?.(quillRef.current!.root.innerHTML)
      })

      quillRef.current.root.addEventListener('blur', () => {
        onBlur?.()
      })

      // Click handler for images inside the editor
      quillRef.current.root.addEventListener('click', (e: MouseEvent) => {
        handleImageClickRef.current(e)
      })

      // Style the custom toolbar button
      const toolbar = containerRef.current.closest('.ql-toolbar') ?? containerRef.current.previousElementSibling
      if (toolbar) {
        const customImageBtn = toolbar.querySelector('.ql-custom-image')
        if (customImageBtn) {
          customImageBtn.innerHTML = `<svg viewBox="0 0 18 18"><rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect><circle class="ql-fill" cx="6" cy="7" r="1"></circle><polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline></svg>`
          customImageBtn.setAttribute('title', 'Insert Image')
        }
      }

      return () => {
        quillRef.current = quillRef.current
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Sync Quill content when defaultValue changes after initialization
    useEffect(() => {
      if (!quillRef.current) return

      if (!defaultValueAppliedRef.current && defaultValue) {
        quillRef.current.root.innerHTML = defaultValue
        defaultValueAppliedRef.current = true
      } else if (defaultValueAppliedRef.current && defaultValue !== quillRef.current.root.innerHTML) {
        quillRef.current.root.innerHTML = defaultValue
      }
    }, [defaultValue])

    // ── Upload Image Handler ──────────────────────────────────────────
    const handleFileSelected = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
          const result = await uploadMutation.mutateAsync({
            file,
            params: { folder: uploadFolder ?? 'rich-text-editor' }
          })

          if (quillRef.current) {
            const range = quillRef.current.getSelection(true)
            quillRef.current.insertEmbed(range.index, 'image', result.url)
            quillRef.current.setSelection(range.index + 1, 0)
          }

          setUploadDialogOpen(false)
        } catch (error) {
          console.error('Image upload failed:', error)
        }
      },
      [uploadMutation, uploadFolder]
    )

    // ── Edit Image Handlers ──────────────────────────────────────────
    const handleWidthChange = useCallback(
      (newWidth: number) => {
        setEditWidth(newWidth)
        if (aspectLocked && editingImage) {
          const ratio = editingImage.naturalHeight / editingImage.naturalWidth
          setEditHeight(Math.round(newWidth * ratio))
        }
      },
      [aspectLocked, editingImage]
    )

    const handleHeightChange = useCallback(
      (newHeight: number) => {
        setEditHeight(newHeight)
        if (aspectLocked && editingImage) {
          const ratio = editingImage.naturalWidth / editingImage.naturalHeight
          setEditWidth(Math.round(newHeight * ratio))
        }
      },
      [aspectLocked, editingImage]
    )

    const handleSaveImageEdit = useCallback(() => {
      if (!editingImage) return

      const img = editingImage.element
      img.setAttribute('width', String(editWidth))
      img.setAttribute('height', String(editHeight))
      img.style.width = `${editWidth}px`
      img.style.height = `${editHeight}px`
      img.setAttribute('alt', editAlt)

      // Notify Quill of the change
      onChange?.(quillRef.current?.root.innerHTML ?? '')

      setEditDialogOpen(false)
      setEditingImage(null)
    }, [editingImage, editWidth, editHeight, editAlt, onChange])

    return (
      <>
        <div className='rich-text-editor-wrapper'>
          <div ref={containerRef} />
        </div>

        {/* ── Upload Image Dialog ──────────────────────────────────── */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Chèn hình ảnh</DialogTitle>
              <DialogDescription>
                Chọn một hình ảnh từ máy tính để tải lên và chèn vào trình soạn thảo.
              </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col items-center gap-4 py-4'>
              <label
                htmlFor='rte-image-upload'
                className='flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:bg-muted'
              >
                {uploadMutation.isPending ? (
                  <div className='flex flex-col items-center gap-2'>
                    <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                    <span className='text-sm text-muted-foreground'>Đang tải lên...</span>
                  </div>
                ) : (
                  <div className='flex flex-col items-center gap-2'>
                    <Upload className='h-8 w-8 text-muted-foreground' />
                    <span className='text-sm text-muted-foreground'>
                      Nhấn để chọn hình ảnh
                    </span>
                  </div>
                )}
                <input
                  id='rte-image-upload'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  disabled={uploadMutation.isPending}
                  onChange={handleFileSelected}
                />
              </label>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setUploadDialogOpen(false)}>
                Hủy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Edit Image Dialog ────────────────────────────────────── */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className='sm:max-w-lg'>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa hình ảnh</DialogTitle>
              <DialogDescription>
                Thay đổi kích thước và văn bản thay thế (alt text) cho hình ảnh.
              </DialogDescription>
            </DialogHeader>

            {editingImage && (
              <div className='flex flex-col gap-4 py-2'>
                {/* Preview */}
                <div className='flex justify-center rounded-md border bg-muted/30 p-2'>
                  <img
                    src={editingImage.src}
                    alt={editAlt}
                    className='max-h-48 rounded object-contain'
                    style={{ maxWidth: '100%' }}
                  />
                </div>

                {/* Dimensions */}
                <div className='flex items-end gap-3'>
                  <div className='flex-1 space-y-1.5'>
                    <Label htmlFor='img-width'>Chiều rộng (px)</Label>
                    <Input
                      id='img-width'
                      type='number'
                      min={1}
                      value={editWidth}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                    />
                  </div>

                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => setAspectLocked((prev) => !prev)}
                    className='mb-0.5 shrink-0'
                    title={aspectLocked ? 'Bỏ khóa tỉ lệ' : 'Khóa tỉ lệ'}
                  >
                    {aspectLocked ? <Lock className='h-4 w-4' /> : <Unlock className='h-4 w-4' />}
                  </Button>

                  <div className='flex-1 space-y-1.5'>
                    <Label htmlFor='img-height'>Chiều cao (px)</Label>
                    <Input
                      id='img-height'
                      type='number'
                      min={1}
                      value={editHeight}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Alt text */}
                <div className='space-y-1.5'>
                  <Label htmlFor='img-alt'>Văn bản thay thế (Alt text)</Label>
                  <Input
                    id='img-alt'
                    type='text'
                    placeholder='Mô tả hình ảnh...'
                    value={editAlt}
                    onChange={(e) => setEditAlt(e.target.value)}
                  />
                  <p className='text-xs text-muted-foreground'>
                    Alt text giúp mô tả hình ảnh cho SEO và khả năng tiếp cận.
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant='outline' onClick={() => setEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSaveImageEdit}>Lưu thay đổi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Scoped styles for image hover indicator */}
        <style dangerouslySetInnerHTML={{ __html: `
          .rich-text-editor-wrapper .ql-editor img {
            cursor: pointer;
            transition: outline 0.15s ease, box-shadow 0.15s ease;
            border-radius: 4px;
          }
          .rich-text-editor-wrapper .ql-editor img:hover {
            outline: 2px solid hsl(var(--primary));
            outline-offset: 2px;
            box-shadow: 0 0 0 4px hsl(var(--primary) / 0.1);
          }
        `}} />
      </>
    )
  }
)

RichTextEditor.displayName = 'RichTextEditor'
export default RichTextEditor
