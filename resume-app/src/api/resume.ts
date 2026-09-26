import type { IResumeDetail, IResumeListRes, IResumeSaveParams } from './types/resume'
import { http } from '@/http/http'
import { useTokenStore } from '@/store/token'
import { getEnvBaseUrl } from '@/utils'

/**
 * 简历提交动作，取值与后端 UserResumeSubmitDTO 的 act 常量一一对应。
 */
export const RESUME_ACT = {
  /** 新增 */
  ADD: 0,
  /** 更新 */
  UPDATE: 1,
  /** 删除 */
  DELETE: 2,
  /** 复制 */
  COPY: 3,
} as const

/**
 * 简历列表：走后端分页接口，返回当前用户的简历（按更新时间倒序）。
 */
export function getResumeList() {
  return http.post<IResumeListRes>('/resume/page', {}, { pageNum: 1, pageSize: 100 })
}

/**
 * 简历详情：带完整简历 JSON
 */
export function getResumeDetail(id: number) {
  return http.get<IResumeDetail>(`/resume/detail/${id}`)
}

/**
 * 保存简历：id 为空走新增，有值走更新，返回落库后的摘要。
 *
 * 新增 / 更新共用后端 `/resume/submit`，靠 act 区分。
 */
export function saveResume(data: IResumeSaveParams) {
  const act = data.id ? RESUME_ACT.UPDATE : RESUME_ACT.ADD
  return http.post<IResumeDetail>('/resume/submit', { ...data, act })
}

/**
 * 复制简历：以服务端数据为准复制一份，返回新简历
 */
export function copyResume(id: number) {
  return http.post<IResumeDetail>('/resume/submit', { act: RESUME_ACT.COPY, id })
}

/**
 * 删除简历（软删除）
 */
export function deleteResume(id: number) {
  return http.post<void>('/resume/submit', { act: RESUME_ACT.DELETE, id })
}

/**
 * 导出简历为 PDF，返回小程序临时文件路径（可直接交给 `uni.openDocument` 打开）。
 *
 * 为什么不走 `http`：导出接口返回的是 `application/pdf` 二进制流，而 `http` 是 JSON 通道
 * （`dataType: 'json'`，还会按业务码解包），二进制流必须用 `uni.downloadFile`。
 *
 * 又因为 `interceptor.ts` 只注册了 `request` / `uploadFile` 两个拦截器，`downloadFile`
 * 不会自动拼 baseUrl、也不会自动带鉴权头，所以这里手动补上这两样。
 */
export function exportResumePdf(id: number): Promise<string> {
  const token = useTokenStore().updateNowTime().validToken
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url: `${getEnvBaseUrl()}/resume/export/${id}`,
      header: token ? { Authorization: `Bearer ${token}` } : {},
      success: (res) => {
        // 鉴权失败等异常场景下后端会退回 JSON 错误体，此时拿不到文件
        if (res.statusCode !== 200) {
          reject(new Error(`导出失败（${res.statusCode}）`))
          return
        }
        resolve(res.tempFilePath)
      },
      fail: error => reject(new Error(error.errMsg || '导出失败')),
    })
  })
}
