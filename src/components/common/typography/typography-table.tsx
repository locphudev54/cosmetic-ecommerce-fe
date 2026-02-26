import { cn } from '@/lib/utils'

interface TypographyTableProps extends React.HTMLAttributes<HTMLTableElement> {}

export function TypographyTable({ className, ...props }: TypographyTableProps) {
  return (
    <table
      className={cn(
        "w-full",
        className
      )}
      {...props}
    />
  )
}