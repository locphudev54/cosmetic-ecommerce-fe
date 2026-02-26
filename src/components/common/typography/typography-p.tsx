import { cn } from '@/lib/utils'

interface TypographyPProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function TypographyP({ className, ...props }: TypographyPProps) {
  return (
    <p
      className={cn(
        "leading-7 [&:not(:first-child)]:mt-6",
        className
      )}
      {...props}
    />
  )
}