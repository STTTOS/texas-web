import { useRequest } from 'ahooks'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import {
  Card,
  ConfigProvider,
  DatePicker,
  Segmented,
  Skeleton,
  Space,
  Table,
  Typography,
  theme
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import shell from '@/page/announcement/shell.module.less'
import { fetchAssetUsageSummary } from '@/service/ops'
import type { AssetUsageSummaryRow } from '@/service/ops/types'

const { Text } = Typography

const AssetUsageOpsPage = () => {
  const [range, setRange] = useState(() => [
    dayjs().subtract(29, 'day').startOf('day'),
    dayjs().endOf('day')
  ] as [dayjs.Dayjs, dayjs.Dayjs])
  const [assetFilter, setAssetFilter] = useState<'all' | 'poker_back' | 'table_bg'>(
    'all'
  )

  const { data, loading, refresh } = useRequest(
    () =>
      fetchAssetUsageSummary({
        time: [range[0].toISOString(), range[1].toISOString()],
        assetType: assetFilter
      }),
    {
      refreshDeps: [range[0].valueOf(), range[1].valueOf(), assetFilter]
    }
  )

  const maxCount = useMemo(
    () => Math.max(1, ...(data?.rows.map((r) => r.count) ?? [1])),
    [data?.rows]
  )

  const columns: ColumnsType<AssetUsageSummaryRow> = useMemo(
    () => [
      {
        title: '类型',
        dataIndex: 'assetType',
        width: 110,
        render: (t: AssetUsageSummaryRow['assetType']) => (
          <TagLike type={t}>{t === 'poker_back' ? '卡背' : '牌桌'}</TagLike>
        )
      },
      {
        title: '资源 id',
        dataIndex: 'assetId',
        ellipsis: true,
        render: (id: string) => (
          <Text style={{ fontFamily: 'ui-monospace, monospace', color: '#fde68a' }}>
            {id}
          </Text>
        )
      },
      {
        title: '次数',
        dataIndex: 'count',
        width: 88,
        align: 'right',
        render: (n: number) => (
          <Text strong style={{ color: '#fef3c7' }}>
            {n}
          </Text>
        )
      },
      {
        title: '占比条',
        key: 'bar',
        width: 280,
        render: (_: unknown, row) => (
          <div
            style={{
              height: 10,
              borderRadius: 5,
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${Math.round((row.count / maxCount) * 100)}%`,
                height: '100%',
                borderRadius: 5,
                background:
                  row.assetType === 'poker_back'
                    ? 'linear-gradient(90deg,#fbbf24,#d97706)'
                    : 'linear-gradient(90deg,#34d399,#059669)',
                transition: 'width 0.35s ease'
              }}
            />
          </div>
        )
      }
    ],
    [maxCount]
  )

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#d4a574', borderRadius: 8 }
      }}
    >
      <div className={shell.page}>
        <HomeBgBalls count={18} />
        <div className={shell.inner}>
          <PageBrand subtitle="管理员 · 客户端资源热度" />

          <div className={shell.glass}>
            <div className={shell.toolbar}>
              <h1 className={shell.pageTitle}>藏品使用 · 频率透视</h1>
              <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                基于客户端上报的 asset_usage_event 聚合；区间与类型可筛。
              </Text>
            </div>

            <Space wrap style={{ marginBottom: 16 }}>
              <DatePicker.RangePicker
                value={range}
                onChange={(v) => {
                  if (v?.[0] && v[1]) setRange([v[0], v[1]])
                }}
                allowClear={false}
              />
              <Segmented
                options={[
                  { label: '全部', value: 'all' },
                  { label: '卡背', value: 'poker_back' },
                  { label: '牌桌', value: 'table_bg' }
                ]}
                value={assetFilter}
                onChange={(v) => setAssetFilter(v as typeof assetFilter)}
              />
              <a onClick={() => refresh()} style={{ color: '#fbbf24' }}>
                刷新
              </a>
            </Space>

            <Skeleton loading={loading} active paragraph={{ rows: 6 }}>
              <Card
                size="small"
                bordered={false}
                style={{
                  background: 'rgba(12,8,20,0.55)',
                  border: '1px solid rgba(212,165,116,0.25)'
                }}
              >
                <div style={{ marginBottom: 12, color: 'rgba(254,243,199,0.85)' }}>
                  区间内总事件数：<b>{data?.total ?? 0}</b> · 展示前 {data?.rows.length ?? 0}{' '}
                  条（按次数降序）
                </div>
                <Table<AssetUsageSummaryRow>
                  rowKey={(r) => `${r.assetType}:${r.assetId}`}
                  columns={columns}
                  dataSource={data?.rows ?? []}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Skeleton>
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

function TagLike({
  type,
  children
}: {
  type: AssetUsageSummaryRow['assetType']
  children: ReactNode
}) {
  const border =
    type === 'poker_back'
      ? 'rgba(251,191,36,0.45)'
      : 'rgba(52,211,153,0.45)'
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 999,
        border: `1px solid ${border}`,
        fontSize: 12,
        fontWeight: 600,
        color: '#fef3c7'
      }}
    >
      {children}
    </span>
  )
}

export default AssetUsageOpsPage
