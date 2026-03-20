import classnames from 'classnames'

import styles from './index.module.less'

interface Props {
  avatarUrl?: string | null
  avatarKey?: string
  name?: string
  className?: string
}

const UserAvatar: React.FC<Props> = ({ avatarUrl, avatarKey, name, className }) => {
  const avatarText = (name || 'U').slice(0, 1).toUpperCase()

  return (
    <div className={classnames(styles.avatar, className)} data-avatar-key={avatarKey || undefined}>
      {avatarUrl ? <img className={styles.img} src={avatarUrl} alt={name || 'avatar'} /> : avatarText}
    </div>
  )
}

export default UserAvatar
