<!-- 自我评价 -->
<template>
  <div class="self-eavluation-content u-tag-div">
    <!-- 兴趣爱好 -->
    <div class="self-eavluation-content u-tag-div">
      <p class="u-tag-p">
        <RichTextView :html="modelData.content" :model-style="modelStyle" extra-style="letter-spacing:2px" />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISELFEVALUATION } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: ISELFEVALUATION
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .self-eavluation-content {
  box-sizing: border-box;
  .self-eavluation-content {
    display: flex;
    padding-top: 15px;
    box-sizing: border-box;
    .u-tag-p {
      letter-spacing: 2px;
      font-size: v-bind('modelStyle.textFontSize');
      color: v-bind('modelStyle.textColor');
      font-weight: v-bind('modelStyle.textFontWeight');
      line-height: 1.5;
      text-align: justify;
    }
  }
}
</style>
