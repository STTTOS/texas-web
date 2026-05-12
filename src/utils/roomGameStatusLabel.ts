/** 与后端 `RoomGameStatus` 枚举一致，用于运维展示与筛选 */
export const ROOM_GAME_STATUS_ZH: Record<string, string> = {
  waiting: '等待',
  entering: '进入中',
  starting_hand: '开局中',
  in_hand: '本手进行中',
  between_hands: '局间'
}

export function formatRoomGameStatus(status: string | null | undefined): string {
  if (status == null || status === '') return '—'
  return ROOM_GAME_STATUS_ZH[status] ?? status
}

export const ROOM_GAME_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: '全部' },
  ...Object.entries(ROOM_GAME_STATUS_ZH).map(([value, label]) => ({
    value,
    label
  }))
]
