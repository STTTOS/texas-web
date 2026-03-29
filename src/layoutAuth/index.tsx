import { Menu, Spin } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useUserInfo } from '@/model'
import styles from './index.module.less'

const AuthLayout = () => {
  const nav = useNavigate()
  const location = useLocation()
  const { user, fetch } = useUserInfo()
  const [ready, setReady] = useState(false)

  const selectedKeys = useMemo(() => {
    if (location.pathname.startsWith('/system/maintenance')) {
      return ['system-maintenance']
    }
    return ['announcement-center']
  }, [location.pathname])

  useEffect(() => {
    let mounted = true
    fetch()
      .catch(() => {
        /* 失败时按无权限处理 */
      })
      .finally(() => {
        if (mounted) setReady(true)
      })
    return () => {
      mounted = false
    }
  }, [fetch])

  if (!ready) {
    return (
      <div className={styles.authLayout__loading}>
        <Spin />
      </div>
    )
  }

  if (!user?.isAdmin) {
    return <Navigate to="/403" replace />
  }

  return (
    <div className={styles.authLayout}>
      <aside className={styles.authLayout__menuPane}>
        <div className={styles.authLayout__menuTitle}>管理中心</div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          className={styles.authLayout__menu}
          items={[
            { key: 'announcement-center', label: '公告中心' },
            { key: 'system-maintenance', label: '维护升级' }
          ]}
          onClick={({ key }) => {
            if (key === 'announcement-center') {
              nav('/announcement/manage')
              return
            }
            if (key === 'system-maintenance') {
              nav('/system/maintenance')
            }
          }}
        />
      </aside>

      <main className={styles.authLayout__content}>
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
