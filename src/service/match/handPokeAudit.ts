import betterRequest from '@/utils/http'

import type {
  HandPokeAuditDetail,
  HandPokeAuditListResult
} from './handPokeAuditTypes'

export async function fetchHandPokeAuditList(params: {
  current: number
  pageSize: number
  name?: string
}) {
  const { data } = await betterRequest<HandPokeAuditListResult>(
    '/api/web/match/hand-poke-audit/list',
    params
  )
  return data
}

export async function fetchHandPokeAuditDetail(userId: number) {
  const { data } = await betterRequest<HandPokeAuditDetail>(
    '/api/web/match/hand-poke-audit/detail',
    { userId }
  )
  return data
}
