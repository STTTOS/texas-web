import { getMatchErrors } from '@/service/analysis'
import { useRequest } from 'ahooks'
import { useParams } from 'react-router'
import styles from './index.module.less'
import { useMemo } from 'react'
import { Spin } from 'antd'

const Error = () => {
  const query = useParams()
  const id = query.id as unknown as number

  const { loading, data: errors = [] } = useRequest(getMatchErrors, { defaultParams: [{ id }] })
  const errorItems = useMemo(() => {
    if (errors.length === 0) return <span>暂无错误信息...</span>

    return errors.map( error => {
      const info = error.info.split('\\n').map(item => <div key={item}>{item}</div>)
      return <div key={error.id} className={styles.error_item}>
        <div className={styles.error_item_createdAt}>{error.createdAt}</div>
        <div className={styles.error_item_info}>
          {info}
        </div>
      </div>
    })
  }, [errors])
  return (
    <div className={styles.wrapper}>
      <Spin spinning={loading}>
        {errorItems}
      </Spin>
    </div>
  )
}

export default Error