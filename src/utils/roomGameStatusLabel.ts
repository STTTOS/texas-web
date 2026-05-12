import {
  ROOM_OPS_GAME_STATUSES,
  type RoomOpsGameStatus
} from '@/service/ops/types'

/** 与后端 `RoomGameStatus` 枚举一致，用于运维展示与筛选 */
export const ROOM_GAME_STATUS_ZH: Record<RoomOpsGameStatus, string> = {
  waiting: '等待',
  entering: '进入中',
  starting_hand: '开局中',
  in_hand: '本手进行中',
  between_hands: '局间'
}

export function formatRoomGameStatus(status: string | null | undefined): string {
  if (status == null || status === '') return '—'
  const key = ROOM_OPS_GAME_STATUSES.find((k) => k === status)
  return key ? ROOM_GAME_STATUS_ZH[key] : status
}

export const ROOM_GAME_STATUS_FILTER_OPTIONS: {
  value: 'all' | RoomOpsGameStatus
  label: string
}[] = [
  { value: 'all', label: '全部' },
  ...ROOM_OPS_GAME_STATUSES.map((value) => ({
    value,
    label: ROOM_GAME_STATUS_ZH[value]
  }))
]
