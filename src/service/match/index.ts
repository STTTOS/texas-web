import type { Params } from 'ahooks/lib/usePagination/types'

import request from '../../utils/http'
import type {
  Match,
  MatchError,
  SettleRecord,
  BetRecord,
  StageRecord
} from './types'

const getMatchList = async ({ pageSize, current }: Params[0]) => {
  const { data } = await request<{ list: Match[]; total: number }>(
    'api/web/match/list',
    {
      pageSize,
      current
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
