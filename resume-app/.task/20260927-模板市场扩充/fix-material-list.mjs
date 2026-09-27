/**
 * 修复 materialList.ts：以 git HEAD 版本为干净底稿，把 72 条新皮肤登记块按模块插到数组末尾。
 *
 * 上一版 gen-skins.mjs 的登记逻辑定位错了数组结尾，把登记块插到了数组外、还吞掉了闭合括号；
 * 本脚本改为「整行克隆首条登记块」（含行首缩进与行尾逗号），插到数组闭合行之前，并用 esbuild 校验语法。
 *
 * 用法：node .task/20260927-模板市场扩充/fix-material-list.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import esbuild from 'esbuild'

const here = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(here, '../..')

const MODULES = [
  { model: 'BASE_INFO', nos: [12, 13, 14, 15, 16, 17, 9, 10, 11] },
  { model: 'JOB_INTENTION', nos: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21] },
  { model: 'EDU_BACKGROUND', nos: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23] },
  { model: 'SKILL_SPECIALTIES', nos: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28] },
  { model: 'CAMPUS_EXPERIENCE', nos: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21] },
  { model: 'INTERNSHIP_EXPERIENCE', nos: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21] },
  { model: 'WORK_EXPERIENCE', nos: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21] },
  { model: 'PROJECT_EXPERIENCE', nos: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21] },
  { model: 'AWARDS', nos: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21] },
  { model: 'HOBBIES', nos: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21] },
  { model: 'SELF_EVALUATION', nos: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21] },
  { model: 'WORKS_DISPLAY', nos: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21] },
]

/** 把字符串与注释里的花括号抹成空格，保证括号匹配只看代码结构 */
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

const base = execFileSync('git', ['show', 'HEAD:resume-app/src/schema/materialList.ts'], { cwd: resolve(appRoot, '..'), maxBuffer: 64 * 1024 * 1024 }).toString('utf8')

/** 从 from 处的 '{' 起做括号匹配，返回配对 '}' 的下标 */
function matchBrace(text, from) {
  const masked = maskStrings(text)
  let depth = 0
  for (let j = from; j < masked.length; j++) {
    if (masked[j] === '{') depth++
    else if (masked[j] === '}') { depth--; if (depth === 0) return j }
  }
  throw new Error('括号不匹配')
}

let source = base
let inserted = 0
for (const mod of MODULES) {
  // 有的族复用既有皮肤（如 BASE_INFO 的 9 / 10 / 11 是老物料），已登记过的不重复插入
  const wanted = mod.nos.filter(no => !source.includes(`'${mod.model}_${no}'`))
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
  // 首条登记块按「整行」取：行首缩进到行尾逗号（含），克隆后缩进与逗号天然正确
  const lineStart = section.lastIndexOf('\n', firstBrace) + 1
  const commaAt = section[firstEnd + 1] === ',' ? firstEnd + 2 : firstEnd + 1
  const template = section.slice(lineStart, commaAt)
  if (!/^\s*\{\n[\s\S]*\n\s*\},$/.test(template))
    throw new Error(`${mod.model} 首条登记块取整行失败`)
  if (!/cptName: '[A-Z_0-9]+'/.test(template))
    throw new Error(`${mod.model} 首条登记块里找不到 cptName`)
  const entries = wanted.map(no => template.replace(/cptName: '[A-Z_0-9]+'/, `cptName: '${mod.model}_${no}'`))
  // 插到数组闭合行之前，前一行（末条登记块）必须已经带逗号
  if (source[closeLineAt - 1] !== ',')
    throw new Error(`${mod.model} 末条登记块缺少逗号，插入会连成一行`)
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
console.log(`已重建 materialList.ts，登记 ${inserted} 条新皮肤，语法校验通过`)
