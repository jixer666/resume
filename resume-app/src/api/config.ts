import type IGlobalStyle from '@/interface/globalStyle'
import type IMODELSTYLE from '@/interface/modelStyle'
import { http } from '@/http/http'

/**
 * 简历前端配置：出厂默认全局样式 + 各模块默认样式 + 问题反馈群入口。
 *
 * 后端 ConfigController 把 config 表的 resumeTemplateConfig / globalConfig 两项聚合后下发，
 * 前端启动时拉一次缓存：本地新建简历 / 新增模块据此取样式，问题反馈群入口据此决定是否展示。
 */
export interface IResumeConfig {
  globalStyle?: Partial<IGlobalStyle>
  modelStyle?: Record<string, Partial<IMODELSTYLE>>
  feedbackSheet?: IFeedbackSheet
}

/** 问题反馈群入口配置：是否展示 + QQ 群号 */
export interface IFeedbackSheet {
  /** 是否展示入口，显式 false 才隐藏 */
  enabled?: boolean
  /** 问题反馈 QQ 群号，留空时前端提示暂未配置 */
  qqGroupNumber?: string
}

/**
 * 查询简历前端配置
 */
export function getResumeConfig() {
  return http.get<IResumeConfig>('/config/resume')
}
