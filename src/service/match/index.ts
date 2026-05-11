import type { Params } from 'ahooks/lib/usePagination/types'

import request from '../../utils/http'
import type {
  Match,
  MatchError,
  SettleRecord,
  BetRecord,
  StageRecord
} from './types'

export type MatchListFilters = {
  /** 桌型筛选，对应服务端 `room.tableType` */
  type?: string
  /** ISO 时间闭区间 [start, end] */
  time?: [string, string]
  /** 管理员：参与用户游戏昵称模糊查询，对应服务端 `playerName` */
  playerName?: string
  /** `all` | `in_progress` | `ended` → 服务端 `matchStatus` */
  matchStatus?: string
  /** `all` | `pre_flop` | `flop` | `turn` | `river` → 服务端 `boardThroughStage` */
  boardThroughStage?: string
}

const getMatchList = async ({
  pageSize,
  current,
  type,
  time,
  playerName,
  matchStatus,
  boardThroughStage
}: Params[0] & MatchListFilters) => {
  const trimmed =
    playerName != null && String(playerName).trim() !== ''
      ? String(playerName).trim()
      : undefined
  const { data } = await request<{ list: Match[]; total: number }>(
    'api/web/match/list',
    {
      pageSize,
      current,
      ...(type && type !== 'all' ? { type } : {}),
      ...(time ? { time } : {}),
      ...(trimmed ? { playerName: trimmed } : {}),
      ...(matchStatus && matchStatus !== 'all' ? { matchStatus } : {}),
      ...(boardThroughStage && boardThroughStage !== 'all'
        ? { boardThroughStage }
        : {})
    }
  )
  return data
}

export interface MatchDetail extends Match {
  settleRecords: SettleRecord[]
  betRecords: BetRecord[]
  stageRecords: StageRecord[]
}
const getMatchDetail = async (params: Pick<Match, 'id'>) => {
  const { data } = await request<MatchDetail>(`api/web/match/detail/${params.id}`, params)
  return data
}
const getMatchErrors = async (params: Pick<Match, 'id'>) => {
  const { data } = await request<{ list: MatchError[] }>(
    `api/web/match/error/${params.id}`,
    params
  )
  return data.list
}

export { getMatchList, getMatchDetail, getMatchErrors }
