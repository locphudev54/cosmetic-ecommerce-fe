import { cn } from '@/lib/utils'

interface TypographyMutedProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function TypographyMuted({ className, ...props }: TypographyMutedProps) {
  return (
    <p
      className={cn(
        "text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}