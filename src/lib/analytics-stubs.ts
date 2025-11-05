export function trackEvent(_name: string, _props?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
  }
}

export function trackPage(path: string) {
  trackEvent('page_view', { path });
}
