import { useRequest } from 'ahooks'
import {
  Card,
  Col,
  ConfigProvider,
  Descriptions,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  theme
} from 'antd'
import { Link, useParams } from 'react-router-dom'

import { fetchUserOpsDetail } from '@/service/ops'
import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import shell from '@/page/announcement/shell.module.less'

const UserOpsDetailPage = () => {
  const { id } = useParams()
  const userId = Number(id)
  const { data, loading } = useRequest(() => fetchUserOpsDetail(userId), {
    ready: Number.isFinite(userId) && userId > 0,
    refreshDeps: [userId]
  })

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
          <PageBrand subtitle="管理员 · 用户只读详情" />

          <div className={shell.glass}>
            <div className={shell.toolbar}>
              <h1 className={shell.pageTitle}>用户 #{id}</h1>
              <Link to="/ops/users">返回列表</Link>
            </div>

            <Skeleton loading={loading} active paragraph={{ rows: 6 }}>
              {data && (
                <>
                  <Descriptions bordered size="small" column={2} style={{ marginBottom: 20 }}>
                    <Descriptions.Item label="昵称">{data.name}</Descriptions.Item>
                    <Descriptions.Item label="用户名">{data.username}</Descriptions.Item>
                    <Descriptions.Item label="余额">{data.balance}</Descriptions.Item>
                    <Descriptions.Item label="管理员">
                      {data.isAdmin ? <Tag color="gold">是</Tag> : '否'}
                    </Descriptions.Item>
                    <Descriptions.Item label="微信 Id">
                      {data.weChatId ?? '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="状态">
                      {data.deletedAt ? (
                        <Tag color="red">已删除 · {data.deletedAt}</Tag>
                      ) : (
                        <Tag color="green">正常</Tag>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="注册时间">{data.createdAt}</Descriptions.Item>
                    <Descriptions.Item label="更新时间">{data.updatedAt}</Descriptions.Item>
                    <Descriptions.Item label="头像 URL" span={2}>
                      {data.avatarUrl ?? '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="avatarKey">{data.avatarKey}</Descriptions.Item>
                    <Descriptions.Item label="牌桌背景">
                      {data.pokerBackgroundKey ?? '-'}
                    </Descriptions.Item>
                  </Descriptions>

                  <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                    <Col xs={12} sm={8} lg={4}>
                      <Card size="small" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <Statistic title="对局记录行" value={data._count.matchRecords} />
                      </Card>
                    </Col>
                    <Col xs={12} sm={8} lg={4}>
                      <Card size="small" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <Statistic title="拥有房间" value={data._count.Room} />
                      </Card>
                    </Col>
                    <Col xs={12} sm={8} lg={4}>
                      <Card size="small" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <Statistic title="房间成员关系" value={data._count.roomMembers} />
                      </Card>
                    </Col>
                    <Col xs={12} sm={8} lg={4}>
                      <Card size="small" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <Statistic title="补码记录" value={data._count.roomChipTopUps} />
                      </Card>
                    </Col>
                    <Col xs={12} sm={8} lg={4}>
                      <Card size="small" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <Statistic title="房间统计行" value={data._count.userRoomStats} />
                      </Card>
                    </Col>
                  </Row>

                  <h3 style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>UserSettings</h3>
                  {data.settings ? (
                    <Descriptions bordered size="small" column={2}>
                      <Descriptions.Item label="展示历史战绩">
                        {data.settings.showHistoryRecords ? '是' : '否'}
                      </Descriptions.Item>
                      <Descriptions.Item label="展示战绩总览">
                        {data.settings.showRecordOverview ? '是' : '否'}
                      </Descriptions.Item>
                      <Descriptions.Item label="离线自动跟注">
                        {data.settings.autoCallOnOffline ? '是' : '否'}
                      </Descriptions.Item>
                      <Descriptions.Item label="设置更新时间">
                        {data.settings.updatedAt}
                      </Descriptions.Item>
                    </Descriptions>
                  ) : (
                    <Space style={{ opacity: 0.75 }}>暂无 UserSettings 行</Space>
                  )}
                </>
              )}
            </Skeleton>
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default UserOpsDetailPage
