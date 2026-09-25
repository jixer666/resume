<!-- 模块公共标题：整行浅主题色底纹条 + 左侧主题色竖条，底纹向右渐隐 -->
<template>
  <div class="template2-model-title u-tag-div">
    <div class="right-title u-tag-div">
      <h1 class="u-tag-h1">
        {{ title }}
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed } from 'vue'
import { lightenColor } from '@/schema/templates'

const props = defineProps<{
  title: string
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 底纹条：主题色近乎兑白，左侧略深、向右收干，做出标题条渐隐的层次 */
const titleBarFrom = computed(() => lightenColor(props.modelStyle.themeColor, 0.82))
const titleBarTo = computed(() => lightenColor(props.modelStyle.themeColor, 0.98))
</script>

<style lang="scss" scoped>
  .template2-model-title {
  width: 100%;
  display: flex;
  align-items: center;
  .right-title {
    width: 100%;
    height: 42px;
    padding-left: 14px;
    border-left: 6px solid v-bind('modelStyle.themeColor');
    margin-bottom: 20px;
    background: linear-gradient(90deg, v-bind('titleBarFrom') 0%, v-bind('titleBarTo') 100%);
    display: flex;
    align-items: center;
    .u-tag-h1 {
      font-size: v-bind('modelStyle.firstTitleFontSize');
      font-weight: v-bind('modelStyle.titleFontWeight');
      color: v-bind('modelStyle.titleColor');
    }
  }
}
</style>
