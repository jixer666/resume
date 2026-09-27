/**
 * 模板市场扩充·版式重排：给 30 套模板重新指定「标题族 + 基本资料版式」。
 *
 * 重排口径：同一套模板的标题族 / 内容布局 / 名片版式尽量互不相同，
 * 只有颜色不同、排版完全一致的组合才允许复用（三套侧栏同族同版式，仅配色不同）。
 *
 * 用法：node .task/20260927-模板市场扩充/apply-plan.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

/** 模板编号 → [标题族, 基本资料皮肤] */
const PLAN = {
  fresh: ['12', 'BASE_INFO_12'],
  intern: ['14', 'BASE_INFO_14'],
  campus: ['13', 'BASE_INFO_13'],
  graduate: ['1', 'BASE_INFO_1'],
  cadre: ['5', 'BASE_INFO_5'],
  english: ['17', 'BASE_INFO_17'],
  developer: ['16', 'BASE_INFO_16'],
  java: ['8', 'BASE_INFO_15'],
  frontend: ['4', 'BASE_INFO_12'],
  algorithm: ['9', 'BASE_INFO_15'],
  data: ['15', 'BASE_INFO_15'],
  test: ['11', 'BASE_INFO_16'],
  product: ['2', 'BASE_INFO_13'],
  operation: ['6', 'BASE_INFO_15'],
  marketing: ['13', 'BASE_INFO_12'],
  sales: ['16', 'BASE_INFO_13'],
  designer: ['14', 'BASE_INFO_14'],
  consulting: ['7', 'BASE_INFO_17'],
  finance: ['3', 'BASE_INFO_15'],
  accounting: ['15', 'BASE_INFO_16'],
  legal: ['17', 'BASE_INFO_13'],
  medical: ['8', 'BASE_INFO_14'],
  teacher: ['12', 'BASE_INFO_15'],
  architect: ['16', 'BASE_INFO_16'],
  state: ['13', 'BASE_INFO_12'],
  social: ['12', 'BASE_INFO_16'],
  ink: ['9', 'BASE_INFO_12'],
  'sidebar-blue': ['11', 'BASE_INFO_11'],
  'sidebar-navy': ['11', 'BASE_INFO_11'],
  'sidebar-warm': ['11', 'BASE_INFO_11'],
}

const file = resolve(here, 'templates.json')
const raw = readFileSync(file, 'utf8').replace(/^\uFEFF/, '')
const json = JSON.parse(raw)
const missing = []
for (const tpl of json.templates) {
  const plan = PLAN[tpl.code]
  if (!plan) {
    missing.push(tpl.code)
    continue
  }
  tpl.family = plan[0]
  tpl.baseInfo = plan[1]
}
if (missing.length)
  throw new Error(`这些模板没有排期：${missing.join(', ')}`)
writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`, 'utf8')
console.log(`已重排 ${json.templates.length} 套模板的标题族与名片版式`)
