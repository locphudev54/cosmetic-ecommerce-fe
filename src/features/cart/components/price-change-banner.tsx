'use client'

import { formatNumberWithCommas } from '@/lib/utils'
import { TrendingDown, TrendingUp } from 'lucide-react'

interface Props {
  previousPrice: number
  currentPrice: number
}

export default function PriceChangeBanner({ previousPrice, currentPrice }: Props) {
  const priceIncreased = currentPrice > previousPrice
  const diff = Math.abs(currentPrice - previousPrice)

  return (
    <div
      className={`mt-1 inline-flex items-center gap-x-1 rounded px-1.5 py-0.5 text-[11px] font-medium ${
        priceIncreased
          ? 'bg-red-50 text-red-600'
          : 'bg-green-50 text-green-600'
      }`}
    >
      {priceIncreased ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      <span>
        {priceIncreased ? 'Tăng' : 'Giảm'} ₫{formatNumberWithCommas(diff)}
      </span>
      <span className='text-gray-400'>
        (₫{formatNumberWithCommas(previousPrice)})
      </span>
    </div>
  )
}
