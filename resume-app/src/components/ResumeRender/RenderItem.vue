<script lang="ts" setup>
import type { IMATERIALITEM } from '@/interface/material'
import CompatRenderer from './generated/CompatRenderer.vue'

/**
 * 单个模块的渲染壳：负责「显不显示」和「多宽」，模块自身的内外边距仍由皮肤里的 modelStyle 决定，
 * 这里不重复计算，避免间距叠加。
 *
 * 编辑态的锚点、点选、高亮也挂在这一层（P3 接入）。
 */
defineProps<{
  item: IMATERIALITEM
}>()
</script>

<template>
  <view v-if="item.show" class="rs-item" :style="{ width: item.cptWidth || '100%' }">
    <CompatRenderer :item="item" />
  </view>
</template>

<style scoped lang="scss">
.rs-item {
  box-sizing: border-box;
}
</style>
