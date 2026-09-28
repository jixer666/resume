<!-- 技能特长 -->
<template>
  <div class="skill-specialties u-tag-div">
    <!-- 标题 -->
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <!-- 技能描述：整段富文本；列表符号由 RichTextView 统一处理，外层不再用 ul/li 包裹 -->
    <view class="skill-content">
      <RichTextView :html="modelData.content" :model-style="modelStyle" extra-style="letter-spacing:2px" />
    </view>
  </div>
</template>

<script setup lang="ts">
import ModelTitle from '../../ModelTitle/ModelTitle1/ModelTitle1.vue'
import type { ISKILLSPECIALTIES } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

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
  .skill-content {
    /* 小标题条 → 首个条目：与模块间距同源，条上下留白一致（见 RenderItem） */
    margin-top: var(--rs-gap-title, 18px);
    letter-spacing: 2px;
    font-size: v-bind('modelStyle.textFontSize');
    color: v-bind('modelStyle.textColor');
    font-weight: v-bind('modelStyle.textFontWeight');
    line-height: 1.5;
  }
}
</style>
