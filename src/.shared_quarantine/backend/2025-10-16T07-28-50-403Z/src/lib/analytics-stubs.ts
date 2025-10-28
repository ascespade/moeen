export function __trackEvent(_name: string, props?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
  }
}

export function __trackPage(_path: string) {
  trackEvent('page_view', { path });
}
