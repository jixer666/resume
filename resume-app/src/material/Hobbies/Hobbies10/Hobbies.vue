<!-- 兴趣爱好 -->
<template>
  <div class="hobbies u-tag-div">
    <!-- 标题 -->
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <!-- 兴趣爱好 -->
    <hobbies1-vue :model-data="modelData" :model-style="modelStyle" />
  </div>
</template>

<script setup lang="ts">
import type { IHOBBIES } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import ModelTitle from '@/material/ModelTitle/ModelTitle9/ModelTitle.vue'
import Hobbies1Vue from '@/material/Common/Hobbies/Hobbies1.vue'

defineProps<{
  modelData: IHOBBIES
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .hobbies {
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  box-sizing: border-box;
  margin-bottom: v-bind('modelStyle.mBottom');
  margin-top: v-bind('modelStyle.mTop');
  :deep(.hobbies-content) {
    padding: 0;
    margin-top: 20px;
  }
}
</style>
