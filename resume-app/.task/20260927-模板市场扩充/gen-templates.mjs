/**
 * 模板市场扩充：把 .task/20260927-模板市场扩充/templates.json 的设计预设展开成
 * resume_template.template_detail（含 variants），并生成 templates.sql 与
 * resume-server/sql/resume.sql 里的模板记录。
 *
 * 用法：node .task/20260927-模板市场扩充/gen-templates.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(here, '../..')

/** 模块渲染顺序，与 store/resume.ts 的 DEFAULT_MODELS 保持一致 */
const MODELS = [
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

/**
 * 标题族（ModelTitleN）→ 各模块的皮肤编号。
 *
 * 各模块的皮肤编号并不一致（SKILL_SPECIALTIES 有 18 套、EDU_BACKGROUND 有 13 套），
 * 这张表是逐套皮肤核对 ModelTitle 引用后得到的，新增模板只按「族」选版式即可。
 * `-` 表示该模块没有这一族皮肤，生成时会回退到上一族。
 */
const FAMILY_SKIN = {
  RESUME_TITLE: { 1: '1', 2: '2' },
  BASE_INFO: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17' },
  JOB_INTENTION: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '9', 9: '10', 10: '11', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17' },
  EDU_BACKGROUND: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '10', 9: '11', 10: '12', 11: '13', 12: '14', 13: '15', 14: '16', 15: '17', 16: '18', 17: '19' },
  SKILL_SPECIALTIES: { 1: '1', 2: '3', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '11', 9: '14', 10: '17', 11: '18', 12: '19', 13: '20', 14: '21', 15: '22', 16: '23', 17: '24' },
  CAMPUS_EXPERIENCE: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '9', 9: '10', 10: '11', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17' },
  INTERNSHIP_EXPERIENCE: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '9', 9: '10', 10: '11', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17' },
  WORK_EXPERIENCE: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '9', 9: '10', 10: '11', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17' },
  PROJECT_EXPERIENCE: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '9', 9: '10', 10: '11', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17' },
  AWARDS: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '9', 9: '10', 10: '11', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17' },
  HOBBIES: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '9', 9: '10', 10: '11', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17' },
  SELF_EVALUATION: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '9', 9: '10', 10: '11', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17' },
  WORKS_DISPLAY: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '9', 9: '10', 10: '11', 11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17' },
}

/** 皮肤名 → 模块名：`WORK_EXPERIENCE_9` → `WORK_EXPERIENCE` */
function modelOf(cptName) {
  return cptName.replace(/_\d+$/, '')
}

/** 某模块的可用皮肤集合，用来校验生成结果 */
const available = {}
{
  const src = readFileSync(resolve(appRoot, 'src/schema/materialList.ts'), 'utf8')
  for (const m of src.matchAll(/model: '([A-Z_]+)'[\s\S]*?cptName: '([A-Z_0-9]+)'/g))
    (available[m[1]] ||= new Set()).add(m[2])
}

const raw = readFileSync(resolve(here, 'templates.json'), 'utf8').replace(/^\uFEFF/, '')
const { templates } = JSON.parse(raw)

/** 按族取皮肤：该模块没有这一族时向上回退，直到命中为止 */
function skinOf(model, family) {
  for (let f = Number(family); f >= 1; f--) {
    const skin = FAMILY_SKIN[model]?.[f]
    if (skin && available[model]?.has(`${model}_${skin}`))
      return `${model}_${skin}`
  }
  throw new Error(`模块 ${model} 找不到族 ${family} 的皮肤`)
}

const errors = []
const rows = templates.map((tpl) => {
  const family = String(tpl.family)
  const variants = {}
  for (const model of MODELS) {
    const cptName = model === 'BASE_INFO' && tpl.baseInfo ? tpl.baseInfo : skinOf(model, family)
    if (!available[model]?.has(cptName))
      errors.push(`${tpl.code}: ${model} 的皮肤 ${cptName} 不在物料清单里`)
    variants[model] = cptName
  }

  // leftModels 是左栏的 cptName 列表：写进 variants，同时把模块名收进 columns.left
  const leftModels = tpl.leftModels || []
  const leftSet = new Set()
  for (const cptName of leftModels) {
    const model = modelOf(cptName)
    if (!available[model]?.has(cptName))
      errors.push(`${tpl.code}: 左栏皮肤 ${cptName} 不在物料清单里`)
    variants[model] = cptName
    leftSet.add(model)
  }

  const detail = {
    style: tpl.style,
    hidden: tpl.hidden,
    layout: tpl.layout,
    variants,
  }
  if (tpl.layout === 'leftRight') {
    detail.columns = {
      left: MODELS.filter(model => leftSet.has(model)),
      right: MODELS.filter(model => !leftSet.has(model)),
    }
    // 侧栏宽度与底色是全局样式字段，和 columns 一起写进明细
    detail.style = {
      ...detail.style,
      leftWidth: tpl.leftWidth,
      rightWidth: tpl.rightWidth,
      leftThemeColor: tpl.leftThemeColor,
      rightThemeColor: tpl.rightThemeColor,
    }
  }
  return { ...tpl, variants, detail }
})

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

const now = '2026-09-27 12:00:00'
const esc = v => String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
const sql = rows.map((row, i) => {
  const id = 4 + i
  const json = JSON.stringify(row.detail)
  return `INSERT INTO \`resume_template\` VALUES (${id}, '${row.code}', '${row.name}', '${esc(row.description)}', '', 1, '${json.replace(/'/g, "''")}', 1, 0, '${now}', '${now}', 1, 1, 1790331887000);`
}).join('\n')

writeFileSync(resolve(here, 'templates.sql'), `${sql}\n`, 'utf8')

/**
 * 同步 Navicat 导出的建库脚本 resume-server/sql/resume.sql：
 * 新模板的 INSERT 追加到 `Records of resume_template` 段（Navicat 风格，JSON 里的双引号写成 \"），
 * 并把自增起点挪到新模板之后，保证这份脚本能整份重建出和线上一致的库。
 */
function syncServerSql(rows) {
  const file = resolve(appRoot, '../resume-server/sql/resume.sql')
  let text = readFileSync(file, 'utf8')
  const hasBom = text.charCodeAt(0) === 0xFEFF
  if (hasBom)
    text = text.slice(1)
  const eol = text.includes('\r\n') ? '\r\n' : '\n'
  const lines = text.split(/\r?\n/)

  const quoteJson = json => json.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  const quoteText = value => String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  const inserts = rows.map((row, i) => {
    const id = 4 + i
    const json = quoteJson(JSON.stringify(row.detail))
    return `INSERT INTO \`resume_template\` VALUES (${id}, '${row.code}', '${quoteText(row.name)}', '${quoteText(row.description)}', '', 1, '${json}', 1, 0, '${now}', '${now}', 1, 1, 1790331887000);`
  })

  // 先摘掉上一轮生成的模板行（id >= 4），再插到最后一条官方模板（id = 3）后面
  const kept = lines.filter(line => !/^INSERT INTO `resume_template` VALUES \((?:[4-9]|[1-9]\d+), /.test(line))
  const anchor = kept.findIndex(line => line.startsWith('INSERT INTO `resume_template` VALUES (3, '))
  if (anchor < 0)
    throw new Error('resume.sql 里找不到 id = 3 的模板行')
  kept.splice(anchor + 1, 0, ...inserts)

  const autoIndex = kept.findIndex(line => line.includes('AUTO_INCREMENT = ') && line.includes("COMMENT = '简历模板表'"))
  if (autoIndex < 0)
    throw new Error('resume.sql 里找不到 resume_template 的自增起点')
  kept[autoIndex] = kept[autoIndex].replace(/AUTO_INCREMENT = \d+/, `AUTO_INCREMENT = ${4 + rows.length}`)

  writeFileSync(file, (hasBom ? '\uFEFF' : '') + kept.join(eol), 'utf8')
  console.log(`已同步 ${inserts.length} 条模板 INSERT 到 resume-server/sql/resume.sql`)
}

syncServerSql(rows)

console.log(`生成 ${rows.length} 套模板，SQL 已写入 .task/20260927-模板市场扩充/templates.sql`)
for (const row of rows)
  console.log(row.code.padEnd(16), row.name)
