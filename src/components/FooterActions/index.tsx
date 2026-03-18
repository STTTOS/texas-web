import type { FC } from 'react'

import { Button, Space } from 'antd'
import { useNavigate } from 'react-router-dom'

import styles from './index.module.less'

const FooterActions: FC = () => {
  const nav = useNavigate()

  return (
    <Space className={styles.footer} size={12} wrap>
      <Button
        type="link"
        className={styles.link}
        onClick={() => window.open('/rules', '_blank', 'noreferrer')}
      >
        游戏规则
      </Button>
      <Button
        type="link"
        className={styles.link}
        onClick={() => nav('/analysis/match')}
      >
        对局记录
      </Button>
    </Space>
  )
}

export default FooterActions
