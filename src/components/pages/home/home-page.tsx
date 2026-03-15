'use client'
import ScrollToTopButton from '@/components/common/scroll-to-top-button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import ProductCard from '@/features/product/components/product-card'
import { useProducts } from '@/features/product/hooks'
import Image from 'next/image'
import React from 'react'

import { envClient } from '@/config/env.client'

export default function HomePage() {
  const isDevelopment = envClient.NEXT_PUBLIC_NODE_ENV === 'development'
  const [dialogOpen, setDialogOpen] = React.useState(!isDevelopment)

  const { data: productsData } = useProducts()
  const productList = productsData?.data ?? []
  return (
    <React.Fragment>
      <Carousel className='relative'>
        <CarouselContent className='md:h-[70 vh] h-[70vh]'>
          <CarouselItem>
            <Image
              width={0}
              height={0}
              sizes='100vw'
              className='h-full w-full object-cover'
              src={'/banner1.webp'}
              alt='banner'
            />
          </CarouselItem>
          <CarouselItem>
            <Image
              width={0}
              height={0}
              sizes='100vw'
              className='h-full w-full object-cover'
              src={'/banner2.webp'}
              alt='banner'
            />
          </CarouselItem>
          <CarouselItem>
            <Image
              width={0}
              height={0}
              sizes='100vw'
              className='h-full w-full object-cover'
              src={'/banner3.webp'}
              alt='banner'
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className='absolute top-[50%] left-3 h-12 w-12 opacity-60 hover:opacity-100' />
        <CarouselNext className='absolute top-[50%] right-3 h-12 w-12 opacity-60 hover:opacity-100' />
      </Carousel>

      <div className='customer-page-container'>
        <div className='grid grid-cols-12 gap-x-5 bg-white pt-20 pb-10'>
          {[
            '/sub-banner-1.webp',
            '/sub-banner-2.webp',
            '/sub-banner-3.webp',
            '/sub-banner-4.webp'
          ].map((path, index) => (
            <div key={index} className='col-span-3'>
              <div className='aspect-[3/2.2] overflow-hidden rounded-md'>
                <Image
                  src={path}
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='h-full w-full cursor-pointer rounded-md object-cover transition-transform duration-300 hover:scale-105'
                  alt='banner'
                />
              </div>
            </div>
          ))}
        </div>

        <div className='mt-10 rounded-md bg-[#ffeef0] px-5 pt-5 pb-12'>
          <div className='flex items-center gap-x-4'>
            <div className='relative flex h-4 w-4 items-center justify-center'>
              {/* Ripple ring */}
              <span className='animate-ripple absolute inline-block h-[80%] w-[80%] rounded-full border border-[#d70827]' />
              {/* Central dot */}
              <span className='relative z-10 inline-block h-2 w-2 rounded-full bg-[#d70827]' />
            </div>
            <h2 className='text-2xl font-bold text-[#d70827] capitalize'>Sản phẩm bán chạy</h2>
          </div>

          {/* The gap between 2 Product cart in the pl-3 andd -ml-3 Tailwind Class */}
          <Carousel className='mt-5'>
            <CarouselContent className='-ml-3'>
              {productList.map((product) => (
                <CarouselItem
                  key={product.id}
                  className='basis-1/2 pl-3 sm:basis-1/3 md:basis-1/4 lg:basis-1/6'
                >
                  <ProductCard key={product.id} product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className='absolute -top-7 right-12 flex items-center justify-center'>
              <CarouselPrevious className='relative left-0 translate-x-0 hover:translate-x-0' />
            </div>
            <div className='absolute -top-7 right-2 flex items-center justify-center'>
              <CarouselNext className='relative right-0 translate-x-0 hover:translate-x-0' />
            </div>
          </Carousel>
        </div>
      </div>

      <ScrollToTopButton />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Website đang trong quá trình phát triền</DialogTitle>
            <DialogDescription>
              Một số tính năng demo có thể không hoạt động hoặc dữ liệu có thể không chính xác
              <div>Đội ngũ phát triền đang triển khai các tính năng mới</div>
              <strong className='mt-3 inline-block text-lg'>
                Cảm ơn bạn đã truy cập website ❣️
              </strong>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
