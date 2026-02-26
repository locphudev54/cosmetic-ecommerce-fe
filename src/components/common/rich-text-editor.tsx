'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

export interface RichTextEditorHandle {
  getHTML: () => string
  getContents: () => object
}

interface Props {
  defaultValue?: string
  onChange?: (html: string) => void
  onBlur?: () => void
  placeholder?: string
}

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'] // remove formatting button
]

const RichTextEditor = forwardRef<RichTextEditorHandle, Props>(
  ({ defaultValue = '', onChange, onBlur, placeholder = 'Write something...' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const quillRef = useRef<Quill | null>(null)

    useImperativeHandle(ref, () => ({
      getHTML: () => quillRef.current?.root.innerHTML ?? '',
      getContents: () => quillRef.current?.getContents() ?? {}
    }))

    useEffect(() => {
      if (!containerRef.current || quillRef.current) return

      quillRef.current = new Quill(containerRef.current, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: toolbarOptions
        }
      })

      if (defaultValue) {
        quillRef.current.root.innerHTML = defaultValue
      }

      quillRef.current.on('text-change', () => {
        onChange?.(quillRef.current!.root.innerHTML)
      })

      quillRef.current.root.addEventListener('blur', () => {
        onBlur?.()
      })

      // // Set default size to "large"
      // quillRef.current.format('size', 'large')

      return () => {
        quillRef.current = quillRef.current
      }
    }, [])

    return <div ref={containerRef} />
  }
)

RichTextEditor.displayName = 'RichTextEditor'
export default RichTextEditor
