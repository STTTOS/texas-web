import styles from './index.module.less'
import UserAvatar from '@/components/UserAvatar'

interface Props {
  name: string
  username: string
  avatarUrl?: string | null
  avatarKey?: string
}

const UserIdentityBadge: React.FC<Props> = ({ name, username, avatarUrl, avatarKey }) => {
  return (
    <div className={styles.user}>
      <UserAvatar
        className={styles.userAvatar}
        avatarUrl={avatarUrl}
        avatarKey={avatarKey}
        name={name || username}
      />
      <div className={styles.userInfo}>
        <div className={styles.userName}>{name}</div>
        <div className={styles.userAccount}>{username}</div>
      </div>
    </div>
  )
}

export default UserIdentityBadge
