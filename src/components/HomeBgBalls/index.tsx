import type { CSSProperties, FC } from 'react'
import { useMemo } from 'react'

import './index.less'

type Ball = {
  x: string
  y: string
  size: number
  dx: number
  dy: number
  dur: number
  delay: number
  blur: number
  op: number
}

interface HomeBgBallsProps {
  /**
   * 小球数量
   */
  count?: number
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function makeBalls(count: number, seed = 1337): Ball[] {
  const rand = mulberry32(seed)
  const result: Ball[] = []

  for (let i = 0; i < count; i++) {
    const x = `${Math.round(rand() * 90 + 5)}%`
    const y = `${Math.round(rand() * 80 + 8)}%`

    const dx = Math.round((rand() - 0.5) * 260)
    const dy = Math.round((rand() - 0.5) * 260)

    const size = Math.round(rand() * 10 + 6)
    const dur = Number((rand() * 12 + 14).toFixed(1))
    const delay = -Number((rand() * dur).toFixed(1))
    const blur = Number((rand() * 0.13 + 0.05).toFixed(2))
    const op = Number(clamp(rand() * 0.22 + 0.32, 0.3, 0.62).toFixed(2))

    result.push({ x, y, size, dx, dy, dur, delay, blur, op })
  }

  return result
}

const HomeBgBalls: FC<HomeBgBallsProps> = ({ count = 20 }) => {
  const balls = useMemo(() => makeBalls(count), [count])

  return (
    <div className="home__balls" aria-hidden="true">
      {balls.map((b, idx) => {
        const style = {
          '--x': b.x,
          '--y': b.y,
          '--size': `${b.size}px`,
          '--dx': `${b.dx}px`,
          '--dy': `${b.dy}px`,
          '--dur': `${b.dur}s`,
          '--delay': `${b.delay}s`,
          '--blur': `${b.blur}px`,
          '--op': String(b.op)
        } as unknown as CSSProperties

        return <span key={idx} className="home__ball" style={style} />
      })}
    </div>
  )
}

export default HomeBgBalls

