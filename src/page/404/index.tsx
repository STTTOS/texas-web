import { Button, Space } from 'antd'
import { CompassOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import styles from './index.module.less'

const Page404 = () => {
  const nav = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <CompassOutlined className={styles.icon} />
        <div className={styles.code}>404</div>
        <div className={styles.title}>页面不存在</div>
        <div className={styles.desc}>
          访问的页面可能已移动或被删除，请检查链接是否正确。
        </div>
        <Space size={12} wrap>
          <Button className={styles.btnGhost} onClick={() => nav(-1)}>
            返回上一页
          </Button>
          <Button className={styles.btnGold} onClick={() => nav('/')}>
            返回首页
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default Page404
