import { Button, Space } from 'antd'
import { useNavigate } from 'react-router-dom'

import styles from './index.module.less'

const RulesPage = () => {
  const nav = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>德州扑克 · 游戏规则</h1>
            <div className={styles.subtitle}>
              快速了解流程、下注轮次与手牌大小（偏入门版）。
            </div>
          </div>
          <Space className={styles.actions} size={10}>
            <Button onClick={() => nav('/')}>返回首页</Button>
            <Button type="primary" onClick={() => nav('/analysis/match')}>
              对局记录
            </Button>
          </Space>
        </div>

        <div className={`${styles.glass} ${styles.card}`}>
          <div className={styles.sectionTitle}>基本流程</div>
          <ul className={styles.list}>
            <li>每位玩家两张底牌（仅自己可见）。</li>
            <li>桌面依次发出 5 张公共牌：翻牌（3）→ 转牌（1）→ 河牌（1）。</li>
            <li>
              你用「两张底牌 + 五张公共牌」中任意 5
              张，组成最大的五张牌型。
            </li>
          </ul>

          <div className={styles.sectionTitle}>下注轮次</div>
          <ul className={styles.list}>
            <li>翻牌前：发底牌后进行第一轮下注。</li>
            <li>翻牌圈：发出 3 张公共牌后下注。</li>
            <li>转牌圈：发出第 4 张公共牌后下注。</li>
            <li>河牌圈：发出第 5 张公共牌后下注，进入摊牌或结束。</li>
          </ul>

          <div className={styles.sectionTitle}>常见行动</div>
          <ul className={styles.list}>
            <li>弃牌（Fold）：放弃本局，已投入筹码不退。</li>
            <li>跟注（Call）：补齐到当前最高下注额。</li>
            <li>加注（Raise）：提高下注额。</li>
            <li>全下（All-in）：一次投入全部筹码。</li>
          </ul>

          <div className={styles.sectionTitle}>手牌大小（从大到小）</div>
          <ul className={styles.list}>
            <li>同花顺 &gt; 四条 &gt; 葫芦 &gt; 同花 &gt; 顺子</li>
            <li>三条 &gt; 两对 &gt; 一对 &gt; 高牌</li>
          </ul>

          <div className={styles.note}>
            提示：不同平台对盲注结构、最小加注规则、结算细节可能略有差异；如果你要我把规则写成你
            App 一样的「操作记录/结算记录」风格文案，我也可以直接按你截图的 UI 口吻重写。
          </div>
        </div>
      </div>
    </div>
  )
}

export default RulesPage

