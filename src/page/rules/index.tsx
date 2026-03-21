import styles from './index.module.less'

const RulesPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>扑克派 · 游戏规则</h1>
            <div className={styles.subtitle}>
              快速了解流程、下注轮次与手牌大小（偏入门版）。
            </div>
          </div>
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
            <li>过牌（Check）：在当前无人加注时，选择不下注并把行动权交给下一位。</li>
            <li>跟注（Call）：补齐到当前最高下注额。</li>
            <li>加注（Raise）：提高下注额。</li>
            <li>全下（All-in）：一次投入全部筹码。</li>
          </ul>

          <div className={styles.sectionTitle}>盲注说明</div>
          <ul className={styles.list}>
            <li>小盲注（SB）与大盲注（BB）是每局开始前的强制下注，用于形成初始底池。</li>
            <li>大盲注通常是小盲注的 2 倍，具体数值以房间配置为准。</li>
            <li>发牌后，翻牌前的行动从大盲位左侧第一位玩家开始。</li>
          </ul>

          <div className={styles.sectionTitle}>手牌大小（从大到小）</div>
          <ul className={styles.list}>
            <li>同花顺 &gt; 四条 &gt; 葫芦 &gt; 同花 &gt; 顺子</li>
            <li>三条 &gt; 两对 &gt; 一对 &gt; 高牌</li>
          </ul>

        </div>
      </div>
    </div>
  )
}

export default RulesPage

