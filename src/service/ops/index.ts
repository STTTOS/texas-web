import type { Params } from 'ahooks/lib/usePagination/types'

import request from '@/utils/http'
import type {
  AssetUsageSummary,
  DashboardSummary,
  EngineFatalRow,
  MatchDomainEventRow,
  RoomOpsRow,
  UserOpsDetail,
  UserOpsRow
} from './types'

export type UserOpsListFilters = {
  q?: string
  includeDeleted?: boolean
  /** 与 `sortOrder` 成对：`matchRecordsCount` */
  sortField?: 'matchRecordsCount'
  sortOrder?: 'asc' | 'desc'
}

export async function fetchUserOpsList(params: Params[0] & UserOpsListFilters) {
  const { current, pageSize, q, includeDeleted, sortField, sortOrder } = params
  const { data } = await request<{ list: UserOpsRow[]; total: number }>(
    'api/web/user-ops/list',
    {
      current,
      pageSize,
      ...(q != null && String(q).trim() !== '' ? { q: String(q).trim() } : {}),
      ...(includeDeleted ? { includeDeleted: true } : {}),
      ...(sortField === 'matchRecordsCount' &&
      (sortOrder === 'asc' || sortOrder === 'desc')
        ? { sortField, sortOrder }
        : {})
    }
  )
  return data
}

export async function fetchUserOpsDetail(userId: number) {
  const { data } = await request<UserOpsDetail>('api/web/user-ops/detail', { userId })
  return data
}

export type MatchDomainEventListFilters = {
  matchId: number
  eventType?: string
}

export async function fetchMatchDomainEventList(
  params: Params[0] & MatchDomainEventListFilters
) {
  const { current, pageSize, matchId, eventType } = params
  const { data } = await request<{ list: MatchDomainEventRow[]; total: number }>(
    'api/web/match-domain-event/list',
    {
      current,
      pageSize,
      matchId,
      ...(eventType != null && String(eventType).trim() !== ''
        ? { eventType: String(eventType).trim() }
        : {})
    }
  )
  return data
}

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
  /** 房主游戏昵称 `User.name` 子串（模糊） */
  ownerNameContains?: string
  /** `all` | `quick` | `standard` | `deep` | `custom` */
  tableType?: string
}

export async function fetchRoomOpsList(params: Params[0] & RoomOpsListFilters) {
  const { current, pageSize, gameStatus, ownerNameContains, tableType } = params
  const ownerNameTrimmed =
    ownerNameContains != null && String(ownerNameContains).trim() !== ''
      ? String(ownerNameContains).trim()
      : undefined
  const { data } = await request<{ list: RoomOpsRow[]; total: number }>(
    'api/web/room-ops/list',
    {
      current,
      pageSize,
      ...(gameStatus && gameStatus !== 'all' ? { gameStatus } : {}),
      ...(ownerNameTrimmed ? { ownerNameContains: ownerNameTrimmed } : {}),
      ...(tableType && tableType !== 'all' ? { tableType } : {})
    }
  )
  return data
}

export async function fetchDashboardSummary() {
  const { data } = await request<DashboardSummary>('api/web/dashboard/summary', {})
  return data
}

export type AssetUsageSummaryParams = {
  time?: [string, string]
  assetType?: 'poker_back' | 'table_bg' | 'all'
}

export async function fetchAssetUsageSummary(params: AssetUsageSummaryParams) {
  const { data } = await request<AssetUsageSummary>('api/web/asset-usage/summary', {
    ...(params.time ? { time: params.time } : {}),
    ...(params.assetType && params.assetType !== 'all'
      ? { assetType: params.assetType }
      : {})
  })
  return data
}
