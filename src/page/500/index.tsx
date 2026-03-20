import { Button, Space } from 'antd'
import { ThunderboltOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import styles from './index.module.less'

const Error500 = () => {
  const nav = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <ThunderboltOutlined className={styles.icon} />
        <div className={styles.code}>500</div>
        <div className={styles.title}>服务器开小差了</div>
        <div className={styles.desc}>
          服务端暂时不可用，请稍后重试；如果问题持续出现，请联系管理员排查。
        </div>
        <Space size={12} wrap>
          <Button className={styles.btnGold} onClick={() => nav('/')}>
            返回首页
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default Error500
