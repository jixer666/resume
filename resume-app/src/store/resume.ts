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
import { getTemplate } from '@/schema/templates'
import { getUuid } from '@/utils/common'

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
 * 传入的既可能是物料清单的分组键（如 `CUSTOM`），也可能是模块名（如 `CUSTOM_2`）——
 * 自定义模块有 3 套皮肤共用一个 `CUSTOM` 分组，只有按 `model` 才能定位到具体那套。
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
      const template = templateId ? getTemplate(templateId) : undefined
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
      current.value = json
      savedSnapshot.value = snapshotOf(json)
      return json
    }

    /** 直接接管一份外部 JSON（模板套用等场景） */
    function setCurrent(json: IRESUMEJSON): void {
      current.value = json
    }

    /**
     * 把当前简历保存到后端（无 id 新建，有 id 覆盖更新），内容没改过直接跳过。
     *
     * @returns 落库后的摘要；内容无改动或没有当前简历时返回 null
     */
    async function saveCurrent(): Promise<IResumeBrief | null> {
      const json = current.value
      if (!json)
        return null
      if (snapshotOf(json) === savedSnapshot.value)
        return null
      const rawId = Number(json.ID)
      const brief = await saveResume({
        id: Number.isFinite(rawId) && rawId > 0 ? rawId : undefined,
        name: json.NAME || DEFAULT_RESUME_NAME,
        layout: json.LAYOUT,
        resumeJson: json,
      })
      json.ID = String(brief.id)
      savedSnapshot.value = snapshotOf(json)
      upsertBrief(brief)
      return brief
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
      if (item)
        item.style = { ...item.style, ...patch }
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
      updateModuleTitle,
      changeVariant,
      variantsOf: materialGroupOf,
      findModule,
      findModuleByKey,
    }
  },
  {
    persist: true,
  },
)
