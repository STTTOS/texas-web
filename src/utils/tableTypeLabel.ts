/** 与房间 / 对局接口 `tableType` 枚举一致 */
const TABLE_TYPE_LABEL: Record<string, string> = {
  quick: '快速',
  standard: '标准',
  deep: '深筹',
  custom: '自定义'
}

const TABLE_TYPE_VALUES = ['quick', 'standard', 'deep', 'custom'] as const

/** 对局运维 / 房间运维等共用的桌型筛选项（含「全部」） */
export const TABLE_TYPE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: '全部桌型' },
  ...TABLE_TYPE_VALUES.map((v) => ({
    value: v,
    label: TABLE_TYPE_LABEL[v] ?? v
  }))
]

export function formatTableType(value: string | null | undefined): string {
  if (value == null || value === '') return '-'
  return TABLE_TYPE_LABEL[value] ?? value
}
