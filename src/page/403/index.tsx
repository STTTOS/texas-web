import { Button, Space } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import styles from './index.module.less'

const Forbidden = () => {
  const nav = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <LockOutlined className={styles.icon} />
        <div className={styles.code}>403</div>
        <div className={styles.title}>暂无访问权限</div>
        <div className={styles.desc}>
          当前账号无法进入该页面，请联系管理员开通权限后再试。
        </div>
        <Space size={12} wrap>
          <Button className={styles.btnGhost} onClick={() => nav('/')}>
            返回首页
          </Button>
          <Button className={styles.btnGold} onClick={() => nav('/login')}>
            重新登录
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default Forbidden
