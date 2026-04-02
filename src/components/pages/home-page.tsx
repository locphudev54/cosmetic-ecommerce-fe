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
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'

export default function HomePage() {
  const isDevelopment = envClient.NEXT_PUBLIC_NODE_ENV === 'development'
  const [dialogOpen, setDialogOpen] = React.useState(!isDevelopment)

  const { data: productsData } = useProducts()
  const productList = productsData?.data ?? []

  const [copiedItem, setCopiedItem] = React.useState<string | null>(null)

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(label)
    toast.success(`${label} đã được sao chép vào clipboard!`)
    setTimeout(() => setCopiedItem(null), 2000)
  }

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

      <Dialog open={true} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Website đang trong quá trình phát triền</DialogTitle>
            <DialogDescription>
              Một số tính năng demo có thể không hoạt động hoặc dữ liệu có thể không chính xác
              <div>Đội ngũ phát triền đang triển khai các tính năng mới</div>
              <strong className='mt-3 inline-block text-lg'>Cảm ơn bạn đã truy cập website</strong>
              <strong className='mt-3 inline-block text-xl text-blue-700'>
                Nếu website không hiển thị sản phẩm, vui lòng truy cập lại sau vài phút !
              </strong>
              <div className='mt-4 mb-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4'>
                <h3 className='mb-3 text-sm font-semibold text-blue-900'>👤 Tài khoản Admin</h3>
                <div className='space-y-2'>
                  {/* Email */}
                  <div className='flex items-center justify-between rounded border border-blue-100 bg-white px-3 py-2'>
                    <div>
                      <p className='text-xs text-slate-500'>Email</p>
                      <p className='text-sm font-medium text-slate-800'>loc01@gmail.com</p>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleCopy('phamphuloc7663@gmail.com', 'Email')}
                      className='ml-2 hover:bg-blue-100'
                    >
                      {copiedItem === 'Email' ? (
                        <Check className='h-4 w-4 text-green-600' />
                      ) : (
                        <Copy className='h-4 w-4' />
                      )}
                    </Button>
                  </div>

                  {/* Password */}
                  <div className='flex items-center justify-between rounded border border-blue-100 bg-white px-3 py-2'>
                    <div>
                      <p className='text-xs text-slate-500'>Mật khẩu</p>
                      <p className='font-mono text-sm font-medium tracking-widest text-slate-800'>
                        123123123
                      </p>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleCopy('123123123', 'Mật khẩu')}
                      className='ml-2 hover:bg-blue-100'
                    >
                      {copiedItem === 'Mật khẩu' ? (
                        <Check className='h-4 w-4 text-green-600' />
                      ) : (
                        <Copy className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </div>
              </div>{' '}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
