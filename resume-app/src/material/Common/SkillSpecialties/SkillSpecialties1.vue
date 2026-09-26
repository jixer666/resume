<!-- 技能特长 -->
<template>
  <div class="skill-specialties-content u-tag-div">
    <!-- 技能描述：整段富文本 -->
    <RichTextView :html="modelData.content" :model-style="modelStyle" extra-style="letter-spacing:2px" />
  </div>
</template>

<script setup lang="ts">
import type { ISKILLSPECIALTIES } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: ISKILLSPECIALTIES
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .skill-specialties-content {
  box-sizing: border-box;
  padding-top: 15px;
  padding-left: 18px;
}
</style>
