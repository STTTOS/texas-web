import { useMemo } from 'react'
import { useRequest } from 'ahooks'
import { useParams } from 'react-router'
import {
  Skeleton,
  Space,
  Table,
  theme,
  Tag,
  ConfigProvider,
  TableColumnProps
} from 'antd'
import {
  roleMap,
  stageMap,
  ActionTypeMap,
  formatterPoke,
  rankCategoryMap
} from 'texas-poker-core'

import { getMatchDuration } from '..'
import { getMatchStatusTag } from '@/service/match/matchStatus'
import styles from './index.module.less'
import { getMatchDetail } from '@/service/match'
import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import UserAvatar from '@/components/UserAvatar'
import shell from '@/page/announcement/shell.module.less'
import { formatTableType } from '@/utils/tableTypeLabel'
import { BetRecord, StageRecord, SettleRecord } from '@/service/match/types'

const MatchDetailPage = () => {
  const query = useParams()
  const id = Number(query.id)
  const { data, loading } = useRequest(getMatchDetail, {
    defaultParams: [{ id }]
  })

  const columnsOfSettles: TableColumnProps<SettleRecord>[] = [
    {
      title: '玩家',
      render(_, { name, avatarUrl, avatarKey, isFold, isAllIn }) {
        return (
          <Space size="small" align="center" wrap={false}>
            <UserAvatar avatarUrl={avatarUrl} avatarKey={avatarKey} name={name} />
            <span className={styles.playerName}>{name}</span>
            {isFold ? <Tag color="#a78bfa">弃牌</Tag> : null}
            {isAllIn ? <Tag color="#fbbf24">All In</Tag> : null}
          </Space>
        )
      }
    },
    {
      title: '位置',
      render(_, { role }) {
        return role != null ? roleMap.get(role) : '-'
      }
    },
    {
      title: '手牌',
      render(_, { handPokes }) {
        return formatterPoke(handPokes || [])
      }
    },
    {
      title: '牌型',
      render(_, { rankCategory }) {
        if (!rankCategory) return '-'
        return rankCategoryMap.get(rankCategory) || rankCategory
      }
    },
    {
      title: '牌力签名',
      width: 140,
      ellipsis: true,
      render(_, { rankSignature }) {
        return rankSignature ?? '-'
      }
    },
    {
      title: '输赢',
      render(_, { wager }) {
        if (!wager) return '0'
        if (wager > 0) return <span className={styles.win}>+{wager}</span>
        return <span>{wager}</span>
      }
    }
  ]
  const columnsOfRecords: TableColumnProps<BetRecord>[] = [
    {
      title: '玩家',
      render(_, { name, avatarUrl, avatarKey }) {
        return (
          <div>
            <Space>
              <UserAvatar avatarUrl={avatarUrl} avatarKey={avatarKey} name={name} />
              <span className={styles.playerName}>{name}</span>
            </Space>
          </div>
        )
      }
    },
    {
      title: '行为',
      render(_, { actionType, amount }) {
        return (
          <span>
            <span className={styles.actionType}>
              {ActionTypeMap.get(actionType)}
            </span>
            {!!amount && <span className={styles.actionAmount}>{amount}</span>}
          </span>
        )
      }
    },
    {
      title: '阶段',
      render(_, { stage }) {
        return stageMap.get(stage)
      }
    },
    {
      title: '距离比赛开始时间(秒)',
      render(_, { createdAt }) {
        return getMatchDuration(data?.startedAt, createdAt, false)
      }
    }
  ]
  const columnsOfStage: TableColumnProps<StageRecord>[] = [
    {
      title: '阶段',
      render(_, { stage }) {
        return stageMap.get(stage)
      }
    },
    {
      title: '持续时长',
      render(_, { startAt, endAt }) {
        return getMatchDuration(startAt, endAt)
      }
    }
  ]
  const duration = useMemo(() => {
    return getMatchDuration(data?.startedAt, data?.endedAt)
  }, [data?.endedAt, data?.startedAt])

  const lowestBetAmount = useMemo(() => {
    if (!data?.lowestBetAmount) return null
    return (
      <span className={styles.win}>
        {data?.lowestBetAmount / 2}/{data.lowestBetAmount}
        <span className={styles.bb}>BB</span>
      </span>
    )
  }, [data?.lowestBetAmount])

  const summaryItems = [
    { label: '开始时间', value: data?.startedAt || '-' },
    { label: '结束时间', value: data?.endedAt || '-' },
    {
      label: '起始筹码',
      value:
        data?.initialChips != null ? data.initialChips.toLocaleString() : '-'
    },
    {
      label: '桌型',
      value: formatTableType(data?.tableType)
    },
    { label: '对局时长', value: duration || '-' },
    {
      label: '结束阶段',
      value:
        data?.boardThroughStage != null
          ? stageMap.get(data.boardThroughStage)
          : '-'
    },
    {
      label: '牌力签名(桌)',
      value: data?.bestRankSignature ?? '-'
    },
    { label: '总下注', value: data?.totalBetAmount?.toLocaleString() || '-' },
    { label: '人数', value: data?.settleRecords?.length ?? '-' },
    { label: '盲注', value: lowestBetAmount || '-' },
    { label: '底牌', value: formatterPoke(data?.commonPokes || []) || '-' },
    {
      label: '最大牌型',
      value:
        (data?.bestRankCategory &&
          rankCategoryMap.get(data.bestRankCategory)) ||
        '-'
    }
  ]

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#fbbf24', borderRadius: 10 }
      }}
    >
      <div className={`${shell.page} ${styles.pageFull}`}>
        <HomeBgBalls count={24} />
        <div className={`${shell.inner} ${styles.innerFull}`}>
          <PageBrand subtitle="对局信息 · 详细回放" />

          <div className={`${shell.glass} ${styles.detailGlass}`}>
            <Skeleton
              active
              loading={loading}
              paragraph={{ rows: 10 }}
              className={styles.skeletonFull}
            >
              <div className={shell.toolbar}>
                <h1 className={shell.pageTitle}>对局信息</h1>
                <div className={styles.statusWrap}>{getMatchStatusTag(data)}</div>
              </div>

              <div className={styles.summaryGrid}>
                {summaryItems.map((item) => (
                  <div className={styles.summaryItem} key={item.label}>
                    <div className={styles.summaryLabel}>{item.label}</div>
                    <div className={styles.summaryValue}>{item.value}</div>
                  </div>
                ))}
              </div>

              <h3 className={styles.sectionTitle}>结算记录</h3>
              <Table
                className={styles.table}
                pagination={false}
                columns={columnsOfSettles}
                dataSource={data?.settleRecords}
                rowKey={(r) => String(r.id)}
                scroll={{ x: 'max-content' }}
              />

              <h3 className={styles.sectionTitle}>阶段记录</h3>
              <Table
                className={styles.table}
                pagination={false}
                columns={columnsOfStage}
                dataSource={data?.stageRecords}
                rowKey={(r) => `${r.stage}-${r.startAt}`}
              />

              <h3 className={styles.sectionTitle}>行为记录</h3>
              <Table
                className={styles.table}
                columns={columnsOfRecords}
                dataSource={data?.betRecords}
                pagination={false}
                rowKey={(r) => String(r.id)}
                scroll={{ y: 460 }}
              />
            </Skeleton>
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default MatchDetailPage
