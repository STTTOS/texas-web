import type { Match } from '@/service/analysis/types'

import dayjs from 'dayjs'
import { useAntdTable } from 'ahooks'
import { stageMap, handPokeMap, formatterPoke } from 'texas-poker-core'
import {
  Tag,
  Table,
  Space,
  theme,
  ConfigProvider,
  TableColumnProps
} from 'antd'

import { getMatchList } from '@/service/analysis'
import HomeBgBalls from '@/components/HomeBgBalls'
import shell from '@/page/announcement/shell.module.less'

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
      dataIndex: 'id'
    },
    {
      title: '底牌',
      width: 200,
      render(_, { commonPokes }) {
        // return commonPokes
        return formatterPoke(commonPokes || [])
      }
    },
    {
      title: '盲注',
      dataIndex: 'lowestBetAmount'
    },
    {
      title: '状态',
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
      render(_, record) {
        return (
          <Space>
            <a
              href={`/analysis/match/detail/${record.id}`}
              target="_blank"
              rel="noreferrer"
            >
              对局详情
            </a>
            {!!record.errorCount && (
              <a
                href={`/analysis/match/error/${record.id}`}
                target="_blank"
                rel="noreferrer"
              >
                错误记录
              </a>
            )}
          </Space>
        )
      }
    }
  ]

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#fbbf24', borderRadius: 10 }
      }}
    >
      <div className={shell.page}>
        <HomeBgBalls count={24} />
        <div className={shell.inner}>
          <div className={shell.brand}>Texas Poker</div>
          <p className={shell.sub}>对局记录 · 数据回放</p>

          <div className={shell.glass}>
            <div className={shell.toolbar}>
              <h1 className={shell.pageTitle}>对局列表</h1>
            </div>

            <Table<Match>
              rowKey={(r) => String(r.id)}
              scroll={{ x: 1180 }}
              {...tableProps}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default Page
