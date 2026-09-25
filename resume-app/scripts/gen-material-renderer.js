// 物料派发组件生成脚本
//
// 事实源：src/schema/materialList.ts 里的 cptName 清单 + src/material/<Model>/<Model><N>/ 下的皮肤文件
// 生成物：src/components/ResumeRender/generated/CompatRenderer.vue（勿手改）
//
// 为什么需要生成：微信小程序不支持 <component :is> 动态组件，自定义组件标签必须静态书写，
// 所以要把全部 cptName 穷举成 v-if / v-else-if 分支。手写一百多个分支不可维护，
// 改为构建期从事实源生成；新增皮肤只要落盘 + 在 materialList 登记，重新生成即可。
//
// 重新生成：pnpm gen:material（已挂到 predev / prebuild 钩子）
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const materialDir = path.resolve(root, 'src/material')
const listFile = path.resolve(root, 'src/schema/materialList.ts')
const outFile = path.resolve(root, 'src/components/ResumeRender/generated/CompatRenderer.vue')

/**
 * 未适配小程序端的皮肤黑名单。
 *
 * P1 / P2-A 用的是白名单逐批放行；P2-B 完成全量净化（净化规则见
 * `.task/20260925-简历模板迁移微信小程序/` 的 §2.5 与 P2 落地记录）后改为黑名单制：
 * **默认全量放行**，只有确认在 mp 端不可用的皮肤才登记进来 —— 登记者不会被 import
 * （不占包体、不会编译报错），渲染时落占位分支，不会白屏整份简历。
 */
const DISABLED = new Set([])

/** 'BASE_INFO' → 'BaseInfo'、'CUSTOM' → 'Custom' */
function toPascal(model) {
  return model
    .split('_')
    .filter(Boolean)
    .map(seg => seg[0] + seg.slice(1).toLowerCase())
    .join('')
}

/**
 * 由 cptName 推导皮肤组件路径：<Model>/<Model><N>/ 目录下唯一的 .vue 文件。
 * 约定见 src/material 的目录结构，解析不到说明皮肤还没落盘。
 */
function resolveSkin(cptName) {
  const matched = /^(.*)_(\d+)$/.exec(cptName)
  if (!matched)
    return null
  const [, model, variant] = matched
  const pascal = toPascal(model)
  const dir = path.join(materialDir, pascal, `${pascal}${variant}`)
  if (!fs.existsSync(dir))
    return null
  const files = fs.readdirSync(dir).filter(file => file.endsWith('.vue'))
  if (files.length !== 1)
    return null
  return {
    localName: `${pascal}${variant}`,
    importPath: `@/material/${pascal}/${pascal}${variant}/${files[0]}`,
  }
}

/** 从 materialList.ts 里按出现顺序取出全部 cptName */
function readCptNames() {
  const source = fs.readFileSync(listFile, 'utf8')
  const names = []
  const re = /cptName:\s*'([A-Z][A-Z0-9_]*)'/g
  let matched = re.exec(source)
  while (matched) {
    if (!names.includes(matched[1]))
      names.push(matched[1])
    matched = re.exec(source)
  }
  return names
}

function build() {
  const cptNames = readCptNames()
  const imports = []
  const branches = []
  const missing = []

  cptNames.forEach((cptName) => {
    const skin = resolveSkin(cptName)
    if (!skin) {
      missing.push(cptName)
      return
    }
    if (DISABLED.has(cptName))
      return
    imports.push(`import ${skin.localName} from '${skin.importPath}'`)
    branches.push(`  <${skin.localName} v-else-if="item.cptName === '${cptName}'" :model-data="item.data" :model-style="item.style" />`)
  })

  // 首个分支用 v-if，其余用 v-else-if，保证任何 cptName 都落到占位分支
  if (branches.length)
    branches[0] = branches[0].replace(' v-else-if=', ' v-if=')

  const content = `<script lang="ts" setup>
/**
 * 本文件由 scripts/gen-material-renderer.js 自动生成，请勿手动修改。
 * 重新生成：pnpm gen:material
 */
import type { IMATERIALITEM } from '@/interface/material'
${imports.join('\n')}

defineOptions({ name: 'CompatRenderer' })

defineProps<{
  item: IMATERIALITEM
}>()
</script>

<template>
${branches.length ? branches.join('\n') : '  <view />'}
  <view v-else class="compat-fallback">
    <text class="compat-fallback__text">
      {{ item.cptTitle || item.cptName }} 暂未适配小程序
    </text>
  </view>
</template>

<style scoped lang="scss">
.compat-fallback {
  padding: 12px 40px;
  color: #b0b0b0;
  font-size: 12px;
}
</style>
`

  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, content)

  console.log(`[gen-material-renderer] 生成 ${path.relative(root, outFile)}`)
  console.log(`[gen-material-renderer] cptName ${cptNames.length} 个，已适配 ${branches.length} 个，待适配 ${cptNames.length - branches.length} 个`)
  if (missing.length)
    console.warn(`[gen-material-renderer] 跳过未落盘的 cptName：${missing.join(', ')}`)
}

build()
