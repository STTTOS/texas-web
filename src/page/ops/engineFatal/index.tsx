import dayjs from 'dayjs'
import { useAntdTable } from 'ahooks'
import {
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  InputNumber,
  Space,
  Table,
  theme,
  TableColumnProps
} from 'antd'

import { fetchEngineFatalList } from '@/service/ops'
import type { EngineFatalRow } from '@/service/ops/types'
import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import shell from '@/page/announcement/shell.module.less'

const { RangePicker } = DatePicker

const EngineFatalPage = () => {
  const [form] = Form.useForm()
  const { tableProps, search } = useAntdTable(
    async (params) => {
      const matchId = form.getFieldValue('matchId') as number | null | undefined
      const roomId = form.getFieldValue('roomId') as number | null | undefined
      const dateRange = form.getFieldValue('dateRange') as
        | [dayjs.Dayjs, dayjs.Dayjs]
        | null
        | undefined
      const time =
        dateRange?.[0] && dateRange[1]
          ? ([
            dateRange[0].startOf('day').toISOString(),
            dateRange[1].endOf('day').toISOString()
          ] as [string, string])
          : undefined
      return fetchEngineFatalList({
        current: params.current,
        pageSize: params.pageSize,
        matchId: matchId != null && matchId > 0 ? matchId : undefined,
        roomId: roomId != null && roomId > 0 ? roomId : undefined,
        time
      })
    },
    {
      form,
      defaultPageSize: 20
    }
  )

  const columns: TableColumnProps<EngineFatalRow>[] = [
    { title: 'Id', dataIndex: 'id', width: 70 },
    { title: '房间', dataIndex: 'roomId', width: 80 },
    { title: '对局', dataIndex: 'matchId', width: 80 },
    { title: '时间', dataIndex: 'createdAt', width: 180 },
    {
      title: '消息',
      dataIndex: 'message',
      ellipsis: true
    },
    {
      title: '操作',
      width: 120,
      render(_, row) {
        return (
          <a href={`/match/error/${row.matchId}`} target="_blank" rel="noreferrer">
            对局错误页
          </a>
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
          <PageBrand subtitle="管理员 · 跨对局引擎致命错误" />

          <div className={shell.glass}>
            <div className={shell.toolbar}>
              <h1 className={shell.pageTitle}>引擎事故</h1>
            </div>

            <Form
              form={form}
              layout="inline"
              style={{ marginBottom: 16, rowGap: 12 }}
              onFinish={search.submit}
            >
              <Form.Item name="matchId" label="对局 Id">
                <InputNumber min={1} controls={false} placeholder="可选" style={{ width: 120 }} />
              </Form.Item>
              <Form.Item name="roomId" label="房间 Id">
                <InputNumber min={1} controls={false} placeholder="可选" style={{ width: 120 }} />
              </Form.Item>
              <Form.Item name="dateRange" label="发生时间">
                <RangePicker />
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

            <Table<EngineFatalRow>
              rowKey={(r) => String(r.id)}
              scroll={{ x: 900 }}
              {...tableProps}
              columns={columns}
              expandable={{
                expandedRowRender: (row) => (
                  <pre style={{ margin: 0, maxHeight: 280, overflow: 'auto', fontSize: 12 }}>
                    {JSON.stringify(row.payload, null, 2)}
                  </pre>
                ),
                rowExpandable: (row) => row.payload != null
              }}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default EngineFatalPage
