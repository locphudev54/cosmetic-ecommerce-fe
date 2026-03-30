import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const FILTER_SECTION_COUNT = 4
const FILTER_ITEM_COUNT = 6
const PRODUCT_CARD_COUNT = 10

export default function CollectionPageLoadingSkeleton() {
  return (
    <div className='mt-4 grid grid-cols-12 gap-x-7'>
      <div className='col-span-3'>
        <div className='flex flex-col gap-y-4 text-sm'>
          {Array.from({ length: FILTER_SECTION_COUNT }).map((_, sectionIndex) => (
            <div
              key={`filter-skeleton-${sectionIndex}`}
              className='rounded border border-gray-100 text-sm shadow'
            >
              <div className='flex items-center justify-between border-b border-gray-200 px-3.5 py-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-5 w-5 rounded-full' />
              </div>
              <div className='space-y-3 px-3.5 py-3'>
                <Skeleton className='h-8 w-full rounded-md' />
                <div className='space-y-2'>
                  {Array.from({ length: FILTER_ITEM_COUNT }).map((_, itemIndex) => (
                    <div
                      key={`filter-item-skeleton-${sectionIndex}-${itemIndex}`}
                      className='flex items-center gap-3'
                    >
                      <Skeleton className='h-4 w-4 rounded-sm' />
                      <Skeleton className='h-3 w-full' />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='col-span-9'>
        <div className='space-y-6'>
          <div className='aspect-16/6'>
            <Skeleton className='h-full w-full rounded-none' />
          </div>

          <div className='flex items-center justify-between py-4'>
            <div className='flex items-center gap-x-6'>
              <Skeleton className='h-7 w-44' />
              <Skeleton className='h-4 w-24' />
            </div>
            <Skeleton className='h-10 w-48 rounded-none' />
          </div>

          <div className='flex flex-wrap gap-2 pb-6'>
            {Array.from({ length: 5 }).map((_, badgeIndex) => (
              <Skeleton key={`badge-skeleton-${badgeIndex}`} className='h-7 w-24 rounded-full' />
            ))}
          </div>

          <div className='grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {Array.from({ length: PRODUCT_CARD_COUNT }).map((_, cardIndex) => (
              <div
                key={`product-card-skeleton-${cardIndex}`}
                className='rounded-md border border-gray-100 bg-white p-1.5 text-sm shadow-md'
              >
                <div className='aspect-square'>
                  <Skeleton className='h-full w-full rounded-md' />
                </div>
                <div className='mt-4 space-y-2 px-2 pb-2'>
                  <Skeleton className='h-3 w-2/3' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-5/6' />
                  <Skeleton className='h-4 w-1/2' />
                  <Skeleton className='h-9 w-full rounded-full' />
                </div>
              </div>
            ))}
          </div>

          <div className='mt-8 flex justify-center'>
            <Skeleton className='h-10 w-36 rounded-md' />
          </div>
        </div>
      </div>
    </div>
  )
}
