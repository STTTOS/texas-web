import type { Suit } from 'texas-poker-core'

import styles from './index.module.less'

export interface SuitIconProps {
  suit: Suit
  className?: string
}

/** 扑克花色矢量图标（继承父级 `color`） */
const SuitIcon = ({ suit, className }: SuitIconProps) => {
  const svgClass = [styles.svg, className || ''].filter(Boolean).join(' ')
  const common = {
    className: svgClass,
    viewBox: '0 0 24 24' as const,
    fill: 'currentColor' as const,
    'aria-hidden': true as const
  }
  switch (suit) {
  case 'h':
    return (
      <svg {...common}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    )
  case 'd':
    return (
      <svg {...common}>
        <path d="M12 3.2L20.8 12 12 20.8 3.2 12 12 3.2z" />
      </svg>
    )
  case 's':
    return (
      <svg {...common}>
        <path d="M12 2.4c-3.15 5.4-7.75 7.45-7.75 12.05 0 3.35 2.85 6 6.35 6 .55 0 1.1-.1 1.65-.28.55.18 1.1.28 1.65.28 3.5 0 6.35-2.65 6.35-6 0-4.6-4.6-6.65-7.75-12.05z" />
        <path d="M11.15 17.35h1.7l.85 4.65h-3.4l.85-4.65z" />
      </svg>
    )
  case 'c':
  default:
    return (
      <svg {...common}>
        <circle cx="12" cy="6.8" r="3.35" />
        <circle cx="7.15" cy="12.4" r="3.35" />
        <circle cx="16.85" cy="12.4" r="3.35" />
        <path d="M10.35 15.1H13.65L14.35 22H9.65L10.35 15.1z" />
      </svg>
    )
  }
}

export default SuitIcon
