export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[analytics]", name, props ?? {});
  }
}

export function trackPage(path: string) {
  trackEvent("page_view", { path });
}

