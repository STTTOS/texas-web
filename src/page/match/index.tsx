import type { Match } from '@/service/match/types'

import dayjs from 'dayjs'
import { useAntdTable } from 'ahooks'
import { stageMap, formatterPoke, rankCategoryMap } from 'texas-poker-core'
import {
  Tag,
  Table,
  Space,
  theme,
  ConfigProvider,
  TableColumnProps
} from 'antd'

import { getMatchList } from '@/service/match'
import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
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
  if (getMatchStatus(record) === 'error') return <Tag color="#a78bfa">异常</Tag>

  return <Tag color="#fbbf24">正常</Tag>
}
const MatchPage = () => {
  const { tableProps } = useAntdTable(getMatchList)
  const columns: TableColumnProps<Match>[] = [
    {
      title: 'Id',
      dataIndex: 'id'
    },
    {
      title: '底牌',
      width: 200,
      render(_, { commonPokes }) {
        return formatterPoke(commonPokes || [])
      }
    },
    {
      title: '起始筹码',
      dataIndex: 'initialChips'
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
      dataIndex: 'memberCount'
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
      dataIndex: 'bestRankCategory',
      render(_, { bestRankCategory }) {
        return bestRankCategory && rankCategoryMap.get(bestRankCategory)
      }
    },
    {
      title: '操作',
      render(_, record) {
        return (
          <Space>
            <a
              href={`/match/detail/${record.id}`}
              target="_blank"
              rel="noreferrer"
            >
              对局详情
            </a>
            {!!record.errorCount && (
              <a
                href={`/match/error/${record.id}`}
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
          <PageBrand subtitle="对局信息查询 · 数据回放" />

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

export default MatchPage
