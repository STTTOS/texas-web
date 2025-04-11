import { ActionType, handPokeType, Poke, Role, Stage, User } from "texas-poker-core"

interface Match {
  /**
   * 主键id
   */
  id: number
  playersCount: number;
  maximumType: handPokeType;
  lowestBetAmount: number;
  endStage: Stage;
  endedAt: string;
  totalBetAmount: number
  commonPokes: Poke[];
  startedAt: string;
}

interface RecordItem {
  action: ActionType;
  amount?: number;
  stage: Stage;
  createdAt: string;
  player: User
}
interface PlayerHand {
  hand: Poke[];
  player: User;
  role: Role
  win: boolean
}
export type { Match, RecordItem, PlayerHand }
