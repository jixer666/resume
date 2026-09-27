/**
 * 模板市场重做·设计族生成：15 个族（族号 12–26）的皮肤包装 + materialList 登记。
 *
 * 一个「族」= 一套模块标题风格 + 一套正文版式，同族的模块排法一致、跨族不重复；
 * 族号沿用既有 12–21 的编号（旧包装按新设计重写），并新增 22–26（新标题族）。
 *
 * 用法：node .task/20260927-模板市场扩充/gen-v2-families.mjs
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import esbuild from 'esbuild'

const here = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(here, '../..')

const MODULES = [
  { model: 'BASE_INFO', dir: 'BaseInfo', file: 'BaseInfo.vue', type: 'IBASEINFO', kebab: 'base-info' },
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

/** 正文版式代号 → 内容组件名（Common 下的相对路径） */
const LAYOUT = {
  classic: 'Common/JobIntention/JobIntention1.vue|Common/EduBackground/EduBackground1.vue|Common/SkillSpecialties/SkillSpecialties1.vue|Common/CampusExperience/CampusExperience1.vue|Common/InternshipExperience/InternshipExperience1.vue|Common/WorkExperience/WorkExperience1.vue|Common/ProjectExperience/ProjectExperience1.vue|Common/Awards/Awards1.vue|Common/Hobbies/Hobbies1.vue|Common/SelfEvaluation/SelfEvaluation1.vue|Common/WorksDisplay/WorksDisplay1.vue',
  timeline: 'Common/JobIntention/JobIntention2.vue|Common/EduBackground/EduBackground5.vue|Common/SkillSpecialties/SkillSpecialties7.vue|Common/CampusExperience/CampusExperience2.vue|Common/InternshipExperience/InternshipExperience3.vue|Common/WorkExperience/WorkExperience5.vue|Common/ProjectExperience/ProjectExperience5.vue|Common/Awards/Awards4.vue|Common/Hobbies/Hobbies4.vue|Common/SelfEvaluation/SelfEvaluation4.vue|Common/WorksDisplay/WorksDisplay2.vue',
  split: 'Common/JobIntention/JobIntention2.vue|Common/EduBackground/EduBackground6.vue|Common/SkillSpecialties/SkillSpecialties8.vue|Common/CampusExperience/CampusExperience3.vue|Common/InternshipExperience/InternshipExperience4.vue|Common/WorkExperience/WorkExperience6.vue|Common/ProjectExperience/ProjectExperience6.vue|Common/Awards/Awards5.vue|Common/Hobbies/Hobbies3.vue|Common/SelfEvaluation/SelfEvaluation3.vue|Common/WorksDisplay/WorksDisplay2.vue',
  table: 'Common/JobIntention/JobIntention2.vue|Common/EduBackground/EduBackground7.vue|Common/SkillSpecialties/SkillSpecialties7.vue|Common/CampusExperience/CampusExperience4.vue|Common/InternshipExperience/InternshipExperience5.vue|Common/WorkExperience/WorkExperience7.vue|Common/ProjectExperience/ProjectExperience7.vue|Common/Awards/Awards5.vue|Common/Hobbies/Hobbies4.vue|Common/SelfEvaluation/SelfEvaluation3.vue|Common/WorksDisplay/WorksDisplay2.vue',
  card: 'Common/JobIntention/JobIntention2.vue|Common/EduBackground/EduBackground4.vue|Common/SkillSpecialties/SkillSpecialties10.vue|Common/CampusExperience/CampusExperience5.vue|Common/InternshipExperience/InternshipExperience6.vue|Common/WorkExperience/WorkExperience8.vue|Common/ProjectExperience/ProjectExperience8.vue|Common/Awards/Awards4.vue|Common/Hobbies/Hobbies3.vue|Common/SelfEvaluation/SelfEvaluation3.vue|Common/WorksDisplay/WorksDisplay2.vue',
  sidebar: 'Common/JobIntention/JobIntention3.vue|Common/EduBackground/EduBackground8.vue|Common/SkillSpecialties/SkillSpecialties9.vue|Common/CampusExperience/CampusExperience6.vue|Common/InternshipExperience/InternshipExperience7.vue|Common/WorkExperience/WorkExperience9.vue|Common/ProjectExperience/ProjectExperience9.vue|Common/Awards/Awards6.vue|Common/Hobbies/Hobbies5.vue|Common/SelfEvaluation/SelfEvaluation5.vue|Common/WorksDisplay/WorksDisplay3.vue',
  block: 'Common/JobIntention/JobIntention1.vue|Common/EduBackground/EduBackground4.vue|Common/SkillSpecialties/SkillSpecialties6.vue|Common/CampusExperience/CampusExperience1.vue|Common/InternshipExperience/InternshipExperience2.vue|Common/WorkExperience/WorkExperience4.vue|Common/ProjectExperience/ProjectExperience4.vue|Common/Awards/Awards2.vue|Common/Hobbies/Hobbies2.vue|Common/SelfEvaluation/SelfEvaluation2.vue|Common/WorksDisplay/WorksDisplay1.vue',
  dotted: 'Common/JobIntention/JobIntention1.vue|Common/EduBackground/EduBackground1.vue|Common/SkillSpecialties/SkillSpecialties7.vue|Common/CampusExperience/CampusExperience1.vue|Common/InternshipExperience/InternshipExperience1.vue|Common/WorkExperience/WorkExperience3.vue|Common/ProjectExperience/ProjectExperience3.vue|Common/Awards/Awards4.vue|Common/Hobbies/Hobbies4.vue|Common/SelfEvaluation/SelfEvaluation2.vue|Common/WorksDisplay/WorksDisplay1.vue',
}

/** 正文版式代号按模块拆开 */
function layoutOf(name) {
  const list = LAYOUT[name].split('|')
  const map = {}
  MODULES.forEach((mod, index) => {
    if (mod.model !== 'BASE_INFO')
      map[mod.model] = list[index - 1]
  })
  return map
}

/**
 * 15 个设计族：标题组件 + 正文版式 + 名片版式。
 * 族号 12–21 沿用旧编号（包装按新设计重写），22–26 为新增标题族。
 */
const FAMILIES = {
  12: { title: 12, layout: 'classic', baseInfo: 9 },
  13: { title: 13, layout: 'table', baseInfo: 18 },
  14: { title: 14, layout: 'card', baseInfo: 11 },
  15: { title: 15, layout: 'split', baseInfo: 6 },
  16: { title: 16, layout: 'timeline', baseInfo: 8 },
  17: { title: 17, layout: 'classic', baseInfo: 3 },
  18: { title: 18, layout: 'dotted', baseInfo: 18 },
  19: { title: 19, layout: 'block', baseInfo: 11 },
  20: { title: 20, layout: 'table', baseInfo: 4 },
  21: { title: 21, layout: 'block', baseInfo: 10 },
  22: { title: 22, layout: 'timeline', baseInfo: 18 },
  23: { title: 23, layout: 'card', baseInfo: 19 },
  24: { title: 24, layout: 'split', baseInfo: 20 },
  25: { title: 25, layout: 'table', baseInfo: 21 },
  26: { title: 26, layout: 'sidebar', baseInfo: 22 },
}

/** 名片版式的 Common 组件名 */
const BASE_INFO_COMMON = {
  3: 'Common/BaseInfo/BaseInfo3.vue',
  4: 'Common/BaseInfo/BaseInfo4.vue',
  6: 'Common/BaseInfo/BaseInfo6.vue',
  8: 'Common/BaseInfo/BaseInfo8.vue',
  9: 'Common/BaseInfo/BaseInfo9.vue',
  10: 'Common/BaseInfo/BaseInfo10.vue',
  11: 'Common/BaseInfo/BaseInfo11.vue',
  18: 'Common/BaseInfo/BaseInfo13.vue',
  19: 'Common/BaseInfo/BaseInfo14.vue',
  20: 'Common/BaseInfo/BaseInfo15.vue',
  21: 'Common/BaseInfo/BaseInfo16.vue',
  22: 'Common/BaseInfo/BaseInfo17.vue',
}

function wrapperOf(mod, family) {
  const conf = FAMILIES[family]
  const header = `<!-- ${mod.dir}·设计族 ${family} 皮肤包装（由 .task/20260927-模板市场扩充/gen-v2-families.mjs 生成） -->`
  if (mod.model === 'BASE_INFO') {
    return `${header}
<template>
  <div class="${mod.kebab}-${conf.baseInfo}-box u-tag-div">
    <!-- 名片版式（自带内外边距） -->
    <content-vue :model-data="modelData" :model-style="modelStyle" />
  </div>
</template>

<script setup lang="ts">
import type { ${mod.type} } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import ContentVue from '@/material/${BASE_INFO_COMMON[conf.baseInfo]}'

defineProps<{
  modelData: ${mod.type}
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>
`
  }
  const common = layoutOf(conf.layout)[mod.model]
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
import ModelTitle from '@/material/ModelTitle/ModelTitle${conf.title}/ModelTitle.vue'
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

const written = []
for (const family of Object.keys(FAMILIES).map(Number)) {
  for (const mod of MODULES) {
    const conf = FAMILIES[family]
    const no = mod.model === 'BASE_INFO' ? conf.baseInfo : family
    const dir = resolve(appRoot, `src/material/${mod.dir}/${mod.dir}${no}`)
    mkdirSync(dir, { recursive: true })
    writeFileSync(resolve(dir, mod.file), wrapperOf(mod, family), 'utf8')
    written.push(`${mod.model}_${no}`)
  }
}
console.log(`已重写 ${written.length} 个族皮肤包装（15 族 × 12 模块）`)

/* ---------------- materialList.ts 重建 ---------------- */

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

/** 本次要登记进物料清单的皮肤：按模块分组 */
const WANTED = {}
for (const family of Object.keys(FAMILIES).map(Number)) {
  const conf = FAMILIES[family]
  for (const mod of MODULES) {
    const no = mod.model === 'BASE_INFO' ? conf.baseInfo : family
    ;(WANTED[mod.model] ||= new Set()).add(no)
  }
}

let source = base
let inserted = 0
for (const mod of MODULES) {
  const wanted = [...WANTED[mod.model]].filter(no => !source.includes(`'${mod.model}_${no}'`)).sort((a, b) => a - b)
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
  const entries = wanted.map(no => template.replace(/cptName: '[A-Z_0-9]+'/, `cptName: '${mod.model}_${no}'`))
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
console.log(`已重建 materialList.ts，登记 ${inserted} 条族皮肤`)