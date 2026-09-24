<script setup lang="ts">
import type { IModelStyle, IResumeTitleData } from '@/schema/types'
import MaterialShell from '../../shared/MaterialShell.vue'

/** 简历标题 2：左对齐大标题 + 左侧色条 */
const props = defineProps<{ modelData: IResumeTitleData, modelStyle: IModelStyle }>()
</script>

<template>
  <MaterialShell :model-style="props.modelStyle">
    <view class="hero">
      <text class="hero__text">{{ props.modelData.title }}</text>
    </view>
  </MaterialShell>
</template>

<style scoped lang="scss">
.hero {
  display: flex;
  align-items: center;
  padding-left: calc(var(--rs-text-size) * 0.85);
  border-left: calc(var(--rs-text-size) * 0.36) solid var(--rs-mark);
}

.hero__text {
  color: var(--rs-title-color);
  font-size: var(--rs-hero-size);
  font-weight: var(--rs-title-weight);
  letter-spacing: 0.06em;
  line-height: 1.25;
}
</style>
