import './index.less'

function Home() {
  return (
    <div className="home">
      <div className="home__bg" />

      <header className="home__header">
        <div className="home__headerInner">
          <div className="home__brand">
            <div className="home__logo">Texas Poker</div>
            <div className="home__tagline">德州扑克 · 体验场</div>
          </div>

          <nav className="home__nav">
            <a
              className="home__navLink"
              href="/rules"
              target="_blank"
              rel="noreferrer"
            >
              游戏规则
            </a>
            <a
              className="home__navLink"
              href="/analysis/match"
              target="_blank"
              rel="noreferrer"
            >
              对局记录
            </a>
          </nav>
        </div>
      </header>

      <main className="home__main">
        <section className="home__hero home__glass">
          <div className="home__heroLeft">
            <div className="home__kicker">All in or fold</div>
            <h1 className="home__title">德州扑克 · 体验场门户</h1>
            <p className="home__desc">
              用更清晰的操作记录与结算记录，回放每一手牌的关键节点。
            </p>

            <div className="home__ctaRow">
              <a
                className="home__btn home__btnPrimary"
                href="/analysis/match"
                target="_blank"
                rel="noreferrer"
              >
                查看对局记录
              </a>
              <a
                className="home__btn home__btnGhost"
                href="/rules"
                target="_blank"
                rel="noreferrer"
              >
                阅读游戏规则
              </a>
            </div>
          </div>

          <div className="home__heroRight">
            <div className="home__miniPanel">
              <div className="home__miniTitle">本局概览</div>
              <div className="home__miniGrid">
                <div className="home__miniItem">
                  <div className="home__miniLabel">盲注</div>
                  <div className="home__miniValue">300</div>
                </div>
                <div className="home__miniItem">
                  <div className="home__miniLabel">起始筹码</div>
                  <div className="home__miniValue">6000</div>
                </div>
                <div className="home__miniItem">
                  <div className="home__miniLabel">总下注</div>
                  <div className="home__miniValue">1.23K</div>
                </div>
                <div className="home__miniItem">
                  <div className="home__miniLabel">阶段</div>
                  <div className="home__miniValue">转牌圈</div>
                </div>
              </div>
              <div className="home__miniHint">
                以 App 同款紫色渐变与玻璃卡片风格呈现
              </div>
            </div>
          </div>
        </section>

        <section className="home__grid">
          <div className="home__glass home__card">
            <div className="home__cardTitle">结算记录</div>
            <div className="home__cardDesc">
              逐条展示底池变化、赢家与筹码增减，复盘更直观。
            </div>
          </div>
          <div className="home__glass home__card">
            <div className="home__cardTitle">操作记录</div>
            <div className="home__cardDesc">
              Fold / Call / Raise / All-in 一目了然，还原对局节奏。
            </div>
          </div>
          <div className="home__glass home__card">
            <div className="home__cardTitle">分析入口</div>
            <div className="home__cardDesc">
              直接进入对局列表与详情页，沿用现有 analysis 跳转逻辑。
            </div>
          </div>
        </section>

        <section className="home__glass home__footerCard">
          <div className="home__footerLeft">
            <div className="home__footerTitle">准备好开始复盘了吗？</div>
            <div className="home__footerDesc">
              从对局记录进入分析页，或先读规则再上桌。
            </div>
          </div>
          <div className="home__footerRight">
            <a
              className="home__btn home__btnPrimary"
              href="/analysis/match"
              target="_blank"
              rel="noreferrer"
            >
              进入对局列表
            </a>
            <a
              className="home__btn home__btnGhost"
              href="/rules"
              target="_blank"
              rel="noreferrer"
            >
              游戏规则
            </a>
          </div>
        </section>
      </main>

      <footer className="home__footer">
        <div className="home__footerInner">
          <div className="home__footerRow">
            <div>© 2026 Texas Poker. 保留所有权利。</div>
            <div className="home__footerLinks">
              <a
                className="home__footerLink"
                href="/user-agreement"
                target="_blank"
                rel="noreferrer"
              >
                用户协议
              </a>
              <span className="home__footerSep">·</span>
              <a
                className="home__footerLink"
                href="/privacy-policy"
                target="_blank"
                rel="noreferrer"
              >
                隐私协议
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
