import { Poke } from "texas-poker-core"

export type HandPokeAuditStatus =
  | 'insufficient_data'
  | 'normal'
  | 'abnormal'

export interface HandPokeAuditListItem {
  userId: number
  name: string
  avatarKey: string
  avatarUrl: string | null
  handCount: number
  auditStatus: HandPokeAuditStatus
  chiSquare: number | null
  pValue: number | null
}

export interface HandPokeAuditListResult {
  total: number
  list: HandPokeAuditListItem[]
}

export interface PokeDistributionItem {
  poke: Poke
  count: number
  expectedCount: number
  pearsonResidual: number | null
}

export interface HandPokeAuditDetail {
  userId: number
  name: string
  avatarKey: string
  avatarUrl: string | null
  handCount: number
  cardCount: number
  auditStatus: HandPokeAuditStatus
  chiSquare: number | null
  pValue: number | null
  heatmapScaleEnabled: boolean
  pokeDistribution: PokeDistributionItem[]
}
