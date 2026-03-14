import type { Integration } from '@/lib/schemas'

interface SyncConfigProps {
  integration: Integration
}

export function SyncConfig({ integration }: SyncConfigProps) {
  return (
    <div className="card config-card">
      <div className="config-card__title">Sync Configuration</div>
      <div className="config-grid">
        <div>
          <div className="config-item__label">Instance URL</div>
          <div className="config-item__value" style={{ fontFamily: 'Courier New, monospace', fontSize: 12 }}>
            {integration.instanceUrl}
          </div>
        </div>
        <div>
          <div className="config-item__label">Environment</div>
          <div className="config-item__value">
            <span className="env-dot" />
            {integration.environment}
          </div>
        </div>
        <div>
          <div className="config-item__label">Last Payload Size</div>
          <div className="config-item__value">{integration.lastPayloadSize}</div>
        </div>
        <div>
          <div className="config-item__label">OAuth Scope</div>
          <div className="config-item__value" style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
            {integration.oauthScope}
          </div>
        </div>
      </div>
    </div>
  )
}
