import { Card, ConfigProvider, Descriptions, theme, Typography } from 'antd'

import pkg from '../../../../package.json'
import styles from './index.module.less'

const VersionPage = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#fbbf24', borderRadius: 12 }
      }}
    >
      <div className={styles.page}>
        <Card className={styles.card}>
          <Typography.Title level={4} className={styles.title}>
            版本管理
          </Typography.Title>
          <Typography.Paragraph className={styles.desc}>
            当前为客户端（App）构建信息；App版本可在接入接口后展示于此。
          </Typography.Paragraph>
          <Descriptions
            column={1}
            size="small"
            className={styles.descriptions}
            labelStyle={{ color: 'rgba(255,255,255,0.65)' }}
            contentStyle={{ color: 'rgba(255,255,255,0.92)' }}
            items={[
              { key: 'name', label: '项目', children: pkg.name },
              { key: 'ver', label: 'Web 版本', children: pkg.version }
            ]}
          />
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default VersionPage
