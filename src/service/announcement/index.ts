import type {
  Announcement,
  AnnouncementListResult,
  AnnouncementStatus
} from './types'

import betterRequest from '@/utils/http'

/** 列表：兼容 data 为数组或 { list, total } */
export async function fetchAnnouncementList(params?: Record<string, unknown>) {
  const { data } = await betterRequest<AnnouncementListResult>(
    '/api/web/announcement/list',
    params
  )
  return {
    list: data?.list ?? [],
    total: data?.total
  }
}

/** App端有效展示公告（无入参） */
export async function fetchAnnouncementValidList() {
  const { data } = await betterRequest<Announcement[]>(
    '/api/web/announcement/validList',
    {}
  )
  return data
}

export async function createAnnouncement(
  body: Record<string, unknown>
): Promise<void> {
  await betterRequest('/api/web/announcement/create', body)
}

export async function fetchAnnouncementDetail(id: number | string) {
  const { data } = await betterRequest<Announcement>(
    '/api/web/announcement/detail',
    { id }
  )
  return data
}

export async function updateAnnouncement(
  body: Record<string, unknown>
): Promise<void> {
  await betterRequest('/api/web/announcement/update', body)
}

/** 上架/下架 */
export async function changeAnnouncementStatus(
  id: number | string,
  status: AnnouncementStatus
): Promise<void> {
  await betterRequest('/api/web/announcement/changeStatus', { id, status })
}

/** 删除：若后端路径不同可改此处 */
export async function deleteAnnouncement(id: number | string): Promise<void> {
  await betterRequest('/api/web/announcement/delete', { id })
}
