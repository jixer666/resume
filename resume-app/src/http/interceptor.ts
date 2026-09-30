import type { CustomRequestOptions } from '@/http/types'
import { useTokenStore } from '@/store'
import { getEnvBaseUrl } from '@/utils'
import { stringifyQuery } from './tools/queryString'

// 请求基准地址
const baseUrl = getEnvBaseUrl()

/**
 * 把业务路径解析成最终请求地址：绝对地址原样返回，相对地址拼基准地址
 * （H5 开发环境开启代理时走代理前缀）。
 *
 * 上传接口的 H5 分支用 XHR 发请求（见 api/file.ts），走不到本文件的拦截器，
 * 所以把地址规则导出复用，保证拼接规则只有这一处。
 */
export function resolveRequestUrl(url: string): string {
  if (url.startsWith('http'))
    return url
  // #ifdef H5
  if (JSON.parse(import.meta.env.VITE_APP_PROXY_ENABLE))
    return import.meta.env.VITE_APP_PROXY_PREFIX + url
  // #endif
  return baseUrl + url
}

/** 取当前登录态的鉴权请求头：未登录时为空对象，同样给 H5 的 XHR 上传复用 */
export function getAuthHeader(): Record<string, string> {
  const token = useTokenStore().updateNowTime().validToken
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: CustomRequestOptions) {
    // 如果您使用了alova，则请把下面的代码放开注释
    // alova 执行流程：alova beforeRequest --> 本拦截器 --> alova responded
    // return options

    // 非 alova 请求，正常执行
    // 接口请求支持通过 query 参数配置 queryString
    if (options.query) {
      const queryStr = stringifyQuery(options.query)
      if (options.url.includes('?')) {
        options.url += `&${queryStr}`
      }
      else {
        options.url += `?${queryStr}`
      }
    }
    // 非 http 开头需拼接地址
    // TIPS: 如果需要对接多个后端服务，在 resolveRequestUrl 里处理，拼接成所需要的地址
    options.url = resolveRequestUrl(options.url)
    // 1. 请求超时
    options.timeout = 60000 // 60s
    // 2. （可选）添加小程序端请求头标识
    // 3. 添加 token 请求头标识
    options.header = {
      ...options.header,
      ...getAuthHeader(),
    }
    return options
  },
}

export const requestInterceptor = {
  install() {
    // 拦截 request 请求
    uni.addInterceptor('request', httpInterceptor)
    // 拦截 uploadFile 文件上传
    uni.addInterceptor('uploadFile', httpInterceptor)
  },
}
