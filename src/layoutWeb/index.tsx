import { Dropdown } from 'antd'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useUserInfo } from '@/model'
import { logout } from '@/service/user'
import UserIdentityBadge from '@/components/UserIdentityBadge'
import { BRAND_EN, BRAND_TAGLINE_ZH } from '@/constants/brand'
import styles from './index.module.less'

const WebLayout = () => {
  const nav = useNavigate()
  const { user, fetch } = useUserInfo()

  useEffect(() => {
    fetch()
  }, [fetch])

  const onLogout = async () => {
    await logout()
    location.href = '/login'
  }

  const onClickMatch = () => {
    if (!user) {
      nav('/login')
      return
    }
    nav('/match')
  }

  return (
    <>
      <header className={styles.webLayout__header}>
        <div className={styles.webLayout__headerInner}>
          <button className={styles.webLayout__brand} onClick={() => nav('/')}>
            <div className={styles.webLayout__logo}>{BRAND_EN}</div>
            <div className={styles.webLayout__tagline}>{BRAND_TAGLINE_ZH}</div>
          </button>

          <nav className={styles.webLayout__nav}>
            <a
              className={styles.webLayout__navTextLink}
              href="/"
              onClick={(e) => {
                e.preventDefault()
                nav('/')
              }}
            >
              首页
            </a>
            {user?.isAdmin && (
              <a
                className={styles.webLayout__navTextLink}
                href="/announcement/manage"
                onClick={(e) => {
                  e.preventDefault()
                  nav('/announcement/manage')
                }}
              >
                管理中心
              </a>
            )}
            <a
              className={styles.webLayout__navTextLink}
              href="/match"
              onClick={(e) => {
                e.preventDefault()
                onClickMatch()
              }}
            >
              对局记录
            </a>
            <a
              className={styles.webLayout__navTextLink}
              href="/rules"
              target="_blank"
              rel="noreferrer"
            >
              游戏规则
            </a>

            {user && (
              <Dropdown
                trigger={['hover']}
                placement="bottomRight"
                menu={{
                  items: [{ key: 'logout', label: '退出登录' }],
                  onClick: ({ key }) => {
                    if (key === 'logout') onLogout()
                  }
                }}
              >
                <UserIdentityBadge name={user.name} username={user.username} />
              </Dropdown>
            )}
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  )
}

export default WebLayout
