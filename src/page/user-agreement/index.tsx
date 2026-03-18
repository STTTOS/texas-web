import styles from '@/page/legal/common.module.less'

const UserAgreementPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>用户协议</h1>
            <div className={styles.meta}>更新日期：2026-03-18</div>
          </div>
        </div>

        <div className={`${styles.glass} ${styles.card}`}>
          <div className={styles.sectionTitle}>1. 服务说明</div>
          <p className={styles.p}>
            本网站/应用提供德州扑克相关的对局记录展示与复盘分析等功能。你在使用服务前，应阅读并同意本协议。
          </p>

          <div className={styles.sectionTitle}>2. 账号与使用规范</div>
          <ul className={styles.list}>
            <li>你应遵守适用法律法规及平台规则，合理使用服务。</li>
            <li>不得利用本服务从事违法、侵权、欺诈、骚扰等行为。</li>
            <li>不得通过爬虫、自动化脚本等方式对服务造成不合理负载或干扰。</li>
          </ul>

          <div className={styles.sectionTitle}>3. 内容与数据</div>
          <ul className={styles.list}>
            <li>对局记录与分析结果仅用于学习与复盘参考，可能存在误差。</li>
            <li>你提交/同步的数据应确保具备合法来源与使用权。</li>
          </ul>

          <div className={styles.sectionTitle}>4. 免责声明</div>
          <p className={styles.p}>
            因不可抗力、网络原因、第三方服务或不可预见的技术问题导致的服务中断/数据延迟等，我们将在合理范围内协助处理，但不对由此产生的间接损失承担责任。
          </p>

          <div className={styles.sectionTitle}>5. 协议变更</div>
          <p className={styles.p}>
            我们可能不时更新本协议。更新后继续使用服务即视为你已接受更新内容。
          </p>

          <div className={styles.note}>
            开发者主体为个人开发者。若你对本协议有任何疑问，请联系邮箱：`744765302@qq.com`。
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserAgreementPage

