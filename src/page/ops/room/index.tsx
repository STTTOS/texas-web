import { useAntdTable } from 'ahooks'
import {
  Button,
  ConfigProvider,
  Form,
  Input,
  Select,
  Space,
  Table,
  theme,
  TableColumnProps,
  Tag
} from 'antd'

import { fetchRoomOpsList } from '@/service/ops'
import type { RoomOpsRow } from '@/service/ops/types'
import { formatTableType, TABLE_TYPE_FILTER_OPTIONS } from '@/utils/tableTypeLabel'
import {
  formatRoomGameStatus,
  ROOM_GAME_STATUS_FILTER_OPTIONS
} from '@/utils/roomGameStatusLabel'
import UserAvatar from '@/components/UserAvatar'
import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import shell from '@/page/announcement/shell.module.less'

const ROOM_LIFECYCLE_OPTIONS = [
  { value: 'all', label: '全部（含已解散）' },
  { value: 'active', label: '仅有效' },
  { value: 'dissolved', label: '仅已解散' }
]

const RoomOpsPage = () => {
  const [form] = Form.useForm()
  const { tableProps, search } = useAntdTable(
    async (params) => {
      const gameStatus = form.getFieldValue('gameStatus') as string | undefined
      const tableType = form.getFieldValue('tableType') as string | undefined
      const ownerNameContains = form.getFieldValue('ownerNameContains') as
        | string
        | undefined
      const roomLifecycleRaw = form.getFieldValue('roomLifecycle') as
        | string
        | undefined
      return fetchRoomOpsList({
        current: params.current,
        pageSize: params.pageSize,
        gameStatus: gameStatus && gameStatus !== 'all' ? gameStatus : undefined,
        tableType: tableType === 'all' || !tableType ? undefined : tableType,
        roomLifecycle:
          roomLifecycleRaw === 'active' || roomLifecycleRaw === 'dissolved'
            ? roomLifecycleRaw
            : undefined,
        ...(ownerNameContains != null && String(ownerNameContains).trim() !== ''
          ? { ownerNameContains: String(ownerNameContains).trim() }
          : {})
      })
    },
    {
      form,
      defaultPageSize: 20
    }
  )

  const columns: TableColumnProps<RoomOpsRow>[] = [
    { title: '房间 Id', dataIndex: 'id', width: 90 },
    { title: '邀请码', dataIndex: 'activeCode', width: 100, render: (v) => v || '-' },
    {
      title: '成员',
      width: 80,
      render(_, row) {
        const n = row.deletedAt ? row.historicalMemberCount : row.memberCount
        return n
      }
    },
    { title: '对局数', dataIndex: 'matchCount', width: 80 },
    {
      title: '房间',
      width: 100,
      render(_, row) {
        return row.deletedAt ? (
          <Tag color="red">已解散</Tag>
        ) : (
          <Tag color="green">有效</Tag>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'gameStatus',
      width: 120,
      render: (s: string) => (
        <Tag color="blue">{formatRoomGameStatus(s)}</Tag>
      )
    },
    {
      title: '桌型',
      dataIndex: 'tableType',
      width: 90,
      render: (t: string) => formatTableType(t)
    },
    {
      title: '是否公开',
      dataIndex: 'isPrivate',
      width: 96,
      render: (isPrivate: boolean) =>
        isPrivate ? (
          <Tag color="default">否</Tag>
        ) : (
          <Tag color="blue">是</Tag>
        )
    },
    { title: '大盲', dataIndex: 'lowestBetAmount', width: 80 },
    { title: '初始筹码', dataIndex: 'initialChips', width: 90 },
    { title: '创建', dataIndex: 'createdAt', width: 170 },
    {
      title: '房主',
      width: 200,
      render(_, row) {
        const o = row.owner
        return (
          <Space>
            <UserAvatar
              avatarUrl={o.avatarUrl}
              avatarKey={o.avatarKey}
              name={o.name}
            />
            <span>
              {o.name} (#{o.id})
            </span>
          </Space>
        )
      }
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render(_, row) {
        return row.matchCount > 0 ? (
          <a
            href={`/ops/room/${row.id}/summary`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fbbf24' }}
          >
            对局汇总
          </a>
        ) : (
          <span style={{ opacity: 0.45 }}>—</span>
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
          <PageBrand subtitle="管理员 · 房间列表与状态" />

          <div className={shell.glass}>
            <div className={shell.toolbar}>
              <h1 className={shell.pageTitle}>房间运维</h1>
            </div>

            <Form
              form={form}
              layout="inline"
              style={{ marginBottom: 16, rowGap: 12 }}
              onFinish={search.submit}
            >
              <Form.Item name="roomLifecycle" label="房间范围" initialValue="all">
                <Select options={ROOM_LIFECYCLE_OPTIONS} style={{ width: 160 }} />
              </Form.Item>
              <Form.Item name="gameStatus" label="状态" initialValue="all">
                <Select options={ROOM_GAME_STATUS_FILTER_OPTIONS} style={{ width: 160 }} />
              </Form.Item>
              <Form.Item name="tableType" label="桌型" initialValue="all">
                <Select options={TABLE_TYPE_FILTER_OPTIONS} style={{ width: 140 }} />
              </Form.Item>
              <Form.Item name="ownerNameContains" label="房主昵称">
                <Input allowClear placeholder="模糊匹配游戏昵称" style={{ width: 200 }} />
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

            <Table<RoomOpsRow>
              rowKey={(r) => String(r.id)}
              scroll={{ x: 1320 }}
              {...tableProps}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default RoomOpsPage
