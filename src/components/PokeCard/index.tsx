import type { Rank, Suit } from 'texas-poker-core'

import SuitIcon from '@/components/SuitIcon'

import { formatRankLabel } from './pokeUtils'
import styles from './index.module.less'

export interface PokeCardProps {
  suit: Suit
  rank: Rank
  className?: string
}

const PokeCard = ({ suit, rank, className }: PokeCardProps) => {
  return (
    <div
      className={[styles.card, className || ''].join(' ')}
      data-suit={suit}
    >
      <span className={styles.rank}>{formatRankLabel(rank)}</span>
      <span className={styles.suitCorner} aria-hidden>
        <SuitIcon suit={suit} className={styles.suitSvg} />
      </span>
    </div>
  )
}

export default PokeCard
