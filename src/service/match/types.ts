import { Poke, Role, Stage, ActionType, RankCategory } from 'texas-poker-core'

interface Match {
  /**
   * 主键id
   */
  id: number
  memberCount: number
  bestRankCategory?: RankCategory | null
  /** 与 bestPokes 对齐的牌力签名（服务端 Match.bestRankSignature） */
  bestRankSignature?: string | null
  lowestBetAmount: number
  /**
   * 本手公共牌实际发到哪一街（对齐服务端 `boardThroughStage`，取代已移除的 endStage）
   */
  boardThroughStage?: Stage | null
  endedAt: string | null
  totalBetAmount?: number | null
  commonPokes: Poke[] | null
  startedAt: string | null
  errorCount?: number
  // 起始筹码
  initialChips: number
  bestPokes?: Poke[][]
  roomId?: number
  tableType?: string
  sevenTwoBonusEnabled?: boolean
  roomCode?: string
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
  role: Role | null
  wager: number
  rankCategory?: RankCategory | null
  rankSignature?: string | null
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
/** 对齐 `api/web/match/error/:id` — EngineFatalIncident */
interface MatchError {
  id: number
  createdAt: string
  message: string
  matchId: number
  roomId: number
  payload: unknown
}
export type { Match, BetRecord, SettleRecord, StageRecord, MatchError }
