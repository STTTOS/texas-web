/* eslint-disable @typescript-eslint/no-explicit-any */
import { message } from 'antd'
import { join } from 'path-browserify'
import { extend, ResponseError, RequestOptionsInit } from 'umi-request'

import { ResBasic } from './types'
import { baseUrl } from '@/config'
import { history } from '@/components/BrowserRouter'

const request = extend({
  timeout: 120 * 1000,
  timeoutMessage: '网络超时'
})

request.interceptors.request.use((url: string, options: any) => {
  return { url: baseUrl + url, options }
})

/** 统一跳转方法（支持路由跳转与 location 跳转） */
function navigateTo(path: string, mode: 'href' | 'route' = 'route') {
  if (mode === 'href') {
    location.href = path
  } else {
    history.push(path)
  }
}

async function betterRequest<R>(
  url: string,
  params?: Record<string, any>,
  file?: FormData,
  options?: RequestOptionsInit & { origin?: boolean }
) {
  try {
    const response = await request<ResBasic<R> | R>(
      url.startsWith('http') ? url : join('/', url),
      {
        method: 'POST',
        data: file || params,
        requestType: file ? 'form' : 'json',
        ...options
      }
    )
    if (options?.origin) return response

    // 后端已移除业务 code：成功只依赖 HTTP 2xx
    // 兼容两种成功结构：
    // 1) { data, msg }
    // 2) 直接返回 data
    if (response && typeof response === 'object' && 'data' in response) {
      const r = response as ResBasic<R>
      return { data: r.data, msg: r.msg }
    }
    return { data: response as R, msg: '' }
  } catch (error) {
    if (options?.origin) throw error

    const err = error as ResponseError
    const { data, response } = err
    const httpStatus = Number((response as any)?.status)

    if (httpStatus === 401) {
      navigateTo(`/login?from=${encodeURIComponent(location.pathname)}`)
    } else if (httpStatus === 403) {
      navigateTo('/403')
    } else if (httpStatus === 404) {
      navigateTo('/404')
    }

    if (httpStatus !== 401 && httpStatus !== 403) {
      const serverMsg =
        (data as any)?.msg ||
        (typeof data === 'string' ? data : undefined) ||
        '服务器内部错误'
      message.error(serverMsg)
    }
    if (String(httpStatus).startsWith('50')) {
      navigateTo('/500')
    }
    throw error
  }
}
betterRequest.get = <R = unknown>(
  url: string,
  params?: Record<string, any>,
  options?: RequestOptionsInit & { origin?: boolean }
) => {
  return betterRequest<R>(url, undefined, undefined, {
    ...options,
    method: 'get',
    params
  })
}
export default betterRequest
