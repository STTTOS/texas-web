import type { SortOrder, SorterResult } from 'antd/es/table/interface'

/**
 * 将 Ant Design Table 的 `sorter` 转为用户运维接口的 `sortField` / `sortOrder`。
 *
 * 服务端排序：列上 `sorter: true`，在 `useAntdTable` 的请求函数里读取 `params.sorter`，
 * 把 `ascend`/`descend` 映射为接口的 `asc`/`desc`；取消排序时不传排序字段（默认 id 倒序）。
 *
 * @see https://ant.design/components/table-cn — Table `onChange` 的 `sorter` 参数
 */
export function userOpsListSortParams(
  sorter: SorterResult<unknown> | SorterResult<unknown>[] | undefined
): { sortField?: 'matchRecordsCount'; sortOrder?: 'asc' | 'desc' } {
  if (!sorter || Array.isArray(sorter)) return {}
  const field = sorter.field as string | string[] | undefined
  const isMatchCount =
    field === 'matchRecordsCount' ||
    (Array.isArray(field) && field.includes('matchRecordsCount'))
  if (!isMatchCount) return {}
  if (sorter.order === 'ascend') {
    return { sortField: 'matchRecordsCount', sortOrder: 'asc' }
  }
  if (sorter.order === 'descend') {
    return { sortField: 'matchRecordsCount', sortOrder: 'desc' }
  }
  return {}
}

/** 受控列 `sortOrder`：与「总对局」列当前排序箭头一致 */
export function matchRecordsColumnSortOrder(
  sorter: SorterResult<unknown> | SorterResult<unknown>[] | undefined
): SortOrder | undefined {
  if (!sorter || Array.isArray(sorter)) return undefined
  const field = sorter.field as string | string[] | undefined
  const ok =
    field === 'matchRecordsCount' ||
    (Array.isArray(field) && field.includes('matchRecordsCount'))
  if (!ok) return undefined
  return sorter.order ?? undefined
}
