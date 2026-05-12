import type { RoomOpsTableType } from '@/service/ops/types'
import { ROOM_OPS_TABLE_TYPES } from '@/service/ops/types'

/** 与房间 / 对局接口 `tableType` 枚举一致 */
const TABLE_TYPE_LABEL: Record<RoomOpsTableType, string> = {
  quick: '快速',
  standard: '标准',
  deep: '深筹',
  custom: '自定义'
}

/** 对局运维 / 房间运维等共用的桌型筛选项（含「全部」） */
export const TABLE_TYPE_FILTER_OPTIONS: {
  value: 'all' | RoomOpsTableType
  label: string
}[] = [
  { value: 'all', label: '全部桌型' },
  ...ROOM_OPS_TABLE_TYPES.map((v) => ({
    value: v,
    label: TABLE_TYPE_LABEL[v] ?? v
  }))
]

export function formatTableType(value: string | null | undefined): string {
  if (value == null || value === '') return '-'
  const key = ROOM_OPS_TABLE_TYPES.find((k) => k === value)
  return key ? TABLE_TYPE_LABEL[key] : value
}
