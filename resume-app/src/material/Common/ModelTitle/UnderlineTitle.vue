<!-- 模块小标题：主题色标题 + 整宽下划线（双栏模板样式，由 ModelTitle1 分发） -->
<template>
  <view class="model-title">
    <text class="model-title__text">
      {{ title }}
    </text>
    <view class="model-title__line" />
  </view>
</template>

<script setup lang="ts">
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  title: string
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
/*
 * 小标题行高度与经典标题条同源（--rs-title-h 由 ResumeRender 按「整理成一页」的压缩比例下发）：
 * 下划线模板只换标题形态，整页节奏不变，换模板时模块间距才对得上。
 *
 * 文字与下划线贴着行底排（justify-content: flex-end），压缩标题行时先收上方留白，
 * 下划线始终紧贴正文，与版式图一致。
 */
.model-title {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
  width: 100%;
  min-height: var(--rs-title-h, 30px);

  &__text {
    font-size: v-bind('modelStyle.firstTitleFontSize');
    font-weight: 700;
    line-height: 1.2;
    color: v-bind('modelStyle.themeColor');
  }

  &__line {
    height: 1px;
    margin-top: 6px;
    background-color: v-bind('modelStyle.themeColor');
  }
}
</style>
