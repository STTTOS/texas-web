import type { ComponentPropsWithoutRef } from 'react'

import styles from './index.module.less'
import UserAvatar from '@/components/UserAvatar'

interface Props extends ComponentPropsWithoutRef<'div'> {
  name: string
  username: string
  avatarUrl?: string | null
  avatarKey?: string
}

const UserIdentityBadge: React.FC<Props> = ({
  name,
  username,
  avatarUrl,
  avatarKey,
  className,
  ...rest
}) => {
  return (
    <div className={className ? `${styles.user} ${className}` : styles.user} {...rest}>
      <UserAvatar avatarUrl={avatarUrl} avatarKey={avatarKey} name={name || username} />
      <div className={styles.userInfo}>
        <div className={styles.userName}>{name}</div>
        <div className={styles.userAccount}>{username}</div>
      </div>
    </div>
  )
}

export default UserIdentityBadge
