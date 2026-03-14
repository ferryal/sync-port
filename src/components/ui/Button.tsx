/**
 * Wrapper around @base-ui/react Button with our design-token classes.
 * Always use THIS Button in UI instead of raw <button>.
 */
import { Button as BaseButton } from '@base-ui/react/button'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  const cls = [
    'btn',
    `btn--${variant}`,
    size === 'sm' && 'btn--sm',
    size === 'lg' && 'btn--lg',
    loading && 'btn--spinning',
    fullWidth && 'btn--full',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <BaseButton className={cls} disabled={disabled || loading} {...rest}>
      {children}
    </BaseButton>
  )
}
