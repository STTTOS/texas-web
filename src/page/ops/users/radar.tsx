import { useRequest } from 'ahooks'
import {
  Alert,
  Card,
  Col,
  ConfigProvider,
  Descriptions,
  Drawer,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  theme,
  Typography
} from 'antd'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import shell from '@/page/announcement/shell.module.less'
import { fetchUserOpsRadar } from '@/service/ops'
import type {
  StyleRadarAxis,
  StyleRadarAxisKey,
  StyleRadarTag,
  StyleRadarTagTone
} from '@/service/ops/types'

import StyleRadarChart, { formatRadarAxisValue } from './StyleRadarChart'

const { Text } = Typography

const TAG_COLOR: Record<StyleRadarTagTone, string> = {
  sample: 'default',
  style: 'blue',
  leak: 'volcano'
}

const AXIS_HELP: Record<StyleRadarAxisKey, string> = {
  skill:
    '技术分：L1 去跑马战绩 + L2 入池选牌合规（仅统计有洞牌的入池手，limp 轻罚）+ L3 红/蓝线 + L4 极端打法漏洞（权重 40/30/22/8）。',
  vpip: '翻前主动入池比例（跟注/加注等，不含被迫盲注）。越高越松。',
  pfr: '翻前加注比例。与 VPIP 差距反映 limp / cold-call 习惯。',
  threeBet: '面对 open 后再加注的频率。样本需更多才稳定。',
  afq: '翻后主动进攻动作占比（bet+raise+allIn）/（同集合+call+check）；分母不含 fold，对齐常见 PT。',
  cbet: '作为翻前进攻方，在翻牌继续下注的频率。',
  wtsd: '看过翻牌后进入摊牌的比例。过高且胜率差常见于「爱跟到底」。',
  wsd: '摊牌时的胜率。与 WTSD 合看可判断跟注质量。'
}

const sampleTag = (s: string) => {
  if (s === 'insufficient') return <Tag color="default">样本不足</Tag>
  if (s === 'reference') return <Tag color="gold">参考</Tag>
  return <Tag color="green">可信</Tag>
}

const renderStyleTags = (tags: StyleRadarTag[] | undefined) => {
  if (!tags?.length) return <Text type="secondary">—</Text>
  return (
    <Space size={[8, 8]} wrap>
      {tags.map((t) => (
        <Tag key={t.key} color={TAG_COLOR[t.tone]} title={t.hint}>
          {t.label}
        </Tag>
      ))}
    </Space>
  )
}

const UserOpsRadarPage = () => {
  const { id } = useParams()
  const userId = Number(id)
  const [activeKey, setActiveKey] = useState<StyleRadarAxisKey | null>(null)

  const { data, loading, error } = useRequest(() => fetchUserOpsRadar(userId), {
    ready: Number.isFinite(userId) && userId > 0,
    refreshDeps: [userId]
  })

  const activeAxis: StyleRadarAxis | undefined = useMemo(
    () => data?.axes.find((a) => a.key === activeKey),
    [data, activeKey]
  )

  const dimmed = data?.sampleStatus === 'insufficient'

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
          <PageBrand subtitle="管理员 · 牌风数据雷达" />

          <div className={shell.glass}>
            <div className={shell.toolbar}>
              <h1 className={shell.pageTitle}>数据雷达 · 用户 #{id}</h1>
              <Space>
                <Link to={`/ops/users/${id}`}>详情</Link>
                <Link to="/ops/users">返回列表</Link>
              </Space>
            </div>

            <Skeleton loading={loading} active paragraph={{ rows: 8 }}>
              {error && (
                <Alert type="error" showIcon message="加载失败" style={{ marginBottom: 16 }} />
              )}
              {data && (
                <>
                  <Descriptions
                    bordered
                    size="small"
                    column={2}
                    style={{ marginBottom: 16 }}
                  >
                    <Descriptions.Item label="昵称">{data.name}</Descriptions.Item>
                    <Descriptions.Item label="用户名">{data.username}</Descriptions.Item>
                    <Descriptions.Item label="样本手数">{data.hands}</Descriptions.Item>
                    <Descriptions.Item label="样本状态">
                      {sampleTag(data.sampleStatus)}
                    </Descriptions.Item>
                    <Descriptions.Item label="口径版本">
                      v{data.statsVersion}
                    </Descriptions.Item>
                    <Descriptions.Item label="更新时间">
                      {data.updatedAt ?? '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="风格标签" span={2}>
                      {renderStyleTags(data.tags)}
                    </Descriptions.Item>
                  </Descriptions>
                  {!!data.tags?.some((t) => t.tone === 'leak') && (
                    <Alert
                      type="info"
                      showIcon
                      style={{ marginBottom: 16 }}
                      message="橙色为打法漏洞类标签；悬停可看判定说明。标签由当前物化轴实时计算，不落库。"
                    />
                  )}

                  {dimmed && (
                    <Alert
                      type="warning"
                      showIcon
                      style={{ marginBottom: 16 }}
                      message="手数不足 50，雷达仅供参考，轴值可能灰显。"
                    />
                  )}

                  <Row gutter={[16, 16]}>
                    <Col xs={24} lg={16}>
                      <Card
                        size="small"
                        title="八轴牌风"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                      >
                        <StyleRadarChart
                          axes={data.axes}
                          activeKey={activeKey}
                          onSelect={(k) => setActiveKey(k as StyleRadarAxisKey)}
                          dimmed={dimmed}
                        />
                        <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>
                          青绿 = 本玩家 · 红虚线 = 全站机会加权均值 · 点击轴查看说明
                        </Text>
                      </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                      <Card
                        size="small"
                        title="技术分构成"
                        style={{ background: 'rgba(255,255,255,0.04)', marginBottom: 16 }}
                      >
                        <Statistic
                          title="技术分"
                          value={data.skill.score ?? '—'}
                          precision={data.skill.score == null ? undefined : 1}
                        />
                        <div style={{ marginTop: 12 }}>
                          {(
                            [
                              ['L1 去跑马', data.skill.l1, 40],
                              ['L2 选牌', data.skill.l2, 30],
                              ['L3 红蓝线', data.skill.l3, 22],
                              ['L4 打法漏洞', data.skill.l4, 8]
                            ] as const
                          ).map(([label, val, w]) => (
                            <div key={label} style={{ marginBottom: 8 }}>
                              <Text type="secondary">
                                {label} · 权重 {w}%
                              </Text>
                              <Progress
                                percent={val ?? 0}
                                showInfo
                                format={() =>
                                  val == null ? '—' : val.toFixed(1)
                                }
                                strokeColor={{ from: '#2dd4bf', to: '#e7c56a' }}
                              />
                            </div>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </>
              )}
            </Skeleton>
          </div>
        </div>
      </div>

      <Drawer
        title={activeAxis?.label ?? '轴说明'}
        open={!!activeAxis}
        onClose={() => setActiveKey(null)}
        width={360}
      >
        {activeAxis && (
          <>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="本玩家">
                {formatRadarAxisValue(activeAxis, activeAxis.value)}
              </Descriptions.Item>
              <Descriptions.Item label="全站均值">
                {formatRadarAxisValue(activeAxis, activeAxis.avg)}
              </Descriptions.Item>
            </Descriptions>
            <Text style={{ display: 'block', marginTop: 16 }}>
              {AXIS_HELP[activeAxis.key]}
            </Text>
          </>
        )}
      </Drawer>
    </ConfigProvider>
  )
}

export default UserOpsRadarPage
