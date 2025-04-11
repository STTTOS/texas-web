import type { Params } from 'ahooks/lib/usePagination/types'

import request from '../../utils/http'
import { Match, PlayerHand, RecordItem } from './types'

const getMatchList = async (pageParams: Params[0]) => {
  const { data } = await request<{ list: Match[]; total: number }>(
    'api/analysis/match/list',
    pageParams
  )
  return data
}
export interface MatchDetail extends Match {
  records: RecordItem[];
  playerHands: PlayerHand[]
}
const getMatchDetail = async (params: Pick<Match, 'id'>) => {
  const { data } = await request<MatchDetail>(
    `api/analysis/match/detail/${params.id}`,
    params
  )
  return data
}

export { getMatchList, getMatchDetail }
