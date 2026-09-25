// 富文本指令净化 codemod
//
// 事实源：src/material/** 里残留的 `v-dompurify-html`（resume-design web 端的指令）
// 生成物：改写为原子标签内嵌 <RichTextView :html="EXPR" :model-style="modelStyle" />
//
// 为什么需要：mp 端不认识 `v-dompurify-html` / `v-html`，会直接编译失败（unknown directive），
// 而 mp 原生的 <rich-text> 又不继承组件 scoped 样式，所以统一收敛到 RichTextView
// （它内部做了条件编译 + 主题样式内联）。
//
// 一次性工具，不挂构建钩子。用法：
//   node ./scripts/mp-purify-richtext.js [--dry] [目标目录]
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

const args = process.argv.slice(2)
const dry = args.includes('--dry')
const target = path.resolve(root, args.find(arg => !arg.startsWith('--')) || 'src/material')

/** 递归收集 .vue 文件 */
function collect(dir) {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory())
      files.push(...collect(full))
    else if (entry.name.endsWith('.vue'))
      files.push(full)
  }
  return files
}

/**
 * `<p attrs v-dompurify-html="EXPR" attrs />`
 *   group1 = 标签名，group2 = 指令前属性，group3 = 表达式，group4 = 指令后属性
 * 属性区一律 `[^<>]*?`：既排除跨标签误匹配，也允许属性区含换行（多行写法）。
 */
const TAG_RE = /<(p|li|div|span|h[1-6]|text)\b([^<>]+?)v-dompurify-html="([^"]*)"([^<>]*?)\/>/g

function purify(file) {
  const source = fs.readFileSync(file, 'utf8')
  if (!source.includes('v-dompurify-html'))
    return null

  // mp 端不继承 scoped 样式，行距需要内联；这些皮肤几乎统一是 2px
  const extraStyle = /letter-spacing:\s*2px/.test(source) ? ' extra-style="letter-spacing:2px"' : ''
  // 个别皮肤（如 Custom1/2/3）没有 modelStyle，别拼出 undefined prop
  const styleProp = /modelStyle/.test(source) ? ' :model-style="modelStyle"' : ''

  let count = 0
  const content = source.replace(TAG_RE, (_match, tag, before, expr, after) => {
    const attrs = `${before}${after}`.replace(/\s+/g, ' ').trim()
    count++
    return `<${tag}${attrs ? ` ${attrs}` : ''}>`
      + `<RichTextView :html="${expr}"${styleProp}${extraStyle} />`
      + `</${tag}>`
  })

  // 非自闭合写法（带子节点）本脚本不动，留给人看
  const leftover = (content.match(/v-dompurify-html/g) || []).length
  return { content, count, leftover }
}

let changed = 0
let rewritten = 0
let leftover = 0

for (const file of collect(target)) {
  const result = purify(file)
  if (!result)
    continue
  changed++
  rewritten += result.count
  leftover += result.leftover
  if (dry) {
    console.log(`[dry] ${path.relative(root, file)} -> ${result.count} 处`)
  }
  else {
    fs.writeFileSync(file, result.content)
    console.log(`${path.relative(root, file)} -> ${result.count} 处`)
  }
}

console.log(`[mp-purify-richtext] 改写 ${changed} 个文件 / ${rewritten} 处${dry ? '（dry-run）' : ''}`)
if (leftover)
  console.warn(`[mp-purify-richtext] 仍有 ${leftover} 处未匹配（非自闭合写法），需人工处理`)
