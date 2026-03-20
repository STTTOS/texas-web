import type { Announcement } from '@/service/announcement/types'

import { useRequest } from 'ahooks'
import { useNavigate } from 'react-router-dom'
import { Card, Empty, Space, theme, Button, ConfigProvider } from 'antd'

import styles from './index.module.less'
import shell from '../shell.module.less'
import HomeBgBalls from '@/components/HomeBgBalls'
import PageBrand from '@/components/PageBrand'
import AnnouncementCard from '../../../components/AnnouncementCard'
import { fetchAnnouncementValidList } from '@/service/announcement'

const AppDisplayAnnouncementPage = () => {
  const nav = useNavigate()
  const { data, loading } = useRequest(fetchAnnouncementValidList)
  const list = data || []

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#fbbf24', borderRadius: 12 }
      }}
    >
      <div className={`${shell.page} ${styles.pageFull}`}>
        <HomeBgBalls count={24} />
        <div className={`${shell.inner} ${styles.innerFull}`}>
          <PageBrand subtitle="App端展示公告 · 当前有效展示内容" />

          <div className={`${shell.glass} ${styles.glassFull}`}>
            <div className={shell.toolbar}>
              <h1 className={shell.pageTitle}>App端展示公告</h1>
              <Space wrap>
                <Button
                  type="default"
                  className={styles.btnGoldGhost}
                  onClick={() => nav('/announcement/manage')}
                >
                  公告管理
                </Button>
              </Space>
            </div>

            <div className={styles.contentScroll}>
              {loading ? (
                <Card loading />
              ) : list.length === 0 ? (
                <Empty description="暂无有效展示公告" />
              ) : (
                <div className={styles.cards}>
                  {list.map((item: Announcement) => (
                    <AnnouncementCard key={String(item.id)} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default AppDisplayAnnouncementPage
