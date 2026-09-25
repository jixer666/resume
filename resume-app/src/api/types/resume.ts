import type IRESUMEJSON from '@/interface/resume'

/**
 * 简历列表项 / 详情基础字段，字段对齐后端 ResumeVO。
 */
export interface IResumeBrief {
  /** 后端主键，新建前不存在 */
  id: number
  /** 简历名称（后端 title） */
  name: string
  /** 布局标识，对齐 JSON 里的 LAYOUT */
  layout: string
  /** 缩略图地址，未生成时为空串 */
  thumbnail: string
  /** 后端格式固定为 yyyy-MM-dd HH:mm:ss */
  updateTime: string
}

/**
 * 简历详情：比列表项多一份完整简历 JSON。
 */
export interface IResumeDetail extends IResumeBrief {
  /** 整份简历 JSON，后端解析失败时为 null */
  resumeJson: IRESUMEJSON | null
}

/**
 * 保存入参：id 为空表示新建，有值表示覆盖更新。
 */
export interface IResumeSaveParams {
  id?: number
  name: string
  layout: string
  thumbnail?: string
  resumeJson: IRESUMEJSON
}

/**
 * 列表返回：后端 PageResult 只有 list + total，没有分页游标。
 */
export interface IResumeListRes {
  list: IResumeBrief[]
  total: number
}
