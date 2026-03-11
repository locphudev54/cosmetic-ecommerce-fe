import { cn } from '@/lib/utils'

interface TypographySmallProps extends React.HTMLAttributes<HTMLElement> {}

export function TypographySmall({ className, ...props }: TypographySmallProps) {
  return <small className={cn('text-sm leading-none font-medium', className)} {...props} />
}
