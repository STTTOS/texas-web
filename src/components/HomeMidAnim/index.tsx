import './index.less'

const HomeMidAnim = () => {
  return (
    <section
      className="home__midAnim home__glass"
      aria-label="扑克派节奏动画"
    >
      <div className="home__midTop">
        <div className="home__midTitle">一手牌的翻转节奏</div>
        <div className="home__midSub">翻牌 → 转牌 → 河牌</div>
      </div>

      <div className="home__midStage">
        <div className="home__chipOrbit" aria-hidden="true">
          <span className="home__chip" />
          <span className="home__chip" />
          <span className="home__chip" />
          <span className="home__chip" />
          <span className="home__chip" />
          <span className="home__chip" />
          <span className="home__chip" />
          <span className="home__chip" />
        </div>

        <div className="home__cardSet" aria-hidden="true">
          <div className="home__pokerCard home__pokerCard--hole1">10</div>
          <div className="home__pokerCard home__pokerCard--hole2">J</div>
          <div className="home__pokerCard home__pokerCard--flop1">Q</div>
          <div className="home__pokerCard home__pokerCard--flop2">4</div>
          <div className="home__pokerCard home__pokerCard--flop3">A</div>
        </div>

        <div className="home__pulseStages" aria-hidden="true">
          <div className="home__stage home__stage--preflop">翻牌前</div>
          <div className="home__stage home__stage--flop">翻牌圈</div>
          <div className="home__stage home__stage--turn">转牌圈</div>
          <div className="home__stage home__stage--river">河牌圈</div>
        </div>
      </div>
    </section>
  )
}

export default HomeMidAnim

