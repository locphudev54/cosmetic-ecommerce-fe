'use client'

import { useState, useRef } from 'react'
import { Menu, ChevronDown, ChevronRight, X } from 'lucide-react'
import { motion, AnimatePresence, NumberMap } from 'motion/react'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from '@/components/ui/drawer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { CategoryTreeNodeType } from '@/features/categories/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { ROUTES } from '@/constants/route.constant'

interface MegaMenuProps {
  categoryTree: CategoryTreeNodeType[]
}

// ─── Mobile (unchanged) ───────────────────────────────────────────────────────

export const AccordionCategoryItem = ({
  category,
  level = 0,
  shouldNavigate = false
}: {
  category: CategoryTreeNodeType
  level?: number
  shouldNavigate?: boolean
}) => {
  const hasChildren = category.children && category.children.length > 0
  const isRootCategory = level === 0

  if (!hasChildren) {
    return (
      <Link href={ROUTES.COLLECTIONS.DETAIL(category.slug)} className='block'>
        <button
          className={cn(
            'w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:text-blue-600',
            isRootCategory && 'font-bold'
          )}
          style={{ paddingLeft: `${16 + level * 16}px` }}
        >
          {category.name}
        </button>
      </Link>
    )
  }

  return (
    <AccordionItem value={category.id} className='border-0'>
      {shouldNavigate ? (
        <div
          className='flex cursor-pointer items-center justify-between px-4 hover:bg-gray-50 hover:text-blue-600 hover:no-underline'
          style={{ paddingLeft: `${16 + level * 16}px` }}
        >
          <Link
            href={ROUTES.COLLECTIONS.DETAIL(category.slug)}
            className={cn('w-full text-sm text-gray-800', isRootCategory && 'font-bold')}
          >
            {category.name}
          </Link>
          <AccordionTrigger className={cn('cursor-pointer')} />
        </div>
      ) : (
        <AccordionTrigger
          className={cn(
            'ptext-left flex cursor-pointer items-center justify-between px-4 py-3 text-sm text-gray-700 transition-colors hover:text-blue-600 hover:no-underline',
            isRootCategory && 'font-bold'
          )}
          style={{ paddingLeft: `${16 + level * 16}px` }}
        >
          {category.name}
        </AccordionTrigger>
      )}
      <AccordionContent className='border-0 pb-0'>
        <div className='space-y-0'>
          {category.children?.map((child) => (
            <AccordionCategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              shouldNavigate={shouldNavigate}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

// ─── Desktop two-panel mega menu ──────────────────────────────────────────────
const DesktopMegaMenu = ({ categoryTree }: { categoryTree: CategoryTreeNodeType[] }) => {
  const [isOpen, setIsOpen] = useState(false)
  // Track active category at each depth level: [level0Id, level1Id, level2Id, ...]
  const [activePath, setActivePath] = useState<CategoryTreeNodeType[]>([])
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (!isOpen) {
      // Auto-select first category on open
      setActivePath(categoryTree[0] ? [categoryTree[0]] : [])
      setIsOpen(true)
    }
  }

  const closeMenu = () => {
    closeTimer.current = setTimeout(() => {
      setIsOpen(false)
      setActivePath([])
    }, 150)
  }

  /** When hovering a category at a given column depth, truncate the path at that depth and set the new active node */
  const handleHover = (category: CategoryTreeNodeType, depth: number) => {
    setActivePath((prev) => [...prev.slice(0, depth), category])
  }

  /**
   * Build the list of columns to render.
   * Column 0 = categoryTree root
   * Column N = children of activePath[N-1]
   */
  const columns: CategoryTreeNodeType[][] = [categoryTree]
  for (const node of activePath) {
    if (node.children && node.children.length > 0) {
      columns.push(node.children)
    } else {
      break
    }
  }

  return (
    <div className='relative font-bold' onMouseEnter={openMenu} onMouseLeave={closeMenu}>
      {/* Trigger */}
      <Button
        variant='outline'
        size='lg'
        className='flex cursor-pointer items-center gap-2 rounded border-none bg-amber-400 font-bold text-gray-800 hover:bg-amber-400 hover:opacity-90'
      >
        <Menu className='h-5 w-5' strokeWidth={3} />
        <span>Danh mục sản phẩm</span>
        <ChevronDown
          className={cn('ml-auto h-4 w-4 transition-transform duration-200', {
            'rotate-180': isOpen
          })}
        />
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className='absolute top-full left-0 z-50 mt-1 flex gap-x-1 overflow-hidden rounded shadow-xl'
            style={{ minHeight: 460, maxHeight: 570 }}
          >
            {columns.map((columnItems, depth) => {
              const activeInThisColumn = activePath[depth]
              const isRootColumn = depth === 0

              return (
                <motion.div
                  key={isRootColumn ? 'root' : activePath[depth - 1]?.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0 }}
                  className={cn(
                    'custom-scrollbar w-62 shrink-0 overflow-y-auto rounded border-r border-gray-100 bg-white shadow-2xl last:border-r-0',
                    !isRootColumn && 'pt-4'
                  )}
                >
                  {columnItems.map((category, categoryIdx) => {
                    const isActive = activeInThisColumn?.id === category.id
                    const hasChildren = category.children && category.children.length > 0

                    return (
                      <button
                        key={category.id}
                        onMouseEnter={() => handleHover(category, depth)}
                        className={cn(
                          'relative flex w-full cursor-pointer items-center justify-between px-5 py-1.5 text-left text-sm transition-colors duration-200 ease-in-out',
                          isRootColumn && 'py-4',
                          isRootColumn &&
                            categoryIdx !== columnItems.length - 1 &&
                            'after:absolute after:right-0 after:-bottom-[1.25px] after:left-0 after:mx-auto after:h-[1.25px] after:w-[90%] after:bg-gray-300 after:content-[""]',
                          isRootColumn
                            ? isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-800 hover:bg-gray-50'
                            : isActive
                              ? 'bg-gray-100 text-blue-700'
                              : 'text-gray-700 hover:text-blue-600'
                        )}
                      >
                        <span className='flex items-center gap-2'>
                          {depth > 0 && (
                            <span className='text-base text-gray-800 group-hover:text-blue-400'>
                              {'>'}
                            </span>
                          )}
                          {category.name}
                        </span>
                        {hasChildren && (
                          <ChevronRight
                            className={`h-3.5 w-3.5 shrink-0 ${
                              isRootColumn
                                ? isActive
                                  ? 'text-white'
                                  : 'text-gray-600'
                                : isActive
                                  ? 'text-blue-500'
                                  : 'text-gray-600'
                            }`}
                          />
                        )}
                      </button>
                    )
                  })}
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function MegaMenu({ categoryTree }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen} direction='left'>
        <Button
          variant='outline'
          size='lg'
          onClick={() => setIsOpen(true)}
          className='flex cursor-pointer items-center gap-2 rounded border-none bg-amber-400 font-bold text-gray-800 hover:bg-amber-400 hover:opacity-90'
        >
          <Menu className='h-5 w-5' strokeWidth={3} />
          <span>Danh mục sản phẩm</span>
          <ChevronDown
            className={cn('ml-auto h-4 w-4 transition-transform duration-200', {
              'rotate-180': isOpen
            })}
          />
        </Button>
        <DrawerContent className='ml-auto max-h-screen max-w-sm rounded-none'>
          <DrawerHeader className='sticky top-0 z-10 border-b bg-black'>
            <DrawerTitle className='flex items-center text-base font-extrabold'>
              <X className='mr-3 cursor-pointer text-white' onClick={() => setIsOpen(false)} />
              <Link href={ROUTES.HOME}>
                <div className='h-[45px] w-[172px]'>
                  <Image
                    alt='abbeauty-logo'
                    height={0}
                    width={0}
                    sizes='100vw'
                    className='h-full w-full object-cover'
                    src={'/logo.webp'}
                  />
                </div>
              </Link>
            </DrawerTitle>
            <DrawerDescription className='sr-only'>Danh sách danh mục sản phẩm</DrawerDescription>
          </DrawerHeader>
          <div className='custom-scrollbar overflow-y-auto bg-white'>
            <div className='px-3 pt-4.5 pb-3 text-xl font-extrabold'>Danh mục sản phẩm</div>
            <Accordion type='multiple' className='w-full'>
              {categoryTree.map((category) => (
                <AccordionCategoryItem key={category.id} category={category} level={0} />
              ))}
            </Accordion>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return <DesktopMegaMenu categoryTree={categoryTree} />
}
