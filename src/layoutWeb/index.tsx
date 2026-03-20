import './index.less'
import { Dropdown } from 'antd'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useUserInfo } from '@/model'
import { logout } from '@/service/user'

const WebLayout = () => {
  const nav = useNavigate()
  const { user, fetch, reset } = useUserInfo()
  const avatarText = (user?.name || user?.username || 'U').slice(0, 1).toUpperCase()

  useEffect(() => {
    fetch()
  }, [fetch])

  const onLogout = async () => {
    await logout()
    reset
    nav('/login')
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
      <header className="webLayout__header">
        <div className="webLayout__headerInner">
          <button className="webLayout__brand" onClick={() => nav('/')}>
            <div className="webLayout__logo">Texas Poker</div>
            <div className="webLayout__tagline">德州扑克 · 体验场</div>
          </button>

          <nav className="webLayout__nav">
            <a
              className="webLayout__navLink"
              href="/rules"
              target="_blank"
              rel="noreferrer"
            >
              游戏规则
            </a>
            <button className="webLayout__navLinkBtn" onClick={onClickAnalysis}>
              对局记录
            </button>
            {user?.isAdmin && (
              <button
                className="webLayout__navLinkBtn"
                onClick={() => nav('/announcement/manage')}
              >
                公告管理
              </button>
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
                <div className="webLayout__user">
                  <div className="webLayout__userAvatar">{avatarText}</div>
                  <div className="webLayout__userInfo">
                    <div className="webLayout__userName">{user.name}</div>
                    <div className="webLayout__userAccount">{user.username}</div>
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
