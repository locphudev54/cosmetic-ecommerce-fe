import { cn } from '@/lib/utils'

interface TypographyListProps extends React.HTMLAttributes<HTMLUListElement> {}

export function TypographyList({ className, ...props }: TypographyListProps) {
  return <ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)} {...props} />
}
