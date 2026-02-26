import { cn } from '@/lib/utils'

interface TypographyH2Props extends React.HTMLAttributes<HTMLHeadingElement> {}

export function TypographyH2({ className, ...props }: TypographyH2Props) {
  return (
    <h2
      className={cn('scroll-m-20 pb-2 text-3xl font-semibold tracking-tight', className)}
      {...props}
    />
  )
}
