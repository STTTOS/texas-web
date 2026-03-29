import betterRequest from '@/utils/http'

export async function fetchMaintenanceStatus() {
  const { data } = await betterRequest<{ enabled: boolean }>(
    '/api/web/system/maintenance/status',
    {}
  )
  return data.enabled
}

export async function setMaintenanceEnabled(enabled: boolean) {
  await betterRequest('/api/web/system/maintenance/set', { enabled })
}
