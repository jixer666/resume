import type { IResumeDetail, IResumeListRes, IResumeSaveParams } from './types/resume'
import { http } from '@/http/http'

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
