'use client'

import { useState, useEffect } from 'react'

export default function StatusBanner() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="bg-red-500 text-white text-center py-2 px-4">
      <span className="font-medium">تحذير:</span> لا يوجد اتصال بالإنترنت
    </div>
  )
}