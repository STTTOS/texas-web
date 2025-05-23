import './index.less'

function Home() {
  return (
    <div className="home">
      <header className="header">
        <h1>德州扑克官网</h1>
        <nav>
          <ul>
            <li>
              <a href="/analysis/match" target="_blank">
                对局记录
              </a>
            </li>
            <li>
              <a href="#games">游戏规则</a>
            </li>
            <li>
              <a href="#join">加入我们</a>
            </li>
            <li>
              <a href="#contact">联系我们</a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <h2>欢迎来到德州扑克的世界</h2>
          <p>体验激动人心的扑克游戏，挑战你的朋友和对手！</p>
          <a href="#join" className="cta-button">
            立即加入
          </a>
        </section>

        <section id="about" className="about">
          <h2>关于我们</h2>
          <p>我们致力于为玩家提供最优质的扑克游戏体验。</p>
        </section>

        <section id="games" className="games">
          <h2>游戏规则</h2>
          <p>了解德州扑克的基本规则和策略。</p>
        </section>

        <section id="contact" className="contact">
          <h2>联系我们</h2>
          <p>有疑问？请与我们联系！</p>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 德州扑克官网. 保留所有权利.</p>
      </footer>
    </div>
  )
}

export default Home
