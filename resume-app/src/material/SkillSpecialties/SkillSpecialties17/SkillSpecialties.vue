<!-- 技能特长 -->
<template>
  <div class="skill-specialties u-tag-div">
    <!-- 标题 -->
    <model-title
      :title="modelData.title"
      :iconfont="modelData.iconfont"
      :model-style="modelStyle"
    />
    <!-- 技能特长 -->
    <skill-specialties5-vue
      :model-data="modelData"
      :model-style="modelStyle"
    />
  </div>
</template>

<script setup lang="ts">
import ModelTitle from '@/material/ModelTitle/ModelTitle10/ModelTitle.vue'
import type { ISKILLSPECIALTIES } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import SkillSpecialties5Vue from '@/material/Common/SkillSpecialties/SkillSpecialties5.vue'

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
    margin-top: 25px;
    .u-tag-ul {
      padding-top: 0;
      .u-tag-li {
        text-align: justify;
      }
    }
  }
}
</style>
