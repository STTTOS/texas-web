import './index.less'
import HomeMidAnim from '@/components/HomeMidAnim'
import HomeBgBalls from '@/components/HomeBgBalls'
import HomePlanetRing from '@/components/HomePlanetRing'
import RequireUserButton from '@/components/RequireUserButton'
import { BRAND_EN, BRAND_ZH, BRAND_SLOGAN_ZH } from '@/constants/brand'

const APP_DOWNLOAD_URL = 'https://cos.wishufree.com/files/app-release.apk'

function Home() {
  return (
    <div className="home">
      <HomeBgBalls />
      <HomePlanetRing />

      <main className="home__main">
        <section className="home__hero home__glass">
          <div className="home__heroLeft">
            <div className="home__kicker">{BRAND_SLOGAN_ZH}</div>
            <h1 className="home__title">{BRAND_ZH}</h1>
            <p className="home__desc">
              {BRAND_ZH} 是一款主打好友同玩的线上扑克
              App。你可以快速创建房间、邀请朋友加入同桌，
              在线轻松开局；同时通过对局记录、操作记录与战绩总览，随时了解自己的打法与状态。
            </p>

            <div className="home__ctaRow">
              <RequireUserButton
                className="home__btn home__btnPrimary"
                to="/match"
              >
                查看对局记录
              </RequireUserButton>
              <a
                className="home__btn home__btnPrimary"
                href={APP_DOWNLOAD_URL}
                target="_blank"
                rel="noreferrer"
              >
                下载 App
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
              <div className="home__miniTitle">产品亮点</div>
              <div className="home__miniGrid">
                <div className="home__miniItem">
                  <div className="home__miniLabel">同玩模式</div>
                  <div className="home__miniValue">创建房间开局</div>
                </div>
                <div className="home__miniItem">
                  <div className="home__miniLabel">好友加入</div>
                  <div className="home__miniValue">一键邀请同桌</div>
                </div>
                <div className="home__miniItem">
                  <div className="home__miniLabel">记录系统</div>
                  <div className="home__miniValue">对局/操作可追溯</div>
                </div>
                <div className="home__miniItem">
                  <div className="home__miniLabel">战绩视图</div>
                  <div className="home__miniValue">一眼看懂战况</div>
                </div>
              </div>
              <div className="home__miniHint">
                适合好友局、休闲局与日常复盘。
              </div>
            </div>
          </div>
        </section>

        <HomeMidAnim />

        <section className="home__grid">
          <div className="home__glass home__card">
            <div className="home__cardTitle">创建房间 · 邀请同玩</div>
            <div className="home__cardDesc">
              一键创建房间并分享邀请入口，和朋友在线同桌，随开随玩不受地点限制。
            </div>
          </div>
          <div className="home__glass home__card">
            <div className="home__cardTitle">对局记录 · 操作记录</div>
            <div className="home__cardDesc">
              每局牌都可追溯，下注、跟注、加注、弃牌等关键行为清晰可查。
            </div>
          </div>
          <div className="home__glass home__card">
            <div className="home__cardTitle">战绩总览 · 快速洞察</div>
            <div className="home__cardDesc">
              用聚合视图查看近期胜负与表现趋势，更快了解自己的战术偏好与风格变化。
            </div>
          </div>
        </section>

        <section className="home__glass home__downloadCard">
          <div className="home__downloadLeft">
            <div className="home__downloadTitle">下载扑克派 App</div>
            <div className="home__downloadDesc">
              在移动端随时组局、随时查看记录。和朋友线上同桌，想玩就玩。
            </div>
          </div>
          <div className="home__downloadRight">
            <a
              className="home__btn home__btnPrimary"
              href={APP_DOWNLOAD_URL}
              target="_blank"
              rel="noreferrer"
            >
              立即下载
            </a>
            <a
              className="home__btn home__btnGhost"
              href={APP_DOWNLOAD_URL}
              target="_blank"
              rel="noreferrer"
            >
              查看下载说明
            </a>
          </div>
        </section>

        <section className="home__glass home__footerCard">
          <div className="home__footerLeft">
            <div className="home__footerTitle">准备好开一局了吗？</div>
            <div className="home__footerDesc">
              现在就邀请好友一起同玩，或者进入对局记录开始复盘。
            </div>
          </div>
          <div className="home__footerRight">
            <RequireUserButton
              className="home__btn home__btnPrimary"
              to="/match"
            >
              进入对局列表
            </RequireUserButton>

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
            <div>
              © 2026 {BRAND_EN} · {BRAND_ZH}. 保留所有权利。
            </div>
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
