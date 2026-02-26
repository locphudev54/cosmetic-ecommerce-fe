import type { SlideImage } from 'yet-another-react-lightbox'

// Extend YARL's SlideImage to keep your existing CarouselImage shape
export interface CarouselImage extends SlideImage {
  src: string
  alt?: string
  blurDataURL?: string // for next/image placeholder
}

export interface ImageCarouselProps {
  images: CarouselImage[]
}
