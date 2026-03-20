import { Dropdown } from 'antd'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useUserInfo } from '@/model'
import { logout } from '@/service/user'
import styles from './index.module.less'

const WebLayout = () => {
  const nav = useNavigate()
  const { user, fetch } = useUserInfo()
  const avatarText = (user?.name || user?.username || 'U')
    .slice(0, 1)
    .toUpperCase()

  useEffect(() => {
    fetch()
  }, [fetch])

  const onLogout = async () => {
    await logout()
    location.href = '/login'
  }

  const onClickAnalysis = () => {
    if (!user) {
      nav('/login')
      return
    }
    nav('/analysis/match')
  }

  return (
    <>
      <header className={styles.webLayout__header}>
        <div className={styles.webLayout__headerInner}>
          <button className={styles.webLayout__brand} onClick={() => nav('/')}>
            <div className={styles.webLayout__logo}>Texas Poker</div>
            <div className={styles.webLayout__tagline}>德州扑克 · 体验场</div>
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
            <a
              className={styles.webLayout__navTextLink}
              href="/rules"
              target="_blank"
              rel="noreferrer"
            >
              游戏规则
            </a>
            <a
              className={styles.webLayout__navTextLink}
              href="/analysis/match"
              onClick={(e) => {
                e.preventDefault()
                onClickAnalysis()
              }}
            >
              对局记录
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
                公告管理
              </a>
            )}

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
                <div className={styles.webLayout__user}>
                  <div className={styles.webLayout__userAvatar}>
                    {avatarText}
                  </div>
                  <div className={styles.webLayout__userInfo}>
                    <div className={styles.webLayout__userName}>
                      {user.name}
                    </div>
                    <div className={styles.webLayout__userAccount}>
                      {user.username}
                    </div>
                  </div>
                </div>
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
