<!-- 兴趣爱好 -->
<template>
  <div class="hobbies-content u-tag-div">
    <!-- 兴趣爱好 -->
    <div class="hobbies-content u-tag-div">
      <p class="u-tag-p">
        <RichTextView :html="modelData.content" :model-style="modelStyle" extra-style="letter-spacing:2px" />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IHOBBIES } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IHOBBIES
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .hobbies-content {
  box-sizing: border-box;
  .hobbies-content {
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
