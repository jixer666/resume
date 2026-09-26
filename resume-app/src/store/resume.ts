import type { IResumeBrief } from '@/api/types/resume'
import type IGlobalStyle from '@/interface/globalStyle'
import type { IMATERIALITEM } from '@/interface/material'
import type IMODELSTYLE from '@/interface/modelStyle'
import type IRESUMEJSON from '@/interface/resume'
import type { IResumeTemplate } from '@/schema/templates'
import { defineStore } from 'pinia'
import { deleteResume, getResumeDetail, getResumeList, saveResume } from '@/api/resume'
import { MATERIAL_JSON } from '@/schema/materialList'
import MODEL_DATA_JSON from '@/schema/modelData'
import RESUME_JSON from '@/schema/resume'
import { useTemplateStore } from '@/store/template'
import { getUuid, pxTonumber } from '@/utils/common'
import { FONT_SIZES } from '@/utils/styleOptions'

/** 新建简历的默认名称，用户可在编辑页改成任意名字 */
export const DEFAULT_RESUME_NAME = '未命名简历'

/** 新建简历默认铺的模块，顺序即渲染顺序（CUSTOM_* 属可选模块，不进默认组合） */
const DEFAULT_MODELS = [
  'RESUME_TITLE',
  'BASE_INFO',
  'JOB_INTENTION',
  'EDU_BACKGROUND',
  'SKILL_SPECIALTIES',
  'CAMPUS_EXPERIENCE',
  'INTERNSHIP_EXPERIENCE',
  'WORK_EXPERIENCE',
  'PROJECT_EXPERIENCE',
  'AWARDS',
  'HOBBIES',
  'SELF_EVALUATION',
  'WORKS_DISPLAY',
]

/** 深拷贝纯 JSON 数据：小程序端没有 structuredClone，JSON 往返是最稳的做法 */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

/**
 * 取某个模块的全部皮肤。
 *
 * 传入的通常是模块名（如 `SKILL_SPECIALTIES`），与物料清单的分组键一一对应；
 * 兜底支持分组内 `model` 不同的场景，按 `model` 遍历定位。
 */
function materialGroupOf(model: string): IMATERIALITEM[] {
  const group = MATERIAL_JSON[model]
  if (group?.length)
    return group
  return Object.values(MATERIAL_JSON).find(list => list.some(one => one.model === model)) || []
}

/**
 * 造一个模块实例：皮肤优先取模板指定的 `cptName`，没指定（或清单里找不到）时回退该模块首套皮肤；
 * 样式沿用皮肤默认值，数据取该模块的默认数据。
 */
function createMaterialItem(model: string, layout = '', cptName?: string): IMATERIALITEM | null {
  const group = materialGroupOf(model)
  const variant = (cptName ? group.find(one => one.cptName === cptName) : undefined) ?? group[0]
  if (!variant)
    return null
  return {
    ...clone(variant),
    keyId: getUuid(),
    layout,
    show: true,
    data: clone(MODEL_DATA_JSON[model] ?? {}),
  }
}

/**
 * 用本地物料表给「骨架模块」补齐 style / data。
 *
 * 后端新增简历时只落模块描述（model / cptName / layout / show），这里按 cptName
 * 取皮肤默认样式、按 model 取默认数据；已有值优先保留，因此载入用户编辑过的
 * 完整 JSON 时不会覆盖用户数据。
 */
function hydrateComponents(json: IRESUMEJSON): IRESUMEJSON {
  const list = json.COMPONENTS
  if (!Array.isArray(list) || !list.length)
    return json
  json.COMPONENTS = list.map((raw: any) => {
    if (!raw?.model)
      return raw
    const base = createMaterialItem(raw.model, raw.layout ?? '', raw.cptName || undefined)
    if (!base)
      return raw
    const merged: any = { ...base }
    Object.keys(raw).forEach((key) => {
      const value = raw[key]
      if (value === null || value === undefined)
        return
      merged[key] = value
    })
    merged.style = { ...base.style, ...(raw.style || {}) }
    merged.data = { ...base.data, ...(raw.data || {}) }
    return merged
  })
  return json
}

/** 全局样式字段 → 模块样式字段的映射（全局面板与模块级 style 命名不一致的那几项靠它对齐） */
const GLOBAL_STYLE_MAP: [keyof IGlobalStyle, keyof IMODELSTYLE][] = [
  ['themeColor', 'themeColor'],
  ['firstTitleFontSize', 'firstTitleFontSize'],
  ['secondTitleFontSize', 'titleFontSize'],
  ['secondTitleColor', 'titleColor'],
  ['secondTitleWeight', 'titleFontWeight'],
  ['textFontSize', 'textFontSize'],
  ['textFontColor', 'textColor'],
  ['textFontWeight', 'textFontWeight'],
  ['pTop', 'pTop'],
  ['pBottom', 'pBottom'],
  ['pLeftRight', 'pLeftRight'],
  ['modelMarginTop', 'mTop'],
  ['modelMarginBottom', 'mBottom'],
]

/** 出厂默认全局样式：用来判断用户到底改过哪几项 */
const GLOBAL_STYLE_DEFAULTS = RESUME_JSON.GLOBAL_STYLE as unknown as Record<string, unknown>

/**
 * 用户在本会话里手动改过的样式字段 —— 换模板时要把这些值盖回模板预设之上。
 *
 * 用模块级变量而不是 store state：它只服务于「编辑一份简历的期间换模板」这个场景，
 * 不需要响应式，也不该被 persist 持久化（持久化了会在下次载入另一份简历时串味）。
 * 载入 / 新建简历时统一清空（见 resetStyleEdits）。
 */
let editedGlobalKeys = new Set<string>()
/** 用户改过的模块样式字段：模块 keyId → 字段名集合 */
let editedModuleKeys = new Map<string, Set<string>>()

/** 载入 / 新建简历时清空改动记录：换了一份简历，上一份的编辑痕迹不再适用 */
function resetStyleEdits(): void {
  editedGlobalKeys = new Set()
  editedModuleKeys = new Map()
}

/** 记录用户手动改过的全局字段 */
function markGlobalEdited(keys: readonly string[]): void {
  keys.forEach(key => editedGlobalKeys.add(key))
}

/** 记录用户手动改过的模块字段 */
function markModuleEdited(keyId: string, keys: readonly string[]): void {
  if (!editedModuleKeys.has(keyId))
    editedModuleKeys.set(keyId, new Set())
  const set = editedModuleKeys.get(keyId)!
  keys.forEach(key => set.add(key))
}

/** 从模块 style 里挑出用户改过的字段（用于换模板后盖回个性化值） */
function pickEditedStyle(style: unknown, keys?: Set<string>): Record<string, unknown> {
  const source = (style || {}) as Record<string, unknown>
  const picked: Record<string, unknown> = {}
  keys?.forEach((key) => {
    if (source[key] !== undefined)
      picked[key] = source[key]
  })
  return picked
}

/**
 * 把全局样式扇出到单个模块的 style 上。
 *
 * - 传 `keys`：这些字段无条件套用 —— 面板里把某项改回默认值也必须生效；
 * - 不传 `keys`：只套「用户改过的」字段（值 ≠ 出厂默认值）。换皮肤时走这个模式，
 *   否则皮肤自带的主题色会被全局样式统一染成一个色，皮肤之间就没区别了。
 */
function applyGlobalStyleToItem(
  item: IMATERIALITEM,
  globalStyle: Record<string, unknown> | undefined,
  keys?: (keyof IGlobalStyle)[],
): void {
  if (!globalStyle)
    return
  const style = item.style as Record<string, unknown>
  GLOBAL_STYLE_MAP.forEach(([globalKey, styleKey]) => {
    if (keys && !keys.includes(globalKey))
      return
    const value = globalStyle[globalKey]
    if (value === undefined || value === null || value === '')
      return
    if (!keys && value === GLOBAL_STYLE_DEFAULTS[globalKey])
      return
    style[styleKey] = value
  })
}

/** 「一键整理成一页」要压缩的模块样式字段：全是纵向项，直接影响内容高度（左右内边距、配色与高度无关，不参与） */
const FIT_MODULE_KEYS = ['pTop', 'pBottom', 'mTop', 'mBottom', 'firstTitleFontSize', 'titleFontSize', 'textFontSize'] as const
/** 同步缩放的全局字号字段：让样式面板显示的值与模块实际渲染对得上 */
const FIT_GLOBAL_FONT_KEYS = ['firstTitleFontSize', 'secondTitleFontSize', 'textFontSize'] as const

/**
 * 「一键整理成一页」的基准快照：模块 keyId → 该模块**自己**当时的样式原值（字符串，保证能无损还原）。
 *
 * 为什么按模块记而不是记一份全局值：各皮肤自带的 pTop / mBottom 差别很大
 * （40px 与 0 都有），拿全局值扇出会把设计好的留白抹平、把本来 0 的下间距抬到 45px，
 * 结果越整越高。按模块记基准后，每档都是「在模块自己的原值上乘比例」，只收紧、不改性质。
 */
export interface IFitBase {
  /** 模块 keyId → 压缩字段的原始样式值 */
  modules: Record<string, Record<string, string>>
  /** 全局字号的原始值 */
  global: Record<string, string>
}

/** 字号吸附到样式面板的档位（10px 起、步长 2px、到 60px），避免面板把非档位值显示成「10px」 */
function snapFontSize(px: number): string {
  const stepped = Math.max(10, Math.min(60, Math.round(px / 2) * 2))
  return FONT_SIZES.includes(`${stepped}px`) ? `${stepped}px` : FONT_SIZES[0]
}

/** 压缩单个值：字号吸附档位，间距取整且不为负；`ratio >= 1` 时原样返回，保证能无损还原 */
function scaleFitValue(key: string, raw: string, ratio: number): string {
  const value = pxTonumber(raw)
  if (!value || ratio >= 1)
    return raw
  if (key.endsWith('FontSize'))
    return snapFontSize(value * ratio)
  return `${Math.max(0, Math.round(value * ratio))}px`
}

/**
 * 简历 JSON store：编辑器的唯一数据源。
 *
 * 一份简历 = LAYOUT + COMPONENTS + GLOBAL_STYLE，编辑、预览、导出读的是同一份 JSON，
 * 换皮肤只改 cptName，整份 JSON 直接存后端（P4）。
 *
 * 这里刻意不 re-export 到 @/store/index：materialList 有 100KB+，
 * 被主包里的请求层间接引用会把包体拖大，改为按需 from '@/store/resume' 引入。
 */
export const useResumeStore = defineStore(
  'resume',
  () => {
    /** 已保存的简历列表（后端摘要，不含 JSON 正文） */
    const list = ref<IResumeBrief[]>([])
    /** 当前正在编辑的简历（本地草稿，saveCurrent 后才落后端） */
    const current = ref<IRESUMEJSON | null>(null)
    /** 最近一次载入 / 保存时的内容快照，用来跳过没有改动的自动保存 */
    const savedSnapshot = ref('')
    /** 当前草稿套用的模板编码：新建时提交给后端（更新时用不到） */
    const currentTemplateCode = ref('')
    /** 在途的落库请求，用来把并发保存串成一条队列 */
    let pendingSave: Promise<IResumeBrief | null> | null = null

    /** 当前简历的模块列表 */
    const components = computed<IMATERIALITEM[]>(() => current.value?.COMPONENTS || [])
    /** 左栏模块（leftRight 布局用） */
    const leftComponents = computed(() => components.value.filter(item => item.layout === 'left'))
    /** 右栏模块 */
    const rightComponents = computed(() => components.value.filter(item => item.layout === 'right'))
    /** 是否左右两列布局 */
    const isTwoColumn = computed(() => current.value?.LAYOUT === 'leftRight')

    function findModuleByKey(keyId: string): IMATERIALITEM | undefined {
      return current.value?.COMPONENTS.find((item: IMATERIALITEM) => item.keyId === keyId)
    }

    /** 内容快照：自动保存前用它判断用户到底改没改 */
    function snapshotOf(json: IRESUMEJSON): string {
      return JSON.stringify(json)
    }

    /**
     * 模板给模块指定的栏位：双列模板没列出的模块一律通栏（单列布局自然是空串）。
     */
    function layoutOf(model: string, template?: IResumeTemplate): string {
      if (!template || template.layout !== 'leftRight')
        return ''
      if (template.columns?.left?.includes(model))
        return 'left'
      if (template.columns?.right?.includes(model))
        return 'right'
      return ''
    }

    /**
     * 新建一份简历并设为当前编辑对象。
     *
     * 传 templateId 时套用该模板的布局、全局样式与模块皮肤，并把模板的左右栏配置落到模块上；
     * 不传就是出厂基线（经典单列）。
     *
     * 此时还没有 id，靠首次 saveCurrent 拿后端主键，所以不进 list ——
     * 否则列表里会多出一条点了就 404 的幽灵记录。
     */
    function createResume(templateId?: string): IRESUMEJSON {
      const template = templateId ? useTemplateStore().get(templateId) : undefined
      currentTemplateCode.value = templateId || ''
      const json = clone(RESUME_JSON) as IRESUMEJSON
      json.ID = ''
      json.NAME = DEFAULT_RESUME_NAME
      if (template) {
        json.LAYOUT = template.layout
        json.GLOBAL_STYLE = { ...json.GLOBAL_STYLE, ...template.style }
      }
      json.COMPONENTS = DEFAULT_MODELS
        .map(model => createMaterialItem(model, layoutOf(model, template), template?.variants?.[model]))
        .filter((item): item is IMATERIALITEM => !!item)

      if (template) {
        // 模板样式是全局样式的预设值，必须无条件扇出（传 keys），否则「刚好等于出厂默认」的那几项不会生效
        const keys = Object.keys(template.style) as (keyof IGlobalStyle)[]
        const globalStyle = json.GLOBAL_STYLE as unknown as Record<string, unknown>
        json.COMPONENTS.forEach((item: IMATERIALITEM) => {
          applyGlobalStyleToItem(item, globalStyle, keys)
          // 模板声明隐藏的模块初始不渲染（编辑页仍可手动打开）
          if (template.hidden?.includes(item.model))
            item.show = false
        })
      }
      current.value = json
      savedSnapshot.value = ''
      resetStyleEdits()
      return json
    }

    /** 拉取简历列表（后端已按更新时间倒序） */
    async function fetchList(): Promise<IResumeBrief[]> {
      const res = await getResumeList()
      list.value = res?.list || []
      return list.value
    }

    /** 载入一份已保存的简历，没有内容返回 null */
    async function loadResume(id: string): Promise<IRESUMEJSON | null> {
      const detail = await getResumeDetail(Number(id))
      const json = detail?.resumeJson as IRESUMEJSON | null
      if (!json) {
        current.value = null
        savedSnapshot.value = ''
        return null
      }
      // 主键以后端为准，避免本地 ID 和后端对不上
      json.ID = String(detail.id)
      // 后端新建时只落骨架，缺的 style / data 由本地物料表补齐
      hydrateComponents(json)
      currentTemplateCode.value = ''
      current.value = json
      savedSnapshot.value = snapshotOf(json)
      resetStyleEdits()
      return json
    }

    /** 直接接管一份外部 JSON（模板套用等场景） */
    function setCurrent(json: IRESUMEJSON): void {
      current.value = json
    }

    /**
     * 把当前简历保存到后端（无 id 新建，有 id 覆盖更新），内容没改过直接跳过。
     *
     * 新建只提交模板编码，整份简历由后端按模板构造（后端落的是骨架，
     * 本地已补齐的草稿原样保留，不回读覆盖）；更新才回传整份 JSON。
     *
     * @returns 落库后的摘要；内容无改动或没有当前简历时返回 null
     */
    async function saveCurrent(): Promise<IResumeBrief | null> {
      // 已有落库在途时先排队：新建靠这次拿到主键，等它结束后再按最新状态判断要不要再存，
      // 否则同一份还没有 id 的草稿会被并发存成两条记录
      if (pendingSave)
        await pendingSave.catch(() => {})
      const json = current.value
      if (!json)
        return null
      if (snapshotOf(json) === savedSnapshot.value)
        return null
      const rawId = Number(json.ID)
      const isNew = !Number.isFinite(rawId) || rawId <= 0
      pendingSave = (isNew
        ? saveResume({ templateCode: currentTemplateCode.value || undefined })
        : saveResume({ id: rawId, resumeDetail: json })).then((brief) => {
        json.ID = String(brief.id)
        savedSnapshot.value = snapshotOf(json)
        upsertBrief(brief)
        return brief
      })
      try {
        return await pendingSave
      }
      finally {
        pendingSave = null
      }
    }

    /** 列表里按 id 覆盖或插入一条摘要 */
    function upsertBrief(brief: IResumeBrief): void {
      const index = list.value.findIndex(item => item.id === brief.id)
      if (index >= 0)
        list.value.splice(index, 1, brief)
      else
        list.value.unshift(brief)
    }

    /** 删除一份简历，删的是当前编辑对象时一并清空 */
    async function removeResume(id: string): Promise<void> {
      await deleteResume(Number(id))
      list.value = list.value.filter(item => String(item.id) !== id)
      if (current.value?.ID === id) {
        current.value = null
        savedSnapshot.value = ''
      }
    }

    /** 新增模块：追加到末尾，双列布局默认进左栏，单列布局一律通栏 */
    function addModule(model: string): IMATERIALITEM | null {
      const json = current.value
      if (!json)
        return null
      const item = createMaterialItem(model, isTwoColumn.value ? 'left' : '')
      if (!item)
        return null
      json.COMPONENTS.push(item)
      return item
    }

    /** 删除模块 */
    function removeModule(keyId: string): void {
      const json = current.value
      if (!json)
        return
      const index = json.COMPONENTS.findIndex((item: IMATERIALITEM) => item.keyId === keyId)
      if (index >= 0)
        json.COMPONENTS.splice(index, 1)
    }

    /** 调整模块顺序（拖拽排序落点） */
    function moveModule(from: number, to: number): void {
      const json = current.value
      if (!json)
        return
      const total = json.COMPONENTS.length
      if (from < 0 || from >= total || to < 0 || to >= total || from === to)
        return
      const [item] = json.COMPONENTS.splice(from, 1)
      json.COMPONENTS.splice(to, 0, item)
    }

    /** 切换模块显示 / 隐藏 */
    function toggleModule(keyId: string): void {
      const item = findModuleByKey(keyId)
      if (item)
        item.show = !item.show
    }

    /** 改模块业务数据（表单落点） */
    function updateModuleData(keyId: string, data: IMATERIALITEM['data']): void {
      const item = findModuleByKey(keyId)
      if (item)
        item.data = data
    }

    /** 改模块样式覆盖值（模块级样式面板落点） */
    function updateModuleStyle(keyId: string, patch: Partial<IMODELSTYLE>): void {
      const item = findModuleByKey(keyId)
      if (!item)
        return
      item.style = { ...item.style, ...patch }
      // 记下用户改过哪些字段：换模板时要保留这些个性化值（见 applyTemplate）
      markModuleEdited(keyId, Object.keys(patch))
    }

    /**
     * 改全局样式：patch 里的每个字段都无条件扇出到所有模块。
     *
     * 传 keys 而不是整份覆盖，是为了让「把某项改回默认值」同样能落到模块上
     * （否则模块会一直留着用户上一次改出来的值）。
     */
    function updateGlobalStyle(patch: Partial<IGlobalStyle>): void {
      const json = current.value
      if (!json)
        return
      json.GLOBAL_STYLE = { ...json.GLOBAL_STYLE, ...patch }
      const keys = Object.keys(patch) as (keyof IGlobalStyle)[]
      const globalStyle = json.GLOBAL_STYLE as unknown as Record<string, unknown>
      json.COMPONENTS.forEach((item: IMATERIALITEM) => applyGlobalStyleToItem(item, globalStyle, keys))
      // 记下用户改过哪些全局字段：换模板时要保留这些个性化值（见 applyTemplate）
      markGlobalEdited(keys as string[])
    }

    /** 量一份「一键整理成一页」的基准快照（见 IFitBase），供 applyFitScale 反复套用不同比例 */
    function captureFitBase(): IFitBase {
      const modules: Record<string, Record<string, string>> = {}
      current.value?.COMPONENTS.forEach((item: IMATERIALITEM) => {
        const style = item.style as unknown as Record<string, unknown>
        const values: Record<string, string> = {}
        FIT_MODULE_KEYS.forEach((key) => {
          const raw = style[key]
          if (typeof raw === 'string')
            values[key] = raw
        })
        modules[item.keyId] = values
      })
      const globalStyle = current.value?.GLOBAL_STYLE as unknown as Record<string, unknown>
      const global: Record<string, string> = {}
      FIT_GLOBAL_FONT_KEYS.forEach((key) => {
        const raw = globalStyle?.[key]
        if (typeof raw === 'string')
          global[key] = raw
      })
      return { modules, global }
    }

    /**
     * 按比例套用一档压缩：每个模块的纵向样式按**各自基准**缩放，全局字号同步缩放。
     *
     * 比例是相对基准算的（不是叠乘），所以档位之间互不影响，反复调用也不会越压越小；
     * 传 1 即无损还原基准（`scaleFitValue` 在 ratio >= 1 时原样返回）。
     *
     * 刻意不记入「用户改过的字段」：整理是一次性的排版动作，不是样式偏好。
     * 记进去的话，之后每次换模板都会拿这 7 个字段盖掉新模板的字体与留白，换模板就看不出变化了。
     */
    function applyFitScale(base: IFitBase, ratio: number): void {
      const json = current.value
      if (!json)
        return
      const globalStyle = json.GLOBAL_STYLE as unknown as Record<string, unknown>
      FIT_GLOBAL_FONT_KEYS.forEach((key) => {
        const raw = base.global[key]
        if (raw !== undefined)
          globalStyle[key] = scaleFitValue(key, raw, ratio)
      })
      json.COMPONENTS.forEach((item: IMATERIALITEM) => {
        const values = base.modules[item.keyId]
        if (!values)
          return
        const style = item.style as unknown as Record<string, unknown>
        FIT_MODULE_KEYS.forEach((key) => {
          const raw = values[key]
          if (raw !== undefined)
            style[key] = scaleFitValue(key, raw, ratio)
        })
      })
    }

    /** 改模块小标题（模块设置面板落点） */
    function updateModuleTitle(keyId: string, title: string): void {
      const item = findModuleByKey(keyId)
      if (item && item.data)
        item.data.title = title
    }

    /**
     * 换皮肤：只改 cptName / cptTitle / style，业务数据原样保留。
     *
     * 样式重置成皮肤默认值后，再把用户改过的全局样式补回来——
     * 皮肤自带的样式差异（尤其主题色）保留，用户的个性化设置也不丢。
     */
    function changeVariant(keyId: string, cptName: string): void {
      const item = findModuleByKey(keyId)
      if (!item)
        return
      const variant = materialGroupOf(item.model).find(one => one.cptName === cptName)
      if (!variant)
        return
      item.cptName = variant.cptName
      item.cptTitle = variant.cptTitle
      item.style = clone(variant.style)
      applyGlobalStyleToItem(item, current.value?.GLOBAL_STYLE as unknown as Record<string, unknown>)
    }

    /** 按模块名取第一个实例，供编辑页按模块定位 */
    function findModule(model: string): IMATERIALITEM | undefined {
      return current.value?.COMPONENTS.find((item: IMATERIALITEM) => item.model === model)
    }

    /**
     * 更换模板：把新模板的版式与样式套到当前简历上，已填内容原样保留。
     *
     * 只动四类字段 —— LAYOUT、GLOBAL_STYLE、模块栏位 layout、模块皮肤（cptName / cptTitle / style）；
     * 模块顺序、显隐状态、业务数据 data 一律不动，换模板不该丢用户填过的东西。
     *
     * 样式冲突的优先级：**用户手动改过的值 > 模板预设 > 皮肤默认**。
     * 也就是说换模板能看出变化（版式 / 皮肤 / 模板样式），但用户在样式面板里调过的
     * 全局字段与模块字段会被盖回来，不会被模板重置（改动痕迹见 markGlobalEdited / markModuleEdited）。
     *
     * @returns 模板不存在或没有当前简历时返回 false
     */
    function applyTemplate(templateId: string): boolean {
      const json = current.value
      const template = templateId ? useTemplateStore().get(templateId) : undefined
      if (!json || !template)
        return false
      json.LAYOUT = template.layout

      // 模板预设打底，用户改过的全局字段再盖回原值
      const prevGlobal = { ...(json.GLOBAL_STYLE as unknown as Record<string, unknown>) }
      const nextGlobal: Record<string, unknown> = { ...prevGlobal, ...(template.style as unknown as Record<string, unknown>) }
      editedGlobalKeys.forEach((key) => {
        if (prevGlobal[key] !== undefined)
          nextGlobal[key] = prevGlobal[key]
      })
      json.GLOBAL_STYLE = nextGlobal as unknown as IGlobalStyle

      // 模板字段与用户改过的全局字段都要无条件扇出：模板里「刚好等于出厂默认」的那几项也必须生效，
      // 用户改过的值同样不能被皮肤默认值盖掉。
      const fanoutKeys = Array.from(
        new Set<string>([...Object.keys(template.style || {}), ...Array.from(editedGlobalKeys)]),
      ) as (keyof IGlobalStyle)[]
      const globalStyle = json.GLOBAL_STYLE as unknown as Record<string, unknown>

      json.COMPONENTS.forEach((item: IMATERIALITEM) => {
        item.layout = layoutOf(item.model, template)
        // 用户对这个模块的个性化改动先留一份，换完皮肤与全局扇出后再盖回去
        const userEdits = pickEditedStyle(item.style, editedModuleKeys.get(item.keyId))
        const cptName = template.variants?.[item.model]
        const variant = cptName ? materialGroupOf(item.model).find(one => one.cptName === cptName) : undefined
        if (variant) {
          item.cptName = variant.cptName
          item.cptTitle = variant.cptTitle
          item.style = clone(variant.style)
        }
        applyGlobalStyleToItem(item, globalStyle, fanoutKeys)
        Object.assign(item.style as Record<string, unknown>, userEdits)
      })
      // 还没落库的草稿靠模板编码新建，这里同步上，否则换的模板不会被后端采用
      currentTemplateCode.value = templateId
      return true
    }

    return {
      list,
      current,
      components,
      leftComponents,
      rightComponents,
      isTwoColumn,
      createResume,
      fetchList,
      loadResume,
      setCurrent,
      saveCurrent,
      removeResume,
      addModule,
      removeModule,
      moveModule,
      toggleModule,
      updateModuleData,
      updateModuleStyle,
      updateGlobalStyle,
      captureFitBase,
      applyFitScale,
      updateModuleTitle,
      changeVariant,
      applyTemplate,
      variantsOf: materialGroupOf,
      findModule,
      findModuleByKey,
    }
  },
  {
    persist: true,
  },
)
