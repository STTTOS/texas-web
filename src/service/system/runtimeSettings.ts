import betterRequest from '@/utils/http'

/** 与后端 `GameRuntimeConfigPatch` / `GameRuntimeConfigSnapshot` 对齐（可 PATCH 的键） */
export const runtimeSettingsPatchKeys = [
  'actionRequiredWsDelayMs',
  'stageChangedWsDelayMs',
  'startGameBeforeAssignRolesDelayMs',
  'nextHandCountdownPushDelayMs',
  'nextHandLockAtOffsetMs',
  'nextHandLockedTailBeforeEndsMs',
  'nextHandDealAfterEndMs',
  'nextHandStartAfterDealMs'
] as const

export type RuntimeSettingsPatchKey = (typeof runtimeSettingsPatchKeys)[number]

export type RuntimeSettingsSnapshot = Record<RuntimeSettingsPatchKey, number> & {
  /** 只读派生：lock + tail */
  nextHandEndsAtOffsetMs: number
}

export type RuntimeSettingsFieldDef = {
  key: RuntimeSettingsPatchKey
  label: string
  group: 'websocket' | 'nextHand' | 'firstHand'
  description: string
  minMs: number
  maxMs: number
}

export type RuntimeSettingsDetail = {
  snapshot: RuntimeSettingsSnapshot
  fields: RuntimeSettingsFieldDef[]
}

export async function fetchRuntimeSettingsDetail() {
  const { data } = await betterRequest<RuntimeSettingsDetail>(
    '/api/web/system/runtime-settings/detail',
    {}
  )
  return data
}

export async function updateRuntimeSettings(
  patch: Partial<Record<RuntimeSettingsPatchKey, number>>
) {
  const { data } = await betterRequest<RuntimeSettingsSnapshot>(
    '/api/web/system/runtime-settings/update',
    patch
  )
  return data
}
