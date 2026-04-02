'use client'

import { Clock, AlertTriangle } from 'lucide-react'

interface Props {
  expiresAt: string | null
}

export default function CartExpiryWarning({ expiresAt }: Props) {
  if (!expiresAt) return null

  const expiryDate = new Date(expiresAt)
  const now = new Date()
  const diffMs = expiryDate.getTime() - now.getTime()

  // Don't show if expired or more than 3 days away
  if (diffMs <= 0 || diffMs > 3 * 24 * 60 * 60 * 1000) return null

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  const isUrgent = diffDays === 0

  return (
    <div
      className={`flex items-center gap-x-2 rounded-md px-4 py-2.5 text-sm ${
        isUrgent
          ? 'border border-orange-200 bg-orange-50 text-orange-700'
          : 'border border-yellow-200 bg-yellow-50 text-yellow-700'
      }`}
    >
      {isUrgent ? <AlertTriangle size={16} /> : <Clock size={16} />}
      <span>
        {isUrgent
          ? `Giỏ hàng của bạn sẽ hết hạn trong ${diffHours} giờ nữa. Hãy đăng nhập để lưu giỏ hàng.`
          : `Giỏ hàng của bạn sẽ hết hạn trong ${diffDays} ngày nữa. Đăng nhập để lưu giỏ hàng vĩnh viễn.`}
      </span>
    </div>
  )
}
