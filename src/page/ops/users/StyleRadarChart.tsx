import { useMemo, useState } from 'react'

import type { StyleRadarAxis } from '@/service/ops/types'

const CX = 180
const CY = 180
const R = 118

const polar = (i: number, n: number, ratio: number) => {
  const a = -Math.PI / 2 + (i / n) * Math.PI * 2
  return { x: CX + Math.cos(a) * R * ratio, y: CY + Math.sin(a) * R * ratio }
}

/** 展示值归一：技术分 0–100；频率轴按常见上限裁切 */
const normValue = (axis: StyleRadarAxis): number => {
  if (axis.value == null) return 0.08
  if (axis.key === 'skill') return Math.max(0.08, Math.min(1, axis.value / 100))
  const max =
    axis.key === 'threeBet' ? 20 : axis.key === 'wtsd' ? 50 : axis.key === 'afq' ? 80 : 60
  return Math.max(0.08, Math.min(1, axis.value / max))
}

const normAvg = (axis: StyleRadarAxis): number => {
  if (axis.avg == null) return 0.08
  if (axis.key === 'skill') return Math.max(0.08, Math.min(1, axis.avg / 100))
  const max =
    axis.key === 'threeBet' ? 20 : axis.key === 'wtsd' ? 50 : axis.key === 'afq' ? 80 : 60
  return Math.max(0.08, Math.min(1, axis.avg / max))
}

const fmt = (axis: StyleRadarAxis, v: number | null) => {
  if (v == null) return '—'
  if (axis.key === 'skill') return String(Math.round(v))
  return `${v.toFixed(1)}%`
}

type Props = {
  axes: StyleRadarAxis[]
  activeKey?: string | null
  /* eslint-disable no-unused-vars -- prop callback type only */
  onSelect: (axisKey: string) => void
  /* eslint-enable no-unused-vars */
  dimmed?: boolean
}

const StyleRadarChart = ({ axes, activeKey, onSelect, dimmed }: Props) => {
  const n = axes.length
  const [hover, setHover] = useState<string | null>(null)

  const grid = useMemo(() => {
    const rings: string[] = []
    for (let ring = 1; ring <= 5; ring++) {
      rings.push(
        axes
          .map((_, i) => {
            const p = polar(i, n, ring / 5)
            return `${p.x},${p.y}`
          })
          .join(' ')
      )
    }
    return rings
  }, [axes, n])

  const mePts = axes
    .map((a, i) => {
      const p = polar(i, n, normValue(a))
      return `${p.x},${p.y}`
    })
    .join(' ')

  const avgPts = axes
    .map((a, i) => {
      const p = polar(i, n, normAvg(a))
      return `${p.x},${p.y}`
    })
    .join(' ')

  return (
    <svg
      viewBox="0 0 360 360"
      width="100%"
      style={{ maxWidth: 420, opacity: dimmed ? 0.45 : 1, display: 'block', margin: '0 auto' }}
      role="img"
      aria-label="八轴牌风雷达"
    >
      {grid.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke="rgba(231,197,106,0.18)"
          strokeWidth={i === 4 ? 1.2 : 1}
        />
      ))}
      {axes.map((_, i) => {
        const p = polar(i, n, 1)
        return (
          <line
            key={`spoke-${i}`}
            x1={CX}
            y1={CY}
            x2={p.x}
            y2={p.y}
            stroke="rgba(231,197,106,0.12)"
          />
        )
      })}
      <polygon
        points={avgPts}
        fill="none"
        stroke="#fb7185"
        strokeWidth={1.6}
        strokeDasharray="4 4"
      />
      <polygon
        points={mePts}
        fill="rgba(94,234,212,0.2)"
        stroke="#5eead4"
        strokeWidth={2.2}
      />
      {axes.map((axis, i) => {
        const tip = polar(i, n, 1)
        const lp = polar(i, n, 1.28)
        const active = activeKey === axis.key || hover === axis.key
        return (
          <g
            key={axis.key}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(axis.key)}
            onMouseEnter={() => setHover(axis.key)}
            onMouseLeave={() => setHover(null)}
          >
            <circle cx={tip.x} cy={tip.y} r={16} fill="transparent" />
            <rect
              x={lp.x - 28}
              y={lp.y - 22}
              width={56}
              height={36}
              rx={8}
              fill={active ? 'rgba(94,234,212,0.16)' : 'rgba(0,0,0,0.25)'}
              stroke={active ? 'rgba(94,234,212,0.5)' : 'transparent'}
            />
            <text
              x={lp.x}
              y={lp.y - 6}
              textAnchor="middle"
              fill="#f3efe6"
              fontSize={10}
              fontWeight={700}
            >
              {axis.label}
            </text>
            <text
              x={lp.x}
              y={lp.y + 8}
              textAnchor="middle"
              fill="#5eead4"
              fontSize={9}
              fontFamily="ui-monospace, monospace"
            >
              {fmt(axis, axis.value)}
            </text>
            <circle
              cx={tip.x}
              cy={tip.y}
              r={3.5}
              fill="#5eead4"
              stroke={active ? '#fff' : 'none'}
              strokeWidth={2}
            />
          </g>
        )
      })}
    </svg>
  )
}

export default StyleRadarChart
export { fmt as formatRadarAxisValue }
