'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'

interface UIProviderProps {
  children: ReactNode
}

export default function UIProvider({ children }: UIProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}