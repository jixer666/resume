<!-- 模块小标题：圆点图标 + 主题色标题 + 右侧浅色分隔线（圆点模板样式） -->
<template>
  <view class="model-title">
    <view class="model-title__badge">
      <!-- 模块没配图标时留一个纯色圆点，不画占位块 -->
      <MpIcon v-if="icon" :name="icon" color="#ffffff" size="0.6em" />
    </view>
    <text class="model-title__text">
      {{ title }}
    </text>
    <view class="model-title__line" />
  </view>
</template>

<script setup lang="ts">
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed } from 'vue'
import { lightenColor } from '@/schema/templates'

const props = defineProps<{
  title: string
  modelStyle: IMODELSTYLE // 模块样式
  icon?: string // 模块图标（模块数据里的 iconfont 名），反白画在圆点里
}>()

/** 分隔线：主题色兑白，浅到只留一丝色感，与经典标题条的底色同源 */
const lineColor = computed(() => lightenColor(String(props.modelStyle?.themeColor || '#2b74ff'), 0.93))
</script>

<style lang="scss" scoped>
/*
 * 小标题行高度与经典标题条同源（--rs-title-h 由 ResumeRender 按「整理成一页」的压缩比例下发）：
 * 圆点模板只换标题形态，整页节奏不变，换模板时模块间距才对得上。
 */
.model-title {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-height: var(--rs-title-h, 30px);

  &__badge {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    /* 圆点直径 = 标题行高 * 0.6（默认 18px），整理成一页压标题行时圆点跟着一起缩 */
    width: 1em;
    height: 1em;
    font-size: calc(var(--rs-title-h, 30px) * 0.6);
    border-radius: 50%;
    background-color: v-bind('modelStyle.themeColor');
  }

  &__text {
    margin-left: 10px;
    font-size: v-bind('modelStyle.firstTitleFontSize');
    font-weight: 600;
    color: v-bind('modelStyle.themeColor');
  }

  &__line {
    flex: 1;
    height: 1px;
    margin-left: 10px;
    background-color: v-bind('lineColor');
  }
}
</style>
