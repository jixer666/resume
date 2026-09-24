import type { IMaterialVariant, ModelName } from './types'

/**
 * 物料变体清单：14 类模块各自可选的样式变体。
 *
 * cptName 形如 WORK_EXPERIENCE_1，对应 ModuleRenderer.vue 里分支渲染的物料组件；
 * 模板 JSON 的 COMPONENTS[i].cptName 从这里取值。
 * 加变体 = 在 src/material 下新建组件 + 在 ModuleRenderer.vue 加分支 + 在这里登记。
 */
export const MATERIAL_VARIANTS: Record<ModelName, IMaterialVariant[]> = {
  RESUME_TITLE: [
    { cptName: 'RESUME_TITLE_1', cptTitle: '居中大标题' },
    { cptName: 'RESUME_TITLE_2', cptTitle: '左对齐标题' },
  ],
  BASE_INFO: [
    { cptName: 'BASE_INFO_1', cptTitle: '头像信息卡' },
    { cptName: 'BASE_INFO_2', cptTitle: '纯文本信息' },
    { cptName: 'BASE_INFO_3', cptTitle: '居中名片' },
    { cptName: 'BASE_INFO_4', cptTitle: '横幅名片' },
  ],
  JOB_INTENTION: [
    { cptName: 'JOB_INTENTION_1', cptTitle: '标签网格' },
  ],
  EDU_BACKGROUND: [
    { cptName: 'EDU_BACKGROUND_1', cptTitle: '标题行式' },
    { cptName: 'EDU_BACKGROUND_2', cptTitle: '时间轴式' },
  ],
  WORK_EXPERIENCE: [
    { cptName: 'WORK_EXPERIENCE_1', cptTitle: '要点列表' },
    { cptName: 'WORK_EXPERIENCE_2', cptTitle: '时间轴式' },
  ],
  PROJECT_EXPERIENCE: [
    { cptName: 'PROJECT_EXPERIENCE_1', cptTitle: '要点列表' },
  ],
  INTERNSHIP_EXPERIENCE: [
    { cptName: 'INTERNSHIP_EXPERIENCE_1', cptTitle: '要点列表' },
  ],
  CAMPUS_EXPERIENCE: [
    { cptName: 'CAMPUS_EXPERIENCE_1', cptTitle: '条目式' },
  ],
  SKILL_SPECIALTIES: [
    { cptName: 'SKILL_SPECIALTIES_1', cptTitle: '熟练度条' },
    { cptName: 'SKILL_SPECIALTIES_2', cptTitle: '标签墙' },
  ],
  AWARDS: [
    { cptName: 'AWARDS_1', cptTitle: '条目式' },
  ],
  HOBBIES: [
    { cptName: 'HOBBIES_1', cptTitle: '文本' },
  ],
  SELF_EVALUATION: [
    { cptName: 'SELF_EVALUATION_1', cptTitle: '文本' },
  ],
  WORKS_DISPLAY: [
    { cptName: 'WORKS_DISPLAY_1', cptTitle: '条目式' },
  ],
  CUSTOM: [
    { cptName: 'CUSTOM_1', cptTitle: '文本' },
  ],
}

/** 模块名 → 默认物料组件名（每类第一个变体） */
export const DEFAULT_CPT_NAME: Record<ModelName, string> = Object.keys(MATERIAL_VARIANTS).reduce((acc, model) => {
  acc[model as ModelName] = MATERIAL_VARIANTS[model as ModelName][0].cptName
  return acc
}, {} as Record<ModelName, string>)

/** 按模块名取变体清单，找不到模块时返回空数组 */
export function getMaterialVariants(model: ModelName): IMaterialVariant[] {
  return MATERIAL_VARIANTS[model] || []
}

/** 按组件名取变体，cptName 非法时回退到该模块的第一个变体 */
export function getMaterialVariant(model: ModelName, cptName?: string): IMaterialVariant {
  const list = getMaterialVariants(model)
  return list.find(item => item.cptName === cptName) || list[0]
}
