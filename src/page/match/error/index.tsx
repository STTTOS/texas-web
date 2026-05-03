import { getMatchErrors } from '@/service/match'
import { useRequest } from 'ahooks'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { Spin } from 'antd'

import styles from './index.module.less'

const MatchErrorPage = () => {
  const query = useParams()
  const id = Number(query.id)

  const { loading, data: errors = [] } = useRequest(getMatchErrors, {
    defaultParams: [{ id }],
    ready: Number.isFinite(id) && id > 0
  })
  const errorItems = useMemo(() => {
    if (errors.length === 0) return <span>暂无错误信息...</span>

    return errors.map((error) => {
      const lines = error.message.split('\n').filter(Boolean)
      return (
        <div key={error.id} className={styles.error_item}>
          <div className={styles.error_item_createdAt}>
            {error.createdAt} · room #{error.roomId}
          </div>
          <div className={styles.error_item_info}>
            {lines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
          {error.payload != null && (
            <pre className={styles.error_item_payload}>
              {JSON.stringify(error.payload, null, 2)}
            </pre>
          )}
        </div>
      )
    })
  }, [errors])
  return (
    <div className={styles.wrapper}>
      <Spin spinning={loading}>{errorItems}</Spin>
    </div>
  )
}

export default MatchErrorPage
