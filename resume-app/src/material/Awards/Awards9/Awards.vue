<!-- 荣誉奖项 -->
<template>
  <div class="awards u-tag-div">
    <!-- 标题 -->
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <!-- 荣誉奖项 -->
    <awards1-vue :model-data="modelData" :model-style="modelStyle" />
  </div>
</template>

<script setup lang="ts">
import type { IAWARDS } from '@/interface/model'
import ModelTitle from '@/material/ModelTitle/ModelTitle8/ModelTitle.vue'
import type IMODELSTYLE from '@/interface/modelStyle'
import Awards1Vue from '@/material/Common/Awards/Awards1.vue'

defineProps<{
  modelData: IAWARDS
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .awards {
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  box-sizing: border-box;
  margin-bottom: v-bind('modelStyle.mBottom');
  margin-top: v-bind('modelStyle.mTop');
  :deep(.awards-list) {
    padding: 0;
  }
}
</style>
