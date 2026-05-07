export interface UserOpsRow {
  id: number
  name: string
  username: string
  balance: number
  avatarUrl: string | null
  avatarKey: string
  pokerBackgroundKey: string | null
  weChatId: string | null
  isAdmin: boolean
  createdAt: string | null
  updatedAt: string | null
  deletedAt: string | null
}

export interface UserOpsDetail extends UserOpsRow {
  settings: {
    showHistoryRecords: boolean
    showRecordOverview: boolean
    autoCallOnOffline: boolean
    createdAt: string | null
    updatedAt: string | null
  } | null
  _count: {
    matchRecords: number
    Room: number
    roomMembers: number
    roomChipTopUps: number
    userRoomStats: number
  }
}

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

export interface MatchDomainEventRow {
  id: number
  matchId: number
  roomId: number
  handId: string | null
  seq: number
  eventType: string
  payload: unknown
  createdAt: string | null
}

export interface DashboardDayPoint {
  day: string
  matchesEnded: number
  engineFatals: number
}

export interface DashboardSummary {
  rangeStart: string | null
  matchesEndedLast7d: number
  engineFatalsLast7d: number
  roomsInPlay: number
  roomsTotal: number
  matchesEndedToday: number
  engineFatalsToday: number
  /** 近 7 日按自然日（含今日），与卡片汇总区间一致 */
  dailySeries: DashboardDayPoint[]
}

export interface AssetUsageSummaryRow {
  assetType: 'poker_back' | 'table_bg'
  assetId: string
  count: number
}

export interface AssetUsageSummary {
  total: number
  rows: AssetUsageSummaryRow[]
}
