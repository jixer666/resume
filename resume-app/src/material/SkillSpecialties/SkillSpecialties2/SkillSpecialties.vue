<!-- 技能特长 -->
<template>
  <div class="skill-specialties u-tag-div">
    <!-- 标题 -->
    <div class="skill-title u-tag-div">
      <mp-icon name="icon-techang" color="#fff" size="26px" />
      <h1 class="u-tag-h1">
        {{ modelData.title }}
      </h1>
    </div>
    <!-- 技能描述：整段富文本 -->
    <ul class="u-tag-ul">
      <li class="u-tag-li">
        <RichTextView :html="modelData.content" :model-style="modelStyle" />
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
  .skill-specialties {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  box-sizing: border-box;
  margin-top: v-bind('modelStyle.mTop');
  margin-bottom: v-bind('modelStyle.mBottom');
  .skill-title {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 18px;
    .u-tag-h1 {
      font-size: 20px;
      color: #fff;
      margin: 0 0 0 10px;
    }
  }

  .u-tag-ul {
    display: flex;
    width: 100%;
    flex-direction: column;
    .u-tag-li {
      margin-bottom: 20px;
      list-style: none;
      color: v-bind('modelStyle.textColor');
      font-size: v-bind('modelStyle.textFontSize');
      font-weight: v-bind('modelStyle.textFontWeight');
    }
  }
}
</style>
