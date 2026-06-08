import type { MenuProps } from 'antd'
import { Menu, Spin } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useUserInfo } from '@/model'
import styles from './index.module.less'

const NAV_TARGETS: Record<string, string> = {
  'announcement-manage': '/announcement/manage',
  'announcement-app-display': '/announcement/app-display',
  'match-ops': '/match/ops',
  'ops-engine-fatal': '/ops/engine-fatal',
  'ops-room': '/ops/room',
  'ops-dashboard': '/ops/dashboard',
  'ops-asset-usage': '/ops/asset-usage',
  'ops-users': '/ops/users',
  'hand-poke-audit': '/match/hand-poke-audit',
  'system-maintenance': '/system/maintenance',
  'system-version': '/system/version',
  'system-runtime-settings': '/system/runtime-settings',
  'system-ssl': '/system/ssl'
}

const adminMenuItems: MenuProps['items'] = [
  {
    key: 'announcement',
    label: '公告中心',
    children: [
      { key: 'announcement-manage', label: '公告管理' },
      { key: 'announcement-app-display', label: 'App 端展示' }
    ]
  },
  {
    key: 'ops',
    label: '对局与排障',
    children: [
      { key: 'match-ops', label: '对局运维' },
      { key: 'ops-engine-fatal', label: '引擎事故' },
      { key: 'ops-room', label: '房间运维' },
      { key: 'ops-dashboard', label: '看板 / 日报' },
      { key: 'ops-asset-usage', label: '卡面 / 牌桌频次' },
      { key: 'ops-users', label: '用户运维' }
    ]
  },
  { key: 'hand-poke-audit', label: '手牌审计' },
  { key: 'system-maintenance', label: '维护升级' },
  { key: 'system-version', label: '版本管理' },
  { key: 'system-runtime-settings', label: '游戏运行时' },
  { key: 'system-ssl', label: 'SSL 证书' }
]

const AuthLayout = () => {
  const nav = useNavigate()
  const location = useLocation()
  const { user, fetch } = useUserInfo()
  const [ready, setReady] = useState(false)

  const selectedKeys = useMemo(() => {
    const p = location.pathname
    if (p.startsWith('/match/hand-poke-audit')) return ['hand-poke-audit']
    if (p.startsWith('/ops/match-tape')) return ['match-ops']
    if (p.startsWith('/match/ops')) return ['match-ops']
    if (p.startsWith('/ops/engine-fatal')) return ['ops-engine-fatal']
    if (p.startsWith('/ops/room')) return ['ops-room']
    if (p.startsWith('/ops/dashboard')) return ['ops-dashboard']
    if (p.startsWith('/ops/asset-usage')) return ['ops-asset-usage']
    if (p.startsWith('/ops/users')) return ['ops-users']
    if (p.startsWith('/announcement/app-display')) return ['announcement-app-display']
    if (p.startsWith('/announcement/manage')) return ['announcement-manage']
    if (p.startsWith('/system/maintenance')) return ['system-maintenance']
    if (p.startsWith('/system/version')) return ['system-version']
    if (p.startsWith('/system/runtime-settings')) return ['system-runtime-settings']
    if (p.startsWith('/system/ssl')) return ['system-ssl']
    return ['announcement-manage']
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
          defaultOpenKeys={['announcement', 'ops']}
          selectedKeys={selectedKeys}
          className={styles.authLayout__menu}
          items={adminMenuItems}
          onClick={({ key }) => {
            const path = NAV_TARGETS[key]
            if (path) nav(path)
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
