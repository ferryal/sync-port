/**
 * Global Toast notification system.
 * Uses React context + Zustand-like state (plain useState/useReducer).
 * Toast is rendered via <ToastProvider> at app root.
 * Use the `useToast()` hook anywhere to trigger toasts.
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { Icon } from '@iconify/react'

export type ToastType = 'success' | 'warning' | 'error'

export interface ToastItem {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, 'id'>) => void
  success: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONS: Record<ToastType, string> = {
  success: 'mdi:check-circle',
  warning: 'mdi:alert-circle',
  error: 'mdi:close-circle',
}

let _toastFn: ToastContextValue['toast'] | null = null

export function getToastFn() {
  return _toastFn
}

function ToastItem({ item, onClose }: { item: ToastItem; onClose: (id: string) => void }) {
  return (
    <div className={`toast toast--${item.type}`} role="alert">
      <div className={`toast__icon toast__icon--${item.type}`}>
        <Icon icon={ICONS[item.type]} width={20} />
      </div>
      <div className="toast__body">
        <div className="toast__title">{item.title}</div>
        {item.message && <div className="toast__msg">{item.message}</div>}
      </div>
      <button className="toast__close" onClick={() => onClose(item.id)} aria-label="Dismiss">
        <Icon icon="mdi:close" width={16} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((item: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const newToast: ToastItem = { id, duration: 4500, ...item }
    setToasts((prev) => [...prev.slice(-4), newToast]) // max 5
    setTimeout(() => dismiss(id), newToast.duration ?? 4500)
  }, [dismiss])

  const success = useCallback((title: string, message?: string) => toast({ type: 'success', title, message }), [toast])
  const warning = useCallback((title: string, message?: string) => toast({ type: 'warning', title, message }), [toast])
  const error = useCallback((title: string, message?: string) => toast({ type: 'error', title, message }), [toast])

  const value: ToastContextValue = { toast, success, warning, error }
  _toastFn = toast

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <ToastItem key={t.id} item={t} onClose={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
