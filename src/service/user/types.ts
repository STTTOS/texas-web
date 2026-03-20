/** 全站通用用户结构（按后端字段） */
export interface User {
  id: number
  username: string
  name: string
  avatarUrl: string
  isAdmin: boolean
  createdAt: string
  updatedAt: string

  /**
   * 兼容历史组件：旧代码使用 `avatar`
   * 后续如果你决定全量改成 `avatarUrl`，可删除此字段和归一逻辑
   */
  avatar?: string

  [key: string]: unknown
}

/** 登录接口返回：按后端实际字段可再扩展 */
export interface WebLoginData {
  token: string
  [key: string]: unknown
}

/** /api/web/user/info 用户信息 */
export type WebUserInfo = User
