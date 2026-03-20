import { Button, Card, Space, Tag } from 'antd'
import dayjs from 'dayjs'

import styles from './index.module.less'
import type {
  Announcement,
  AnnouncementType
} from '@/service/announcement/types'

const TYPE_LABEL: Record<AnnouncementType, string> = {
  activity: '活动',
  update: '更新',
  maintenance: '维护'
}

const TYPE_COLOR: Record<AnnouncementType, string> = {
  activity: 'green',
  update: 'blue',
  maintenance: 'volcano'
}

interface Props {
  item: Announcement
}

const AnnouncementCard: React.FC<Props> = ({ item }) => {
  const expireHint = item.expireAt
    ? `${dayjs(item.expireAt).fromNow()}后过期`
    : '长期'

  return (
    <Card
      className={styles.card}
      title={
        <div className={styles.head}>
          <Space wrap size="small">
            <Tag color={TYPE_COLOR[item.type] ?? 'gold'}>
              {TYPE_LABEL[item.type] ?? item.type}
            </Tag>
            <span>{item.title}</span>
          </Space>
          <span className={styles.expire}>{expireHint}</span>
        </div>
      }
    >
      <p className={styles.summary}>{item.summary}</p>
      <p className={styles.content}>{item.content}</p>
      <div className={styles.meta}>
        <div>优先级：{item.priority ?? 0}</div>
        <div>
          创建时间：{item.createdAt || '—'}
        </div>
        <div>
          最后一次修改时间：{item.updatedAt || '—'}
        </div>
        {item.actionText && (
          <div className={styles.actions}>
            <Button
              type="primary"
              ghost
              className={styles.btnGoldGhost}
              onClick={() => {
                if (item.actionUrl) window.open(item.actionUrl, '_blank')
              }}
              disabled={!item.actionUrl}
            >
              {item.actionText}
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

export default AnnouncementCard
