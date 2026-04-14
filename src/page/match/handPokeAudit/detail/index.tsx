import type {
  HandPokeAuditDetail,
  HandPokeAuditStatus
} from '@/service/match/handPokeAuditTypes'

import { useRequest } from 'ahooks'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  Alert,
  Avatar,
  ConfigProvider,
  Descriptions,
  Tag,
  theme,
  Tooltip,
  Typography
} from 'antd'

import { fetchHandPokeAuditDetail } from '@/service/match/handPokeAudit'
import PokeDistributionGrid from '@/components/PokeDistributionGrid'
import shell from '@/page/announcement/shell.module.less'
import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import styles from './index.module.less'

const STAT_HELP_URL = 'https://www.wishufree.com/moment/share/345'
const PEARSON_HELP_URL = 'https://www.wishufree.com/moment/share/346'

const chiSquareTooltip = (
  <div className={styles.statTooltip}>
    <p>
      在「每张牌出现概率相同」假设下，对 52 种牌面频数做 Pearson χ² 拟合优度检验，自由度
      df=51。数值越大表示整体偏离均匀期望越明显，请勿当作 0～100 的「健康分」。
    </p>
    <a href={STAT_HELP_URL} target="_blank" rel="noreferrer">
      详细解读
    </a>
  </div>
)

const pValueTooltip = (
  <div className={styles.statTooltip}>
    <p>
      在均匀假设成立时，出现当前 χ² 或更极端结果的近似概率（上侧）。p
      越小越常作为拒绝均匀假设的依据，便于技术排查；不等于「作弊概率」。
    </p>
    <a href={STAT_HELP_URL} target="_blank" rel="noreferrer">
      详细解读
    </a>
  </div>
)

const pearsonResidualTooltip = (
  <div className={styles.statTooltip}>
    <p>
      <strong>Pearson 残差</strong>定义：r = (O − E) / √E。O 为某张牌观测张数，E
      为均匀假设下期望张数（与接口一致：E = cardCount / 52）。|r| 较小多为正常波动；|r| 较大表示相对期望偏多或偏少。
    </p>
    <p>
      色块颜色与整体检验同源，便于扫览 52 张分布；仅当样本充足、服务端开启热力标尺时，才宜按残差强弱解读色温。
    </p>
    <a href={PEARSON_HELP_URL} target="_blank" rel="noreferrer">
      详细解读
    </a>
  </div>
)

const STATUS_META: Record<
  HandPokeAuditStatus,
  { label: string; color: string; desc: string }
> = {
  insufficient_data: {
    label: '样本不足',
    color: 'default',
    desc: '有效手牌少于 150，未做 χ² 检验'
  },
  normal: {
    label: '未检出异常',
    color: 'success',
    desc: 'α=0.05 下未拒绝「52 种牌面均匀」假设'
  },
  abnormal: {
    label: '与均匀假设差异显著（待排查）',
    color: 'warning',
    desc: 'p < 0.05，建议结合发牌/日志排查（不等于已认定作弊）'
  }
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

const HandPokeAuditDetailPage = () => {
  const { userId } = useParams<{ userId: string }>()
  const uid = Number(userId)

  const validUid = Number.isFinite(uid) && uid > 0
  const { data, loading } = useRequest(
    () =>
      validUid
        ? fetchHandPokeAuditDetail(uid)
        : Promise.resolve(undefined as unknown as HandPokeAuditDetail),
    { refreshDeps: [uid, validUid] }
  )

  const titleText = useMemo(
    () => (data?.name ? `${data.name} · 手牌审计详情` : '手牌审计详情'),
    [data?.name]
  )

  useEffect(() => {
    document.title = titleText
  }, [titleText])

  const status = data?.auditStatus
  const meta = status ? STATUS_META[status] : null

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#fbbf24', borderRadius: 12 }
      }}
    >
      <div className={shell.page}>
        <HomeBgBalls count={22} />
        <div className={shell.inner}>
          <PageBrand subtitle={titleText} />

          <div className={shell.glass}>
            {!validUid ? (
              <Alert type="error" message="无效的用户 ID" showIcon />
            ) : loading || !data ? (
              <div className={styles.loading}>加载中…</div>
            ) : (
              <>
                <div
                  className={styles.statusHero}
                  data-status={data.auditStatus}
                >
                  <div className={styles.statusHeroMain}>
                    <Avatar
                      size={56}
                      src={data.avatarUrl || undefined}
                      className={styles.avatar}
                    >
                      {data.name?.slice(0, 1)}
                    </Avatar>
                    <div>
                      <Typography.Title level={3} className={styles.heroTitle}>
                        {data.name}
                        <span className={styles.heroSuffix}>手牌审计详情</span>
                      </Typography.Title>
                      <div className={styles.heroTags}>
                        {meta && (
                          <Tag color={meta.color} className={styles.statusTag}>
                            {meta.label}
                          </Tag>
                        )}
                        <span className={styles.heroHint}>{meta?.desc}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.statStrip}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>有效手数</span>
                      <strong>{data.handCount}</strong>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>统计牌张</span>
                      <strong>{data.cardCount}</strong>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabelRow}>
                        <span className={styles.statLabel}>χ²（df=51）</span>
                        <Tooltip title={chiSquareTooltip} placement="topLeft">
                          <span
                            className={styles.statHintIcon}
                            role="button"
                            tabIndex={0}
                            aria-label="χ² 指标说明"
                          >
                            <QuestionCircleOutlined />
                          </span>
                        </Tooltip>
                      </span>
                      <strong>{formatChi(data.chiSquare)}</strong>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabelRow}>
                        <span className={styles.statLabel}>p 值</span>
                        <Tooltip title={pValueTooltip} placement="topLeft">
                          <span
                            className={styles.statHintIcon}
                            role="button"
                            tabIndex={0}
                            aria-label="p 值说明"
                          >
                            <QuestionCircleOutlined />
                          </span>
                        </Tooltip>
                      </span>
                      <strong>{formatPValue(data.pValue)}</strong>
                    </div>
                  </div>
                </div>

                {!data.heatmapScaleEnabled && (
                  <Alert
                    className={styles.alert}
                    type="info"
                    showIcon
                    message="样本不足，整体检验与热力标尺未启用"
                    description="满 150 手有效底牌后将显示 χ²、p 值，并可按 Pearson 残差着色。"
                  />
                )}

                <Descriptions
                  className={styles.desc}
                  column={{ xs: 1, sm: 2 }}
                  size="small"
                  labelStyle={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  <Descriptions.Item label="用户 ID">
                    {data.userId}
                  </Descriptions.Item>
                  <Descriptions.Item label="头像 key">
                    {data.avatarKey}
                  </Descriptions.Item>
                  <Descriptions.Item label="期望每牌张数 E" span={2}>
                    {(data.cardCount / 52).toFixed(4)}（= 总数 / 52）
                  </Descriptions.Item>
                </Descriptions>

                <Typography.Title level={5} className={styles.blockTitle}>
                  52 牌面分布
                </Typography.Title>
                <div className={styles.legendRow}>
                  <span className={styles.legendLead}>Pearson 残差</span>
                  <Tooltip title={pearsonResidualTooltip} placement="topLeft">
                    <span
                      className={styles.statHintIcon}
                      role="button"
                      tabIndex={0}
                      aria-label="Pearson 残差说明"
                    >
                      <QuestionCircleOutlined />
                    </span>
                  </Tooltip>
                  <span className={styles.legendRest}>
                    悬停单格可查看次数与残差。
                  </span>
                </div>

                <PokeDistributionGrid
                  items={data.pokeDistribution}
                  heatmapScaleEnabled={data.heatmapScaleEnabled}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default HandPokeAuditDetailPage
