import type { IResumeDetail, IResumeListRes, IResumeSaveParams } from './types/resume'
import { http } from '@/http/http'

/**
 * 简历列表：后端按更新时间倒序返回当前用户的全部简历。
 */
export function getResumeList() {
  return http.get<IResumeListRes>('/resume/list')
}

/**
 * 简历详情：带完整简历 JSON
 */
export function getResumeDetail(id: number) {
  return http.get<IResumeDetail>(`/resume/detail/${id}`)
}

/**
 * 保存简历：id 为空走新建，有值走更新，返回落库后的摘要
 */
export function saveResume(data: IResumeSaveParams) {
  return http.post<IResumeDetail>('/resume/save', { ...data })
}

/**
 * 复制简历：以服务端数据为准复制一份，返回新简历
 */
export function copyResume(id: number) {
  return http.post<IResumeDetail>(`/resume/copy/${id}`)
}

/**
 * 删除简历（软删除）
 */
export function deleteResume(id: number) {
  return http.post<void>(`/resume/delete/${id}`)
}
