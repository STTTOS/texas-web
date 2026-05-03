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
import { Link } from 'react-router-dom'

import { fetchUserOpsList } from '@/service/ops'
import type { UserOpsRow } from '@/service/ops/types'
import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import shell from '@/page/announcement/shell.module.less'

const UserOpsListPage = () => {
  const [form] = Form.useForm()
  const { tableProps, search } = useAntdTable(fetchUserOpsList, {
    form,
    defaultPageSize: 20
  })

  const columns: TableColumnProps<UserOpsRow>[] = [
    { title: 'Id', dataIndex: 'id', width: 72 },
    { title: '昵称', dataIndex: 'name', width: 140, ellipsis: true },
    { title: '用户名', dataIndex: 'username', width: 120, ellipsis: true },
    {
      title: '余额',
      dataIndex: 'balance',
      width: 100,
      render: (v: number) => v?.toLocaleString?.() ?? v
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
                      form.resetFields()
                      search.submit()
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
              {...tableProps}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default UserOpsListPage
