import styles from '@/page/legal/common.module.less'

const PrivacyPolicyPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>隐私协议</h1>
            <div className={styles.meta}>更新日期：2026-03-18</div>
          </div>
        </div>

        <div className={`${styles.glass} ${styles.card}`}>
          <div className={styles.sectionTitle}>1. 开发者信息</div>
          <p className={styles.p}>
            本服务由个人开发者提供与维护。如对本隐私协议有疑问，请联系邮箱：`744765302@qq.com`。
          </p>

          <div className={styles.sectionTitle}>2. 我们收集的信息</div>
          <ul className={styles.list}>
            <li>账号信息：使用账号/密码登录时，你提供的账号标识与登录凭证相关信息。</li>
            <li>对局与操作记录相关数据：用于展示、复盘与分析。</li>
            <li>设备与日志信息：用于安全、排障、性能优化与防止滥用。</li>
          </ul>

          <div className={styles.sectionTitle}>3. 我们如何使用信息</div>
          <ul className={styles.list}>
            <li>提供与维护服务（对局列表、详情、错误分析等）。</li>
            <li>改进体验（统计与优化性能、修复问题）。</li>
            <li>安全风控（防止滥用、攻击与异常行为）。</li>
          </ul>

          <div className={styles.sectionTitle}>4. 信息共享与披露</div>
          <p className={styles.p}>
            我们不会出售你的个人信息。仅在实现功能所必需或法律法规要求的情况下，与服务提供方/主管机关共享必要信息，并采取合理的安全措施。
          </p>

          <div className={styles.sectionTitle}>5. 数据存储与保护</div>
          <ul className={styles.list}>
            <li>我们会在提供服务所需的最短期限内保存数据，或符合法律要求的期限。</li>
            <li>
              我们采用合理的安全措施（如访问控制、传输保护等）降低风险，但无法保证绝对安全。
            </li>
          </ul>

          <div className={styles.sectionTitle}>6. 你的权利</div>
          <ul className={styles.list}>
            <li>你可以访问、更正或删除与你相关的数据（视功能提供情况）。</li>
            <li>你可以撤回授权或停止使用服务。</li>
          </ul>

          <div className={styles.sectionTitle}>7. 数据出境</div>
          <p className={styles.p}>本服务不存在个人信息出境的情况。</p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage

