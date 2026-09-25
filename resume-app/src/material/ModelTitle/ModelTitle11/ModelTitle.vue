<!-- 模块公共标题：主题色标题字 + 贯穿全宽的 1px 细下划线 -->
<template>
  <div class="template3-model-title u-tag-div">
    <h1 class="u-tag-h1">
      {{ title }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  title: string
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .template3-model-title {
  width: 100%;
  box-sizing: border-box;
  /* 标题字与下划线留 6px，下划线到正文再由 margin-bottom 留出 12px */
  padding-bottom: 6px;
  margin-bottom: 12px;
  border-bottom: 1px solid v-bind('modelStyle.themeColor');
  .u-tag-h1 {
    line-height: 1.2;
    font-size: v-bind('modelStyle.firstTitleFontSize');
    font-weight: v-bind('modelStyle.titleFontWeight');
    color: v-bind('modelStyle.themeColor');
  }
}
</style>
