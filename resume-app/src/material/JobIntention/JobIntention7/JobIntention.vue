<template>
  <div class="job-intention-7 u-tag-div">
    <!-- 标题 -->
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <!-- 内容区域 -->
    <job-intention1 :model-data="modelData" :model-style="modelStyle" />
  </div>
</template>

<script setup lang="ts">
import ModelTitle from '@/material/ModelTitle/ModelTitle7/ModelTitle.vue'
import type { IJOBINTENTION } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import JobIntention1 from '../../Common/JobIntention/JobIntention1.vue'

defineProps<{
  modelData: IJOBINTENTION
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .job-intention-7 {
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-top: v-bind('modelStyle.mTop');
  margin-bottom: v-bind('modelStyle.mBottom');
  box-sizing: border-box;
  display: flex;
  align-items: center;
  :deep(.job-intention-content) {
    flex: 1;
    .u-tag-ul {
      padding: 0;
    }
  }
}
</style>
