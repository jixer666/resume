<!-- 技能特长 -->
<template>
  <div class="skill-specialties u-tag-div">
    <!-- 标题 -->
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <!-- 技能描述：整段富文本 -->
    <ul class="u-tag-ul">
      <li class="u-tag-li">
        <RichTextView :html="modelData.content" :model-style="modelStyle" extra-style="letter-spacing:2px" />
      </li>
    </ul>
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
  .u-tag-ul {
    display: flex;
    flex-wrap: wrap;
    .left,
    .right {
      flex: 40%;
      margin-top: 25px;
    }
    .u-tag-li {
      flex: 100%;
      margin-top: 25px;
      list-style: none;
      letter-spacing: 2px;
      font-size: v-bind('modelStyle.textFontSize');
      color: v-bind('modelStyle.textColor');
      font-weight: v-bind('modelStyle.textFontWeight');
      line-height: 1.5;
    }
    .left {
      padding: 0 20px;
    }
    .right {
      padding: 0 0 0 10px;
    }
  }
}
</style>
