import { cn } from '@/lib/utils'

interface TypographyInlineCodeProps extends React.HTMLAttributes<HTMLElement> {}

export function TypographyInlineCode({ className, ...props }: TypographyInlineCodeProps) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}
      {...props}
    />
  )
}