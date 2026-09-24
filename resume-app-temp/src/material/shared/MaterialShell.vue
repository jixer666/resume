<script setup lang="ts">
import type { IModelStyle } from '@/schema/types'
import { toCssVars } from './style'

/**
 * 物料外壳：把模块级样式 token 挂成 CSS 变量，并提供统一的模块间距/底色。
 * 所有物料组件都套这一层，样式表里只写 var(--rs-*)。
 *
 * 页面左右与上下留白由外层容器（ResumeRenderer）统一消费，
 * 这里只负责模块之间的间距，避免首个模块把留白吃掉、也避免逐模块重复留白。
 */
const props = defineProps<{ modelStyle: IModelStyle }>()
const vars = computed(() => toCssVars(props.modelStyle))
</script>

<template>
  <view class="rs-module" :style="vars">
    <slot />
  </view>
</template>

<style scoped lang="scss">
.rs-module {
  box-sizing: border-box;
  margin-top: var(--rs-mt);
  margin-bottom: var(--rs-mb);
  padding: var(--rs-module-pad);
  border: var(--rs-module-border);
  border-radius: var(--rs-module-radius);
  background-color: var(--rs-bg);
  color: var(--rs-text-color);
  font-size: var(--rs-text-size);
  font-weight: var(--rs-text-weight);
  line-height: var(--rs-lh);
}
</style>
