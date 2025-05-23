import {
  Poke,
  Role,
  User,
  Stage,
  ActionType,
  handPokeType
} from 'texas-poker-core'

interface Match {
  /**
   * 主键id
   */
  id: number
  playersCount: number
  maximumType: handPokeType
  lowestBetAmount: number
  endStage: Stage
  endedAt: string
  totalBetAmount: number
  commonPokes: Poke[]
  startedAt: string
  errorCount: number
}

interface RecordItem {
  action: ActionType
  amount?: number
  stage: Stage
  createdAt: string
  player: User
}
interface PlayerHand {
  hand: Poke[]
  player: User
  role: Role
  earn: number
  win: boolean
}
interface MatchStageTimeRecord {
  stage: Stage
  startAt: string
  endAt: string
}
interface MatchError{
  id: number;
  createdAt: string;
  info: string;
  matchId: number;
}
export type { Match, RecordItem, PlayerHand, MatchStageTimeRecord, MatchError }
