import type IGlobalStyle from '@/interface/globalStyle'
import type IMODELSTYLE from '@/interface/modelStyle'
import { http } from '@/http/http'

/**
 * 简历前端配置：出厂默认全局样式 + 各模块默认样式。
 *
 * 由后端 config 表的 resume_model_data_config 下发，前端启动时拉一次缓存，
 * 本地新建简历 / 新增模块时据此取样式，避免样式硬编码在前端。
 */
export interface IResumeConfig {
  globalStyle?: Partial<IGlobalStyle>
  modelStyle?: Record<string, Partial<IMODELSTYLE>>
}

/**
 * 查询简历前端配置
 */
export function getResumeConfig() {
  return http.get<IResumeConfig>('/resume/config')
}
