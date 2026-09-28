<script lang="ts" setup>
import type { IMATERIALITEM } from '@/interface/material'
import { pxTonumber } from '@/utils/common'
import CompatRenderer from './generated/CompatRenderer.vue'

/**
 * 单个模块的渲染壳：负责「显不显示」和「多宽」，模块自身的内外边距仍由皮肤里的 modelStyle 决定，
 * 这里不重复计算，避免间距叠加。
 *
 * 但有两类值必须在这里下发成 CSS 变量，否则各皮肤只能各写各的、同一个模板里都统一不了：
 * 1. 列表项间距（entryMarginBottom）：作用在皮肤内部的 v-for 条目上，下发成 `--entry-mb`，
 *    由各皮肤用 `var(--entry-mb, var(--rs-gap-entry))` 消费 —— 没设过就用整页统一的 10px，
 *    设过就按用户的值，且和 pTop 一样参与「整理成一页」的压缩；
 * 2. 小标题条留白（--rs-gap-title）：直接取模块自己的上内边距 pTop，由所有皮肤的小标题条消费。
 *    经典模板里「模块间距」就等于 pTop（下内边距 / 上下外边距均为 0），所以小标题条上方（模块间距）
 *    与下方（条到首个条目）留白始终一致；改 pTop 或「整理成一页」压缩 pTop 时，条下留白都跟着一起变。
 *
 * 两个变量都只在有值时下发，没设过就保持皮肤自身的兜底值，默认外观零变化。
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
  const source = props.item.style as { entryMarginBottom?: string, pTop?: string } | undefined
  const entryGap = source?.entryMarginBottom
  if (entryGap)
    style['--entry-mb'] = entryGap
  // 小标题条下留白 = 模块上内边距：条上方（模块间距）与条下方留白始终相等。
  // pTop 显式为 0（用户调到 0 或「整理成一页」压到底）时也要下发，
  // 否则皮肤会退回兜底留白，条下白白留一截、怎么压都收不紧
  const rawTitleGap = source?.pTop
  if (rawTitleGap) {
    const titleGap = pxTonumber(rawTitleGap)
    if (Number.isFinite(titleGap))
      style['--rs-gap-title'] = `${Math.max(0, Math.round(titleGap))}px`
  }
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
