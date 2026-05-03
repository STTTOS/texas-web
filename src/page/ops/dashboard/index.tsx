import { useRequest } from 'ahooks'
import { Card, Col, ConfigProvider, Row, Skeleton, Statistic, theme } from 'antd'

import { fetchDashboardSummary } from '@/service/ops'
import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import shell from '@/page/announcement/shell.module.less'

const DashboardPage = () => {
  const { data, loading } = useRequest(fetchDashboardSummary)

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
          <PageBrand subtitle="管理员 · 近 7 日概览" />

          <div className={shell.glass}>
            <div className={shell.toolbar}>
              <h1 className={shell.pageTitle}>看板 / 日报</h1>
            </div>

            <Skeleton loading={loading} active paragraph={{ rows: 4 }}>
              <div style={{ marginBottom: 12, opacity: 0.85 }}>
                统计起点（近 7 日）: {data?.rangeStart ?? '-'}
              </div>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                  <Card
                    size="small"
                    bordered={false}
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <Statistic title="已结束对局（7 日）" value={data?.matchesEndedLast7d ?? 0} />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Card
                    size="small"
                    bordered={false}
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <Statistic title="引擎致命错误（7 日）" value={data?.engineFatalsLast7d ?? 0} />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Card
                    size="small"
                    bordered={false}
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <Statistic title="进行中房间（非等待）" value={data?.roomsInPlay ?? 0} />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Card
                    size="small"
                    bordered={false}
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <Statistic title="有效房间总数" value={data?.roomsTotal ?? 0} />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Card
                    size="small"
                    bordered={false}
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <Statistic title="今日已结束对局" value={data?.matchesEndedToday ?? 0} />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Card
                    size="small"
                    bordered={false}
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <Statistic title="今日引擎错误" value={data?.engineFatalsToday ?? 0} />
                  </Card>
                </Col>
              </Row>
            </Skeleton>
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default DashboardPage
