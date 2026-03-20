import { Poke, Role, Stage, ActionType, RankCategory } from 'texas-poker-core'

interface Match {
  /**
   * 主键id
   */
  id: number
  memberCount: number
  bestRankCategory?: RankCategory
  lowestBetAmount: number
  endStage: Stage
  endedAt: string
  totalBetAmount: number
  commonPokes: Poke[]
  startedAt: string
  errorCount?: number
  // 起始筹码
  initialChips: number
  bestPokes?: Poke[][]
  roomId?: number
}

interface BetRecord {
  id: number
  matchId: number
  userId: number
  name: string
  avatarUrl: string | null
  avatarKey?: string
  actionType: ActionType
  amount?: number
  stage: Stage
  createdAt: string
}

interface SettleRecord {
  id: number
  matchId: number
  userId: number
  name: string
  avatarUrl: string | null
  avatarKey?: string
  role: Role
  wager: number
  rankCategory?: RankCategory
  rankSignature?: string
  rankStrength?: number
  totalBetAmount?: number
  isAllIn?: boolean
  isFold?: boolean
  handPokes: Poke[]
}

interface StageRecord {
  stage: Stage
  startAt: string
  endAt: string
}
interface MatchError {
  id: number
  createdAt: string
  info: string
  matchId: number
}
export type { Match, BetRecord, SettleRecord, StageRecord, MatchError }
