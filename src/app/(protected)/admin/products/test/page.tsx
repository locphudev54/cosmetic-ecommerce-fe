'use client'

import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

export default function Page() {
  const [items, setItems] = useState([
    { id: 1, text: '' },
    { id: 2, text: '' }
  ])

  return items.map((item, index) => (
    <Input
      key={index}
      value={item.text}
      onChange={(e) => {
        const newItems = [...items]
        newItems[index].text = e.target.value
        setItems(newItems)
      }}
    />
  ))
}
