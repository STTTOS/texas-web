import { Form, Input, Button, message } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'

import styles from './index.module.less'
import HomeBgBalls from '@/components/HomeBgBalls'
import HomePlanetRing from '@/components/HomePlanetRing'

interface LoginValues {
  username: string
  password: string
}

const LoginPage = () => {
  const nav = useNavigate()
  const [search] = useSearchParams()

  const onFinish = (values: LoginValues) => {
    const from = search.get('from') || '/'
    message.success(`欢迎回来，${values.username}`)
    nav(from)
  }

  return (
    <div className={styles.page}>
      <HomeBgBalls count={30} />
      <HomePlanetRing />
      <div className={styles.wrapper}>
        <div className={styles.brand}>Texas Poker</div>
        <div className={styles.panel}>
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
              <Button className={styles.btn} size="large" htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.extra}></div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
