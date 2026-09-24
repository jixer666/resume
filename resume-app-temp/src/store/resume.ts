import type { IGlobalStyle, IMaterialItem, IModelStyle, IResumeJson, ModelName, ModelSide } from '@/schema/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  addMaterialItem,
  changeMaterialVariant,
  componentsOf,
  createResumeJson,
  isTwoColumn as isTwoColumnJson,
  moveMaterialItem,
  removeMaterialItem,
  switchTemplate,
  syncGlobalStyle,
  toggleMaterialShow,
  touchResume,
} from '@/schema/resume'
import { DEFAULT_TEMPLATE_ID } from '@/schema/templates'

/**
 * 简历 JSON store：整个编辑器的单一数据源。
 *
 * 一份简历 = LAYOUT + COMPONENTS + GLOBAL_STYLE，编辑、预览、导出都读同一份 JSON；
 * 换模板 = 换这份 JSON，加模块 = 往 COMPONENTS 里 push 一项。
 */
export const useResumeStore = defineStore(
  'resume',
  () => {
    /** 已保存的简历列表 */
    const list = ref<IResumeJson[]>([])
    /** 当前正在编辑的简历 */
    const current = ref<IResumeJson | null>(null)

    /** 当前简历的主栏模块（classical 布局下即全部模块） */
    const mainComponents = computed<IMaterialItem[]>(() => (current.value ? componentsOf(current.value, 'main') : []))
    /** 当前简历的左栏模块 */
    const leftComponents = computed<IMaterialItem[]>(() => (current.value ? componentsOf(current.value, 'left') : []))
    /** 当前简历的右栏模块 */
    const rightComponents = computed<IMaterialItem[]>(() => (current.value ? componentsOf(current.value, 'right') : []))
    /** 是否左右两列布局（custom 布局由模块自身 layout 决定，与渲染容器保持一致） */
    const isTwoColumn = computed(() => (current.value ? isTwoColumnJson(current.value) : false))

    /** 新建一份简历并加入列表，同时设为当前编辑对象 */
    function createResume(templateId: string = DEFAULT_TEMPLATE_ID): IResumeJson {
      const json = createResumeJson(templateId)
      list.value.unshift(json)
      current.value = json
      return json
    }

    /** 取一份简历设为当前编辑对象，找不到返回 null */
    function loadResume(id: string): IResumeJson | null {
      current.value = list.value.find(item => item.ID === id) || null
      return current.value
    }

    /** 把当前简历写回列表（不存在则插入），并刷新更新时间 */
    function saveCurrent(): void {
      const json = current.value
      if (!json)
        return
      touchResume(json)
      const index = list.value.findIndex(item => item.ID === json.ID)
      if (index >= 0)
        list.value.splice(index, 1, json)
      else list.value.unshift(json)
    }

    /** 删除一份简历，删的是当前编辑对象时一并清空 */
    function removeResume(id: string): void {
      list.value = list.value.filter(item => item.ID !== id)
      if (current.value?.ID === id)
        current.value = null
    }

    /** 换模板：换组合与全局样式，保留已有模块业务数据；同步回列表避免持久化里新旧两份 */
    function applyTemplate(templateId: string): void {
      if (!current.value)
        return
      current.value = switchTemplate(current.value, templateId)
      saveCurrent()
    }

    /** 改全局主题：改一处，所有模块的样式 token 跟着重算 */
    function updateGlobalStyle(patch: Partial<IGlobalStyle>): void {
      if (!current.value)
        return
      Object.assign(current.value.GLOBAL_STYLE, patch)
      syncGlobalStyle(current.value)
    }

    /** 恢复整份 GLOBAL_STYLE */
    function setGlobalStyle(style: IGlobalStyle): void {
      if (!current.value)
        return
      current.value.GLOBAL_STYLE = style
      syncGlobalStyle(current.value)
    }

    /** 新增模块 */
    function addModule(model: ModelName, side: ModelSide = 'main'): void {
      if (!current.value)
        return
      addMaterialItem(current.value, model, side)
    }

    /** 删除模块 */
    function removeModule(keyId: string): void {
      if (!current.value)
        return
      removeMaterialItem(current.value, keyId)
    }

    /** 调整模块顺序（拖拽排序落点） */
    function moveModule(from: number, to: number): void {
      if (!current.value)
        return
      moveMaterialItem(current.value, from, to)
    }

    /** 切换模块显示/隐藏 */
    function toggleModule(keyId: string): void {
      const item = current.value?.COMPONENTS.find(com => com.keyId === keyId)
      if (item)
        toggleMaterialShow(item)
    }

    /** 换模块的样式变体，保留业务数据 */
    function changeVariant(keyId: string, cptName: string): void {
      const json = current.value
      if (!json)
        return
      const item = json.COMPONENTS.find(com => com.keyId === keyId)
      if (item)
        changeMaterialVariant(item, cptName, json.GLOBAL_STYLE)
    }

    /** 改模块业务数据 */
    function updateModuleData(keyId: string, data: IMaterialItem['data']): void {
      const item = current.value?.COMPONENTS.find(com => com.keyId === keyId)
      if (item)
        item.data = data
    }

    /** 改单个模块的样式覆盖值 */
    function updateModuleStyle(keyId: string, patch: Partial<IModelStyle>): void {
      const item = current.value?.COMPONENTS.find(com => com.keyId === keyId)
      if (item)
        item.style = { ...item.style, ...patch }
    }

    /** 按模块名取第一个实例，供编辑页按模块定位 */
    function findModule(model: ModelName): IMaterialItem | undefined {
      return current.value?.COMPONENTS.find(item => item.model === model)
    }

    return {
      list,
      current,
      mainComponents,
      leftComponents,
      rightComponents,
      isTwoColumn,
      createResume,
      loadResume,
      saveCurrent,
      removeResume,
      applyTemplate,
      updateGlobalStyle,
      setGlobalStyle,
      addModule,
      removeModule,
      moveModule,
      toggleModule,
      changeVariant,
      updateModuleData,
      updateModuleStyle,
      findModule,
    }
  },
  {
    persist: true,
  },
)
