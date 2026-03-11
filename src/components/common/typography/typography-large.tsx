import { cn } from '@/lib/utils'

interface TypographyLargeProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TypographyLarge({ className, ...props }: TypographyLargeProps) {
  return <div className={cn('text-lg font-semibold', className)} {...props} />
}
