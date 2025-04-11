import dayjs from 'dayjs'
import { useAntdTable } from 'ahooks'
import { Tag, Table, TableColumnProps } from 'antd'
import { stageMap, handPokeMap, formatterPoke } from 'texas-poker-core'

import { Match } from '@/service/analysis/types'
import { getMatchList } from '@/service/analysis'

export const getMatchDuration = (start?: string, end?: string, unit = true) => {
  if (start && end) return dayjs(end).diff(start, 'second') + (unit ? '秒' : '')
}
const getMatchStatus = ({ commonPokes, endStage, endedAt }: Match) => {
  if (!commonPokes || commonPokes.length === 0 || !endStage || !endedAt)
    return 'error'

  return 'normal'
}
export const getMatchTag = (record?: Match) => {
  if (!record) return null
  if (getMatchStatus(record) === 'error') return <Tag color="red">异常</Tag>

  return <Tag color="green">正常</Tag>
}
const Page = () => {
  const { tableProps } = useAntdTable(getMatchList)
  const columns: TableColumnProps<Match>[] = [
    {
      title: '对局Id',
      dataIndex: 'id',
      fixed: 'left'
    },
    {
      title: '底牌',
      fixed: 'left',
      width: 200,
      render(_, { commonPokes }) {
        // return commonPokes
        return formatterPoke(commonPokes || [])
      }
    },
    {
      title: '盲注',
      fixed: 'left',
      dataIndex: 'lowestBetAmount'
    },
    {
      title: '状态',
      fixed: 'left',
      render(_, record) {
        return getMatchTag(record)
      }
    },
    {
      title: '人数',
      dataIndex: 'playersCount'
    },
    {
      title: '开始时间',
      dataIndex: 'startedAt'
    },
    {
      title: '结束阶段',
      render(_, { endStage }) {
        return stageMap.get(endStage)
      }
    },
    {
      title: '时长(秒)',
      render(_, { startedAt, endedAt }) {
        return getMatchDuration(startedAt, endedAt)
      }
    },
    {
      title: '最大牌型',
      dataIndex: 'maximumType',
      render(_, { maximumType }) {
        return handPokeMap.get(maximumType)
      }
    },
    {
      title: '操作',
      fixed: 'right',
      render(_, record) {
        // if (getMatchStatus(record) === 'error')
        return (
          <a href={`/analysis/match/detail/${record.id}`} target="_blank">
            对局详情
          </a>
        )
      }
    }
  ]
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
      }}
    >
      <Table
        scroll={{ x: 'max-content' }}
        {...tableProps}
        columns={columns}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default Page
