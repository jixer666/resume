/**
 * 模板市场重做·皮肤包装生成 + materialList 登记。
 *
 * 包装文件 = 根节点内外边距 + 模块标题 + 内容组件，与既有皮肤结构一致；
 * 登记沿用 fix-material-list.mjs 的做法：以 git HEAD 为干净底稿整行克隆首条登记块。
 *
 * 用法：node .task/20260927-模板市场扩充/gen-v2-skins.mjs
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import esbuild from 'esbuild'

const here = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(here, '../..')

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

/**
 * 新皮肤：cptName 编号 → 内容组件与标题组件。
 * 编号从各模块既有最大号之后顺延，避免与旧皮肤重名。
 */
const SKINS = [
  { model: 'BASE_INFO', no: 18, common: 'Common/BaseInfo/BaseInfo13.vue' },
  { model: 'BASE_INFO', no: 19, common: 'Common/BaseInfo/BaseInfo14.vue' },
  { model: 'BASE_INFO', no: 20, common: 'Common/BaseInfo/BaseInfo15.vue' },
  { model: 'BASE_INFO', no: 21, common: 'Common/BaseInfo/BaseInfo16.vue' },
  { model: 'BASE_INFO', no: 22, common: 'Common/BaseInfo/BaseInfo17.vue' },

  { model: 'JOB_INTENTION', no: 22, common: 'Common/JobIntention/JobIntention2.vue', title: 24 },
  { model: 'JOB_INTENTION', no: 23, common: 'Common/JobIntention/JobIntention3.vue', title: 26 },

  { model: 'EDU_BACKGROUND', no: 24, common: 'Common/EduBackground/EduBackground5.vue', title: 22 },
  { model: 'EDU_BACKGROUND', no: 25, common: 'Common/EduBackground/EduBackground6.vue', title: 24 },
  { model: 'EDU_BACKGROUND', no: 26, common: 'Common/EduBackground/EduBackground7.vue', title: 22 },
  { model: 'EDU_BACKGROUND', no: 27, common: 'Common/EduBackground/EduBackground8.vue', title: 26 },

  { model: 'SKILL_SPECIALTIES', no: 29, common: 'Common/SkillSpecialties/SkillSpecialties7.vue', title: 22 },
  { model: 'SKILL_SPECIALTIES', no: 30, common: 'Common/SkillSpecialties/SkillSpecialties8.vue', title: 24 },
  { model: 'SKILL_SPECIALTIES', no: 31, common: 'Common/SkillSpecialties/SkillSpecialties9.vue', title: 26 },
  { model: 'SKILL_SPECIALTIES', no: 32, common: 'Common/SkillSpecialties/SkillSpecialties10.vue', title: 23 },

  { model: 'CAMPUS_EXPERIENCE', no: 22, common: 'Common/CampusExperience/CampusExperience2.vue', title: 22 },
  { model: 'CAMPUS_EXPERIENCE', no: 23, common: 'Common/CampusExperience/CampusExperience3.vue', title: 24 },
  { model: 'CAMPUS_EXPERIENCE', no: 24, common: 'Common/CampusExperience/CampusExperience4.vue', title: 22 },
  { model: 'CAMPUS_EXPERIENCE', no: 25, common: 'Common/CampusExperience/CampusExperience5.vue', title: 23 },
  { model: 'CAMPUS_EXPERIENCE', no: 26, common: 'Common/CampusExperience/CampusExperience6.vue', title: 26 },

  { model: 'INTERNSHIP_EXPERIENCE', no: 22, common: 'Common/InternshipExperience/InternshipExperience3.vue', title: 22 },
  { model: 'INTERNSHIP_EXPERIENCE', no: 23, common: 'Common/InternshipExperience/InternshipExperience4.vue', title: 24 },
  { model: 'INTERNSHIP_EXPERIENCE', no: 24, common: 'Common/InternshipExperience/InternshipExperience5.vue', title: 22 },
  { model: 'INTERNSHIP_EXPERIENCE', no: 25, common: 'Common/InternshipExperience/InternshipExperience6.vue', title: 23 },
  { model: 'INTERNSHIP_EXPERIENCE', no: 26, common: 'Common/InternshipExperience/InternshipExperience7.vue', title: 26 },

  { model: 'WORK_EXPERIENCE', no: 22, common: 'Common/WorkExperience/WorkExperience5.vue', title: 22 },
  { model: 'WORK_EXPERIENCE', no: 23, common: 'Common/WorkExperience/WorkExperience6.vue', title: 24 },
  { model: 'WORK_EXPERIENCE', no: 24, common: 'Common/WorkExperience/WorkExperience7.vue', title: 22 },
  { model: 'WORK_EXPERIENCE', no: 25, common: 'Common/WorkExperience/WorkExperience8.vue', title: 23 },
  { model: 'WORK_EXPERIENCE', no: 26, common: 'Common/WorkExperience/WorkExperience9.vue', title: 26 },

  { model: 'PROJECT_EXPERIENCE', no: 22, common: 'Common/ProjectExperience/ProjectExperience5.vue', title: 22 },
  { model: 'PROJECT_EXPERIENCE', no: 23, common: 'Common/ProjectExperience/ProjectExperience6.vue', title: 24 },
  { model: 'PROJECT_EXPERIENCE', no: 24, common: 'Common/ProjectExperience/ProjectExperience7.vue', title: 22 },
  { model: 'PROJECT_EXPERIENCE', no: 25, common: 'Common/ProjectExperience/ProjectExperience8.vue', title: 23 },
  { model: 'PROJECT_EXPERIENCE', no: 26, common: 'Common/ProjectExperience/ProjectExperience9.vue', title: 26 },

  { model: 'AWARDS', no: 22, common: 'Common/Awards/Awards4.vue', title: 22 },
  { model: 'AWARDS', no: 23, common: 'Common/Awards/Awards5.vue', title: 22 },
  { model: 'AWARDS', no: 24, common: 'Common/Awards/Awards6.vue', title: 26 },

  { model: 'HOBBIES', no: 22, common: 'Common/Hobbies/Hobbies3.vue', title: 23 },
  { model: 'HOBBIES', no: 23, common: 'Common/Hobbies/Hobbies4.vue', title: 22 },
  { model: 'HOBBIES', no: 24, common: 'Common/Hobbies/Hobbies5.vue', title: 26 },

  { model: 'SELF_EVALUATION', no: 22, common: 'Common/SelfEvaluation/SelfEvaluation3.vue', title: 24 },
  { model: 'SELF_EVALUATION', no: 23, common: 'Common/SelfEvaluation/SelfEvaluation4.vue', title: 23 },
  { model: 'SELF_EVALUATION', no: 24, common: 'Common/SelfEvaluation/SelfEvaluation5.vue', title: 26 },

  { model: 'WORKS_DISPLAY', no: 22, common: 'Common/WorksDisplay/WorksDisplay2.vue', title: 23 },
  { model: 'WORKS_DISPLAY', no: 23, common: 'Common/WorksDisplay/WorksDisplay3.vue', title: 26 },
]

function wrapperOf(mod, skin) {
  const header = `<!-- ${mod.dir}·新版式 ${skin.no} 皮肤包装（由 .task/20260927-模板市场扩充/gen-v2-skins.mjs 生成） -->`
  if (mod.model === 'BASE_INFO') {
    return `${header}
<template>
  <div class="${mod.kebab}-${skin.no}-box u-tag-div">
    <!-- 名片版式（自带内外边距） -->
    <content-vue :model-data="modelData" :model-style="modelStyle" />
  </div>
</template>

<script setup lang="ts">
import type { ${mod.type} } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import ContentVue from '@/material/${skin.common}'

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
import ModelTitle from '@/material/ModelTitle/ModelTitle${skin.title}/ModelTitle.vue'
import ContentVue from '@/material/${skin.common}'

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
for (const skin of SKINS) {
  const mod = MODULES.find(item => item.model === skin.model)
  const dir = resolve(appRoot, `src/material/${mod.dir}/${mod.dir}${skin.no}`)
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, mod.file), wrapperOf(mod, skin), 'utf8')
  written += 1
}
console.log(`已生成 ${written} 个皮肤包装文件`)

/* ---------------- materialList.ts 登记 ---------------- */

function maskStrings(src) {
  const out = src.split('')
  let i = 0
  const n = src.length
  while (i < n) {
    const c = src[i]
    const c2 = src[i + 1]
    if (c === '/' && c2 === '/') { while (i < n && src[i] !== '\n') { out[i] = ' '; i++ } continue }
    if (c === '/' && c2 === '*') {
      out[i] = ' '; out[i + 1] = ' '; i += 2
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] !== '\n') out[i] = ' '; i++ }
      if (i < n) { out[i] = ' '; out[i + 1] = ' '; i += 2 }
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      const q = c
      out[i] = ' '; i++
      while (i < n) {
        if (src[i] === '\\') { out[i] = ' '; out[i + 1] = ' '; i += 2; continue }
        if (src[i] === q) { out[i] = ' '; i++; break }
        if (src[i] !== '\n') out[i] = ' '
        i++
      }
      continue
    }
    i++
  }
  return out.join('')
}

function matchBrace(text, from) {
  const masked = maskStrings(text)
  let depth = 0
  for (let j = from; j < masked.length; j++) {
    if (masked[j] === '{') depth++
    else if (masked[j] === '}') { depth--; if (depth === 0) return j }
  }
  throw new Error('括号不匹配')
}

const base = execFileSync('git', ['show', 'HEAD:resume-app/src/schema/materialList.ts'], { cwd: resolve(appRoot, '..'), maxBuffer: 64 * 1024 * 1024 }).toString('utf8')

let source = base
let inserted = 0
for (const mod of MODULES) {
  const wanted = SKINS.filter(skin => skin.model === mod.model && !source.includes(`'${mod.model}_${skin.no}'`))
  if (!wanted.length)
    continue
  const keyAt = source.indexOf(`  ${mod.model}: [`)
  if (keyAt < 0)
    throw new Error(`找不到模块 ${mod.model}`)
  const closeLineAt = source.indexOf('\n  ],', keyAt)
  if (closeLineAt < 0)
    throw new Error(`模块 ${mod.model} 找不到数组闭合行`)
  const section = source.slice(keyAt, closeLineAt)
  const firstBrace = section.indexOf('{')
  const firstEnd = matchBrace(section, firstBrace)
  const lineStart = section.lastIndexOf('\n', firstBrace) + 1
  const commaAt = section[firstEnd + 1] === ',' ? firstEnd + 2 : firstEnd + 1
  const template = section.slice(lineStart, commaAt)
  if (!/^\s*\{\n[\s\S]*\n\s*\},$/.test(template))
    throw new Error(`${mod.model} 首条登记块取整行失败`)
  const entries = wanted.map(skin => template.replace(/cptName: '[A-Z_0-9]+'/, `cptName: '${mod.model}_${skin.no}'`))
  if (source[closeLineAt - 1] !== ',')
    throw new Error(`${mod.model} 末条登记块缺少逗号`)
  source = source.slice(0, closeLineAt) + '\n' + entries.join('\n') + source.slice(closeLineAt)
  inserted += entries.length
}

try {
  await esbuild.transform(source, { loader: 'ts' })
}
catch (error) {
  throw new Error(`重建后的 materialList.ts 语法校验失败：${error.message}`)
}
writeFileSync(resolve(appRoot, 'src/schema/materialList.ts'), source, 'utf8')
console.log(`已重建 materialList.ts，登记 ${inserted} 条新皮肤`)