import { useAntdTable } from 'ahooks'
import {
  Button,
  ConfigProvider,
  Form,
  InputNumber,
  Select,
  Space,
  Table,
  theme,
  TableColumnProps,
  Tag
} from 'antd'

import { fetchRoomOpsList } from '@/service/ops'
import type { RoomOpsRow } from '@/service/ops/types'
import { formatTableType } from '@/utils/tableTypeLabel'
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
      const roomId = form.getFieldValue('roomId') as number | null | undefined
      const ownerId = form.getFieldValue('ownerId') as number | null | undefined
      return fetchRoomOpsList({
        current: params.current,
        pageSize: params.pageSize,
        gameStatus: gameStatus && gameStatus !== 'all' ? gameStatus : undefined,
        roomId: roomId != null && roomId > 0 ? roomId : undefined,
        ownerId: ownerId != null && ownerId > 0 ? ownerId : undefined
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
              <Form.Item name="roomId" label="房间 Id">
                <InputNumber min={1} controls={false} placeholder="可选" style={{ width: 120 }} />
              </Form.Item>
              <Form.Item name="ownerId" label="房主用户 Id">
                <InputNumber min={1} controls={false} placeholder="可选" style={{ width: 140 }} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      form.resetFields()
                      search.submit()
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>

            <Table<RoomOpsRow>
              rowKey={(r) => String(r.id)}
              scroll={{ x: 1100 }}
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
