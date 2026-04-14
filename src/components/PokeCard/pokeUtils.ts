import type { Rank, Suit } from 'texas-poker-core'
import { ranks } from 'texas-poker-core'

export type { Rank, Suit }
export { ranks }

/**
 * 展示用花色顺序：红桃、方片、黑桃、梅花（与 core 的 suits 顺序不同）。
 * `label` 供无障碍 `title` 等使用；行头花色请用 `SuitIcon` 渲染。
 */
export const SUIT_ORDER: { code: Suit; label: string }[] = [
  { code: 'h', label: '红桃' },
  { code: 'd', label: '方片' },
  { code: 's', label: '黑桃' },
  { code: 'c', label: '梅花' }
]

export function buildPokeKey(suit: Suit, rank: Rank): string {
  return `${suit}${rank}`
}

/** 解析接口返回的 poke 字符串，如 h2、sa、ht */
export function parsePokeKey(poke: string): { suit: Suit; rank: Rank } | null {
  const m = /^([hdsc])(.+)$/i.exec(poke.trim())
  if (!m) return null
  const suit = m[1].toLowerCase() as Suit
  let rank = m[2].toLowerCase()
  if (rank === '10') rank = 't'
  if (!(ranks as readonly string[]).includes(rank)) return null
  return { suit, rank: rank as Rank }
}

export function formatRankLabel(rank: Rank): string {
  if (rank === 't') return '10'
  return rank.toUpperCase()
}

/**
 * Pearson 残差热力：|r| 小偏绿，大偏红；heatmapScaleEnabled 为 false 时不着色（由调用方处理）
 * 文档：|r|≤2 浅绿，2~3 黄/琥珀，|r|>3 红；此处用 0~4.5 线性插值绿→黄→红
 */
export function pearsonResidualToHeatStyle(
  pearsonResidual: number | null,
  heatmapEnabled: boolean
): { background: string; borderColor: string; color: string } {
  if (!heatmapEnabled || pearsonResidual == null) {
    return {
      background: 'rgba(51, 65, 85, 0.45)',
      borderColor: 'rgba(148, 163, 184, 0.35)',
      color: 'rgba(248, 250, 252, 0.92)'
    }
  }
  const x = Math.min(Math.abs(pearsonResidual), 4.5)
  const u = x / 4.5
  const g = { r: 34, g: 197, b: 94 }
  const y = { r: 251, g: 191, b: 36 }
  const r = { r: 239, g: 68, b: 68 }
  let rgb: [number, number, number]
  if (u <= 0.5) {
    const t = u / 0.5
    rgb = [
      Math.round(g.r + (y.r - g.r) * t * 0.35),
      Math.round(g.g + (y.g - g.g) * t * 0.35),
      Math.round(g.b + (y.b - g.b) * t * 0.35)
    ]
  } else {
    const t = (u - 0.5) / 0.5
    const from = {
      r: Math.round(g.r + (y.r - g.r) * 0.35),
      g: Math.round(g.g + (y.g - g.g) * 0.35),
      b: Math.round(g.b + (y.b - g.b) * 0.35)
    }
    rgb = [
      Math.round(from.r + (r.r - from.r) * t),
      Math.round(from.g + (r.g - from.g) * t),
      Math.round(from.b + (r.b - from.b) * t)
    ]
  }
  return {
    background: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.52)`,
    borderColor: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.9)`,
    color: u > 0.65 ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.88)'
  }
}
