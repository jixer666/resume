<!-- 技能特长 -->
<template>
  <div class="skill-specialties u-tag-div">
    <!-- 标题 -->
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <!-- 技能特长 -->
    <skill-specialties4-vue
      :model-data="modelData"
      :model-style="modelStyle"
    />
  </div>
</template>

<script setup lang="ts">
import ModelTitle from '@/material/ModelTitle/ModelTitle9/ModelTitle.vue'
import type { ISKILLSPECIALTIES } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import SkillSpecialties4Vue from '@/material/Common/SkillSpecialties/SkillSpecialties4.vue'

defineProps<{
  modelData: ISKILLSPECIALTIES
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .skill-specialties {
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  box-sizing: border-box;
  margin-top: v-bind('modelStyle.mTop');
  margin-bottom: v-bind('modelStyle.mBottom');
  :deep(.skill-specialties-content) {
    flex: 1;
    margin-top: 25px;
    box-sizing: border-box;
    .u-tag-ul {
      padding-top: 0;
      .u-tag-li {
        width: 45%;
      }
    }
  }
}
</style>
