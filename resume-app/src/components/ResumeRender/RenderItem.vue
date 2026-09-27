<script lang="ts" setup>
import type { IMATERIALITEM } from '@/interface/material'
import CompatRenderer from './generated/CompatRenderer.vue'

/**
 * 单个模块的渲染壳：负责「显不显示」和「多宽」，模块自身的内外边距仍由皮肤里的 modelStyle 决定，
 * 这里不重复计算，避免间距叠加。
 *
 * 列表项间距（entryMarginBottom）例外：它作用在皮肤内部的 v-for 条目上，这里只把值下发成
 * CSS 变量 `--entry-mb`，由各皮肤用 `var(--entry-mb, 原值)` 消费 —— 没设过就不下发变量，
 * 皮肤的兜底值原样生效，默认外观零变化。
 *
 * 这一层还是模块级绝对定位装饰（如左侧竖线）的包含块：皮肤用 `&::before` 画竖线时只写
 * `position: absolute`，不给根节点 `position: relative`，一旦外层没有定位祖先，竖线会以整页为参照
 * 拉满全篇。放在这里一次兜住，省得每套皮肤各写一遍。
 *
 * 编辑态的锚点、点选、高亮也挂在这一层（P3 接入）。
 */
const props = defineProps<{
  item: IMATERIALITEM
}>()

const itemStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = { width: props.item.cptWidth || '100%' }
  const entryGap = (props.item.style as { entryMarginBottom?: string } | undefined)?.entryMarginBottom
  if (entryGap)
    style['--entry-mb'] = entryGap
  return style
})
</script>

<template>
  <view v-if="item.show" class="rs-item" :style="itemStyle">
    <CompatRenderer :item="item" />
  </view>
</template>

<style scoped lang="scss">
.rs-item {
  box-sizing: border-box;
  position: relative;
}
</style>
