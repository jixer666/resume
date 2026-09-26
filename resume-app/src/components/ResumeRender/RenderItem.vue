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
}
</style>
