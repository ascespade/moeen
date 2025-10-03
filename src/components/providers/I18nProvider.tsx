'use client'

import { ReactNode } from 'react'

interface I18nProviderProps {
  children: ReactNode
  locale: string
}

export function I18nProvider({ children, locale }: I18nProviderProps) {
  return (
    <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {children}
    </div>
  )
}