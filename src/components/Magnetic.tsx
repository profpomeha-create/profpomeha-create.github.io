import { useRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react'
import { useMagnetic } from '~/lib/magnetic'

type MagneticProps<T extends ElementType> = {
  as?: T
  label?: string
  strength?: number
  children?: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export function Magnetic<T extends ElementType = 'div'>({
  as,
  label,
  strength = 0.34,
  children,
  className,
  ...rest
}: MagneticProps<T>) {
  const Tag = (as ?? 'div') as ElementType
  const ref = useRef<HTMLElement>(null)
  useMagnetic(ref, strength)

  return (
    <Tag ref={ref} data-cursor-label={label} className={className} {...rest}>
      {children}
    </Tag>
  )
}
