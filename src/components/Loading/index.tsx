import { BRAND_EN, BRAND_ZH } from '@/constants/brand'

import styles from './index.module.less'

function Loading() {
  return (
    <div className={styles.fullscreen}>
      <div className={styles.glow} />
      <div className={styles.card}>
        <div className={styles.brand}>{BRAND_EN}</div>
        <div className={styles.subtitle}>{BRAND_ZH}</div>
        <div className={styles.loadingRow}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <div className={styles.tip}>正在加载页面内容...</div>
      </div>
    </div>
  )
}

export default Loading
