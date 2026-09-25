import type IGlobalStyle from '@/interface/globalStyle'
import type { IResumeTemplate } from '@/schema/templates'
import { http } from '@/http/http'

/** 后端模板明细节点（template_detail 列反序列化后的结构） */
interface ITemplateDetailNode {
  layout?: string
  style?: Partial<IGlobalStyle>
  variants?: Partial<Record<string, string>>
  columns?: { left?: string[], right?: string[] }
  hidden?: string[]
}

/**
 * 后端原始模板结构。
 *
 * 列表接口（ResumeTemplateListVO）把明细放在 `templateDetail`，
 * 详情接口（ResumeTemplateVO）放在 `resumeTemplateDetail`，这里两种都兼容。
 */
interface IRawTemplate {
  code: string
  name: string
  description?: string
  cover?: string
  templateDetail?: ITemplateDetailNode
  resumeTemplateDetail?: ITemplateDetailNode
}

/** 把后端嵌套的模板明细摊平成前端统一结构 */
function normalizeTemplate(raw: IRawTemplate): IResumeTemplate {
  const detail = raw.templateDetail || raw.resumeTemplateDetail || {}
  return {
    code: raw.code,
    name: raw.name,
    description: raw.description || '',
    cover: raw.cover || '',
    layout: detail.layout || 'classical',
    style: detail.style || {},
    variants: detail.variants,
    columns: detail.columns,
    hidden: detail.hidden,
  }
}

/**
 * 模板库分页：pageNum / pageSize 走 query（后端 PageHelper 从请求参数取分页）。
 */
export async function getTemplateList(pageNum = 1, pageSize = 8) {
  const res = await http.post<{ list: IRawTemplate[], total: number }>(
    '/resume/template/page',
    {},
    { pageNum, pageSize },
  )
  return {
    list: (res?.list || []).map(normalizeTemplate),
    total: res?.total ?? 0,
  }
}

/**
 * 模板详情：按模板编号取一份完整预设。
 */
export async function getTemplateDetail(code: string): Promise<IResumeTemplate | null> {
  const res = await http.get<IRawTemplate>(`/resume/template/detail/${code}`)
  return res ? normalizeTemplate(res) : null
}
