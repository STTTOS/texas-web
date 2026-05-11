import type { Match } from '@/service/match/types'

import dayjs from 'dayjs'
import { useAntdTable } from 'ahooks'
import {
  formatterPoke,
  rankCategoryMap,
  stageMap,
  type Stage
} from 'texas-poker-core'
import {
  Form,
  Select,
  DatePicker,
  Table,
  Space,
  Button,
  theme,
  ConfigProvider,
  TableColumnProps,
  Input
} from 'antd'
import { Link } from 'react-router-dom'

import { getMatchList } from '@/service/match'
import { getMatchDuration } from '@/page/match'
import { getMatchStatusTag } from '@/service/match/matchStatus'
import { dayRangeToClosedIso } from '@/utils/dayRangeToClosedIso'
import { formatTableType } from '@/utils/tableTypeLabel'
import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import shell from '@/page/announcement/shell.module.less'

const { RangePicker } = DatePicker

const TABLE_TYPE_OPTIONS = [
  { value: 'all', label: '全部桌型' },
  { value: 'quick', label: '快速' },
  { value: 'standard', label: '标准' },
  { value: 'deep', label: '深筹' },
  { value: 'custom', label: '自定义' }
]

const MATCH_STATUS_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'in_progress', label: '进行中' },
  { value: 'ended', label: '已结束' }
]

const BOARD_STAGE_KEYS = ['pre_flop', 'flop', 'turn', 'river'] as const

const MatchOpsPage = () => {
  const [form] = Form.useForm()
  const { tableProps, search } = useAntdTable(
    async (params) => {
      const tableType = form.getFieldValue('tableType') as string | undefined
      const matchStatus = form.getFieldValue('matchStatus') as string | undefined
      const boardThroughStage = form.getFieldValue('boardThroughStage') as
        | string
        | undefined
      const playerName = form.getFieldValue('playerName') as string | undefined
      const dateRange = form.getFieldValue('dateRange') as
        | [dayjs.Dayjs, dayjs.Dayjs]
        | null
        | undefined
      const time = dayRangeToClosedIso(dateRange ?? undefined)
      return getMatchList({
        current: params.current,
        pageSize: params.pageSize,
        type: tableType === 'all' || !tableType ? undefined : tableType,
        time,
        matchStatus:
          matchStatus && matchStatus !== 'all' ? matchStatus : undefined,
        boardThroughStage:
          boardThroughStage && boardThroughStage !== 'all'
            ? boardThroughStage
            : undefined,
        ...(playerName != null && String(playerName).trim() !== ''
          ? { playerName: String(playerName).trim() }
          : {})
      })
    },
    {
      form,
      defaultPageSize: 20
    }
  )

  const columns: TableColumnProps<Match>[] = [
    { title: 'Id', dataIndex: 'id' },
    {
      title: '底牌',
      width: 200,
      render(_, { commonPokes }) {
        return formatterPoke(commonPokes || [])
      }
    },
    { title: '起始筹码', dataIndex: 'initialChips' },
    {
      title: '桌型',
      dataIndex: 'tableType',
      render: (t: string | undefined) => formatTableType(t)
    },
    { title: '盲注', dataIndex: 'lowestBetAmount' },
    {
      title: '状态',
      render(_, record) {
        return getMatchStatusTag(record)
      }
    },
    { title: '人数', dataIndex: 'memberCount' },
    { title: '开始时间', dataIndex: 'startedAt' },
    {
      title: '结束阶段',
      render(_, { boardThroughStage }) {
        return boardThroughStage != null ? stageMap.get(boardThroughStage) : '-'
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
      render(_, { bestRankCategory }) {
        return bestRankCategory && rankCategoryMap.get(bestRankCategory)
      }
    },
    {
      title: '操作',
      render(_, record) {
        return (
          <Space>
            <a href={`/match/detail/${record.id}`} target="_blank" rel="noreferrer">
              对局详情
            </a>
            <Link to={`/ops/match-tape/${record.id}`} target="_blank" rel="noreferrer">
              磁带
            </Link>
            {!!record.errorCount && (
              <a href={`/match/error/${record.id}`} target="_blank" rel="noreferrer">
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
          <PageBrand subtitle="管理员 · 对局筛选与检索" />

          <div className={shell.glass}>
            <div className={shell.toolbar}>
              <h1 className={shell.pageTitle}>对局运维</h1>
            </div>

            <Form
              form={form}
              layout="inline"
              style={{ marginBottom: 16, rowGap: 12 }}
              onFinish={search.submit}
            >
              <Form.Item name="tableType" label="桌型" initialValue="all">
                <Select options={TABLE_TYPE_OPTIONS} style={{ width: 140 }} />
              </Form.Item>
              <Form.Item name="matchStatus" label="状态" initialValue="all">
                <Select options={MATCH_STATUS_OPTIONS} style={{ width: 120 }} />
              </Form.Item>
              <Form.Item name="boardThroughStage" label="结束阶段" initialValue="all">
                <Select
                  style={{ width: 140 }}
                  options={[
                    { value: 'all', label: '全部' },
                    ...BOARD_STAGE_KEYS.map((k) => ({
                      value: k,
                      label: stageMap.get(k as Stage) ?? k
                    }))
                  ]}
                />
              </Form.Item>
              <Form.Item name="dateRange" label="时间">
                <RangePicker />
              </Form.Item>
              <Form.Item name="playerName" label="参与用户昵称">
                <Input allowClear placeholder="模糊，仅管理员" style={{ width: 160 }} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      search.reset()
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>

            <Table<Match>
              rowKey={(r) => String(r.id)}
              scroll={{ x: 1280 }}
              {...tableProps}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default MatchOpsPage
