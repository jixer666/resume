import type { HttpError } from '@/http/types'
import { describe, expect, it } from 'vitest'
import { parseUploadResult } from './file'

/** 成功响应：后端 ApiResult.success(FileVO) */
const successBody = JSON.stringify({
  code: 200,
  msg: null,
  data: { id: 1, downloadUrl: 'http://127.0.0.1:17000/system/oss/download/1' },
})

/** 取同步函数抛出的错误：http 层的错误是 HttpError 形状而不是 Error 实例，toThrow 匹配不上 */
function errorOf(run: () => unknown): HttpError {
  try {
    run()
  }
  catch (error) {
    return error as HttpError
  }
  throw new Error('预期抛出错误，但没有')
}

/**
 * 上传响应的解析是前后端的契约：业务码 200 且带 downloadUrl 才算成功，
 * 其余情况必须 reject，页面才拿得到可提示的消息。
 */
describe('parseUploadResult', () => {
  it('业务码 200 且带 downloadUrl 时返回文件记录', () => {
    const file = parseUploadResult(200, successBody)
    expect(file.downloadUrl).toBe('http://127.0.0.1:17000/system/oss/download/1')
  })

  it('业务码失败时抛出后端消息', () => {
    const body = JSON.stringify({ code: 500, msg: '上传文件出错', data: null })
    const error = errorOf(() => parseUploadResult(200, body))
    expect(error.type).toBe('business')
    expect(error.message).toBe('上传文件出错')
  })

  it('状态码 500 时抛出状态提示', () => {
    const error = errorOf(() => parseUploadResult(500, '{}'))
    expect(error.type).toBe('http')
    expect(error.message).toBe('服务器错误(500)，请检查网络或联系管理员！')
  })

  it('响应不是 JSON 时抛出解析失败', () => {
    const error = errorOf(() => parseUploadResult(200, '<html></html>'))
    expect(error.type).toBe('http')
    expect(error.message).toBe('上传响应解析失败')
  })

  it('成功但缺少 downloadUrl 时抛出', () => {
    const body = JSON.stringify({ code: 200, msg: null, data: { id: 1 } })
    const error = errorOf(() => parseUploadResult(200, body))
    expect(error.message).toBe('上传成功但未返回文件地址')
  })
})
