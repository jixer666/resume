import type { IFileUploadParams, IFileVO } from './types/file'
import type { HttpError, IResponse } from '@/http/types'
import { getAuthHeader, resolveRequestUrl } from '@/http/interceptor'
import { createHttpError, getResponseMessage, HttpErrorType, isSuccessResultCode, ShowMessage } from '@/http/tools/enum'

/** 后端 OSS 上传接口（OssController#uploadOss） */
const UPLOAD_URL = '/system/oss/upload'

/**
 * 上传文件到后端 OSS，返回文件记录（含可直接存进简历 JSON 的下载地址）。
 *
 * 为什么不走 `http`：上传是 multipart 表单，JSON 通道传不了文件。
 * 为什么 H5 单独用 XHR：`uni.uploadFile` 在 H5 会把 blob 地址里的 UUID 当文件名，
 * 而后端按文件名取扩展名拼 OSS 对象名，这里用 FormData 自己带上带扩展名的文件名；
 * 小程序 / App 的临时路径自带扩展名，直接交给 `uni.uploadFile`（地址与鉴权头
 * 由 interceptor.ts 的拦截器自动补）。
 */
export function uploadFile(params: IFileUploadParams): Promise<IFileVO> {
  let task: Promise<IFileVO>
  // #ifdef H5
  task = uploadByXhr(params)
  // #endif
  // #ifndef H5
  task = uploadByUni(params)
  // #endif
  return task
}

// #ifdef H5
function uploadByXhr(params: IFileUploadParams): Promise<IFileVO> {
  return new Promise((resolve, reject) => {
    readBlob(params.filePath).then((blob) => {
      const form = new FormData()
      form.append('file', blob, params.fileName)
      form.append('fileMd5', params.fileMd5)
      form.append('fileType', params.fileType)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', resolveRequestUrl(UPLOAD_URL))
      xhr.onload = () => settleUpload(xhr.status, xhr.responseText, resolve, reject)
      xhr.onerror = () => reject(createHttpError({ type: HttpErrorType.Network, message: '网络错误，换个网络试试' }))
      const { Authorization } = getAuthHeader()
      if (Authorization)
        xhr.setRequestHeader('Authorization', Authorization)
      xhr.send(form)
    }).catch(reject)
  })
}

/** H5 里先把 blob 地址读回 Blob，才能按原始文件名拼 multipart 表单 */
function readBlob(filePath: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', filePath)
    xhr.responseType = 'blob'
    xhr.onload = () => resolve(xhr.response as Blob)
    xhr.onerror = () => reject(new Error('图片读取失败，请重试'))
    xhr.send()
  })
}
// #endif

// #ifndef H5
function uploadByUni(params: IFileUploadParams): Promise<IFileVO> {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: UPLOAD_URL,
      filePath: params.filePath,
      name: 'file',
      formData: {
        fileMd5: params.fileMd5,
        fileType: params.fileType,
      },
      success: res => settleUpload(res.statusCode, res.data, resolve, reject),
      fail: () => reject(createHttpError({ type: HttpErrorType.Network, message: '网络错误，换个网络试试' })),
    })
  })
}
// #endif

/** 把解析结果交给 Promise：失败按 `http` 的错误分类 reject */
function settleUpload(
  statusCode: number,
  responseText: string,
  resolve: (value: IFileVO) => void,
  reject: (reason: HttpError) => void,
) {
  try {
    resolve(parseUploadResult(statusCode, responseText))
  }
  catch (error) {
    reject(error as HttpError)
  }
}

/**
 * 解析上传响应：HTTP 与业务码都成功才算成功，失败抛 `http` 的错误分类（与 http.ts 的约定一致）。
 * 导出供单测锁定与后端的响应契约。
 */
export function parseUploadResult(statusCode: number, responseText: string): IFileVO {
  let body: Partial<IResponse<IFileVO>> | undefined
  try {
    body = JSON.parse(responseText)
  }
  catch {
    throw createHttpError({ type: HttpErrorType.Http, statusCode, message: '上传响应解析失败' })
  }
  if (statusCode < 200 || statusCode >= 300)
    throw createHttpError({ type: HttpErrorType.Http, statusCode, message: getResponseMessage(body, ShowMessage(statusCode)) })
  const code = body.code
  if (typeof code !== 'number' || !isSuccessResultCode(code))
    throw createHttpError({ type: HttpErrorType.Business, code, statusCode, message: getResponseMessage(body) })
  const file = body.data
  if (!file?.downloadUrl)
    throw createHttpError({ type: HttpErrorType.Business, statusCode, message: '上传成功但未返回文件地址' })
  return file
}
