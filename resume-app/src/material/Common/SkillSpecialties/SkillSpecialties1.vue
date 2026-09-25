<!-- 技能特长 -->
<template>
  <div class="skill-specialties-content u-tag-div">
    <!-- 技能特长 -->
    <ul class="u-tag-ul">
      <li v-for="(item, index) in modelData.LIST" :key="index" class="u-tag-li">
        <RichTextView :html="item.introduce" :model-style="modelStyle" extra-style="letter-spacing:2px" />
      </li>
    </ul>
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
  .u-tag-ul {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-top: 15px;
    padding-left: 18px;
    .u-tag-li {
      letter-spacing: 2px;
      font-size: v-bind('modelStyle.textFontSize');
      color: v-bind('modelStyle.textColor');
      font-weight: v-bind('modelStyle.textFontWeight');
      line-height: 1.5;
      text-align: justify;
      margin-bottom: 10px;
    }
  }
}
</style>
