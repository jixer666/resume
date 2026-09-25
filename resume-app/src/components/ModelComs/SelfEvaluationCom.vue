<!-- 自我评价 -->
<template>
  <div class="self-eavluation u-tag-div">
    <!-- 标题 -->
    <slot name="model-title" />
    <!-- 兴趣爱好 -->
    <div class="self-eavluation-content u-tag-div">
      <p class="u-tag-p">
        <RichTextView :html="modelData.content" :model-style="modelStyle" extra-style="letter-spacing:2px" />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import useGetLineLeft from '@/hooks/material/useTemplate3LeftLine'
import type { ISELFEVALUATION } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

const props = defineProps<{
  modelData: ISELFEVALUATION
  modelStyle: IMODELSTYLE // 模块样式
}>()
// 模板3左侧竖线
const { left } = useGetLineLeft(props.modelStyle)
</script>

<style lang="scss" scoped>
  .self-eavluation {
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-bottom: v-bind('modelStyle.mBottom');
  margin-top: v-bind('modelStyle.mTop');
  box-sizing: border-box;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 1px;
    height: 100%;
    background-color: v-bind('modelStyle.themeColor');
    left: v-bind('left');
    top: 5px;
  }
  .self-eavluation-content {
    display: flex;
    margin-top: 25px;
    .u-tag-p {
      letter-spacing: 2px;
      font-size: v-bind('modelStyle.textFontSize');
      color: v-bind('modelStyle.textColor');
      font-weight: v-bind('modelStyle.textFontWeight');
      line-height: 1.5;
    }
  }
}
</style>
