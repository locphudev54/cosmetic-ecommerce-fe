import { cn } from '@/lib/utils'

interface TypographyBlockquoteProps extends React.HTMLAttributes<HTMLQuoteElement> {}

export function TypographyBlockquote({ className, ...props }: TypographyBlockquoteProps) {
  return (
    <blockquote
      className={cn(
        "mt-6 border-l-2 pl-6 italic",
        className
      )}
      {...props}
    />
  )
}