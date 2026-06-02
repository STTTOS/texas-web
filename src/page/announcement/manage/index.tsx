import type {
  Announcement,
  AnnouncementType,
  AnnouncementStatus
} from '@/service/announcement/types'
import {
  compareSemverCore,
  formatClientVersionRange,
  isSemverCore
} from '@/service/announcement/types'

import dayjs from 'dayjs'
import { useRequest } from 'ahooks'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Dayjs } from 'dayjs'
import {
  Tag,
  Form,
  Input,
  Modal,
  Space,
  Table,
  theme,
  Button,
  Select,
  message,
  Checkbox,
  DatePicker,
  Popconfirm,
  InputNumber,
  ConfigProvider
} from 'antd'

import styles from './index.module.less'
import shell from '../shell.module.less'
import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import AnnouncementCard from '../../../components/AnnouncementCard'
import {
  changeAnnouncementStatus,
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
  fetchAnnouncementList,
  fetchAnnouncementDetail
} from '@/service/announcement'

const TYPE_LABEL: Record<AnnouncementType, string> = {
  activity: '活动',
  update: '更新',
  maintenance: '维护',
  notice: '通知'
}

const TYPE_OPTIONS = (Object.keys(TYPE_LABEL) as AnnouncementType[]).map(
  (v) => ({
    value: v,
    label: TYPE_LABEL[v]
  })
)

const STATUS_OPTIONS: { value: AnnouncementStatus; label: string }[] = [
  { value: 'published', label: '上架' },
  { value: 'disabled', label: '下架' }
]

const buildRange = (max: number) => Array.from({ length: max }, (_, i) => i)

const validateSemverField = (_: unknown, value: unknown) => {
  if (value == null || String(value).trim() === '') return Promise.resolve()
  if (!isSemverCore(String(value))) {
    return Promise.reject(new Error('须为 x.y.z 格式，如 1.0.0'))
  }
  return Promise.resolve()
}

const validateVersionRangeOrder = (getFieldValue: (name: string) => unknown) => {
  return (_: unknown, value: unknown) => {
    const min = getFieldValue('minClientVersion')
    const max = value
    if (
      min == null ||
      String(min).trim() === '' ||
      max == null ||
      String(max).trim() === ''
    ) {
      return Promise.resolve()
    }
    const cmp = compareSemverCore(String(min), String(max))
    if (cmp == null) {
      return Promise.reject(new Error('版本格式异常'))
    }
    if (cmp > 0) {
      return Promise.reject(new Error('最低版本不能高于最高版本'))
    }
    return Promise.resolve()
  }
}

const ManageAnnouncementPage = () => {
  const nav = useNavigate()
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailData, setDetailData] = useState<Announcement | null>(null)
  const [query, setQuery] = useState<{
    type?: AnnouncementType
    title?: string
    summary?: string
    status?: AnnouncementStatus
  }>({})

  const { data, loading, refresh } = useRequest(
    () => fetchAnnouncementList(query),
    {
      refreshDeps: [query]
    }
  )

  const list = data?.list ?? []

  useEffect(() => {
    if (!open) return
    if (editingId == null) {
      form.resetFields()
      form.setFieldsValue({
        priority: 0,
        longTerm: false,
        allVersions: true
      })
      return
    }
    let cancelled = false
    fetchAnnouncementDetail(editingId)
      .then((d) => {
        if (cancelled || !d) return
        form.setFieldsValue({
          type: d.type,
          title: d.title,
          summary: d.summary,
          content: d.content,
          actionText: d.actionText,
          actionUrl: d.actionUrl,
          priority: d.priority ?? 0,
          publishAt: d.publishAt ? dayjs(d.publishAt) : undefined,
          expireAt: d.expireAt ? dayjs(d.expireAt) : undefined,
          longTerm: !d.expireAt,
          allVersions: !d.minClientVersion && !d.maxClientVersion,
          minClientVersion: d.minClientVersion ?? undefined,
          maxClientVersion: d.maxClientVersion ?? undefined
        })
      })
      .catch(() => {
        message.error('加载公告详情失败')
      })
    return () => {
      cancelled = true
    }
  }, [open, editingId, form])

  const buildPayload = (values: Record<string, unknown>) => {
    const {
      longTerm,
      expireAt,
      priority,
      allVersions,
      minClientVersion,
      maxClientVersion,
      ...rest
    } = values
    const minText =
      typeof minClientVersion === 'string' ? minClientVersion.trim() : ''
    const maxText =
      typeof maxClientVersion === 'string' ? maxClientVersion.trim() : ''
    return {
      ...rest,
      priority: priority ?? 0,
      minClientVersion: allVersions ? null : minText || null,
      maxClientVersion: allVersions ? null : maxText || null,
      ...(longTerm ? {} : expireAt ? { expireAt } : {})
    }
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields()
      const payload = buildPayload(values)
      if (editingId != null) {
        await updateAnnouncement({ id: editingId, ...payload })
        message.success('已保存')
        setOpen(false)
        setEditingId(null)
        refresh()
      } else {
        await createAnnouncement(payload)
        message.success('已创建')
        setOpen(false)
        setEditingId(null)
        form.resetFields()
        refresh()
      }
    } catch {
      // 校验失败或接口已由 betterRequest 提示
    }
  }

  const setStatus = async (row: Announcement, status: AnnouncementStatus) => {
    await changeAnnouncementStatus(row.id, status)
    message.success(status === 'published' ? '已上架' : '已下架')
    refresh()
  }

  const onDelete = async (row: Announcement) => {
    await deleteAnnouncement(row.id)
    message.success('已删除')
    refresh()
  }

  const onViewDetail = async (row: Announcement) => {
    setDetailOpen(true)
    setDetailLoading(true)
    try {
      const data = await fetchAnnouncementDetail(row.id)
      setDetailData(data)
    } catch {
      setDetailData(row)
    } finally {
      setDetailLoading(false)
    }
  }

  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      width: 96,
      render: (t: AnnouncementType) => TYPE_LABEL[t] ?? t
    },
    { title: '标题', dataIndex: 'title', ellipsis: true, width: 160 },
    {
      title: '摘要',
      dataIndex: 'summary',
      width: 100
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (s: AnnouncementStatus) =>
        s === 'published' ? <Tag color="gold">上架</Tag> : <Tag>下架</Tag>
    },
    { title: '优先级', dataIndex: 'priority', width: 88 },
    {
      title: '版本范围',
      key: 'clientVersion',
      width: 140,
      render: (_: unknown, row: Announcement) => formatClientVersionRange(row)
    },
    {
      title: '发布时间',
      dataIndex: 'publishAt',
      width: 168,
      render: (t: string) => (t ? dayjs(t).format('YYYY-MM-DD HH:mm') : '—')
    },
    {
      title: '过期',
      dataIndex: 'expireAt',
      width: 168,
      render: (t: string) => (
        <span style={{ whiteSpace: 'nowrap' }}>
          {t ? dayjs(t).format('YYYY-MM-DD HH:mm') : '长期'}
        </span>
      )
    },
    {
      title: '操作',
      key: 'op',
      width: 280,
      render: (_: unknown, row: Announcement) => (
        <Space size="small" wrap>
          <Button type="link" size="small" onClick={() => onViewDetail(row)}>
            详情
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setEditingId(row.id)
              setOpen(true)
            }}
          >
            编辑
          </Button>
          {row.status !== 'published' ? (
            <Button
              type="link"
              size="small"
              onClick={() => setStatus(row, 'published')}
            >
              上架
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              onClick={() => setStatus(row, 'disabled')}
            >
              下架
            </Button>
          )}
          <Popconfirm title="确认删除该公告？" onConfirm={() => onDelete(row)}>
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const onSearch = async () => {
    const values = await searchForm.validateFields()
    setQuery({
      type: values.type || undefined,
      title: values.title || undefined,
      summary: values.summary || undefined,
      status: values.status || undefined
    })
  }

  const onResetSearch = () => {
    searchForm.resetFields()
    setQuery({})
  }

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
          <PageBrand subtitle="公告管理 · 后台维护" />

          <div className={shell.glass}>
            <div className={shell.toolbar}>
              <h1 className={shell.pageTitle}>公告列表</h1>
              <Space wrap>
                <Button
                  className={styles.btnGoldGhost}
                  onClick={() => nav('/announcement/app-display')}
                >
                  App端展示公告
                </Button>
                <Button
                  type="primary"
                  className={styles.btnGold}
                  onClick={() => {
                    setEditingId(null)
                    setOpen(true)
                  }}
                >
                  新建公告
                </Button>
              </Space>
            </div>

            <Form
              form={searchForm}
              layout="inline"
              className={styles.searchRow}
              onFinish={onSearch}
            >
              <Form.Item name="type">
                <Select
                  allowClear
                  options={TYPE_OPTIONS}
                  placeholder="类型"
                  style={{ width: 120 }}
                />
              </Form.Item>
              <Form.Item name="title">
                <Input placeholder="标题" style={{ width: 180 }} allowClear />
              </Form.Item>
              <Form.Item name="summary">
                <Input placeholder="摘要" style={{ width: 200 }} allowClear />
              </Form.Item>
              <Form.Item name="status">
                <Select
                  allowClear
                  options={STATUS_OPTIONS}
                  placeholder="状态"
                  style={{ width: 120 }}
                />
              </Form.Item>
              <Form.Item className={styles.searchActions}>
                <Space>
                  <Button
                    type="primary"
                    className={styles.btnGold}
                    htmlType="submit"
                  >
                    查询
                  </Button>
                  <Button
                    className={styles.btnGoldGhost}
                    onClick={onResetSearch}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>

            <Table<Announcement>
              rowKey={(r) => String(r.id)}
              loading={loading}
              columns={columns}
              dataSource={list}
              scroll={{ x: 980 }}
              pagination={{ pageSize: 10, showSizeChanger: true }}
            />
          </div>
        </div>

        <Modal
          title={editingId != null ? '编辑公告' : '新建公告'}
          open={open}
          onCancel={() => {
            setOpen(false)
            setEditingId(null)
            form.resetFields()
          }}
          onOk={onSubmit}
          width={720}
          destroyOnClose
          okText="保存"
          cancelText="取消"
          okButtonProps={{ className: styles.btnGold }}
        >
          <Form
            form={form}
            layout="vertical"
            className={styles.modalForm}
            initialValues={{ priority: 0, longTerm: false, allVersions: true }}
            onValuesChange={(changedValues) => {
              if ('publishAt' in changedValues) {
                form.setFieldValue('expireAt', undefined)
              }
            }}
          >
            <Form.Item
              name="type"
              label="类型"
              rules={[{ required: true, message: '请选择类型' }]}
            >
              <Select
                options={TYPE_OPTIONS}
                placeholder="请选择类型"
                disabled={editingId != null}
              />
            </Form.Item>
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input placeholder="公告标题" />
            </Form.Item>
            <Form.Item
              name="summary"
              label="摘要"
              rules={[{ required: true, message: '请输入摘要' }]}
            >
              <Input.TextArea rows={2} placeholder="摘要" />
            </Form.Item>
            <Form.Item
              name="content"
              label="正文"
              rules={[{ required: true, message: '请输入正文' }]}
            >
              <Input.TextArea rows={6} placeholder="正文内容" />
            </Form.Item>
            <Form.Item name="actionText" label="按钮文案（可选）">
              <Input placeholder="actionText" />
            </Form.Item>
            <Form.Item name="actionUrl" label="跳转链接（可选）">
              <Input placeholder="actionUrl" />
            </Form.Item>
            <Form.Item name="priority" label="优先级">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <div className={styles.timeRow}>
              <Form.Item
                className={styles.timeCol}
                name="publishAt"
                label="发布时间"
                rules={[{ required: true, message: '请选择发布时间' }]}
              >
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(p, c) =>
                  p.longTerm !== c.longTerm || p.publishAt !== c.publishAt
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue('longTerm') ? null : (
                    <Form.Item
                      className={styles.timeCol}
                      name="expireAt"
                      label="过期时间（可选）"
                    >
                      <DatePicker
                        showTime
                        style={{ width: '100%' }}
                        disabledDate={(current) => {
                          const publishAt = getFieldValue('publishAt') as Dayjs | undefined
                          if (!publishAt || !current) return false
                          return current.isBefore(publishAt.startOf('day'))
                        }}
                        disabledTime={(current) => {
                          const publishAt = getFieldValue('publishAt') as Dayjs | undefined
                          if (!publishAt || !current || !current.isSame(publishAt, 'day')) {
                            return {}
                          }
                          const publishHour = publishAt.hour()
                          const publishMinute = publishAt.minute()
                          const publishSecond = publishAt.second()
                          return {
                            disabledHours: () => buildRange(publishHour),
                            disabledMinutes: (selectedHour: number) =>
                              selectedHour === publishHour ? buildRange(publishMinute) : [],
                            disabledSeconds: (
                              selectedHour: number,
                              selectedMinute: number
                            ) =>
                              selectedHour === publishHour &&
                              selectedMinute === publishMinute
                                ? buildRange(publishSecond)
                                : []
                          }
                        }}
                      />
                    </Form.Item>
                  )
                }
              </Form.Item>
            </div>
            <Form.Item name="longTerm" valuePropName="checked">
              <Checkbox>长期有效（不传过期时间）</Checkbox>
            </Form.Item>
            <Form.Item name="allVersions" valuePropName="checked">
              <Checkbox>全部版本（不限客户端版本）</Checkbox>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(p, c) => p.allVersions !== c.allVersions}
            >
              {({ getFieldValue }) =>
                getFieldValue('allVersions') ? null : (
                  <div className={styles.timeRow}>
                    <Form.Item
                      className={styles.timeCol}
                      name="minClientVersion"
                      label="最低版本（可选）"
                      rules={[{ validator: validateSemverField }]}
                    >
                      <Input placeholder="如 1.0.1，留空表示不限" />
                    </Form.Item>
                    <Form.Item
                      className={styles.timeCol}
                      name="maxClientVersion"
                      label="最高版本（可选）"
                      dependencies={['minClientVersion']}
                      rules={[
                        { validator: validateSemverField },
                        { validator: validateVersionRangeOrder(getFieldValue) }
                      ]}
                    >
                      <Input placeholder="如 1.0.2，留空表示不限" />
                    </Form.Item>
                  </div>
                )
              }
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="公告详情"
          open={detailOpen}
          onCancel={() => {
            setDetailOpen(false)
            setDetailData(null)
          }}
          footer={null}
          width={820}
        >
          <div className={styles.detailBody}>
            {detailLoading ? (
              <div className={styles.detailLoading}>加载中...</div>
            ) : detailData ? (
              <AnnouncementCard item={detailData} />
            ) : (
              <div className={styles.detailLoading}>暂无详情</div>
            )}
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  )
}

export default ManageAnnouncementPage
