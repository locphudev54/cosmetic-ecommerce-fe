import React from 'react'

interface LocComponentProps {
  value: number
  onChange: (newValue: number) => void
}

export default function LocComponent({ value, onChange }: LocComponentProps) {
  const [internalValue, setInternalValue] = React.useState(value)

  const isControlled = value !== undefined && onChange !== undefined
  const effectiveValue = isControlled ? value : internalValue

  debugger

  // sync internal state with external value when it changes -> Bad
  // React.useEffect(() => {
  //   debugger
  //   setInternalValue(value)
  // }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)

    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange(newValue)
  }

  return (
    <div>
      <input
        type='number'
        value={effectiveValue}
        onChange={handleInputChange}
        placeholder='Enter location...'
      />
    </div>
  )
}
