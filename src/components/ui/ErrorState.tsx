import { Icon } from '@iconify/react'

interface ApiError {
  status?: number
  code?: string
  message?: string
}

interface ErrorStateProps {
  error: ApiError | null | unknown
  onRetry?: () => void
}

function getErrorInfo(error: ApiError) {
  const status = error?.status
  if (status === 502) {
    return {
      type: '502' as const,
      icon: 'mdi:cloud-off-outline',
      title: '502 Integration Unavailable',
      message: 'The integration API is currently unreachable. Retrying in 30 seconds.',
      actionLabel: 'Check Status',
    }
  }
  if (status === 500) {
    return {
      type: '500' as const,
      icon: 'mdi:alert-circle-outline',
      title: '500 Internal Server Error',
      message: 'An unexpected error occurred on the server. Our team has been notified.',
      actionLabel: 'Retry',
    }
  }
  if (status && status >= 400 && status < 500) {
    return {
      type: '4xx' as const,
      icon: 'mdi:cog-off-outline',
      title: `${status} Configuration Error`,
      message: error?.message || 'Possible missing or invalid configuration. Please check your integration settings.',
      actionLabel: 'Review Settings',
    }
  }
  return {
    type: 'error' as const,
    icon: 'mdi:wifi-off',
    title: 'Connection Error',
    message: error?.message || 'Unable to reach the server. Please check your network.',
    actionLabel: 'Retry',
  }
}

export function ErrorBanner({ error, onRetry }: ErrorStateProps) {
  const err = error as ApiError
  const info = getErrorInfo(err)
  return (
    <div className={`error-banner error-banner--${info.type}`}>
      <Icon icon={info.icon} className="error-banner__icon" width={20} />
      <div className="error-banner__body">
        <div className="error-banner__title">{info.title}</div>
        <div className="error-banner__msg">{info.message}</div>
      </div>
      {onRetry && (
        <div className="error-banner__action">
          <button className="btn btn--danger btn--sm" onClick={onRetry}>
            {info.actionLabel}
          </button>
        </div>
      )}
    </div>
  )
}

export function FullErrorState({ error, onRetry }: ErrorStateProps) {
  const err = error as ApiError
  const info = getErrorInfo(err)
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon icon={info.icon} width={44} />
      </div>
      <div className="empty-state__title">{info.title}</div>
      <div className="empty-state__desc">{info.message}</div>
      {onRetry && (
        <button className="btn btn--primary" style={{ marginTop: 20 }} onClick={onRetry}>
          <Icon icon="mdi:refresh" width={16} />
          Retry
        </button>
      )}
    </div>
  )
}
