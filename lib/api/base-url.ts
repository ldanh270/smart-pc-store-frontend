function trimTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url
}

function resolveOrigin(): string {
  const explicitOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL
  if (explicitOrigin) return trimTrailingSlash(explicitOrigin)

  if (process.env.VERCEL_URL) {
    return `https://${trimTrailingSlash(process.env.VERCEL_URL)}`
  }

  return "http://localhost:3000"
}

const configuredBase =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_SERVE_URL ?? "/api"

/**
 * API base URL that is safe for both browser and server runtimes.
 * - Absolute URLs are used as-is.
 * - Relative "/api" is converted to absolute on server.
 */
export function getApiBaseUrl(): string {
  const base = trimTrailingSlash(configuredBase)
  const isAbsolute = /^https?:\/\//i.test(base)
  if (isAbsolute) return base

  if (typeof window !== "undefined") return base

  const prefixed = base.startsWith("/") ? base : `/${base}`
  return `${resolveOrigin()}${prefixed}`
}

export function buildApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `${getApiBaseUrl()}${cleanPath}`
}
