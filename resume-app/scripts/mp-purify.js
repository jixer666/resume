#!/usr/bin/env node
/**
 * 小程序端物料净化 codemod
 *
 * 解决两类「statics 级」问题（不依赖运行时判断）：
 *
 * 1. **CSS 标签选择器失效**
 *    uni-app 的 mp 编译器只把 `[data-v-xxx]` 改写成 `.data-v-xxx`，**不会重写标签选择器**
 *    （见 @dcloudio/uni-cli-shared/dist/mp/style.js，仅打一条 warn）。而 `<div>/<span>/<p>/<ul>/<li>`
 *    在 mp 端会被映射成 `view/label`，于是 `ul {}` / `li {}` 这类规则永远匹配不到。
 *    处理：为出现在 CSS 里的每个 HTML 标签生成 `u-tag-<tag>` 类，同时写进 `<style>` 选择器
 *    与 `<template>` 元素，语义等价（同标签元素全部拿到该类，原有层叠关系不变）。
 *
 * 2. **`<svg-icon>` 不可用**
 *    resume-design 的图标是 `<svg><use/></svg>`，mp 不支持内联 svg。
 *    处理：改写成全局组件 `<mp-icon>`（`src/components/MpIcon.vue`），属性一一映射。
 *
 * 用法：
 *   node ./scripts/mp-purify.js                 # 改写 src/material/**
 *   node ./scripts/mp-purify.js --dry           # 只报告，不落盘
 *   node ./scripts/mp-purify.js src/material/Common
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parse as parseSfc } from '@vue/compiler-sfc'
import { parse as parseTemplate } from '@vue/compiler-dom'
import postcssScss from 'postcss-scss'
import selectorParser from 'postcss-selector-parser'

const ROOT = process.cwd()
const args = process.argv.slice(2)
const DRY = args.includes('--dry')
const targets = args.filter(a => !a.startsWith('--'))

/**
 * 需要 class 化的 HTML 标签。
 * 只收录「mp 端没有同名原生组件、会被 uni-app 映射成别的标签」的标签，
 * mp 原生标签（view/text/image/button/input/label/form/canvas/video...）的标签选择器本身可用，故排除。
 */
const HTML_TAGS = new Set([
  'div',
  'span',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'dl',
  'dt',
  'dd',
  'a',
  'img',
  'i',
  'b',
  'em',
  'strong',
  'small',
  'sub',
  'sup',
  'u',
  's',
  'del',
  'ins',
  'mark',
  'code',
  'pre',
  'blockquote',
  'q',
  'cite',
  'abbr',
  'address',
  'time',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'td',
  'th',
  'caption',
  'hr',
  'br',
  'section',
  'article',
  'aside',
  'header',
  'footer',
  'nav',
  'main',
  'figure',
  'figcaption',
  'details',
  'summary',
  'dialog',
  'menu',
  'fieldset',
  'legend',
  'font',
  'center',
  'big',
  'tt',
  'strike',
  'marquee',
])

const CLASS_PREFIX = 'u-tag-'

function walk(dir, acc = []) {
  if (!fs.existsSync(dir))
    return acc
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory())
      walk(full, acc)
    else if (entry.name.endsWith('.vue'))
      acc.push(full)
  }
  return acc
}

/** 改写 CSS 选择器：HTML 标签 -> .u-tag-<tag>；.svg-icon -> .mp-icon */
function transformSelector(selector, usedTags) {
  return selectorParser((root) => {
    root.walkTags((node) => {
      const tag = node.value.toLowerCase()
      if (!HTML_TAGS.has(tag))
        return
      usedTags.add(tag)
      node.replaceWith(selectorParser.className({ value: `${CLASS_PREFIX}${tag}` }))
    })
    root.walkClasses((node) => {
      // resume-design 的 SvgIcon 根类名，替换后统一走 MpIcon
      if (node.value === 'svg-icon')
        node.value = 'mp-icon'
    })
    // `.svg-icon` 也可能以标签形式出现在 :deep 里
    root.walkTags((node) => {
      if (node.value === 'svg-icon')
        node.replaceWith(selectorParser.className({ value: 'mp-icon' }))
    })
  }).processSync(selector)
}

/** 改写 <style> 块 */
function purifyStyles(content, usedTags) {
  const root = postcssScss.parse(content)
  root.walkRules((rule) => {
    if (!rule.selector)
      return
    // @keyframes 内的 from/to/0% 不是选择器，跳过
    if (rule.parent && rule.parent.type === 'atrule' && /keyframes$/i.test(rule.parent.name))
      return
    const next = transformSelector(rule.selector, usedTags)
    if (next !== rule.selector)
      rule.selector = next
  })
  return root.toString()
}

/** 幂等：`class="a u-tag-div"` 里已经带上了 `u-tag-<tag>` 就不再重复插入 */
function hasTagClass(source, cls) {
  return new RegExp(`(?:^|[\\s"'])${cls}(?=[\\s"']|$)`).test(source)
}

/** 收集模板里所有需要 class 化的元素，返回插入点列表 */
function collectClassInsertions(templateContent) {
  const ast = parseTemplate(templateContent, { comments: true, prefixIdentifiers: false })
  const insertions = []

  const visit = (nodes) => {
    for (const node of nodes || []) {
      if (node.type === 1) {
        if (HTML_TAGS.has(node.tag)) {
          const cls = `${CLASS_PREFIX}${node.tag}`
          const staticClass = node.props.find(p => p.type === 6 && p.name === 'class')
          const dynamicClass = node.props.find(
            p => p.type === 7 && p.name === 'bind' && p.arg && p.arg.content === 'class',
          )
          if (staticClass) {
            const source = staticClass.loc.source
            // 幂等：已经带上 `u-tag-<tag>` 就不再插入
            if (!hasTagClass(source, cls)) {
              if (/^class\s*=\s*["']/.test(source)) {
                // class="a b" -> class="a b u-tag-x"
                insertions.push({ offset: staticClass.loc.end.offset - 1, text: ` ${cls}` })
              }
              else {
                // 仅有裸 class 属性
                insertions.push({ offset: staticClass.loc.end.offset, text: `="${cls}"` })
              }
            }
          }
          else if (dynamicClass) {
            insertions.push({ offset: dynamicClass.loc.start.offset, text: `class="${cls}" ` })
          }
          else {
            insertions.push({ offset: node.loc.start.offset + 1 + node.tag.length, text: ` class="${cls}"` })
          }
        }
        visit(node.children)
      }
      else if (node.type === 0 || node.type === 9 || node.type === 11) {
        // ROOT(0) / FOR(11) / IF(9)
        if (node.type === 9 && node.branches)
          visit(node.branches.flatMap(b => b.children))
        else
          visit(node.children)
      }
    }
  }
  visit(ast.children)

  insertions.sort((a, b) => b.offset - a.offset)
  return insertions
}

function applyInsertions(content, insertions) {
  let out = content
  for (const { offset, text } of insertions)
    out = out.slice(0, offset) + text + out.slice(offset)
  return out
}

/** 改写 <svg-icon .../> -> <mp-icon .../> */
function purifyIconTags(content) {
  return content.replace(/<svg-icon\b([^>]*?)\/?>/g, (whole, attrs) => {
    let next = attrs
    next = next.replace(/(\s):icon-name=/, '$1:name=')
    next = next.replace(/(\s)icon-name=/, '$1name=')
    next = next.replace(/\s:?(?:is-hover|parent-hover|hover-color)(?:="[^"]*")?/g, '')
    if (/\sclass=/.test(next))
      next = next.replace(/\sclass-name="[^"]*"/, '')
    else
      next = next.replace(/\sclass-name=/, ' class=')
    return `<mp-icon${next} />`
  })
}

function processFile(file) {
  const source = fs.readFileSync(file, 'utf8')
  const { descriptor } = parseSfc(source)
  if (!descriptor.template && !descriptor.styles.length)
    return null

  const usedTags = new Set()
  // [start, end, replacement] 三元组，最后统一从后往前替换，避免偏移漂移
  const edits = []

  for (const style of descriptor.styles) {
    let next
    try {
      next = purifyStyles(style.content, usedTags)
    }
    catch (error) {
      throw new Error(`<style> 解析失败：${error.message}`)
    }
    if (next !== style.content)
      edits.push({ start: style.loc.start.offset, end: style.loc.end.offset, text: next })
  }

  if (descriptor.template) {
    const tpl = descriptor.template
    let nextTpl = tpl.content
    const insertions = collectClassInsertions(nextTpl)
    if (insertions.length)
      nextTpl = applyInsertions(nextTpl, insertions)
    nextTpl = purifyIconTags(nextTpl)
    if (nextTpl !== tpl.content)
      edits.push({ start: tpl.loc.start.offset, end: tpl.loc.end.offset, text: nextTpl })
  }

  if (!edits.length)
    return null

  edits.sort((a, b) => b.start - a.start)
  let out = source
  for (const edit of edits)
    out = out.slice(0, edit.start) + edit.text + out.slice(edit.end)

  if (!DRY)
    fs.writeFileSync(file, out, 'utf8')

  return { tags: [...usedTags].sort(), icons: /<mp-icon\b/.test(out) }
}

function main() {
  const roots = (targets.length ? targets : ['src/material']).map(t => path.resolve(ROOT, t))
  const files = roots.flatMap(dir => walk(dir))
  let changed = 0
  let failed = 0
  const tagStat = new Map()

  for (const file of files) {
    let result
    try {
      result = processFile(file)
    }
    catch (error) {
      failed++
      console.error(`  跳过 ${path.relative(ROOT, file)} -> ${error.message}`)
      continue
    }
    if (!result)
      continue
    changed++
    for (const tag of result.tags)
      tagStat.set(tag, (tagStat.get(tag) || 0) + 1)
    console.log(`  改写 ${path.relative(ROOT, file)}`)
  }

  console.log(`\n[mp-purify] 扫描 ${files.length} 个 .vue，改写 ${changed} 个，失败 ${failed} 个${DRY ? '（dry-run，未落盘）' : ''}`)
  if (tagStat.size) {
    const summary = [...tagStat.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => `${tag}(${count})`)
      .join(' ')
    console.log(`[mp-purify] 标签 class 化统计：${summary}`)
  }
  if (failed)
    process.exitCode = 1
}

main()
