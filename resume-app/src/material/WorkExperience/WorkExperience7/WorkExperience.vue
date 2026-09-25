<!-- 工作经验 -->
<template>
  <div class="work-experience u-tag-div">
    <!-- 标题 -->
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <!-- 校园经历 -->
    <work-experience1-vue :model-data="modelData" :model-style="modelStyle" />
  </div>
</template>

<script setup lang="ts">
import type { IWORKEXPERIENCE } from '@/interface/model'
import ModelTitle from '@/material/ModelTitle/ModelTitle7/ModelTitle.vue'
import WorkExperience1Vue from '@/material/Common/WorkExperience/WorkExperience2.vue'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IWORKEXPERIENCE
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .work-experience {
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  box-sizing: border-box;
  margin-bottom: v-bind('modelStyle.mBottom');
  margin-top: v-bind('modelStyle.mTop');
  display: flex;
  align-items: flex-start;
  :deep(.work-experience-content) {
    flex: 1;
    .work-experience-list {
      padding: 0;
    }
  }
}
</style>
