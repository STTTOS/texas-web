import { useAntdTable } from 'ahooks'
import { useEffect, useMemo } from 'react'
import {
  Button,
  ConfigProvider,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tag,
  theme,
  TableColumnProps
} from 'antd'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import { fetchMatchDomainEventList } from '@/service/ops'
import type { MatchDomainEventRow } from '@/service/ops/types'
import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import shell from '@/page/announcement/shell.module.less'

const TABLE_TYPE_OPTIONS = [
  { value: 'all', label: '不限桌型' },
  { value: 'quick', label: '快速' },
  { value: 'standard', label: '标准' },
  { value: 'deep', label: '深筹' },
  { value: 'custom', label: '自定义' }
]

const MatchTapePage = () => {
  const { matchId: matchIdParam } = useParams()
  const [searchParams] = useSearchParams()
  const matchId = Number(matchIdParam)
  const valid = Number.isFinite(matchId) && matchId > 0

  const tableTypeFromUrl = useMemo(() => {
    const t = searchParams.get('tableType')
    if (!t) return 'all'
    if (TABLE_TYPE_OPTIONS.some((o) => o.value === t)) return t
    return 'all'
  }, [searchParams])

  const [form] = Form.useForm()
  const { tableProps, search } = useAntdTable(
    async (params) => {
      const tapeTableType = params.tapeTableType as string | undefined
      return fetchMatchDomainEventList({
        ...params,
        matchId,
        tableType:
          tapeTableType && tapeTableType !== 'all' ? tapeTableType : undefined,
        eventType: params.eventType as string | undefined
      })
    },
    {
      form,
      defaultPageSize: 50,
      ready: valid,
      manual: true
    }
  )

  useEffect(() => {
    if (!valid) return
    form.setFieldsValue({
      tapeTableType: tableTypeFromUrl,
      eventType: ''
    })
    search.submit()
  }, [valid, tableTypeFromUrl, matchId, form, search])

  const columns: TableColumnProps<MatchDomainEventRow>[] = [
    { title: '行 Id', dataIndex: 'id', width: 88 },
    { title: 'seq', dataIndex: 'seq', width: 64 },
    { title: 'handId', dataIndex: 'handId', width: 120, ellipsis: true },
    {
      title: 'eventType',
      dataIndex: 'eventType',
      width: 180,
      ellipsis: true,
      render: (t: string) => <Tag color="geekblue">{t}</Tag>
    },
    { title: '时间', dataIndex: 'createdAt', width: 170 },
    {
      title: 'payload 摘要',
      ellipsis: true,
      render: (_, row) => {
        const s = JSON.stringify(row.payload)
        return s.length > 120 ? `${s.slice(0, 120)}…` : s
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
          <PageBrand subtitle="管理员 · MatchDomainEvent 磁带（只读）" />

          <div className={shell.glass}>
            <div className={shell.toolbar}>
              <h1 className={shell.pageTitle}>对局 #{matchIdParam} 领域磁带</h1>
              <Link to="/match/ops">返回对局运维</Link>
            </div>

            {!valid ? (
              <p style={{ opacity: 0.85 }}>无效的对局 Id。请从「对局运维」列表点击「磁带」进入。</p>
            ) : (
              <>
                <p style={{ marginBottom: 12, opacity: 0.8, fontSize: 13 }}>
                  使用路径中的对局 Id，与下方「桌型」联合校验（与对局所在房间一致）；可选按 eventType 模糊筛选。
                </p>
                <Form
                  form={form}
                  layout="inline"
                  style={{ marginBottom: 16, rowGap: 12 }}
                  onFinish={search.submit}
                >
                  <Form.Item name="tapeTableType" label="桌型" initialValue="all">
                    <Select options={TABLE_TYPE_OPTIONS} style={{ width: 160 }} />
                  </Form.Item>
                  <Form.Item name="eventType" label="eventType 包含">
                    <Input allowClear placeholder="模糊" style={{ width: 180 }} />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                      <Button
                        onClick={() => {
                          form.setFieldsValue({
                            tapeTableType: 'all',
                            eventType: ''
                          })
                          search.submit()
                        }}
                      >
                        重置
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>

                <Table<MatchDomainEventRow>
                  rowKey={(r) => String(r.id)}
                  scroll={{ x: 1100 }}
                  {...tableProps}
                  columns={columns}
                  expandable={{
                    expandedRowRender: (row) => (
                      <pre
                        style={{
                          margin: 0,
                          maxHeight: 360,
                          overflow: 'auto',
                          fontSize: 12
                        }}
                      >
                        {JSON.stringify(row.payload, null, 2)}
                      </pre>
                    )
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default MatchTapePage
