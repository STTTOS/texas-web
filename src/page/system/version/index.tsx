import { useRequest } from 'ahooks'
import {
  Button,
  Card,
  ConfigProvider,
  Descriptions,
  Input,
  Space,
  Spin,
  Typography,
  theme,
  message
} from 'antd'
import { useEffect, useState } from 'react'

import {
  fetchClientMinVersionDetail,
  setClientMinVersion
} from '@/service/system/clientVersion'
import pkg from '../../../../package.json'
import styles from './index.module.less'

const semverHint =
  '须为三位版本号，如 1.0.1，与 Expo app.json 的 expo.version 一致。低于该版本的 App 请求 /api/client/* 将收到 403，客户端会清登录态并弹出不可关闭的升级提示。'

const VersionPage = () => {
  const [minVersion, setMinVersionInput] = useState('')
  const [saving, setSaving] = useState(false)
  const { data: policy, loading: policyLoading, refreshAsync } = useRequest(
    fetchClientMinVersionDetail
  )
  const initialLoading = policyLoading && policy === undefined

  useEffect(() => {
    if (policy?.minVersion != null) setMinVersionInput(policy.minVersion)
  }, [policy?.minVersion])

  const onSave = async () => {
    const v = minVersion.trim()
    if (!/^\d+\.\d+\.\d+/.test(v)) {
      message.error('格式须为 x.y.z，如 1.0.2')
      return
    }
    setSaving(true)
    try {
      await setClientMinVersion(v)
      message.success('已保存最低客户端版本')
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
            <Typography.Title level={4} className={styles.title}>
              版本管理
            </Typography.Title>
            <Typography.Paragraph className={styles.desc}>
              管理原生 App 最低可用版本（服务端校验）。Web 管理端自身版本见下表。
            </Typography.Paragraph>
            <Descriptions
              column={1}
              size="small"
              className={styles.descriptions}
              labelStyle={{ color: 'rgba(255,255,255,0.65)' }}
              contentStyle={{ color: 'rgba(255,255,255,0.92)' }}
              items={[
                { key: 'name', label: '项目', children: pkg.name },
                { key: 'ver', label: 'Web 版本', children: pkg.version },
                {
                  key: 'minApp',
                  label: '当前最低 App 版本',
                  children: policy?.minVersion ?? '—'
                }
              ]}
            />

            <Typography.Title level={5} className={styles.sectionTitle}>
              最低 App 版本（强制升级）
            </Typography.Title>
            <Typography.Paragraph className={styles.policyHint}>
              {policy?.hint ?? semverHint}
            </Typography.Paragraph>
            <Space.Compact style={{ maxWidth: 360, width: '100%', marginTop: 12 }}>
              <Input
                value={minVersion}
                onChange={(e) => setMinVersionInput(e.target.value)}
                placeholder="例如 1.0.2"
                allowClear
                disabled={initialLoading}
              />
              <Button
                type="primary"
                onClick={onSave}
                loading={saving}
                disabled={initialLoading}
              >
                保存
              </Button>
            </Space.Compact>
          </Spin>
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default VersionPage
