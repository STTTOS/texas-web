import type { Params } from 'ahooks/lib/usePagination/types'

import request from '../../utils/http'
import {
  Match,
  MatchError,
  PlayerHand,
  RecordItem,
  MatchStageTimeRecord
} from './types'

const getMatchList = async ({ pageSize, current }: Params[0]) => {
  const { data } = await request<{ list: Match[]; total: number }>(
    'api/analysis/match/list',
    {
      pageSize,
      current
    }
  )
  return data
}

export interface MatchDetail extends Match {
  records: RecordItem[]
  playerHands: PlayerHand[]
  matchStageTimeRecord: MatchStageTimeRecord[]
}
const getMatchDetail = async (params: Pick<Match, 'id'>) => {
  const { data } = await request<MatchDetail>(
    `api/analysis/match/detail/${params.id}`,
    params
  )
  return data
}
const getMatchErrors = async (params: Pick<Match, 'id'>) => {
  const { data } = await request<{ list: MatchError[] }>(
    `api/analysis/match/error/${params.id}`,
    params
  )
  return data.list
}

export { getMatchList, getMatchDetail, getMatchErrors }
