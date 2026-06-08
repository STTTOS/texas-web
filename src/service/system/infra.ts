import betterRequest from '@/utils/http'

export type SslUploadResult = {
  dir: string
  files: string[]
}

export type NginxCommandResult = {
  ok: true
  output: string
}

export async function uploadSslCerts(files: File[]) {
  const form = new FormData()
  files.forEach((file) => {
    form.append('files', file, file.name)
  })
  const { data } = await betterRequest<SslUploadResult>(
    '/api/web/system/infra/ssl/upload',
    undefined,
    form
  )
  return data
}

export async function testNginxConfig() {
  const { data } = await betterRequest<NginxCommandResult>(
    '/api/web/system/infra/nginx/test',
    {}
  )
  return data
}

export async function applyNginxReload() {
  const { data } = await betterRequest<NginxCommandResult>(
    '/api/web/system/infra/nginx/apply',
    {}
  )
  return data
}
