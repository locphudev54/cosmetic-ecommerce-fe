import React from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none',
              className
            )}
            {...props}
          >
            <div className='text-sm leading-none font-medium'>{title}</div>
            <p className='text-muted-foreground line-clamp-2 text-sm leading-snug'>{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = 'ListItem'

export default function NavMenu() {
  return (
    <NavigationMenu className='mx-auto max-w-full'>
      <NavigationMenuList className='space-x-4'>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href='/docs'>
              <span
                className={navigationMenuTriggerStyle({
                  className:
                    'animate-blink text-business-secondary hover:text-business-secondary bg-transparent hover:bg-transparent'
                })}
              >
                <span className='font-semibold'>Ưu đãi Hot</span>
              </span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={
              'h-11 rounded-none bg-transparent font-bold uppercase hover:bg-black hover:text-white focus:bg-transparent focus:text-black focus:hover:bg-black focus:hover:text-white data-[state=open]:hover:bg-black data-[state=open]:hover:text-white'
            }
          >
            Make up
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
              <li className='row-span-3'>
                <NavigationMenuLink asChild>
                  <Link
                    className='from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md'
                    href='/'
                  >
                    <div className='mt-4 mb-2 text-lg font-medium'>shadcn/ui</div>
                    <p className='text-muted-foreground text-sm leading-tight'>
                      Beautifully designed components built with Radix UI and Tailwind CSS.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href='/docs' title='Introduction'>
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href='/docs/installation' title='Installation'>
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href='/docs/primitives/typography' title='Typography'>
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={
              'h-11 rounded-none bg-transparent font-bold uppercase hover:bg-black hover:text-white focus:bg-transparent focus:text-black focus:hover:bg-black focus:hover:text-white data-[state=open]:hover:bg-black data-[state=open]:hover:text-white'
            }
          >
            Chăm sóc da
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
              <li className='row-span-3'>
                <NavigationMenuLink asChild>
                  <Link
                    className='from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md'
                    href='/'
                  >
                    {/* <Icons.logo className="h-6 w-6" /> */}
                    <div className='mt-4 mb-2 text-lg font-medium'>shadcn/ui</div>
                    <p className='text-muted-foreground text-sm leading-tight'>
                      Beautifully designed components built with Radix UI and Tailwind CSS.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href='/docs' title='Introduction'>
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href='/docs/installation' title='Installation'>
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href='/docs/primitives/typography' title='Typography'>
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={
              'h-11 rounded-none bg-transparent font-bold uppercase hover:bg-black hover:text-white focus:bg-transparent focus:text-black focus:hover:bg-black focus:hover:text-white data-[state=open]:hover:bg-black data-[state=open]:hover:text-white'
            }
          >
            Nước hoa
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
              <li className='row-span-3'>
                <NavigationMenuLink asChild>
                  <Link
                    className='from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md'
                    href='/'
                  >
                    {/* <Icons.logo className="h-6 w-6" /> */}
                    <div className='mt-4 mb-2 text-lg font-medium'>shadcn/ui</div>
                    <p className='text-muted-foreground text-sm leading-tight'>
                      Beautifully designed components built with Radix UI and Tailwind CSS.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href='/docs' title='Introduction'>
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href='/docs/installation' title='Installation'>
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href='/docs/primitives/typography' title='Typography'>
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={
              'h-11 rounded-none bg-transparent font-bold uppercase hover:bg-black hover:text-white focus:bg-transparent focus:text-black focus:hover:bg-black focus:hover:text-white data-[state=open]:hover:bg-black data-[state=open]:hover:text-white'
            }
          >
            Thực phẩm
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
              <li className='row-span-3'>
                <NavigationMenuLink asChild>
                  <Link
                    className='from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md'
                    href='/'
                  >
                    {/* <Icons.logo className="h-6 w-6" /> */}
                    <div className='mt-4 mb-2 text-lg font-medium'>shadcn/ui</div>
                    <p className='text-muted-foreground text-sm leading-tight'>
                      Beautifully designed components built with Radix UI and Tailwind CSS.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href='/docs' title='Introduction'>
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href='/docs/installation' title='Installation'>
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href='/docs/primitives/typography' title='Typography'>
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={
              'h-11 rounded-none bg-transparent font-bold uppercase hover:bg-black hover:text-white focus:bg-transparent focus:text-black focus:hover:bg-black focus:hover:text-white data-[state=open]:hover:bg-black data-[state=open]:hover:text-white'
            }
          >
            Chăm sóc cá nhân
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
              <li className='row-span-3'>
                <NavigationMenuLink asChild>
                  <Link
                    className='from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md'
                    href='/'
                  >
                    {/* <Icons.logo className="h-6 w-6" /> */}
                    <div className='mt-4 mb-2 text-lg font-medium'>shadcn/ui</div>
                    <p className='text-muted-foreground text-sm leading-tight'>
                      Beautifully designed components built with Radix UI and Tailwind CSS.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href='/docs' title='Introduction'>
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href='/docs/installation' title='Installation'>
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href='/docs/primitives/typography' title='Typography'>
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href='/docs'>
              <span
                className={navigationMenuTriggerStyle({
                  className: 'rounded-none bg-transparent uppercase hover:bg-black hover:text-white'
                })}
              >
                <span className='font-bold'>Thương hiệu hot</span>
              </span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href='#'>
              <span
                className={navigationMenuTriggerStyle({
                  className:
                    'h-full rounded-none bg-transparent uppercase hover:bg-black hover:text-white'
                })}
              >
                <span className='font-bold'>Tất cả sản phẩm</span>
              </span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
