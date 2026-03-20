import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { useUserInfo } from '@/model'

const AuthLayout = () => {
  const { user, fetch } = useUserInfo()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    fetch()
      .catch(() => {
        /* 失败时按无权限处理 */
      })
      .finally(() => {
        if (mounted) setReady(true)
      })
    return () => {
      mounted = false
    }
  }, [fetch])

  if (!ready) return null

  if (!user?.isAdmin) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}

export default AuthLayout
