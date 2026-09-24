import { getComposition } from './compositions'
import { DEFAULT_CPT_NAME, getMaterialVariant } from './materialList'
import { createModelData, MODEL_TITLE } from './modelData'
import { buildModelStyle, DEFAULT_GLOBAL_STYLE, getUuid } from './style'
import { DEFAULT_TEMPLATE_ID, getTemplate } from './templates'
import type { IGlobalStyle, IMaterialItem, IResumeJson, ModelName, ModelSide } from './types'

/**
 * 简历 JSON 的工厂与操作函数。
 *
 * 一份简历 = LAYOUT（布局模式）+ COMPONENTS（模块数组）+ GLOBAL_STYLE（全局主题）。
 * 所有操作都是纯函数式地改这份 JSON，改完交给 Pinia store 持有。
 */

/** 新建一个模块实例：物料名/标题取自变体清单，样式由 GLOBAL_STYLE 下发，数据取默认值 */
export function createMaterialItem(model: ModelName, side: ModelSide, globalStyle: IGlobalStyle, cptName?: string): IMaterialItem {
  const variant = getMaterialVariant(model, cptName)
  return {
    keyId: getUuid(),
    model,
    cptName: variant.cptName,
    cptTitle: variant.cptTitle,
    layout: side,
    show: true,
    style: buildModelStyle(globalStyle, variant.style, side),
    data: createModelData(model),
  }
}

/** 按模板组合出模块数组 */
function buildComponents(globalStyle: IGlobalStyle, compositionId: string): IMaterialItem[] {
  const composition = getComposition(compositionId)
  return composition.modules.map(({ model, side, cptName }) =>
    createMaterialItem(model, side || 'main', globalStyle, cptName),
  )
}

/** 当前时间戳，简历列表页展示更新时间用 */
function nowText(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** 打上最新更新时间，保存时调用 */
export function touchResume(json: IResumeJson): void {
  json.updatedAt = nowText()
}

/** 新建简历的默认名称，用户可在编辑页改成任意名字 */
export const DEFAULT_RESUME_NAME = '未命名简历'

/** 生成一份空简历 JSON：按模板的组合铺模块 + 套模板的 GLOBAL_STYLE */
export function createResumeJson(templateId: string = DEFAULT_TEMPLATE_ID): IResumeJson {
  const template = getTemplate(templateId)
  const globalStyle: IGlobalStyle = { ...DEFAULT_GLOBAL_STYLE, ...template.style }
  return {
    ID: getUuid(),
    NAME: DEFAULT_RESUME_NAME,
    TITLE: '',
    templateId: template.id,
    LAYOUT: getComposition(template.composition).layout,
    COMPONENTS: buildComponents(globalStyle, template.composition),
    GLOBAL_STYLE: globalStyle,
    updatedAt: nowText(),
  }
}

/**
 * GLOBAL_STYLE 变化后重新下发样式 token。
 * 这是"改一处全简历生效"的落点：每个模块的 style 都由 GLOBAL_STYLE + 变体覆盖重算。
 */
export function syncGlobalStyle(json: IResumeJson): void {
  json.COMPONENTS.forEach((item) => {
    const variant = getMaterialVariant(item.model, item.cptName)
    item.style = buildModelStyle(json.GLOBAL_STYLE, variant.style, item.layout)
  })
}

/**
 * 换模板：换组合与全局样式，但严格保留用户当前的模块选择 ——
 * 在模块管理里删掉的模块不会被模板"复活"，自己加的模块也原样保留。
 * 命中新组合的模块沿用业务数据与显示状态，并换上新模板的物料变体与栏位。
 */
export function switchTemplate(json: IResumeJson, templateId: string): IResumeJson {
  const next = createResumeJson(templateId)
  const keptByModel = new Map<ModelName, IMaterialItem>()
  json.COMPONENTS.forEach(item => keptByModel.set(item.model, item))

  // 只保留用户当前拥有的模块：数据与显示状态沿用旧模块
  next.COMPONENTS = next.COMPONENTS.filter((item) => {
    const kept = keptByModel.get(item.model)
    if (!kept)
      return false
    item.data = kept.data
    item.show = kept.show
    return true
  })

  // 新组合没有、但用户自己加的模块：原样保留，样式在 syncGlobalStyle 里刷新
  const keptModels = new Set(next.COMPONENTS.map(item => item.model))
  json.COMPONENTS.forEach((item) => {
    if (!keptModels.has(item.model))
      next.COMPONENTS.push(item)
  })

  syncGlobalStyle(next)
  next.ID = json.ID
  next.NAME = json.NAME
  next.TITLE = json.TITLE
  next.updatedAt = json.updatedAt
  return next
}

/** 模块顺序变化：把某个模块从 from 挪到 to */
export function moveMaterialItem(json: IResumeJson, from: number, to: number): void {
  const list = json.COMPONENTS
  if (from < 0 || from >= list.length || to < 0 || to >= list.length || from === to)
    return
  const [item] = list.splice(from, 1)
  list.splice(to, 0, item)
}

/** 切换模块的显示/隐藏 */
export function toggleMaterialShow(item: IMaterialItem): void {
  item.show = !item.show
}

/** 删除模块 */
export function removeMaterialItem(json: IResumeJson, keyId: string): void {
  const index = json.COMPONENTS.findIndex(item => item.keyId === keyId)
  if (index >= 0)
    json.COMPONENTS.splice(index, 1)
}

/** 新增模块：追加到末尾，落位跟随当前布局（左右布局默认进主栏） */
export function addMaterialItem(json: IResumeJson, model: ModelName, side: ModelSide = 'main'): IMaterialItem {
  const item = createMaterialItem(model, json.LAYOUT === 'classical' ? 'main' : side, json.GLOBAL_STYLE)
  json.COMPONENTS.push(item)
  return item
}

/** 换某模块的物料变体（样式变体），保留业务数据 */
export function changeMaterialVariant(item: IMaterialItem, cptName: string, globalStyle: IGlobalStyle): void {
  const variant = getMaterialVariant(item.model, cptName)
  item.cptName = variant.cptName
  item.cptTitle = variant.cptTitle
  item.style = buildModelStyle(globalStyle, variant.style, item.layout)
}

/** 模块在列表中显示的名字：业务数据里的 title 优先，否则用模块中文名 */
export function materialTitle(item: IMaterialItem): string {
  const data = item.data as { title?: string }
  return data.title || MODEL_TITLE[item.model]
}

/** 是否两栏布局：leftRight 固定两栏；custom 由模块自身的 layout 字段决定 */
export function isTwoColumn(json: IResumeJson): boolean {
  if (json.LAYOUT === 'leftRight')
    return true
  if (json.LAYOUT === 'custom')
    return json.COMPONENTS.some(item => item.layout !== 'main')
  return false
}

/**
 * 取某栏位的模块。
 * 单栏布局：main 拿到全部模块。
 * 两栏布局：left / right 各拿各的；归属 main 的模块横向通栏，
 * 由渲染容器排在两栏之上（顶部名片、横幅等），编辑区照常展示。
 */
export function componentsOf(json: IResumeJson, side: ModelSide): IMaterialItem[] {
  if (side === 'main')
    return json.COMPONENTS.filter(item => item.layout === 'main')
  return json.COMPONENTS.filter(item => item.layout === side)
}

/** 新建模块时用的默认物料名，供模块管理面板展示 */
export const DEFAULT_MATERIAL_NAME = DEFAULT_CPT_NAME
