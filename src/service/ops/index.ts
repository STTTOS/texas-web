import type { Params } from 'ahooks/lib/usePagination/types'

import request from '@/utils/http'
import type { DashboardSummary, EngineFatalRow, RoomOpsRow } from './types'

export type EngineFatalListFilters = {
  matchId?: number
  roomId?: number
  time?: [string, string]
}

export async function fetchEngineFatalList(
  params: Params[0] & EngineFatalListFilters
) {
  const { current, pageSize, matchId, roomId, time } = params
  const { data } = await request<{ list: EngineFatalRow[]; total: number }>(
    'api/web/engine-fatal/list',
    {
      current,
      pageSize,
      ...(matchId != null && matchId > 0 ? { matchId } : {}),
      ...(roomId != null && roomId > 0 ? { roomId } : {}),
      ...(time ? { time } : {})
    }
  )
  return data
}

export type RoomOpsListFilters = {
  gameStatus?: string
  roomId?: number
  ownerId?: number
}

export async function fetchRoomOpsList(params: Params[0] & RoomOpsListFilters) {
  const { current, pageSize, gameStatus, roomId, ownerId } = params
  const { data } = await request<{ list: RoomOpsRow[]; total: number }>(
    'api/web/room-ops/list',
    {
      current,
      pageSize,
      ...(gameStatus && gameStatus !== 'all' ? { gameStatus } : {}),
      ...(roomId != null && roomId > 0 ? { roomId } : {}),
      ...(ownerId != null && ownerId > 0 ? { ownerId } : {})
    }
  )
  return data
}

export async function fetchDashboardSummary() {
  const { data } = await request<DashboardSummary>('api/web/dashboard/summary', {})
  return data
}
