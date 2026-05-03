import type { Match } from './types'

import { Tag } from 'antd'
import type { ReactNode } from 'react'

export type MatchListHealth = 'engine_error' | 'in_progress' | 'finished'

export function getMatchListHealth(record: Match): MatchListHealth {
  if ((record.errorCount ?? 0) > 0) return 'engine_error'
  if (!record.endedAt) return 'in_progress'
  return 'finished'
}

/** 对局列表 / 详情摘要：与当前服务端字段一致（boardThroughStage、endedAt、errorCount） */
export function getMatchStatusTag(record?: Match | null): ReactNode {
  if (!record) return null
  const health = getMatchListHealth(record)
  if (health === 'engine_error') {
    return <Tag color="red">引擎异常</Tag>
  }
  if (health === 'in_progress') {
    return <Tag color="processing">进行中</Tag>
  }
  return <Tag color="gold">已结束</Tag>
}
