import { cn } from '@/lib/utils'

interface TypographyH4Props extends React.HTMLAttributes<HTMLHeadingElement> {}

export function TypographyH4({ className, ...props }: TypographyH4Props) {
  return (
    <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)} {...props} />
  )
}
