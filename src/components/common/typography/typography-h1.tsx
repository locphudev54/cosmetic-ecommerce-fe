import { cn } from '@/lib/utils'

interface TypographyH1Props extends React.HTMLAttributes<HTMLHeadingElement> {}

export function TypographyH1({ className, ...props }: TypographyH1Props) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
      {...props}
    />
  )
}