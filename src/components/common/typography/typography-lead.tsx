import { cn } from '@/lib/utils'

interface TypographyLeadProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function TypographyLead({ className, ...props }: TypographyLeadProps) {
  return <p className={cn('text-muted-foreground text-xl', className)} {...props} />
}
