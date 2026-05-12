import { useRequest } from 'ahooks'
import {
  ConfigProvider,
  Descriptions,
  Skeleton,
  Table,
  Tag,
  theme,
  TableColumnProps
} from 'antd'
import { Link, useParams } from 'react-router-dom'

import { fetchRoomOpsDetail } from '@/service/ops'
import type { RoomOpsDetailPlayerRow } from '@/service/ops/types'
import { formatTableType } from '@/utils/tableTypeLabel'
import { formatRoomGameStatus } from '@/utils/roomGameStatusLabel'
import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import UserAvatar from '@/components/UserAvatar'
import shell from '@/page/announcement/shell.module.less'

const winStyle = { color: '#fbbf24' as const }

function formatZhDuration(totalSec: number): string {
  if (!Number.isFinite(totalSec) || totalSec <= 0) return '0 秒'
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = Math.floor(totalSec % 60)
  if (h > 0) {
    return m > 0 ? `${h} 小时 ${m} 分` : `${h} 小时`
  }
  if (m > 0) {
    return s > 0 ? `${m} 分 ${s} 秒` : `${m} 分钟`
  }
  return `${s} 秒`
}

const RoomOpsSummaryPage = () => {
  const { roomId: roomIdParam } = useParams()
  const roomId = Number(roomIdParam)
  const { data, loading } = useRequest(() => fetchRoomOpsDetail(roomId), {
    ready: Number.isFinite(roomId) && roomId > 0,
    refreshDeps: [roomId]
  })

  const r = data?.room

  const columns: TableColumnProps<RoomOpsDetailPlayerRow>[] = [
    {
      title: '玩家',
      render(_, row) {
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <UserAvatar
              avatarUrl={row.avatarUrl}
              avatarKey={row.avatarKey}
              name={row.name}
            />
            <span>
              {row.name} (#{row.userId})
            </span>
          </span>
        )
      }
    },
    {
      title: '总输赢',
      dataIndex: 'totalWager',
      render: (v: number) => {
        if (v > 0) return <span style={winStyle}>+{v}</span>
        if (v < 0) return <span>{v}</span>
        return <span>0</span>
      }
    },
    {
      title: '总下注',
      dataIndex: 'totalBetAmount',
      render: (v: number) => (v != null ? v.toLocaleString() : '0')
    },
    {
      title: '总补码',
      dataIndex: 'totalTopUpAmount',
      render: (v: number) => (v != null ? v.toLocaleString() : '0')
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
          <PageBrand subtitle="管理员 · 房间对局汇总" />

          <div className={shell.glass}>
            <div className={shell.toolbar}>
              <h1 className={shell.pageTitle}>房间 #{roomIdParam}</h1>
              <Link to="/ops/room">返回列表</Link>
            </div>

            <Skeleton loading={loading} active paragraph={{ rows: 4 }}>
              {r && (
                <>
                  <Descriptions bordered size="small" column={2} style={{ marginBottom: 20 }}>
                    <Descriptions.Item label="邀请码">
                      {r.activeCode ?? '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="房间状态">
                      {r.deletedAt ? (
                        <Tag color="red">已解散 · {r.deletedAt}</Tag>
                      ) : (
                        <Tag color="green">有效</Tag>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="游戏状态">
                      <Tag color="blue">{formatRoomGameStatus(r.gameStatus)}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="桌型">{formatTableType(r.tableType)}</Descriptions.Item>
                    <Descriptions.Item label="大盲">{r.lowestBetAmount}</Descriptions.Item>
                    <Descriptions.Item label="初始筹码">{r.initialChips}</Descriptions.Item>
                    <Descriptions.Item label="是否公开">
                      {r.isPrivate ? '否' : '是'}
                    </Descriptions.Item>
                    <Descriptions.Item label="对局数">{r.matchCount}</Descriptions.Item>
                    <Descriptions.Item label="总游戏时长">
                      {formatZhDuration(r.totalGameDurationSec ?? 0)}
                    </Descriptions.Item>
                    <Descriptions.Item label="总下注">
                      {(r.totalRoomBetAmount ?? 0).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="当前成员数">{r.memberCount}</Descriptions.Item>
                    <Descriptions.Item label="历史成员数">{r.historicalMemberCount}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{r.createdAt}</Descriptions.Item>
                    <Descriptions.Item label="房主" span={2}>
                      {r.owner.name} (#{r.owner.id}) · {r.owner.username}
                    </Descriptions.Item>
                  </Descriptions>

                  <h3 style={{ color: 'rgba(255,255,255,0.92)', marginBottom: 10 }}>
                    玩家汇总
                  </h3>
                  <Table<RoomOpsDetailPlayerRow>
                    rowKey={(p) => String(p.userId)}
                    pagination={false}
                    columns={columns}
                    dataSource={data?.players ?? []}
                  />
                </>
              )}
            </Skeleton>
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default RoomOpsSummaryPage
