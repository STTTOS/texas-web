import { SHA256 } from 'crypto-js'
import { useState, useEffect } from 'react'
import { Form, Input, Avatar, Button, message } from 'antd'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { useUserInfo } from '@/model'
import styles from './index.module.less'
import { webLogin } from '@/service/user'
import HomeBgBalls from '@/components/HomeBgBalls'
import { BRAND_EN, BRAND_TAGLINE_ZH } from '@/constants/brand'

interface LoginValues {
  username: string
  password: string
}

const LoginPage = () => {
  const nav = useNavigate()
  const [search] = useSearchParams()
  const { user, fetch } = useUserInfo()
  const [submitting, setSubmitting] = useState(false)
  const [checkingUser, setCheckingUser] = useState(true)
  const [useOtherAccount, setUseOtherAccount] = useState(false)

  useEffect(() => {
    fetch()
      .catch(() => {
        /* 登录页不强制跳转，拿不到用户按未登录展示 */
      })
      .finally(() => {
        setCheckingUser(false)
      })
  }, [fetch])

  const onFinish = async (values: LoginValues) => {
    const from = search.get('from') || '/'
    setSubmitting(true)
    try {
      const password = SHA256(values.password).toString()
      const loginData = await webLogin({
        username: values.username,
        password
      })
      void loginData
      message.success('欢迎回来')
      nav(from, { replace: true })
    } catch {
      /* betterRequest 已提示错误 */
    } finally {
      setSubmitting(false)
    }
  }

  const onUseCurrentAccount = () => {
    const from = search.get('from') || '/'
    nav(from, { replace: true })
  }

  const avatarText = (user?.name || user?.username || 'U')
    .slice(0, 1)
    .toUpperCase()
  const showAccountCard = !checkingUser && !!user && !useOtherAccount

  return (
    <div className={styles.page}>
      <HomeBgBalls count={30} />
      <div className={styles.wrapper}>
        <div className={styles.brand}>{BRAND_EN}</div>
        <div className={styles.tagline}>{BRAND_TAGLINE_ZH}</div>
        <div className={styles.panel}>
          {showAccountCard ? (
            <div className={styles.accountCard}>
              <Avatar
                className={styles.accountAvatar}
                size={72}
                src={user.avatarUrl || user.avatar || undefined}
              >
                {avatarText}
              </Avatar>
              <div className={styles.accountName}>
                {user.name || '未命名用户'}
              </div>
              <div className={styles.accountUsername}>@{user.username}</div>

              <div className={styles.accountActions}>
                <Button
                  block
                  size="large"
                  className={styles.btnGhost}
                  onClick={() => setUseOtherAccount(true)}
                >
                  登录其他账号
                </Button>
                <Button
                  block
                  size="large"
                  className={styles.btn}
                  type="primary"
                  onClick={onUseCurrentAccount}
                >
                  使用此账号
                </Button>
              </div>
            </div>
          ) : (
            <Form<LoginValues>
              className={styles.form}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                className={styles.field}
                name="username"
                rules={[{ required: true, message: '请输入账号' }]}
              >
                <Input placeholder="账号" variant="underlined" size="large" />
              </Form.Item>

              <Form.Item
                className={styles.field}
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  placeholder="密码"
                  variant="underlined"
                  size="large"
                />
              </Form.Item>

              <Form.Item className={styles.submitRow}>
                <Button
                  className={styles.btn}
                  size="large"
                  htmlType="submit"
                  loading={submitting || checkingUser}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          )}

          <div className={styles.extra}>
            {user?.isAdmin && (
              <Link to="/announcement/app-display">App端展示公告</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
