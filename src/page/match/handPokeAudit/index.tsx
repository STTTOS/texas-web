import type { HandPokeAuditListItem } from '@/service/match/handPokeAuditTypes'

import { useRequest } from 'ahooks'
import { useState } from 'react'
import {
  Avatar,
  Button,
  ConfigProvider,
  Form,
  Input,
  Space,
  Table,
  Tag,
  theme
} from 'antd'

import { fetchHandPokeAuditList } from '@/service/match/handPokeAudit'
import shell from '@/page/announcement/shell.module.less'
import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import styles from './index.module.less'

const STATUS_META: Record<
  HandPokeAuditListItem['auditStatus'],
  { label: string; color: string }
> = {
  insufficient_data: { label: '样本不足', color: 'default' },
  normal: { label: '未检出异常', color: 'success' },
  abnormal: { label: '与均匀假设差异显著（待排查）', color: 'warning' }
}

function formatPValue(p: number | null) {
  if (p == null) return '—'
  if (p < 0.0001) return 'p < 0.0001'
  return p.toFixed(4)
}

function formatChi(v: number | null) {
  if (v == null) return '—'
  return v.toFixed(2)
}

const HandPokeAuditListPage = () => {
  const [form] = Form.useForm<{ name?: string }>()
  const [query, setQuery] = useState<{ name?: string }>({})
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  const { data, loading } = useRequest(
    () =>
      fetchHandPokeAuditList({
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...query
      }),
    { refreshDeps: [pagination.current, pagination.pageSize, query] }
  )

  const list = data?.list ?? []
  const total = data?.total ?? 0

  const onSearch = async () => {
    const v = await form.validateFields()
    setQuery({ name: v.name?.trim() || undefined })
    setPagination((p) => ({ ...p, current: 1 }))
  }

  const onReset = () => {
    form.resetFields()
    setQuery({})
    setPagination((p) => ({ ...p, current: 1 }))
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#fbbf24', borderRadius: 10 }
      }}
    >
      <div className={shell.page}>
        <HomeBgBalls count={20} />
        <div className={shell.inner}>
          <PageBrand subtitle="手牌分布审计 · 管理端" />

          <div className={shell.glass}>
            <div className={shell.toolbar}>
              <h1 className={shell.pageTitle}>手牌审计</h1>
            </div>

            <Form
              form={form}
              layout="inline"
              className={styles.search}
              onFinish={onSearch}
            >
              <Form.Item name="name">
                <Input
                  allowClear
                  placeholder="用户昵称（模糊）"
                  style={{ width: 220 }}
                  onPressEnter={() => onSearch()}
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button onClick={onReset}>重置</Button>
                </Space>
              </Form.Item>
            </Form>

            <Table<HandPokeAuditListItem>
              rowKey={(r) => String(r.userId)}
              loading={loading}
              dataSource={list}
              scroll={{ x: 960 }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total,
                showSizeChanger: true,
                onChange: (current, pageSize) =>
                  setPagination({ current, pageSize: pageSize || 10 })
              }}
              columns={[
                {
                  title: '用户',
                  key: 'user',
                  width: 220,
                  render: (_, row) => (
                    <Space>
                      <Avatar
                        src={row.avatarUrl || undefined}
                        size={36}
                        style={{ background: 'rgba(245, 158, 11, 0.35)' }}
                      >
                        {row.name?.slice(0, 1)}
                      </Avatar>
                      <span className={styles.name}>{row.name}</span>
                    </Space>
                  )
                },
                {
                  title: '有效底牌手数',
                  dataIndex: 'handCount',
                  width: 140,
                  render: (n: number) => (
                    <span title="仅统计格式合法的两张手牌">
                      {n}
                      <span className={styles.handHint}> 手</span>
                    </span>
                  )
                },
                {
                  title: '审计结论',
                  dataIndex: 'auditStatus',
                  width: 220,
                  render: (s: HandPokeAuditListItem['auditStatus']) => {
                    const m = STATUS_META[s]
                    return <Tag color={m.color}>{m.label}</Tag>
                  }
                },
                {
                  title: 'χ²',
                  dataIndex: 'chiSquare',
                  width: 100,
                  render: (v: number | null) => formatChi(v)
                },
                {
                  title: 'p 值',
                  dataIndex: 'pValue',
                  width: 120,
                  render: (v: number | null) => formatPValue(v)
                },
                {
                  title: '操作',
                  key: 'op',
                  width: 100,
                  fixed: 'right',
                  render: (_, row) => (
                    <a
                      className={styles.detailLink}
                      href={`/match/hand-poke-audit/${row.userId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      详情
                    </a>
                  )
                }
              ]}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default HandPokeAuditListPage
