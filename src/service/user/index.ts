import betterRequest from '@/utils/http'

import type { User, WebLoginData, WebUserInfo } from './types'

/** POST /api/web/user/login */
export async function webLogin(body: { username: string; password: string }) {
  const { data } = await betterRequest<WebLoginData>('/api/web/user/login', body)
  return data
}

/** 用户信息 */
export async function fetchWebUserInfo() {
  const { data } = await betterRequest<WebUserInfo>('/api/web/user/info', {})
  return data
}

/** 管理端布局拉取用户：与 web 用户信息统一 */
export async function getUser(...args: unknown[]): Promise<User> {
  void args
  const { data } = await betterRequest<User>('/api/web/user/info', {})
  return data
}

export async function logout(): Promise<void> {
  try {
    await betterRequest('/api/web/user/logout', {})
  } catch {
    /* 退出登录允许失败 */
  }
}