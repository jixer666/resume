<!-- 校园经历 -->
<template>
  <div class="campus-experience u-tag-div">
    <!-- 标题 -->
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <!-- 校园经历 -->
    <campus-experience1-vue
      :model-data="modelData"
      :model-style="modelStyle"
    />
  </div>
</template>

<script setup lang="ts">
import type { ICAMPUSEXPERIENCE } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import ModelTitle from '@/material/ModelTitle/ModelTitle11/ModelTitle.vue'
import CampusExperience1Vue from '@/material/Common/CampusExperience/CampusExperience1.vue'

defineProps<{
  modelData: ICAMPUSEXPERIENCE
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .campus-experience {
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  box-sizing: border-box;
  margin-bottom: v-bind('modelStyle.mBottom');
  margin-top: v-bind('modelStyle.mTop');
  :deep(.campus-experience-content) {
    flex: 1;
    .campue-experience-list {
      padding: 0;
    }
  }
}
</style>
