import type { SyncChange } from './schemas'

export function getFieldLabel(fieldName: string) {
  const map: Record<string, string> = {
    'user.email': 'User Email',
    'user.role': 'User Role',
    'user.name': 'User Name',
    'user.status': 'User Status',
    'user.phone': 'User Phone',
    'door.status': 'Device Status',
    'door.battery_level': 'Battery Level',
    'key.key_type': 'Key Type',
    'key.status': 'Key Status',
    'key.access_end': 'Access End',
    'key.access_start': 'Access Start',
  }
  return map[fieldName] || fieldName
}

export function shortValue(v: string | undefined) {
  if (!v) return '—'
  return v.length > 40 ? v.slice(0, 38) + '…' : v
}

export function formatValue(value: string | undefined, fieldName: string): string {
  if (!value) return '—'
  // Format timestamps nicely
  if (fieldName.includes('access_end') || fieldName.includes('access_start')) {
    try {
      return new Date(value).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      })
    } catch { return value }
  }
  return value
}

export function getRecordId(change: SyncChange | { field_name: string }, index: number): string {
  const prefix = change.field_name.startsWith('user') ? 'USR' :
    change.field_name.startsWith('door') ? 'DEV' : 'KEY'
  return `${prefix}-${String(index + 1000).padStart(4, '0')}`
}

export function getEntityAndField(fieldName: string) {
  const parts = fieldName.split('.')
  return {
    entity: parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : fieldName,
    field: parts[1] || fieldName,
  }
}

export function getEntityIcon(entity: string) {
  const map: Record<string, string> = {
    User: 'mdi:account-outline',
    Door: 'mdi:door-open',
    Key: 'mdi:key-outline',
  }
  return map[entity] || 'mdi:database-outline'
}

export function formatTimestamp(ts: string) {
  const d = new Date(ts)
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

export function getDiffLines(prev: string, curr: string) {
  const prevLines = prev.split('\n')
  const currLines = curr.split('\n')

  const addedLines = new Set<number>()
  const removedLines = new Set<number>()

  const maxLen = Math.max(prevLines.length, currLines.length)
  for (let i = 0; i < maxLen; i++) {
    if (prevLines[i] !== currLines[i]) {
      if (prevLines[i] !== undefined) removedLines.add(i)
      if (currLines[i] !== undefined) addedLines.add(i)
    }
  }

  return { prevLines, currLines, addedLines, removedLines }
}
