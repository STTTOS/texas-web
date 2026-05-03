export interface EngineFatalRow {
  id: number
  roomId: number
  matchId: number
  message: string
  payload: unknown
  createdAt: string | null
}

export interface RoomOpsRow {
  id: number
  activeCode: string | null
  gameStatus: string
  lowestBetAmount: number
  initialChips: number
  tableType: string
  thinkingTime: number
  isPrivate: boolean
  sevenTwoBonusEnabled: boolean
  createdAt: string | null
  owner: {
    id: number
    name: string
    username: string
    avatarUrl: string | null
    avatarKey?: string
  }
  memberCount: number
  matchCount: number
}

export interface DashboardSummary {
  rangeStart: string | null
  matchesEndedLast7d: number
  engineFatalsLast7d: number
  roomsInPlay: number
  roomsTotal: number
  matchesEndedToday: number
  engineFatalsToday: number
}
