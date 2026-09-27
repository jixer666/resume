/**
 * 模板市场重做·模板生成：把 30 套设计展开成 resume_template.template_detail，
 * 写入 templates.sql，并同步 resume-server/sql/resume.sql。
 *
 * 用法：node .task/20260927-模板市场扩充/gen-v2-templates.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(here, '../..')

const MODELS = [
  'RESUME_TITLE', 'BASE_INFO', 'JOB_INTENTION', 'EDU_BACKGROUND', 'SKILL_SPECIALTIES',
  'CAMPUS_EXPERIENCE', 'INTERNSHIP_EXPERIENCE', 'WORK_EXPERIENCE', 'PROJECT_EXPERIENCE',
  'AWARDS', 'HOBBIES', 'SELF_EVALUATION', 'WORKS_DISPLAY',
]

/** 族号 → 各模块皮肤号（包装由 gen-v2-families.mjs 生成，正文版式同族一致） */
const FAMILY = {
  12: { BASE_INFO: 9, JOB_INTENTION: 12, EDU_BACKGROUND: 12, SKILL_SPECIALTIES: 12, CAMPUS_EXPERIENCE: 12, INTERNSHIP_EXPERIENCE: 12, WORK_EXPERIENCE: 12, PROJECT_EXPERIENCE: 12, AWARDS: 12, HOBBIES: 12, SELF_EVALUATION: 12, WORKS_DISPLAY: 12 },
  13: { BASE_INFO: 18, JOB_INTENTION: 13, EDU_BACKGROUND: 13, SKILL_SPECIALTIES: 13, CAMPUS_EXPERIENCE: 13, INTERNSHIP_EXPERIENCE: 13, WORK_EXPERIENCE: 13, PROJECT_EXPERIENCE: 13, AWARDS: 13, HOBBIES: 13, SELF_EVALUATION: 13, WORKS_DISPLAY: 13 },
  14: { BASE_INFO: 11, JOB_INTENTION: 14, EDU_BACKGROUND: 14, SKILL_SPECIALTIES: 14, CAMPUS_EXPERIENCE: 14, INTERNSHIP_EXPERIENCE: 14, WORK_EXPERIENCE: 14, PROJECT_EXPERIENCE: 14, AWARDS: 14, HOBBIES: 14, SELF_EVALUATION: 14, WORKS_DISPLAY: 14 },
  15: { BASE_INFO: 6, JOB_INTENTION: 15, EDU_BACKGROUND: 15, SKILL_SPECIALTIES: 15, CAMPUS_EXPERIENCE: 15, INTERNSHIP_EXPERIENCE: 15, WORK_EXPERIENCE: 15, PROJECT_EXPERIENCE: 15, AWARDS: 15, HOBBIES: 15, SELF_EVALUATION: 15, WORKS_DISPLAY: 15 },
  16: { BASE_INFO: 8, JOB_INTENTION: 16, EDU_BACKGROUND: 16, SKILL_SPECIALTIES: 16, CAMPUS_EXPERIENCE: 16, INTERNSHIP_EXPERIENCE: 16, WORK_EXPERIENCE: 16, PROJECT_EXPERIENCE: 16, AWARDS: 16, HOBBIES: 16, SELF_EVALUATION: 16, WORKS_DISPLAY: 16 },
  17: { BASE_INFO: 3, JOB_INTENTION: 17, EDU_BACKGROUND: 17, SKILL_SPECIALTIES: 17, CAMPUS_EXPERIENCE: 17, INTERNSHIP_EXPERIENCE: 17, WORK_EXPERIENCE: 17, PROJECT_EXPERIENCE: 17, AWARDS: 17, HOBBIES: 17, SELF_EVALUATION: 17, WORKS_DISPLAY: 17 },
  18: { BASE_INFO: 18, JOB_INTENTION: 18, EDU_BACKGROUND: 18, SKILL_SPECIALTIES: 18, CAMPUS_EXPERIENCE: 18, INTERNSHIP_EXPERIENCE: 18, WORK_EXPERIENCE: 18, PROJECT_EXPERIENCE: 18, AWARDS: 18, HOBBIES: 18, SELF_EVALUATION: 18, WORKS_DISPLAY: 18 },
  19: { BASE_INFO: 11, JOB_INTENTION: 19, EDU_BACKGROUND: 19, SKILL_SPECIALTIES: 19, CAMPUS_EXPERIENCE: 19, INTERNSHIP_EXPERIENCE: 19, WORK_EXPERIENCE: 19, PROJECT_EXPERIENCE: 19, AWARDS: 19, HOBBIES: 19, SELF_EVALUATION: 19, WORKS_DISPLAY: 19 },
  20: { BASE_INFO: 4, JOB_INTENTION: 20, EDU_BACKGROUND: 20, SKILL_SPECIALTIES: 20, CAMPUS_EXPERIENCE: 20, INTERNSHIP_EXPERIENCE: 20, WORK_EXPERIENCE: 20, PROJECT_EXPERIENCE: 20, AWARDS: 20, HOBBIES: 20, SELF_EVALUATION: 20, WORKS_DISPLAY: 20 },
  21: { BASE_INFO: 10, JOB_INTENTION: 21, EDU_BACKGROUND: 21, SKILL_SPECIALTIES: 21, CAMPUS_EXPERIENCE: 21, INTERNSHIP_EXPERIENCE: 21, WORK_EXPERIENCE: 21, PROJECT_EXPERIENCE: 21, AWARDS: 21, HOBBIES: 21, SELF_EVALUATION: 21, WORKS_DISPLAY: 21 },
  22: { BASE_INFO: 18, JOB_INTENTION: 22, EDU_BACKGROUND: 24, SKILL_SPECIALTIES: 29, CAMPUS_EXPERIENCE: 22, INTERNSHIP_EXPERIENCE: 22, WORK_EXPERIENCE: 22, PROJECT_EXPERIENCE: 22, AWARDS: 22, HOBBIES: 23, SELF_EVALUATION: 23, WORKS_DISPLAY: 22 },
  23: { BASE_INFO: 19, JOB_INTENTION: 22, EDU_BACKGROUND: 4, SKILL_SPECIALTIES: 32, CAMPUS_EXPERIENCE: 25, INTERNSHIP_EXPERIENCE: 25, WORK_EXPERIENCE: 25, PROJECT_EXPERIENCE: 25, AWARDS: 22, HOBBIES: 22, SELF_EVALUATION: 22, WORKS_DISPLAY: 22 },
  24: { BASE_INFO: 20, JOB_INTENTION: 22, EDU_BACKGROUND: 25, SKILL_SPECIALTIES: 30, CAMPUS_EXPERIENCE: 23, INTERNSHIP_EXPERIENCE: 23, WORK_EXPERIENCE: 23, PROJECT_EXPERIENCE: 23, AWARDS: 23, HOBBIES: 22, SELF_EVALUATION: 22, WORKS_DISPLAY: 22 },
  25: { BASE_INFO: 21, JOB_INTENTION: 22, EDU_BACKGROUND: 26, SKILL_SPECIALTIES: 29, CAMPUS_EXPERIENCE: 24, INTERNSHIP_EXPERIENCE: 24, WORK_EXPERIENCE: 24, PROJECT_EXPERIENCE: 24, AWARDS: 23, HOBBIES: 23, SELF_EVALUATION: 22, WORKS_DISPLAY: 22 },
  26: { BASE_INFO: 22, JOB_INTENTION: 23, EDU_BACKGROUND: 27, SKILL_SPECIALTIES: 31, CAMPUS_EXPERIENCE: 26, INTERNSHIP_EXPERIENCE: 26, WORK_EXPERIENCE: 26, PROJECT_EXPERIENCE: 26, AWARDS: 24, HOBBIES: 24, SELF_EVALUATION: 24, WORKS_DISPLAY: 23 },
}

/** 侧栏布局的栏位划分：左栏放名片与求职意向等，右栏放主体经历 */
const SIDEBAR_LEFT = ['BASE_INFO', 'JOB_INTENTION', 'SKILL_SPECIALTIES', 'HOBBIES', 'SELF_EVALUATION']

/** 每套模板：族号 + 配色 + 页面背景预设 + 隐藏模块 */
const TEMPLATES = [
  { code: 'fresh', name: '应届生通用', family: 22, color: '#c0392b', bg: '', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'WORK_EXPERIENCE'] },
  { code: 'campus', name: '校园招聘', family: 13, color: '#1a56db', bg: 'tint', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'WORK_EXPERIENCE'] },
  { code: 'intern', name: '实习生专用', family: 16, color: '#0f766e', bg: '', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'WORK_EXPERIENCE'] },
  { code: 'graduate', name: '保研考研', family: 20, color: '#1f3864', bg: '', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'WORK_EXPERIENCE', 'HOBBIES'] },
  { code: 'cadre', name: '学生干部', family: 21, color: '#ea580c', bg: '', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'WORK_EXPERIENCE'] },
  { code: 'english', name: '英文简历', family: 17, color: '#111827', bg: '', hidden: ['RESUME_TITLE', 'HOBBIES', 'WORKS_DISPLAY'] },
  { code: 'developer', name: '软件工程师', family: 12, color: '#1f3a5f', bg: '', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'HOBBIES'] },
  { code: 'java', name: 'Java 开发工程师', family: 24, color: '#b45309', bg: 'tint', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'HOBBIES'] },
  { code: 'frontend', name: '前端工程师', family: 23, color: '#7c3aed', bg: '', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'HOBBIES'] },
  { code: 'algorithm', name: '算法工程师', family: 26, color: '#4338ca', bg: '', layout: 'leftRight', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'HOBBIES'] },
  { code: 'data', name: '数据分析师', family: 26, color: '#0e7490', bg: '', layout: 'leftRight', rightSide: true, hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'HOBBIES'] },
  { code: 'test', name: '测试工程师', family: 25, color: '#15803d', bg: '', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'HOBBIES'] },
  { code: 'product', name: '产品经理', family: 14, color: '#c2410c', bg: 'warm', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'WORK_EXPERIENCE'] },
  { code: 'operation', name: '运营专员', family: 25, color: '#be123c', bg: '', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'WORK_EXPERIENCE'] },
  { code: 'marketing', name: '市场营销', family: 22, color: '#dc2626', bg: 'dot', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'WORK_EXPERIENCE'] },
  { code: 'sales', name: '销售代表', family: 15, color: '#0369a1', bg: '', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY'] },
  { code: 'designer', name: '设计师', family: 18, color: '#a21caf', bg: '', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'WORK_EXPERIENCE'] },
  { code: 'consulting', name: '咨询顾问', family: 23, color: '#334155', bg: '', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'HOBBIES'] },
  { code: 'finance', name: '金融分析师', family: 20, color: '#065f46', bg: 'grid', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'HOBBIES'] },
  { code: 'accounting', name: '财务会计', family: 13, color: '#047857', bg: '', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'HOBBIES'] },
  { code: 'legal', name: '法律法务', family: 25, color: '#1e293b', bg: '', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'HOBBIES'] },
  { code: 'medical', name: '医疗护理', family: 19, color: '#0e7490', bg: 'tint', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'WORK_EXPERIENCE'] },
  { code: 'teacher', name: '教师教育', family: 16, color: '#166534', bg: '', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'WORK_EXPERIENCE'] },
  { code: 'architect', name: '建筑土木', family: 12, color: '#57534e', bg: '', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'HOBBIES'] },
  { code: 'state', name: '国企公务员', family: 21, color: '#b91c1c', bg: '', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'HOBBIES'] },
  { code: 'social', name: '社招跳槽', family: 22, color: '#1e40af', bg: '', hidden: ['RESUME_TITLE', 'CAMPUS_EXPERIENCE', 'INTERNSHIP_EXPERIENCE', 'HOBBIES', 'WORKS_DISPLAY'] },
  { code: 'ink', name: '水墨国风', family: 18, color: '#44403c', bg: 'warm', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY'] },
  { code: 'sidebar-blue', name: '蓝调侧栏', family: 26, color: '#1d4ed8', bg: '', layout: 'leftRight', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY'] },
  { code: 'sidebar-navy', name: '藏青侧栏', family: 26, color: '#16324f', bg: '', layout: 'leftRight', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY', 'HOBBIES'] },
  { code: 'sidebar-warm', name: '暖棕侧栏', family: 26, color: '#92400e', bg: '', layout: 'leftRight', hidden: ['RESUME_TITLE', 'WORKS_DISPLAY'] },
]

/** 各配色的正文与标题色：深色主题配浅字，浅色主题配深字 */
function palette(color) {
  return {
    themeColor: color,
    firstTitleFontSize: '18px',
    secondTitleFontSize: '14px',
    textFontSize: '13px',
    secondTitleColor: '#1f2937',
    textFontColor: '#4b5563',
    secondTitleWeight: 600,
    textFontWeight: 400,
    pTop: '18px',
    pBottom: '0px',
    pLeftRight: '46px',
    modelMarginTop: '0px',
    modelMarginBottom: '28px',
  }
}

const rows = TEMPLATES.map((tpl) => {
  const family = FAMILY[tpl.family]
  const variants = {}
  for (const model of MODELS)
    variants[model] = `${model}_${family[model]}`
  const detail = {
    style: { ...palette(tpl.color), resumeBackgroundCom: tpl.bg || '' },
    hidden: tpl.hidden,
    layout: tpl.layout || 'classical',
    variants,
  }
  if (tpl.layout === 'leftRight') {
    const left = tpl.rightSide ? [] : SIDEBAR_LEFT
    const right = tpl.rightSide ? SIDEBAR_LEFT : []
    detail.columns = {
      left: tpl.rightSide ? MODELS.filter(model => !left.includes(model)) : left,
      right: tpl.rightSide ? left : MODELS.filter(model => !right.includes(model)),
    }
    detail.style = {
      ...detail.style,
      leftWidth: '30%',
      rightWidth: '70%',
      pLeftRight: '20px',
      modelMarginBottom: '24px',
      // 侧栏底色：左侧栏用深色，右侧栏时深色落在右栏
      leftThemeColor: tpl.rightSide ? '#ffffff' : tpl.color,
      rightThemeColor: tpl.rightSide ? tpl.color : '#ffffff',
    }
  }
  return { ...tpl, detail }
})

const now = '2026-09-27 12:00:00'
const esc = v => String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
const sql = rows.map((row, i) => {
  const id = 4 + i
  const json = JSON.stringify(row.detail)
  return `INSERT INTO \`resume_template\` VALUES (${id}, '${row.code}', '${row.name}', '${esc(row.name)}模板', '', 1, '${json.replace(/'/g, "''")}', 1, 0, '${now}', '${now}', 1, 1, 1790331887000);`
}).join('\n')

writeFileSync(resolve(here, 'templates.sql'), `${sql}\n`, 'utf8')

/** 同步 Navicat 导出的建库脚本：新模板 INSERT 追加到 id = 3 之后，自增起点顺延 */
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
    return `INSERT INTO \`resume_template\` VALUES (${id}, '${row.code}', '${quoteText(row.name)}', '${quoteText(row.name)}模板', '', 1, '${json}', 1, 0, '${now}', '${now}', 1, 1, 1790331887000);`
  })

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

console.log(`生成 ${rows.length} 套模板，SQL 已写入 templates.sql`)
for (const row of rows)
  console.log(row.code.padEnd(14), row.name, '族', row.family, row.detail.layout)