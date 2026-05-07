/** 与房间 / 对局接口 `tableType` 枚举一致，见对局运维筛选 `TABLE_TYPE_OPTIONS` */
const TABLE_TYPE_LABEL: Record<string, string> = {
  quick: '快速',
  standard: '标准',
  deep: '深筹',
  custom: '自定义'
}

export function formatTableType(value: string | null | undefined): string {
  if (value == null || value === '') return '-'
  return TABLE_TYPE_LABEL[value] ?? value
}
