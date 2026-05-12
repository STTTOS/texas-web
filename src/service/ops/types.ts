export interface UserOpsRow {
  id: number
  name: string
  username: string
  balance: number
  /** 参与对局条数（PlayerMatchRecord），列表展示「总对局」 */
  matchRecordsCount: number
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
  /** 软删解散时间；未解散为 null */
  deletedAt: string | null
  owner: {
    id: number
    name: string
    username: string
    avatarUrl: string | null
    avatarKey?: string
  }
  /** 当前 `RoomMember` 人数 */
  memberCount: number
  /** 历史去重成员数（与对局汇总口径一致） */
  historicalMemberCount: number
  matchCount: number
}

/** `POST api/web/room-ops/detail` */
export interface RoomOpsDetailPlayerRow {
  userId: number
  name: string
  username: string
  avatarUrl: string | null
  avatarKey: string
  /** 该房间对局内输赢合计 */
  totalWager: number
  /** 该房间对局内下注额合计（PlayerMatchRecord.totalBetAmount） */
  totalBetAmount: number
  totalTopUpAmount: number
}

/** 对局汇总页返回的房间信息（在列表字段基础上增加统计项） */
export interface RoomOpsDetailRoom extends RoomOpsRow {
  historicalMemberCount: number
  /** 各已结束对局时长之和，单位：秒 */
  totalGameDurationSec: number
  /** 全房间对局 `Match.totalBetAmount` 之和 */
  totalRoomBetAmount: number
}

export interface RoomOpsDetailPayload {
  room: RoomOpsDetailRoom
  players: RoomOpsDetailPlayerRow[]
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
  /** 历史累计已结束对局 */
  matchesEndedTotal: number
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
