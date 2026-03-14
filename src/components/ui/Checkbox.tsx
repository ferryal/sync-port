/**
 * Checkbox wrapper around @base-ui/react/checkbox
 */
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { Icon } from '@iconify/react'

interface CheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  id?: string
  label?: string
  indeterminate?: boolean
}

export function Checkbox({ checked, onCheckedChange, id, label, indeterminate }: CheckboxProps) {
  return (
    <label className="cb-label" htmlFor={id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <BaseCheckbox.Root
        id={id}
        checked={checked}
        indeterminate={indeterminate}
        onCheckedChange={onCheckedChange}
        className="cb-root"
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          border: `1.5px solid ${checked || indeterminate ? 'var(--color-primary)' : 'var(--color-border)'}`,
          background: checked || indeterminate ? 'var(--color-primary)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all .12s',
          outline: 'none',
        }}
      >
        <BaseCheckbox.Indicator className="cb-indicator">
          {indeterminate ? (
            <Icon icon="mdi:minus" width={10} color="#fff" />
          ) : (
            <Icon icon="mdi:check" width={10} color="#fff" />
          )}
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label && (
        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{label}</span>
      )}
    </label>
  )
}

