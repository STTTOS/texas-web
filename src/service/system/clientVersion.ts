import betterRequest from '@/utils/http'

export type ClientMinVersionDetail = {
  minVersion: string
  hint: string
}

export async function fetchClientMinVersionDetail() {
  const { data } = await betterRequest<ClientMinVersionDetail>(
    '/api/web/system/client-version/detail',
    {}
  )
  return data
}

export async function setClientMinVersion(minVersion: string) {
  const { data } = await betterRequest<{ minVersion: string }>(
    '/api/web/system/client-version/set',
    { minVersion }
  )
  return data
}
