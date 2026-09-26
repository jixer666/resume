<script lang="ts" setup>
import type { IMpIconSymbol } from './mp-icons'
import { MP_ICONS } from './mp-icons'

/**
 * 跨端图标组件（替代 resume-design 的 `SvgIcon.vue`）
 *
 * 小程序不支持内联 `<svg>`，故把 iconfont symbol 拼成 `data:image/svg+xml;base64,`
 * 背景图渲染（同 UnoCSS preset-icons 在小程序端的做法），颜色由 `color` 决定，
 * 尺寸默认 `1em`（跟随父级 font-size，与原本的 `<svg>` 行为一致）。
 */
defineOptions({ name: 'MpIcon' })

const props = withDefaults(defineProps<{
  /** 图标名称：iconfont 的 `icon-xxx`，或内置 UI 图标的 `ui-xxx` */
  name: string
  /** 图标颜色 */
  color?: string
  /** 图标尺寸，默认 1em（跟随 font-size） */
  size?: string
}>(), {
  color: '#757575',
  size: '1em',
})

/**
 * 编辑器 UI 图标（`ui-` 前缀，取自 @iconify-json/carbon）。
 *
 * 为什么不直接用 UnoCSS 的 `i-carbon-*`：本项目 mp 端构建不会为 carbon 集合生成样式
 * （实测产物 wxss 里查不到 i-carbon-* 规则），safelist 里的 5 个图标一直有
 * `failed to load icon` 告警。UI 图标数量很少且固定，内联路径数据最稳、也不增包体。
 */
const UI_ICONS: Record<string, IMpIconSymbol> = {
  'ui-view': { v: '0 0 32 32', b: '<path d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 25c-5.3 0-10.9-3.93-12.93-9C5.1 10.93 10.7 7 16 7s10.9 3.93 12.93 9C26.9 21.07 21.3 25 16 25"/><path d="M16 10a6 6 0 1 0 6 6a6 6 0 0 0-6-6m0 10a4 4 0 1 1 4-4a4 4 0 0 1-4 4"/>' },
  'ui-view-off': { v: '0 0 32 32', b: '<path d="m5.24 22.51l1.43-1.42A14.06 14.06 0 0 1 3.07 16C5.1 10.93 10.7 7 16 7a12.4 12.4 0 0 1 4 .72l1.55-1.56A14.7 14.7 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68a16 16 0 0 0 4.18 6.17"/><path d="M12 15.73a4 4 0 0 1 3.7-3.7l1.81-1.82a6 6 0 0 0-7.33 7.33zm18.94-.07a16.4 16.4 0 0 0-5.74-7.44L30 3.41L28.59 2L2 28.59L3.41 30l5.1-5.1A15.3 15.3 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M20 16a4 4 0 0 1-6 3.44L19.44 14a4 4 0 0 1 .56 2m-4 9a13.05 13.05 0 0 1-6-1.58l2.54-2.54a6 6 0 0 0 8.35-8.35l2.87-2.87A14.54 14.54 0 0 1 28.93 16C26.9 21.07 21.3 25 16 25"/>' },
  'ui-list': { v: '0 0 32 32', b: '<path d="M16 8h14v2H16zm0 14h14v2H16zm-6-8H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M4 6v6h6.001L10 6zm6 22H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2m-6-8v6h6.001L10 20z"/>' },
  'ui-edit': { v: '0 0 32 32', b: '<path d="M2 26h28v2H2zM25.4 9c.8-.8.8-2 0-2.8l-3.6-3.6c-.8-.8-2-.8-2.8 0l-15 15V24h6.4zm-5-5L24 7.6l-3 3L17.4 7zM6 22v-3.6l10-10l3.6 3.6l-10 10z"/>' },
  'ui-pen': { v: '0 0 32 32', b: '<path d="M27.307 6.107L30 3.414L28.586 2l-2.693 2.693L24.8 3.6a1.933 1.933 0 0 0-2.8 0l-18 18V28h6.4l18-18a1.933 1.933 0 0 0 0-2.8ZM9.6 26H6v-3.6L23.4 5L27 8.6ZM9 11.586L16.586 4L18 5.414L10.414 13z"/>' },
  'ui-trash': { v: '0 0 32 32', b: '<path d="M12 12h2v12h-2zm6 0h2v12h-2z"/><path d="M4 6v2h2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8h2V6zm4 22V8h16v20zm4-26h8v2h-8z"/>' },
  'ui-up': { v: '0 0 32 32', b: '<path d="M16 4L6 14l1.41 1.41L15 7.83V28h2V7.83l7.59 7.58L26 14z"/>' },
  'ui-down': { v: '0 0 32 32', b: '<path d="M24.59 16.59L17 24.17V4h-2v20.17l-7.59-7.58L6 18l10 10l10-10z"/>' },
  'ui-add': { v: '0 0 32 32', b: '<path d="M17 15V8h-2v7H8v2h7v7h2v-7h7v-2z"/>' },
  // carbon 原路径的 `fill="currentColor"` 已去掉：颜色由外层 `<g fill>` 统一给，留 currentColor 会渲染成黑
  'ui-palette': { v: '0 0 32 32', b: '<circle cx="10" cy="12" r="2"/><circle cx="16" cy="9" r="2"/><circle cx="22" cy="12" r="2"/><circle cx="23" cy="18" r="2"/><circle cx="19" cy="23" r="2"/><path d="M16.54 2A14 14 0 0 0 2 16a4.82 4.82 0 0 0 6.09 4.65l1.12-.31a3 3 0 0 1 3.79 2.9V27a3 3 0 0 0 3 3a14 14 0 0 0 14-14.54A14.05 14.05 0 0 0 16.54 2m8.11 22.31A11.93 11.93 0 0 1 16 28a1 1 0 0 1-1-1v-3.76a5 5 0 0 0-5-5a5 5 0 0 0-1.33.18l-1.12.31A2.82 2.82 0 0 1 4 16A12 12 0 0 1 16.47 4A12.18 12.18 0 0 1 28 15.53a11.9 11.9 0 0 1-3.35 8.79Z"/>' },
  'ui-image': { v: '0 0 32 32', b: '<path d="M19 14a3 3 0 1 0-3-3a3 3 0 0 0 3 3m0-4a1 1 0 1 1-1 1a1 1 0 0 1 1-1"/><path d="M26 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 22H6v-6l5-5l5.59 5.59a2 2 0 0 0 2.82 0L21 19l5 5Zm0-4.83l-3.59-3.59a2 2 0 0 0-2.82 0L18 19.17l-5.59-5.59a2 2 0 0 0-2.82 0L6 17.17V6h20Z"/>' },
  'ui-download': { v: '0 0 32 32', b: '<path d="M26 24v4H6v-4H4v4a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-4zm0-10l-1.41-1.41L17 20.17V2h-2v18.17l-7.59-7.58L6 14l10 10z"/>' },
  'ui-renew': { v: '0 0 32 32', b: '<path d="M12 10H6.78A11 11 0 0 1 27 16h2A13 13 0 0 0 6 7.68V4H4v8h8zm8 12h5.22A11 11 0 0 1 5 16H3a13 13 0 0 0 23 8.32V28h2v-8h-8z"/>' },
}

const B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

/** 纯 ASCII 的 base64 编码（小程序无 btoa，且 icon 路径数据全部为 ASCII） */
function encodeAsciiBase64(input: string): string {
  let result = ''
  for (let i = 0; i < input.length; i += 3) {
    const c1 = input.charCodeAt(i)
    const c2 = input.charCodeAt(i + 1)
    const c3 = input.charCodeAt(i + 2)
    result += B64_CHARS[c1 >> 2]
    result += B64_CHARS[((c1 & 3) << 4) | (Number.isNaN(c2) ? 0 : c2 >> 4)]
    result += Number.isNaN(c2) ? '=' : B64_CHARS[((c2 & 15) << 2) | (Number.isNaN(c3) ? 0 : c3 >> 6)]
    result += Number.isNaN(c3) ? '=' : B64_CHARS[c3 & 63]
  }
  return result
}

const backgroundImage = computed(() => {
  const symbol = MP_ICONS[props.name] || UI_ICONS[props.name]
  if (!symbol)
    return ''
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${symbol.v}"><g fill="${props.color}">${symbol.b}</g></svg>`
  return `url("data:image/svg+xml;base64,${encodeAsciiBase64(svg)}")`
})

const iconStyle = computed(() => ({
  width: props.size,
  height: props.size,
  backgroundImage: backgroundImage.value,
}))
</script>

<template>
  <!--
    必须保持单根节点：uni-app 在 mp 端靠 `virtualHostClass` 把父组件的 class 透传到子组件根节点，
    多根节点时该透传失效，父级 `.icon { font-size: 17px }` 之类的样式会丢。
  -->
  <view class="mp-icon-root">
    <!-- 未收录的图标落占位，避免运行时静默丢图标 -->
    <view v-if="backgroundImage" class="mp-icon" :style="iconStyle" />
    <view v-else class="mp-icon mp-icon--missing" :style="iconStyle" />
  </view>
</template>

<style lang="scss" scoped>
.mp-icon-root {
  display: inline-block;
  vertical-align: -2px;
}

.mp-icon {
  display: block;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  &--missing {
    background-color: currentColor;
    opacity: 0.15;
    border-radius: 2px;
  }
}
</style>
