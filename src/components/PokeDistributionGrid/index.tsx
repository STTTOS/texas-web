import type { PokeDistributionItem } from '@/service/match/handPokeAuditTypes'

import { Tooltip } from 'antd'

import PokeCard from '@/components/PokeCard'
import SuitIcon from '@/components/SuitIcon'
import {
  SUIT_ORDER,
  buildPokeKey,
  pearsonResidualToHeatStyle,
  ranks
} from '@/components/PokeCard/pokeUtils'
import styles from './index.module.less'

function buildMap(list: PokeDistributionItem[]) {
  const m = new Map<string, PokeDistributionItem>()
  for (const row of list) {
    m.set(row.poke.toLowerCase(), row)
  }
  return m
}

export interface PokeDistributionGridProps {
  items: PokeDistributionItem[]
  heatmapScaleEnabled: boolean
}

const PokeDistributionGrid = ({
  items,
  heatmapScaleEnabled
}: PokeDistributionGridProps) => {
  const map = buildMap(items)

  return (
    <div className={styles.grid}>
      {SUIT_ORDER.map(({ code: suit, label: suitLabel }) => (
        <div key={suit} className={styles.row}>
          <div className={styles.rowLabel}>
            <span
              className={styles.suitBadge}
              data-suit={suit}
              title={suitLabel}
            >
              <SuitIcon suit={suit} className={styles.rowSuitIcon} />
            </span>
          </div>
          <div className={styles.cells}>
            {ranks.map((rank) => {
              const key = buildPokeKey(suit, rank)
              const row = map.get(key)
              const count = row?.count ?? 0
              const heat = pearsonResidualToHeatStyle(
                row?.pearsonResidual ?? null,
                heatmapScaleEnabled
              )
              const inner = (
                <div
                  className={styles.cell}
                  style={{
                    background: heat.background,
                    borderColor: heat.borderColor,
                    color: heat.color
                  }}
                >
                  <PokeCard suit={suit} rank={rank} />
                  <span className={styles.count}>{count}</span>
                </div>
              )
              if (!row) {
                return (
                  <div key={key} className={styles.cellWrap}>
                    {inner}
                  </div>
                )
              }
              return (
                <Tooltip
                  key={key}
                  title={
                    <div className={styles.tip}>
                      <div>
                        <strong>{row.poke}</strong>
                      </div>
                      <div>出现次数：{row.count}</div>
                      <div>期望：{row.expectedCount.toFixed(2)}</div>
                      <div>
                        Pearson 残差 r：
                        {row.pearsonResidual == null
                          ? '—'
                          : row.pearsonResidual.toFixed(3)}
                      </div>
                    </div>
                  }
                >
                  <div className={styles.cellWrap}>{inner}</div>
                </Tooltip>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PokeDistributionGrid
