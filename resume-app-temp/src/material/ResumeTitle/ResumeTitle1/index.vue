<script setup lang="ts">
import type { IModelStyle, IResumeTitleData } from '@/schema/types'
import MaterialShell from '../../shared/MaterialShell.vue'

/** 简历标题 1：居中大标题，顶部主题色分隔 */
const props = defineProps<{ modelData: IResumeTitleData, modelStyle: IModelStyle }>()
</script>

<template>
  <MaterialShell :model-style="props.modelStyle">
    <view class="hero">
      <text class="hero__text">{{ props.modelData.title }}</text>
      <view class="hero__rule" />
    </view>
  </MaterialShell>
</template>

<style scoped lang="scss">
.hero {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.hero__text {
  color: var(--rs-title-color);
  font-size: var(--rs-hero-size);
  font-weight: var(--rs-title-weight);
  letter-spacing: 0.16em;
  /* 字距会在末字后留白，补一个等量左缩进让标题视觉居中 */
  text-indent: 0.16em;
  line-height: 1.25;
}

.hero__rule {
  width: calc(var(--rs-text-size) * 3.6);
  height: calc(var(--rs-text-size) * 0.16);
  min-height: 2px;
  margin-top: calc(var(--rs-text-size) * 0.75);
  border-radius: var(--rs-radius-pill);
  background-color: var(--rs-mark);
}
</style>
