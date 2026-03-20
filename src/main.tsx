import 'animate.css'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { useRoutes } from 'react-router-dom'
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import relativeTime from 'dayjs/plugin/relativeTime'

import './main.less'
import routers from './router'
import BrowserRouter from './components/BrowserRouter'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
const Index = () => useRoutes(routers)

const App = () => {
  return (
    // <StrictMode>
    <BrowserRouter>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: '#4c1d95',
            colorFillContentHover: '#fbbf24',
            colorLink: '#fde68a',
            colorLinkHover: '#f59e0b'
          }
        }}
      >
        <Index />
      </ConfigProvider>
    </BrowserRouter>
    // </StrictMode>
  )
}

createRoot(document.getElementById('blog-app')!).render(<App />)
