export function decodeToken(token: string): { exp: number } | null {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(
      Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
    )
    return { exp: decoded.exp }
  } catch {
    return null
  }
}

export function isNextRedirectError(error: unknown): error is Error & { digest: string } {
  return (
    error instanceof Error &&
    'digest' in error &&
    typeof (error as any).digest === 'string' &&
    (error as any).digest.startsWith('NEXT_REDIRECT')
  )
}
