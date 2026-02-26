import { Input } from '@/components/ui/input'
import { cn, formatNumberWithCommas } from '@/lib/utils'
import React from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number
  onValueChange?: (value: number) => void
  minValue?: number
}

const InputNumber = React.forwardRef<HTMLInputElement, Props>(
  ({ value, onValueChange, className, minValue, ...rest }, ref) => {
    const [number, setNumber] = React.useState<number | undefined>(value)
    const [displayValue, setDisplayValue] = React.useState<string>(value?.toLocaleString() || '')

    React.useEffect(() => {
      if (value !== undefined) {
        setNumber(value)
        setDisplayValue(value.toLocaleString())
      }
    }, [value])

    function handleInputNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
      const rawValue = event.target.value.replace(/,/g, '')
      const numberValue = Number(rawValue)

      if (minValue !== undefined && numberValue < minValue) {
        return
      }

      if (!Number.isNaN(numberValue)) {
        setNumber(numberValue)
        setDisplayValue(formatNumberWithCommas(numberValue))
        onValueChange?.(numberValue)
      } else if (rawValue === '') {
        setNumber(undefined)
        setDisplayValue('')
        onValueChange?.(0)
      }
    }

    return (
      <Input
        ref={ref}
        type='text'
        inputMode='numeric'
        pattern='[0-9,]*'
        className={cn('text-right', className)}
        value={displayValue}
        onChange={handleInputNumberChange}
        {...rest} // Forward other native input props
      />
    )
  }
)

InputNumber.displayName = 'InputNumber'

export default InputNumber
