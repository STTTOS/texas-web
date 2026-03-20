import type { MouseEventHandler, ReactNode } from 'react'

import { useNavigate } from 'react-router-dom'

import { useUserInfo } from '@/model'

interface Props {
  className?: string
  to: string
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const RequireUserButton: React.FC<Props> = ({ className, to, children, onClick }) => {
  const nav = useNavigate()
  const { user } = useUserInfo()

  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        if (!user) {
          nav('/login')
          return
        }
        onClick?.(e)
        nav(to)
      }}
    >
      {children}
    </button>
  )
}

export default RequireUserButton
