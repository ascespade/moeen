'use client'

import { ReactNode } from 'react'

interface UIProviderProps {
  children: ReactNode
}

export default function UIProvider({ children }: UIProviderProps) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  )
}