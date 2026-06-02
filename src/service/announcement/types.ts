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
}

export interface AnnouncementListResult {
  list: Announcement[]
  total?: number
}
