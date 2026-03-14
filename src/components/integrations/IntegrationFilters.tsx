import { Icon } from '@iconify/react'
import type { IntegrationStatus } from '@/lib/schemas'

interface FilterTabsProps {
  active: string
  onChange: (filter: string) => void
  counts: Record<string, number>
}

const TABS: { key: string; label: string; color?: string; status?: IntegrationStatus }[] = [
  { key: 'all', label: 'All' },
  { key: 'synced', label: 'Synced', color: '#16a34a', status: 'synced' },
  { key: 'syncing', label: 'Syncing', color: '#2563eb', status: 'syncing' },
  { key: 'conflict', label: 'Conflict', color: '#d97706', status: 'conflict' },
  { key: 'error', label: 'Error', color: '#dc2626', status: 'error' },
]

export function IntegrationFilters({ active, onChange, counts }: FilterTabsProps) {
  return (
    <div className="filter-tabs">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`filter-tab${active === tab.key ? ' filter-tab--active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.color && active !== tab.key && (
            <span className="filter-tab__dot" style={{ background: tab.color }} />
          )}
          {active === tab.key && tab.key !== 'all' && (
            <Icon icon="mdi:check" width={13} />
          )}
          {tab.label}
          {counts[tab.key] !== undefined ? (
            <span style={{ opacity: 0.7, fontSize: 11 }}>({counts[tab.key]})</span>
          ) : null}
        </button>
      ))}
    </div>
  )
}
