<!-- 模块小标题：浅色标题条 + 左侧主题色竖条（经典模板样式） -->
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
import { lightenColor } from '@/schema/templates'

const props = defineProps<{
  title: string
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 标题条底色：主题色兑白，换主题色时整条底色一起跟随 */
const barBackground = computed(() => lightenColor(String(props.modelStyle?.themeColor || '#2b74ff'), 0.92))
</script>

<style lang="scss" scoped>
.model-title {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-height: 30px;
  background-color: v-bind('barBackground');

  &__bar {
    width: 4px;
    height: 30px;
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
