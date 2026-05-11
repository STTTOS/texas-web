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
import UserAvatar from '@/components/UserAvatar'
import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import shell from '@/page/announcement/shell.module.less'

const STATUS_OPTIONS = [
  { value: 'all', label: '全部状态' },
  { value: 'waiting', label: '等待' },
  { value: 'entering', label: '进入中' },
  { value: 'starting_hand', label: '开局中' },
  { value: 'in_hand', label: '本手进行中' },
  { value: 'between_hands', label: '局间' }
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
      return fetchRoomOpsList({
        current: params.current,
        pageSize: params.pageSize,
        gameStatus: gameStatus && gameStatus !== 'all' ? gameStatus : undefined,
        tableType: tableType === 'all' || !tableType ? undefined : tableType,
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
      title: '状态',
      dataIndex: 'gameStatus',
      width: 120,
      render: (s: string) => <Tag color="blue">{s}</Tag>
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
    { title: '成员', dataIndex: 'memberCount', width: 70 },
    { title: '对局数', dataIndex: 'matchCount', width: 80 },
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
              <Form.Item name="gameStatus" label="状态" initialValue="all">
                <Select options={STATUS_OPTIONS} style={{ width: 160 }} />
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

export default RoomOpsPage
