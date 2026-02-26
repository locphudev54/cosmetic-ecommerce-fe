import Image from 'next/image'
import type { RenderSlideProps, SlideImage } from 'yet-another-react-lightbox'

function isSlideImage(slide: RenderSlideProps['slide']): slide is SlideImage {
  return slide.type === 'image' || !('type' in slide)
}

const THUMBNAIL_SIZE = 120 // px — match YARL's default thumbnail size

export default function NextJsImage({ slide, rect }: RenderSlideProps) {
  if (!isSlideImage(slide) || !slide.src) return null

  // Guard against zero dimensions (e.g. during thumbnail pre-render)
  const safeRect = {
    width: rect.width > 0 ? rect.width : THUMBNAIL_SIZE,
    height: rect.height > 0 ? rect.height : THUMBNAIL_SIZE
  }

  const width =
    slide.width && slide.height
      ? Math.round(Math.min(rect.width, (rect.height / slide.height) * slide.width))
      : safeRect.width

  const height =
    slide.width && slide.height
      ? Math.round(Math.min(rect.height, (rect.width / slide.width) * slide.height))
      : safeRect.height

  return (
    <div style={{ position: 'relative', width, height }}>
      <Image
        src={slide.src}
        alt={(slide as SlideImage & { alt?: string }).alt ?? ''}
        fill
        placeholder={
          (slide as SlideImage & { blurDataURL?: string }).blurDataURL ? 'blur' : 'empty'
        }
        blurDataURL={(slide as SlideImage & { blurDataURL?: string }).blurDataURL}
        className='object-contain'
        sizes='100vw'
        priority
      />
    </div>
  )
}
