'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/counter.css'

import NextJsImage from '@/components/common/next-js-image'
import type { ImageCarouselProps, CarouselImage } from '@/types/carousel'
import type { RenderThumbnailProps } from 'yet-another-react-lightbox'

// const ThumbnailRenderer = ({ slide }: RenderThumbnailProps) => (
//   <NextJsImage slide={slide} offset={0} rect={{ width: 0, height: 0 }} />
// )

// // ── Dynamically import the heavy lightbox so it's excluded from initial bundle
// const Lightbox = dynamic(() => import('yet-another-react-lightbox'), {
//   ssr: false
// })

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1) // -1 = closed

  return (
    <>
      {/* ── Thumbnail grid ─────────────────────────────────── */}
      <div
        className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4'
        role='list'
        aria-label='Image gallery'
      >
        {images.map((img: CarouselImage, i: number) => (
          <button
            key={`${img.src}-${i}`}
            role='listitem'
            onClick={() => setLightboxIndex(i)}
            className='group relative aspect-square overflow-hidden rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
            aria-label={`Open image: ${img.alt ?? `Image ${i + 1}`}`}
          >
            <Image
              src={img.src}
              alt={img.alt ?? ''}
              fill
              placeholder={img.blurDataURL ? 'blur' : 'empty'}
              blurDataURL={img.blurDataURL}
              className='object-cover transition duration-300 group-hover:scale-105'
              sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
            />
            <span className='absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20' />
          </button>
        ))}
      </div>

      {/* ── Lightbox ───────────────────────────────────────── */}
      {/* <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={images}
        render={{ slide: NextJsImage, thumbnail: ThumbnailRenderer }}
        plugins={[Thumbnails, Captions, Counter, Zoom]}
        animation={{ fade: 300 }}
        carousel={{ finite: false }}
        controller={{ closeOnBackdropClick: true }}
        on={{
          view: ({ index }) => setLightboxIndex(index)
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2
        }}
        counter={{ container: { style: { top: 0, bottom: 'unset' } } }}
      /> */}
    </>
  )
}
