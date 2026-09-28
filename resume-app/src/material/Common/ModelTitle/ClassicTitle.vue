<!-- 模块小标题：浅色标题条 + 左侧主题色竖条（经典模板样式，由 ModelTitle1 分发） -->
<template>
  <view class="model-title">
    <view class="model-title__bar" />
    <text class="model-title__text">
      {{ title }}
    </text>
  </view>
</template>

<script setup lang="ts">
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed } from 'vue'
import { lightenColor } from '@/schema/templates'

const props = defineProps<{
  title: string
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 标题条底色：主题色兑白，换主题色时整条底色一起跟随 */
const barBackground = computed(() => lightenColor(String(props.modelStyle?.themeColor || '#2b74ff'), 0.92))
</script>

<style lang="scss" scoped>
/*
 * 小标题条高度：`--rs-title-h` 由 ResumeRender 按「整理成一页」的压缩比例下发
 * （默认 30px = 字号 16px + 上下各 15px），条高跟着字号一起收，
 * 否则字号压小了、条还是 30px，标题就显得又空又大。
 */
.model-title {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-height: var(--rs-title-h, 30px);
  background-color: v-bind('barBackground');

  &__bar {
    width: 4px;
    height: var(--rs-title-h, 30px);
    background-color: v-bind('modelStyle.themeColor');
  }

  &__text {
    padding-left: 16px;
    font-size: v-bind('modelStyle.firstTitleFontSize');
    font-weight: 600;
    color: v-bind('modelStyle.themeColor');
  }
}
</style>
