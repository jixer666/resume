/**
 * 模板市场扩充·物料皮肤生成：为 6 个新标题族（ModelTitle12–17）生成 12 个模块的皮肤包装，
 * 并把 cptName 登记进 src/schema/materialList.ts。
 *
 * 为什么用脚本生成：一套「族」在每个模块下都要有一份包装文件（模块名 + 标题 + 内容组件 + 内外边距），
 * 13 个模块 × 6 个族共 78 个文件，逐个手写既重复又容易漏；这里以模块规格表为准批量落盘。
 *
 * 用法：node .task/20260927-模板市场扩充/gen-skins.mjs
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(here, '../..')

/** 各模块的目录名 / 文件名 / 数据类型 / 根类名，与 src/material 现有目录结构一致 */
const MODULES = [
  { model: 'BASE_INFO', dir: 'BaseInfo', file: 'BaseInfo.vue', type: 'IBASEINFO', kebab: 'base-info', noPad: true },
  { model: 'JOB_INTENTION', dir: 'JobIntention', file: 'JobIntention.vue', type: 'IJOBINTENTION', kebab: 'job-intention' },
  { model: 'EDU_BACKGROUND', dir: 'EduBackground', file: 'EduBackground.vue', type: 'IEDUBACKGROUND', kebab: 'edu-background' },
  { model: 'SKILL_SPECIALTIES', dir: 'SkillSpecialties', file: 'SkillSpecialties.vue', type: 'ISKILLSPECIALTIES', kebab: 'skill-specialties' },
  { model: 'CAMPUS_EXPERIENCE', dir: 'CampusExperience', file: 'CampusExperience.vue', type: 'ICAMPUSEXPERIENCE', kebab: 'campus-experience' },
  { model: 'INTERNSHIP_EXPERIENCE', dir: 'InternshipExperience', file: 'InternshipExperience.vue', type: 'IINTERNSHIPEXPERIENCE', kebab: 'internship-experience' },
  { model: 'WORK_EXPERIENCE', dir: 'WorkExperience', file: 'WorkExperience.vue', type: 'IWORKEXPERIENCE', kebab: 'work-experience' },
  { model: 'PROJECT_EXPERIENCE', dir: 'ProjectExperience', file: 'ProjectExperience.vue', type: 'IPROJECTEXPERIENCE', kebab: 'project-experience' },
  { model: 'AWARDS', dir: 'Awards', file: 'Awards.vue', type: 'IAWARDS', kebab: 'awards' },
  { model: 'HOBBIES', dir: 'Hobbies', file: 'Hobbies.vue', type: 'IHOBBIES', kebab: 'hobbies' },
  { model: 'SELF_EVALUATION', dir: 'SelfEvaluation', file: 'SelfEvaluation.vue', type: 'ISELFEVALUATION', kebab: 'self-evaluation' },
  { model: 'WORKS_DISPLAY', dir: 'WorksDisplay', file: 'WorksDisplay.vue', type: 'IWORKSDISPLAY', kebab: 'works-display' },
]

/** 新标题族的标题组件：族号 → ModelTitle 组件 */
const TITLE = {
  12: 'ModelTitle12',
  13: 'ModelTitle13',
  14: 'ModelTitle14',
  15: 'ModelTitle15',
  16: 'ModelTitle16',
  17: 'ModelTitle17',
  18: 'ModelTitle18',
  19: 'ModelTitle19',
  20: 'ModelTitle20',
  21: 'ModelTitle21',
}

/**
 * 新族在各模块下的皮肤编号 —— 各模块历史编号不齐（EduBackground 已到 13、SkillSpecialties 已到 18），
 * 新族顺延各自的号段，避免与既有皮肤重名。
 */
const SKIN_NO = {
  BASE_INFO: { 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 9, 19: 11, 20: 10, 21: 12 },
  JOB_INTENTION: { 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21 },
  EDU_BACKGROUND: { 12: 14, 13: 15, 14: 16, 15: 17, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22, 21: 23 },
  SKILL_SPECIALTIES: { 12: 19, 13: 20, 14: 21, 15: 22, 16: 23, 17: 24, 18: 25, 19: 26, 20: 27, 21: 28 },
  CAMPUS_EXPERIENCE: { 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21 },
  INTERNSHIP_EXPERIENCE: { 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21 },
  WORK_EXPERIENCE: { 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21 },
  PROJECT_EXPERIENCE: { 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21 },
  AWARDS: { 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21 },
  HOBBIES: { 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21 },
  SELF_EVALUATION: { 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21 },
  WORKS_DISPLAY: { 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21 },
}

/**
 * 每族一套内容布局：同族的模块共用一种「正文排法」，跨族才换排法，
 * 这样同一套简历里的正文风格一致，不同族之间排版不重复。
 */
const CONTENT_SETS = {
  12: {
    JOB_INTENTION: 'Common/JobIntention/JobIntention1.vue',
    EDU_BACKGROUND: 'Common/EduBackground/EduBackground1.vue',
    SKILL_SPECIALTIES: 'Common/SkillSpecialties/SkillSpecialties6.vue',
    CAMPUS_EXPERIENCE: 'Common/CampusExperience/CampusExperience1.vue',
    INTERNSHIP_EXPERIENCE: 'Common/InternshipExperience/InternshipExperience1.vue',
    WORK_EXPERIENCE: 'Common/WorkExperience/WorkExperience3.vue',
    PROJECT_EXPERIENCE: 'Common/ProjectExperience/ProjectExperience3.vue',
    AWARDS: 'Common/Awards/Awards2.vue',
    HOBBIES: 'Common/Hobbies/Hobbies2.vue',
    SELF_EVALUATION: 'Common/SelfEvaluation/SelfEvaluation2.vue',
    WORKS_DISPLAY: 'Common/WorksDisplay/WorksDisplay1.vue',
  },
  13: {
    JOB_INTENTION: 'Common/JobIntention/JobIntention1.vue',
    EDU_BACKGROUND: 'Common/EduBackground/EduBackground3.vue',
    SKILL_SPECIALTIES: 'Common/SkillSpecialties/SkillSpecialties1.vue',
    CAMPUS_EXPERIENCE: 'Common/CampusExperience/CampusExperience1.vue',
    INTERNSHIP_EXPERIENCE: 'Common/InternshipExperience/InternshipExperience1.vue',
    WORK_EXPERIENCE: 'Common/WorkExperience/WorkExperience1.vue',
    PROJECT_EXPERIENCE: 'Common/ProjectExperience/ProjectExperience1.vue',
    AWARDS: 'Common/Awards/Awards1.vue',
    HOBBIES: 'Common/Hobbies/Hobbies1.vue',
    SELF_EVALUATION: 'Common/SelfEvaluation/SelfEvaluation1.vue',
    WORKS_DISPLAY: 'Common/WorksDisplay/WorksDisplay1.vue',
  },
  14: {
    JOB_INTENTION: 'Common/JobIntention/JobIntention1.vue',
    EDU_BACKGROUND: 'Common/EduBackground/EduBackground4.vue',
    SKILL_SPECIALTIES: 'Common/SkillSpecialties/SkillSpecialties2.vue',
    CAMPUS_EXPERIENCE: 'Common/CampusExperience/CampusExperience1.vue',
    INTERNSHIP_EXPERIENCE: 'Common/InternshipExperience/InternshipExperience1.vue',
    WORK_EXPERIENCE: 'Common/WorkExperience/WorkExperience1.vue',
    PROJECT_EXPERIENCE: 'Common/ProjectExperience/ProjectExperience1.vue',
    AWARDS: 'Common/Awards/Awards1.vue',
    HOBBIES: 'Common/Hobbies/Hobbies1.vue',
    SELF_EVALUATION: 'Common/SelfEvaluation/SelfEvaluation1.vue',
    WORKS_DISPLAY: 'Common/WorksDisplay/WorksDisplay1.vue',
  },
  15: {
    JOB_INTENTION: 'Common/JobIntention/JobIntention1.vue',
    EDU_BACKGROUND: 'Common/EduBackground/EduBackground3.vue',
    SKILL_SPECIALTIES: 'Common/SkillSpecialties/SkillSpecialties3.vue',
    CAMPUS_EXPERIENCE: 'Common/CampusExperience/CampusExperience1.vue',
    INTERNSHIP_EXPERIENCE: 'Common/InternshipExperience/InternshipExperience1.vue',
    WORK_EXPERIENCE: 'Common/WorkExperience/WorkExperience4.vue',
    PROJECT_EXPERIENCE: 'Common/ProjectExperience/ProjectExperience1.vue',
    AWARDS: 'Common/Awards/Awards1.vue',
    HOBBIES: 'Common/Hobbies/Hobbies1.vue',
    SELF_EVALUATION: 'Common/SelfEvaluation/SelfEvaluation1.vue',
    WORKS_DISPLAY: 'Common/WorksDisplay/WorksDisplay1.vue',
  },
  16: {
    JOB_INTENTION: 'Common/JobIntention/JobIntention1.vue',
    EDU_BACKGROUND: 'Common/EduBackground/EduBackground3.vue',
    SKILL_SPECIALTIES: 'Common/SkillSpecialties/SkillSpecialties4.vue',
    CAMPUS_EXPERIENCE: 'Common/CampusExperience/CampusExperience1.vue',
    INTERNSHIP_EXPERIENCE: 'Common/InternshipExperience/InternshipExperience1.vue',
    WORK_EXPERIENCE: 'Common/WorkExperience/WorkExperience1.vue',
    PROJECT_EXPERIENCE: 'Common/ProjectExperience/ProjectExperience4.vue',
    AWARDS: 'Common/Awards/Awards1.vue',
    HOBBIES: 'Common/Hobbies/Hobbies1.vue',
    SELF_EVALUATION: 'Common/SelfEvaluation/SelfEvaluation1.vue',
    WORKS_DISPLAY: 'Common/WorksDisplay/WorksDisplay1.vue',
  },
  17: {
    JOB_INTENTION: 'Common/JobIntention/JobIntention1.vue',
    EDU_BACKGROUND: 'Common/EduBackground/EduBackground3.vue',
    SKILL_SPECIALTIES: 'Common/SkillSpecialties/SkillSpecialties5.vue',
    CAMPUS_EXPERIENCE: 'Common/CampusExperience/CampusExperience1.vue',
    INTERNSHIP_EXPERIENCE: 'Common/InternshipExperience/InternshipExperience1.vue',
    WORK_EXPERIENCE: 'Common/WorkExperience/WorkExperience1.vue',
    PROJECT_EXPERIENCE: 'Common/ProjectExperience/ProjectExperience1.vue',
    AWARDS: 'Common/Awards/Awards3.vue',
    HOBBIES: 'Common/Hobbies/Hobbies1.vue',
    SELF_EVALUATION: 'Common/SelfEvaluation/SelfEvaluation1.vue',
    WORKS_DISPLAY: 'Common/WorksDisplay/WorksDisplay1.vue',
  },
  18: {
    JOB_INTENTION: 'Common/JobIntention/JobIntention1.vue',
    EDU_BACKGROUND: 'Common/EduBackground/EduBackground1.vue',
    SKILL_SPECIALTIES: 'Common/SkillSpecialties/SkillSpecialties6.vue',
    CAMPUS_EXPERIENCE: 'Common/CampusExperience/CampusExperience1.vue',
    INTERNSHIP_EXPERIENCE: 'Common/InternshipExperience/InternshipExperience2.vue',
    WORK_EXPERIENCE: 'Common/WorkExperience/WorkExperience2.vue',
    PROJECT_EXPERIENCE: 'Common/ProjectExperience/ProjectExperience2.vue',
    AWARDS: 'Common/Awards/Awards2.vue',
    HOBBIES: 'Common/Hobbies/Hobbies2.vue',
    SELF_EVALUATION: 'Common/SelfEvaluation/SelfEvaluation2.vue',
    WORKS_DISPLAY: 'Common/WorksDisplay/WorksDisplay1.vue',
  },
  19: {
    JOB_INTENTION: 'Common/JobIntention/JobIntention1.vue',
    EDU_BACKGROUND: 'Common/EduBackground/EduBackground2.vue',
    SKILL_SPECIALTIES: 'Common/SkillSpecialties/SkillSpecialties4.vue',
    CAMPUS_EXPERIENCE: 'Common/CampusExperience/CampusExperience1.vue',
    INTERNSHIP_EXPERIENCE: 'Common/InternshipExperience/InternshipExperience2.vue',
    WORK_EXPERIENCE: 'Common/WorkExperience/WorkExperience2.vue',
    PROJECT_EXPERIENCE: 'Common/ProjectExperience/ProjectExperience4.vue',
    AWARDS: 'Common/Awards/Awards3.vue',
    HOBBIES: 'Common/Hobbies/Hobbies1.vue',
    SELF_EVALUATION: 'Common/SelfEvaluation/SelfEvaluation1.vue',
    WORKS_DISPLAY: 'Common/WorksDisplay/WorksDisplay1.vue',
  },
  20: {
    JOB_INTENTION: 'Common/JobIntention/JobIntention1.vue',
    EDU_BACKGROUND: 'Common/EduBackground/EduBackground4.vue',
    SKILL_SPECIALTIES: 'Common/SkillSpecialties/SkillSpecialties3.vue',
    CAMPUS_EXPERIENCE: 'Common/CampusExperience/CampusExperience1.vue',
    INTERNSHIP_EXPERIENCE: 'Common/InternshipExperience/InternshipExperience2.vue',
    WORK_EXPERIENCE: 'Common/WorkExperience/WorkExperience4.vue',
    PROJECT_EXPERIENCE: 'Common/ProjectExperience/ProjectExperience2.vue',
    AWARDS: 'Common/Awards/Awards3.vue',
    HOBBIES: 'Common/Hobbies/Hobbies1.vue',
    SELF_EVALUATION: 'Common/SelfEvaluation/SelfEvaluation2.vue',
    WORKS_DISPLAY: 'Common/WorksDisplay/WorksDisplay1.vue',
  },
  21: {
    JOB_INTENTION: 'Common/JobIntention/JobIntention1.vue',
    EDU_BACKGROUND: 'Common/EduBackground/EduBackground2.vue',
    SKILL_SPECIALTIES: 'Common/SkillSpecialties/SkillSpecialties5.vue',
    CAMPUS_EXPERIENCE: 'Common/CampusExperience/CampusExperience1.vue',
    INTERNSHIP_EXPERIENCE: 'Common/InternshipExperience/InternshipExperience2.vue',
    WORK_EXPERIENCE: 'Common/WorkExperience/WorkExperience3.vue',
    PROJECT_EXPERIENCE: 'Common/ProjectExperience/ProjectExperience3.vue',
    AWARDS: 'Common/Awards/Awards2.vue',
    HOBBIES: 'Common/Hobbies/Hobbies2.vue',
    SELF_EVALUATION: 'Common/SelfEvaluation/SelfEvaluation1.vue',
    WORKS_DISPLAY: 'Common/WorksDisplay/WorksDisplay1.vue',
  },
}

/** 兜底：没登记内容布局的族沿用 13 族（默认排法），避免生成时报错 */
const FALLBACK_CONTENT = CONTENT_SETS[13]

const FAMILIES = Object.keys(TITLE).map(Number)

/**
 * 基础资料不走通用映射：它自带整块名片版式，内外边距由 Common 组件自己吃，
 * 六个新族各配一个不同的名片版式（与 src/material/BaseInfo/BaseInfo12-17 的包装一致）。
 */
const BASE_INFO_COMMON = {
  12: 'Common/BaseInfo/BaseInfo5.vue',
  13: 'Common/BaseInfo/BaseInfo6.vue',
  14: 'Common/BaseInfo/BaseInfo7.vue',
  15: 'Common/BaseInfo/BaseInfo8.vue',
  16: 'Common/BaseInfo/BaseInfo1.vue',
  17: 'Common/BaseInfo/BaseInfo4.vue',
  18: 'Common/BaseInfo/BaseInfo9.vue',
  19: 'Common/BaseInfo/BaseInfo11.vue',
  20: 'Common/BaseInfo/BaseInfo10.vue',
  21: 'Common/BaseInfo/BaseInfo12.vue',
}

/**
 * 皮肤包装：模块根节点负责内外边距，标题与内容组件由族与模块决定。
 *
 * 基础资料是特例：它没有模块标题，名片版式（Common/BaseInfo/BaseInfoN）自带内外边距，
 * 包装层只做壳，既不挂 model-title 也不写间距，避免与名片重复。
 * 其余模块的内容组件只管内容，内外边距由包装层的根节点吃 modelStyle。
 */
function wrapperOf(mod, family) {
  const skinNo = SKIN_NO[mod.model][family]
  const common = mod.model === 'BASE_INFO'
    ? BASE_INFO_COMMON[family]
    : (CONTENT_SETS[family] ?? FALLBACK_CONTENT)[mod.model] ?? FALLBACK_CONTENT[mod.model]
  const header = `<!-- ${mod.dir}·新标题族 ${family} 皮肤包装（由 .task/20260927-模板市场扩充/gen-skins.mjs 生成） -->`
  if (mod.model === 'BASE_INFO') {
    return `${header}
<template>
  <div class="${mod.kebab}-${skinNo}-box u-tag-div">
    <!-- 名片版式（自带内外边距） -->
    <content-vue :model-data="modelData" :model-style="modelStyle" />
  </div>
</template>

<script setup lang="ts">
import type { ${mod.type} } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import ContentVue from '@/material/${common}'

defineProps<{
  modelData: ${mod.type}
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>
`
  }
  return `${header}
<template>
  <div class="${mod.kebab} u-tag-div">
    <!-- 标题 -->
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <!-- 内容区域 -->
    <content-vue :model-data="modelData" :model-style="modelStyle" />
  </div>
</template>

<script setup lang="ts">
import type { ${mod.type} } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import ModelTitle from '@/material/ModelTitle/${TITLE[family]}/ModelTitle.vue'
import ContentVue from '@/material/${common}'

defineProps<{
  modelData: ${mod.type}
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .${mod.kebab} {
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  box-sizing: border-box;
  margin-bottom: v-bind('modelStyle.mBottom');
  margin-top: v-bind('modelStyle.mTop');
}
</style>
`
}

let written = 0
for (const mod of MODULES) {
  for (const family of FAMILIES) {
    const skinNo = SKIN_NO[mod.model][family]
    const dir = resolve(appRoot, `src/material/${mod.dir}/${mod.dir}${skinNo}`)
    mkdirSync(dir, { recursive: true })
    writeFileSync(resolve(dir, mod.file), wrapperOf(mod, family), 'utf8')
    written += 1
  }
}
console.log(`已生成 ${written} 个皮肤包装文件`)

// materialList.ts 的登记不在这里做：登记块要按模块插进数组内部，
// 脚本化插入容易吞掉数组闭合括号，统一交给 fix-material-list.mjs 重建。
