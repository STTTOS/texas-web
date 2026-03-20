import type { User, WebUserInfo } from '@/service/user/types'

import { create } from 'zustand'

import { fetchWebUserInfo } from '@/service/user'

export type UserModel = WebUserInfo | null

/* eslint-disable no-unused-vars -- 类型签名参数名被误报 */
interface UserStore {
  user: UserModel
  set: (next: UserModel) => void
  fetch: (...args: unknown[]) => Promise<void>
  reset: () => void
}
/* eslint-enable no-unused-vars */

const useUserInfoStore = create<UserStore>((set) => ({
  user: null,
  set: (next) => set({ user: next }),
  fetch: async (...args: unknown[]) => {
    void args
    const data = await fetchWebUserInfo()
    if (!data) {
      set({ user: null })
      return
    }

    // 归一：后端字段是 `avatarUrl`，但历史组件依赖 `avatar`
    const normalized: WebUserInfo = {
      ...(data as unknown as User),
      avatar:
        (data as unknown as { avatar?: string; avatarUrl?: string }).avatar ??
        (data as unknown as { avatarUrl?: string }).avatarUrl ??
        ''
    }

    set({ user: normalized })
  },
  reset: () => {
    set({ user: null })
  }
}))

export default function useUserInfo(): UserStore {
  return useUserInfoStore()
}
