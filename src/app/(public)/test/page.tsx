'use client'

export default function TestPage() {
  return (
    <div className='p-20'>
      <div className='grid grid-cols-6'>
        <div className='col-span-2 bg-green-400'>1</div>
        <div className='col-span-4 bg-red-500'>2</div>
      </div>

      <div className='mt-4 grid grid-cols-5'>
        <div className='col-span-3 bg-blue-400'>1</div>
        <div className='col-span-2 bg-yellow-500'>2</div>
      </div>
    </div>
  )
}
