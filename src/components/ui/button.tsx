import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        blue: 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md transition-all duration-200 active:scale-[0.98]',

        yellow:
          'bg-yellow-400 text-black hover:bg-yellow-500 hover:shadow-md transition-all duration-200 active:scale-[0.98]',

        orange:
          'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-md transition-all duration-200 active:scale-[0.98]',

        green:
          'bg-green-500 text-white hover:bg-green-600 hover:shadow-md transition-all duration-200 active:scale-[0.98]',

        red: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-md transition-all duration-200 active:scale-[0.98]',

        purple:
          'bg-purple-500 text-white hover:bg-purple-600 hover:shadow-md transition-all duration-200 active:scale-[0.98]',

        pink: 'bg-pink-500 text-white hover:bg-pink-600 hover:shadow-md transition-all duration-200 active:scale-[0.98]',

        cyan: 'bg-cyan-500 text-white hover:bg-cyan-600 hover:shadow-md transition-all duration-200 active:scale-[0.98]',
        teal: 'bg-teal-500 text-white hover:bg-teal-600 hover:shadow-md transition-all duration-200 active:scale-[0.98]',
        gray: 'bg-gray-500 text-white hover:bg-gray-600 hover:shadow-md transition-all duration-200 active:scale-[0.98]',
        dark: 'bg-gray-900 text-white hover:bg-black hover:shadow-md transition-all duration-200 active:scale-[0.98]',
        blue_gradient:
          'bg-[image:var(--gradient-blue)] text-white hover:bg-[image:var(--gradient-blue-hover)] hover:shadow-md transition-all duration-200 active:scale-[0.98]',
        yellow_gradient:
          'bg-[image:var(--gradient-yellow)] text-black hover:bg-[image:var(--gradient-yellow-hover)] hover:shadow-md transition-all duration-200 active:scale-[0.98]',
        orange_gradient:
          'bg-[image:var(--gradient-orange)] text-white hover:bg-[image:var(--gradient-orange-hover)] hover:shadow-md transition-all duration-200 active:scale-[0.98]',
        green_gradient:
          'bg-[image:var(--gradient-green)] text-white hover:bg-[image:var(--gradient-green-hover)] hover:shadow-md transition-all duration-200 active:scale-[0.98]',
        red_gradient:
          'bg-[image:var(--gradient-red)] text-white hover:bg-[image:var(--gradient-red-hover)] hover:shadow-md transition-all duration-200 active:scale-[0.98]',
        purple_gradient:
          'bg-[image:var(--gradient-purple)] text-white hover:bg-[image:var(--gradient-purple-hover)] hover:shadow-md transition-all duration-200 active:scale-[0.98]',
        pink_gradient:
          'bg-[image:var(--gradient-pink)] text-white hover:bg-[image:var(--gradient-pink-hover)] hover:shadow-md transition-all duration-200 active:scale-[0.98]',
        cyan_gradient:
          'bg-[image:var(--gradient-cyan)] text-white hover:bg-[image:var(--gradient-cyan-hover)] hover:shadow-md transition-all duration-200 active:scale-[0.98]',
        teal_gradient:
          'bg-[image:var(--gradient-teal)] text-white hover:bg-[image:var(--gradient-teal-hover)] hover:shadow-md transition-all duration-200 active:scale-[0.98]',
        gray_gradient:
          'bg-[image:var(--gradient-gray)] text-white hover:bg-[image:var(--gradient-gray-hover)] hover:shadow-md transition-all duration-200 active:scale-[0.98]',
        dark_gradient:
          'bg-[image:var(--gradient-dark)] text-white hover:bg-[image:var(--gradient-dark-hover)] hover:shadow-md transition-all duration-200 active:scale-[0.98]'
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
        'icon-lg': 'size-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot='button'
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
