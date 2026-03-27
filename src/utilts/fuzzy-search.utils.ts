// fuzzySearch.ts

export type MatchType = 'exact' | 'prefix' | 'substring' | 'fuzzy' | null

export interface FuzzyResult<T> {
  item: T
  score: number
  matchType: MatchType
}

// Recursively extract all dot-notation paths from T that resolve to a string/number
type Primitive = string | number

type DotPaths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends Primitive
    ? `${Prefix}${K}`
    : T[K] extends object
      ? DotPaths<T[K], `${Prefix}${K}.`>
      : never
}[keyof T & string]

export interface FuzzySearchOptions<T> {
  /**
   * Keys to search on — fully type-safe, supports dot notation for nested fields.
   * e.g. ['name', 'user.email']
   */
  keys?: DotPaths<T>[]
  /**
   * Minimum normalized similarity score to include fuzzy matches (0–1).
   * Lower = more permissive. Default: 0.4
   */
  threshold?: number
}

// --- Core: Levenshtein distance ---
function levenshtein(a: string, b: string): number {
  const m = a.length,
    n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
  return dp[m][n]
}

function getNestedValue(obj: unknown, path: string): string {
  return String(
    path.split('.').reduce<unknown>((acc, key) => {
      return acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : ''
    }, obj) ?? ''
  )
}

function scoreField(
  field: string,
  query: string,
  threshold: number
): { score: number; matchType: MatchType } {
  const f = field.toLowerCase()
  const q = query.toLowerCase()

  if (f === q) return { score: 1.0, matchType: 'exact' }
  if (f.startsWith(q)) return { score: 0.9 - (f.length - q.length) * 0.01, matchType: 'prefix' }
  if (f.includes(q)) return { score: 0.75, matchType: 'substring' }

  const window = f.slice(0, Math.min(f.length, q.length + 2))
  const dist = levenshtein(q, window)
  const similarity = 1 - dist / Math.max(q.length, window.length)

  if (similarity >= threshold) return { score: similarity * 0.65, matchType: 'fuzzy' }

  return { score: 0, matchType: null }
}

// --- Main export ---
export function fuzzySearch<T>(
  items: T[],
  query: string,
  options: FuzzySearchOptions<T> = {}
): FuzzyResult<T>[] {
  const { keys, threshold = 0.4 } = options

  if (!query.trim()) {
    return items.map((item) => ({ item, score: 1, matchType: null }))
  }

  return items
    .map((item) => {
      const fieldsToSearch: string[] = keys
        ? keys.map((k) => getNestedValue(item, k))
        : [String(item)]

      let best = { score: 0, matchType: null as MatchType }
      for (const field of fieldsToSearch) {
        const result = scoreField(field, query, threshold)
        if (result.score > best.score) best = result
      }

      return { item, score: best.score, matchType: best.matchType }
    })
    .filter((r) => r.matchType !== null)
    .sort((a, b) => b.score - a.score)
}
