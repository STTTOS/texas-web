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
  options?: RequestOptionsInit
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

    // 后端已移除业务 code：成功只依赖 HTTP 2xx
    // 兼容成功结构：
    // 1) { ok, data, message }（Web 管理端部分接口）
    // 2) { data, msg }
    // 3) 直接返回 data
    if (response && typeof response === 'object' && 'ok' in response) {
      const r = response as {
        ok: boolean
        data: R
        message?: string
        msg?: string
      }
      if (r.ok === false) {
        const errMsg = r.message || r.msg || '请求失败'
        message.error(errMsg)
        throw { data: { msg: errMsg }, response: { status: 400 } }
      }
      return { data: r.data, msg: r.message ?? r.msg ?? '' }
    }
    if (response && typeof response === 'object' && 'data' in response) {
      const r = response as ResBasic<R>
      return { data: r.data, msg: r.msg }
    }
    return { data: response as R, msg: '' }
  } catch (error) {
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
        (data as any)?.message ||
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
  options?: RequestOptionsInit
) => {
  return betterRequest<R>(url, undefined, undefined, {
    ...options,
    method: 'get',
    params
  })
}
export default betterRequest
