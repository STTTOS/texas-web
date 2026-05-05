import type { Dayjs } from 'dayjs'

/** 管理端列表常用：RangePicker 闭区间 → ISO 字符串，供 `time` 类 API */
export function dayRangeToClosedIso(
  range: [Dayjs, Dayjs] | null | undefined
): [string, string] | undefined {
  if (!range?.[0] || !range[1]) return undefined
  return [range[0].startOf('day').toISOString(), range[1].endOf('day').toISOString()]
}
