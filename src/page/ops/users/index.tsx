import type { Params } from 'ahooks/lib/usePagination/types'

import { useAntdTable } from 'ahooks'
import {
  Button,
  ConfigProvider,
  Form,
  Input,
  Space,
  Switch,
  Table,
  Tag,
  theme,
  TableColumnProps
} from 'antd'
import type { SorterResult } from 'antd/es/table/interface'
import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { fetchUserOpsList } from '@/service/ops'
import type { UserOpsRow } from '@/service/ops/types'
import {
  matchRecordsColumnSortOrder,
  userOpsListSortParams
} from '@/utils/userOpsTableSort'
import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import shell from '@/page/announcement/shell.module.less'

type UserOpsTableParams = Params[0] & {
  sorter?: SorterResult<UserOpsRow> | SorterResult<UserOpsRow>[]
}

const UserOpsListPage = () => {
  const [form] = Form.useForm()
  const [matchRecordsSortOrder, setMatchRecordsSortOrder] = useState<
    ReturnType<typeof matchRecordsColumnSortOrder>
  >(undefined)

  const { tableProps, search } = useAntdTable(
    async (params: UserOpsTableParams) => {
      const q = form.getFieldValue('q') as string | undefined
      const includeDeleted = Boolean(form.getFieldValue('includeDeleted'))
      return fetchUserOpsList({
        current: params.current,
        pageSize: params.pageSize,
        ...(q != null && String(q).trim() !== '' ? { q: String(q).trim() } : {}),
        ...(includeDeleted ? { includeDeleted: true } : {}),
        ...userOpsListSortParams(params.sorter)
      })
    },
    {
      form,
      defaultPageSize: 20
    }
  )

  const { onChange: antdListOnChange, ...restTableProps } = tableProps
  const onTableChange = useCallback<
    NonNullable<typeof antdListOnChange>
  >(
    (pagination, filters, sorter, extra) => {
      setMatchRecordsSortOrder(matchRecordsColumnSortOrder(sorter))
      antdListOnChange?.(pagination, filters, sorter, extra)
    },
    [antdListOnChange]
  )

  const columns: TableColumnProps<UserOpsRow>[] = useMemo(
    () => [
      { title: 'Id', dataIndex: 'id', width: 72 },
      { title: '昵称', dataIndex: 'name', width: 140, ellipsis: true },
      { title: '用户名', dataIndex: 'username', width: 120, ellipsis: true },
      {
        title: '总对局',
        dataIndex: 'matchRecordsCount',
        width: 88,
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        sortOrder: matchRecordsSortOrder,
        render: (v: number) => (v != null ? v.toLocaleString() : '-')
      },
      {
        title: '管理员',
        dataIndex: 'isAdmin',
        width: 88,
        render: (v: boolean) => (v ? <Tag color="gold">是</Tag> : <Tag>否</Tag>)
      },
      {
        title: '状态',
        width: 88,
        render: (_, r) =>
          r.deletedAt ? <Tag color="red">已删</Tag> : <Tag color="green">正常</Tag>
      },
      { title: '注册', dataIndex: 'createdAt', width: 170 },
      {
        title: '操作',
        width: 100,
        render: (_, r) => <Link to={`/ops/users/${r.id}`}>详情</Link>
      }
    ],
    [matchRecordsSortOrder]
  )

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
          <PageBrand subtitle="管理员 · 用户只读" />

          <div className={shell.glass}>
            <div className={shell.toolbar}>
              <h1 className={shell.pageTitle}>用户运维</h1>
            </div>

            <Form
              form={form}
              layout="inline"
              style={{ marginBottom: 16, rowGap: 12 }}
              onFinish={search.submit}
            >
              <Form.Item name="q" label="昵称 / 用户名">
                <Input allowClear placeholder="模糊搜索" style={{ width: 200 }} />
              </Form.Item>
              <Form.Item name="includeDeleted" label="含已删除" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      setMatchRecordsSortOrder(undefined)
                      form.resetFields()
                      search.reset()
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>

            <Table<UserOpsRow>
              rowKey={(r) => String(r.id)}
              scroll={{ x: 960 }}
              {...restTableProps}
              onChange={onTableChange}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default UserOpsListPage
