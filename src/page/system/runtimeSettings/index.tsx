import { useRequest } from 'ahooks'
import {
  Alert,
  Button,
  Card,
  ConfigProvider,
  Form,
  InputNumber,
  Space,
  Spin,
  Typography,
  theme,
  message
} from 'antd'
import { useEffect, useMemo, useState } from 'react'

import {
  fetchRuntimeSettingsDetail,
  updateRuntimeSettings,
  type RuntimeSettingsFieldDef,
  type RuntimeSettingsPatchKey,
  runtimeSettingsPatchKeys
} from '@/service/system/runtimeSettings'
import styles from './index.module.less'

const groupOrder: RuntimeSettingsFieldDef['group'][] = [
  'websocket',
  'firstHand',
  'nextHand'
]

const groupTitle: Record<RuntimeSettingsFieldDef['group'], string> = {
  websocket: 'WebSocket 游戏流节奏',
  firstHand: '首局进桌',
  nextHand: '局间倒计时（下一手）'
}

const RuntimeSettingsPage = () => {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const lockMs = Form.useWatch('nextHandLockAtOffsetMs', form)
  const tailMs = Form.useWatch('nextHandLockedTailBeforeEndsMs', form)

  const derivedEnds = useMemo(() => {
    const a = Number(lockMs)
    const b = Number(tailMs)
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null
    return Math.trunc(a) + Math.trunc(b)
  }, [lockMs, tailMs])

  const { data, loading, refreshAsync } = useRequest(fetchRuntimeSettingsDetail)
  const initialLoading = loading && data === undefined

  useEffect(() => {
    if (!data?.snapshot) return
    const init: Partial<Record<RuntimeSettingsPatchKey, number>> = {}
    for (const k of runtimeSettingsPatchKeys) {
      init[k] = data.snapshot[k]
    }
    form.setFieldsValue(init)
  }, [data, form])

  const fieldsByGroup = useMemo(() => {
    const map = new Map<RuntimeSettingsFieldDef['group'], RuntimeSettingsFieldDef[]>()
    for (const g of groupOrder) map.set(g, [])
    for (const f of data?.fields ?? []) {
      const arr = map.get(f.group)
      if (arr) arr.push(f)
    }
    return map
  }, [data?.fields])

  const onSave = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)
      const patch: Partial<Record<RuntimeSettingsPatchKey, number>> = {}
      for (const k of runtimeSettingsPatchKeys) {
        patch[k] = values[k] as number
      }
      await updateRuntimeSettings(patch)
      message.success('已保存，新开局与新的局间倒计时会使用新参数')
      await refreshAsync()
    } catch (e) {
      if (e && typeof e === 'object' && 'errorFields' in e) return
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#38bdf8', borderRadius: 10 }
      }}
    >
      <div className={styles.page}>
        <Card className={styles.card}>
          <Spin spinning={initialLoading}>
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
            <div>
              <Typography.Title level={4} className={styles.title}>
                系统设置 · 游戏运行时参数
              </Typography.Title>
              <Typography.Paragraph type="secondary" className={styles.lead}>
                以下为进程内单例配置，修改后无需重启服务；已排队的定时器仍按旧值执行。单位均为毫秒，范围
                0～120000。仅管理员可访问。
              </Typography.Paragraph>
            </div>

            <Alert
              type="info"
              showIcon
              message="局间倒计时"
              description={
                <>
                  锁座时刻与分配角色时刻由两项相加得到 WS 中的 <Typography.Text code>endsAt</Typography.Text>{' '}
                  相对偏移（派生值见表单下方）。请勿再使用已废弃的单独「总 ends」字段，以免锁座顺序配反。
                </>
              }
            />

            <Form
              form={form}
              layout="vertical"
              className={styles.form}
              disabled={initialLoading}
            >
              {groupOrder.map((g) => {
                const list = fieldsByGroup.get(g) ?? []
                if (list.length === 0) return null
                return (
                  <div key={g} className={styles.group}>
                    <Typography.Title level={5} className={styles.groupTitle}>
                      {groupTitle[g]}
                    </Typography.Title>
                    {list.map((f) => (
                      <Form.Item
                        key={f.key}
                        name={f.key}
                        label={
                          <span>
                            <Typography.Text strong>{f.label}</Typography.Text>
                            <Typography.Text type="secondary" className={styles.keyHint}>
                              {' '}
                              ({f.key})
                            </Typography.Text>
                          </span>
                        }
                        rules={[
                          { required: true, message: '请输入数值' },
                          {
                            type: 'number',
                            min: f.minMs,
                            max: f.maxMs,
                            message: `须在 ${f.minMs}～${f.maxMs} 之间`
                          }
                        ]}
                        extra={
                          <Typography.Paragraph className={styles.fieldDesc}>
                            {f.description}
                          </Typography.Paragraph>
                        }
                      >
                        <InputNumber
                          className={styles.inputNum}
                          min={f.minMs}
                          max={f.maxMs}
                          step={100}
                        />
                      </Form.Item>
                    ))}
                    {g === 'nextHand' && derivedEnds != null ? (
                      <Typography.Paragraph type="secondary" className={styles.derived}>
                        当前派生的 <Typography.Text code>nextHandEndsAtOffsetMs</Typography.Text>（锁座偏移 +
                        锁座后尾段）= <Typography.Text strong>{derivedEnds}</Typography.Text> ms
                      </Typography.Paragraph>
                    ) : null}
                  </div>
                )
              })}
            </Form>

            <Button
              type="primary"
              onClick={onSave}
              loading={saving}
              disabled={!data || initialLoading}
            >
              保存全部参数
            </Button>
            </Space>
          </Spin>
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default RuntimeSettingsPage
