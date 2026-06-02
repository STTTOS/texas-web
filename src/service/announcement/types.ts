export type AnnouncementType =
  | 'activity'
  | 'update'
  | 'maintenance'
  | 'notice'

export type AnnouncementStatus = 'published' | 'disabled'

export interface Announcement {
  id: number | string
  type: AnnouncementType
  title: string
  summary: string
  content: string
  actionText?: string
  actionUrl?: string
  priority: number
  publishAt: string
  createdAt?: string
  updatedAt?: string
  expireAt?: string
  status: AnnouncementStatus
  minClientVersion?: string | null
  maxClientVersion?: string | null
}

export interface AnnouncementListResult {
  list: Announcement[]
  total?: number
}

const SEMVER_CORE = /^\d+\.\d+\.\d+$/

export function isSemverCore(value: string): boolean {
  return SEMVER_CORE.test(value.trim())
}

export function compareSemverCore(a: string, b: string): number | null {
  const parse = (input: string) => {
    const parts = input.trim().split('.')
    const nums = [Number(parts[0]), Number(parts[1] ?? 0), Number(parts[2] ?? 0)]
    if (nums.some((n) => !Number.isFinite(n) || n < 0)) return null
    return nums
  }
  const pa = parse(a)
  const pb = parse(b)
  if (!pa || !pb) return null
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i]
  }
  return 0
}

export function formatClientVersionRange(
  item: Pick<Announcement, 'minClientVersion' | 'maxClientVersion'>
): string {
  const min = item.minClientVersion?.trim() || null
  const max = item.maxClientVersion?.trim() || null
  if (!min && !max) return '全部版本'
  if (min && max) {
    if (min === max) return min
    return `${min} ~ ${max}`
  }
  if (min) return `≥ ${min}`
  return `≤ ${max}`
}
