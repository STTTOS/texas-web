import {
  Button,
  Card,
  ConfigProvider,
  Space,
  Typography,
  Upload,
  message,
  theme
} from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import { InboxOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'

import {
  applyNginxReload,
  testNginxConfig,
  uploadSslCerts
} from '@/service/system/infra'
import styles from './index.module.less'

const ACCEPT = '.key,.crt,.pem'

const SslCertPage = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [applying, setApplying] = useState(false)
  const [output, setOutput] = useState('')

  const rawFiles = useMemo(
    () =>
      fileList
        .map((item) => item.originFileObj)
        .filter((file): file is File => file instanceof File),
    [fileList]
  )

  const onUpload = async () => {
    if (rawFiles.length === 0) {
      message.warning('请先选择 .key / .crt 文件')
      return
    }
    setUploading(true)
    try {
      const result = await uploadSslCerts(rawFiles)
      setOutput(result.files.map((path) => `已写入 ${path}`).join('\n'))
      message.success('证书上传成功')
    } catch {
      /* http 已 toast */
    } finally {
      setUploading(false)
    }
  }

  const onTest = async () => {
    setTesting(true)
    try {
      const result = await testNginxConfig()
      setOutput(result.output || 'nginx 配置校验通过')
      message.success('nginx 配置校验通过')
    } catch {
      /* http 已 toast */
    } finally {
      setTesting(false)
    }
  }

  const onApply = async () => {
    setApplying(true)
    try {
      const result = await applyNginxReload()
      setOutput(result.output || 'nginx 已重载')
      message.success('nginx 已重载')
    } catch {
      /* http 已 toast */
    } finally {
      setApplying(false)
    }
  }

  const onDeploy = async () => {
    if (rawFiles.length === 0) {
      message.warning('请先选择 .key / .crt 文件')
      return
    }
    setUploading(true)
    setApplying(true)
    try {
      const uploadResult = await uploadSslCerts(rawFiles)
      const reloadResult = await applyNginxReload()
      setOutput(
        [
          ...uploadResult.files.map((path) => `已写入 ${path}`),
          reloadResult.output || 'nginx 已重载'
        ].join('\n')
      )
      message.success('证书已部署并重载 nginx')
    } catch {
      /* http 已 toast */
    } finally {
      setUploading(false)
      setApplying(false)
    }
  }

  const busy = uploading || testing || applying
  const hasFiles = rawFiles.length > 0

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
            SSL 证书部署
          </Typography.Title>
          <Typography.Text className={styles.desc}>
            上传 .key / .crt 到服务器 /etc/nginx，校验配置后重载 nginx。支持分步操作，也可一键部署。
          </Typography.Text>

          <Space wrap className={styles.actions}>
            <Button
              type="primary"
              loading={uploading}
              disabled={busy || !hasFiles}
              onClick={onDeploy}
            >
              一键部署
            </Button>
            <Button loading={uploading} disabled={busy || !hasFiles} onClick={onUpload}>
              仅上传
            </Button>
            <Button loading={testing} disabled={busy} onClick={onTest}>
              nginx -t
            </Button>
            <Button loading={applying} disabled={busy} onClick={onApply}>
              重载 nginx
            </Button>
          </Space>

          <Upload.Dragger
            className={styles.upload}
            multiple
            accept={ACCEPT}
            fileList={fileList}
            beforeUpload={() => false}
            onChange={({ fileList: next }) => setFileList(next)}
            disabled={busy}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽证书文件到此处</p>
            <p className="ant-upload-hint">支持 .key、.crt、.pem，单文件不超过 2MB</p>
          </Upload.Dragger>

          {output ? <pre className={styles.output}>{output}</pre> : null}
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default SslCertPage
