import './index.less'

const HomePlanetRing = () => {
  return (
    <div className="home__planetRing" aria-hidden="true">
      <div className="home__ringPlane">
        <div className="home__ring" />
      </div>

      <div className="home__coinPlane">
        <div className="home__coinOrbit">
          <div className="home__coin" />
        </div>
      </div>

      <div className="home__planetCore" />
    </div>
  )
}

export default HomePlanetRing

