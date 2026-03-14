import type { ReactNode } from 'react'
import { TopNav } from './TopNav'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <TopNav />
      <main className="page-content">{children}</main>
    </div>
  )
}
