import { useRequest } from 'ahooks'
import {
  Card,
  ConfigProvider,
  Space,
  Spin,
  Switch,
  Tag,
  theme,
  Typography,
  message
} from 'antd'
import { useState } from 'react'

import { fetchMaintenanceStatus, setMaintenanceEnabled } from '@/service/system'
import styles from './index.module.less'

const MaintenancePage = () => {
  const [saving, setSaving] = useState(false)
  const { data: enabled, loading, refreshAsync } = useRequest(fetchMaintenanceStatus)
  const initialLoading = loading && enabled === undefined

  const onToggle = async (checked: boolean) => {
    setSaving(true)
    try {
      await setMaintenanceEnabled(checked)
      message.success(checked ? '已开启维护模式' : '已关闭维护模式')
      await refreshAsync()
    } catch {
      /* http 已 toast */
    } finally {
      setSaving(false)
    }
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#fbbf24', borderRadius: 12 }
      }}
    >
      <div className={styles.page}>
        <Card className={styles.card}>
          <Spin spinning={initialLoading}>
            <Space direction="vertical" size={18} style={{ width: '100%' }}>
              <div className={styles.header}>
                <Typography.Title level={4} className={styles.title}>
                  维护升级
                </Typography.Title>
                <Tag color={enabled ? 'gold' : 'default'}>
                  {enabled ? '维护中' : '正常服务'}
                </Tag>
              </div>

              <Typography.Text className={styles.desc}>
                开启后，玩家将进入维护状态提示页，无法正常进行游戏。
              </Typography.Text>

              <div className={styles.switchRow}>
                <span className={styles.switchLabel}>游戏维护开关</span>
                <Switch
                  checked={Boolean(enabled)}
                  loading={saving}
                  onChange={onToggle}
                  disabled={initialLoading || saving}
                />
              </div>
            </Space>
          </Spin>
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default MaintenancePage
