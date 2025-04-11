import { useMemo } from 'react'
import { useRequest } from 'ahooks'
import { useParams } from 'react-router'
import {
  roleMap,
  stageMap,
  actionMap,
  handPokeMap,
  formatterPoke
} from 'texas-poker-core'
import {
  Spin,
  Space,
  Table,
  Avatar,
  Checkbox,
  Descriptions,
  TableColumnProps
} from 'antd'

import { getMatchDuration } from '..'
import { getMatchTag } from '../index'
import { getMatchDetail } from '@/service/analysis'
import { PlayerHand, RecordItem } from '@/service/analysis/types'

const AnalysisDetail = () => {
  const query = useParams()
  const id = query.id as unknown as number
  const { data, loading } = useRequest(getMatchDetail, {
    defaultParams: [{ id }]
  })

  const columnsOfWinners: TableColumnProps<PlayerHand>[] = [
    {
      title: '玩家',
      render(_, { player }) {
        return (
          <div>
            <Space>
              <Avatar src={player.avatar} />
              <span>{player.name}</span>
            </Space>
          </div>
        )
      }
    },
    {
      title: '位置',
      render(_, { role }) {
        return roleMap.get(role)
      }
    },
    {
      title: '手牌',
      render(_, { hand }) {
        return formatterPoke(hand)
      }
    },
    {
      title: '胜利',
      render(_, { win }) {
        return win && <Checkbox checked />
      }
    }
  ]
  const columnsOfRecords: TableColumnProps<RecordItem>[] = [
    {
      title: '玩家',
      render(_, { player }) {
        return (
          <div>
            <Space>
              <Avatar src={player.avatar} />
              <span>{player.name}</span>
            </Space>
          </div>
        )
      }
    },
    {
      title: '行为',
      render(_, { action, amount }) {
        return (
          <span>
            <span style={{ fontSize: 16, fontWeight: 'bold' }}>
              {actionMap.get(action)}
            </span>
            {amount && (
              <span style={{ marginLeft: 6, color: 'red' }}>{amount}</span>
            )}
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
  const duration = useMemo(() => {
    return getMatchDuration(data?.startedAt, data?.endedAt)
  }, [data?.endedAt, data?.startedAt])

  const lowestBetAmount = useMemo(() => {
    if (!data?.lowestBetAmount) return null
    return (
      <span style={{ color: 'red' }}>
        {data?.lowestBetAmount / 2}/{data.lowestBetAmount}
        <span style={{ marginLeft: 4 }}>BB</span>
      </span>
    )
  }, [data?.lowestBetAmount])
  return (
    <Spin spinning={loading}>
      <div
        style={{
          padding: '12px 18px',
          background: '#f5f5f5',
          height: '100vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <h4 style={{ marginTop: 0 }}>
          <span>对局信息</span>
          <span style={{ marginLeft: 4 }}>{getMatchTag(data)}</span>
        </h4>
        <Descriptions column={3}>
          <Descriptions.Item label="开始时间">
            {data?.startedAt}
          </Descriptions.Item>
          <Descriptions.Item label="结束时间">
            {data?.endedAt}
          </Descriptions.Item>
          <Descriptions.Item label="对局时长">{duration}</Descriptions.Item>
          <Descriptions.Item label="结束阶段">
            {data?.endStage && stageMap.get(data.endStage)}
          </Descriptions.Item>
          <Descriptions.Item label="人数">
            {data?.playersCount}
          </Descriptions.Item>
          <Descriptions.Item label="盲注">{lowestBetAmount}</Descriptions.Item>
          <Descriptions.Item label="底牌">
            {formatterPoke(data?.commonPokes || [])}
          </Descriptions.Item>
          <Descriptions.Item label="最大牌型">
            {data?.maximumType && handPokeMap.get(data.maximumType)}
          </Descriptions.Item>
        </Descriptions>

        <h4>玩家</h4>
        <Table
          pagination={false}
          scroll={{ y: 300 }}
          columns={columnsOfWinners}
          dataSource={data?.playerHands}
        />
        <h4>行为记录</h4>
        <Table
          columns={columnsOfRecords}
          dataSource={data?.records}
          pagination={false}
          style={{ flexGrow: 1, overflowY: 'auto' }}
          sticky
        />
      </div>
    </Spin>
  )
}

export default AnalysisDetail
