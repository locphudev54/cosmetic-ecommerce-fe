'use client'

import { Pagination } from '@/components/common/pagination'

export default function TestPage() {
  return (
    <div className='p-20'>
      <div className='grid grid-cols-6'>
        <div className='col-span-2 bg-green-400'>1</div>
        <div className='col-span-4 bg-red-500'>2</div>
      </div>

      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={(page) => {
          console.log(page)
        }}
        // onPageChange={(page) => setQueryParams({ page })}
        // disabled={isFetching}
        siblingCount={1}
        boundaryCount={1}
        className='mt-8'
      />

      <div className='mt-4 grid grid-cols-5'>
        <div className='col-span-3 bg-blue-400'>1</div>
        <div className='col-span-2 bg-yellow-500'>2</div>
      </div>
    </div>
  )
}
