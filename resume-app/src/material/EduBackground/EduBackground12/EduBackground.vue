<template>
  <div class="edu-background-12-box u-tag-div">
    <!-- 标题 -->
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <!-- 内容区域 -->
    <div class="edubackground-11-content-box u-tag-div">
      <!-- 左侧 -->
      <div class="left u-tag-div">
        <image class="u-tag-img" src="/static/images/modulelist.png" mode="scaleToFill" style="width: 45px; height: 44px" />
        <image class="moduleborder u-tag-img" src="/static/images/moduleborder.png" mode="scaleToFill" style="width: 6px" />
      </div>
      <edu-background1-vue :model-data="modelData" :model-style="modelStyle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IEDUBACKGROUND } from '@/interface/model'
import ModelTitle from '@/material/ModelTitle/ModelTitle9/ModelTitle.vue'
import type IMODELSTYLE from '@/interface/modelStyle'
import EduBackground1Vue from '@/material/Common/EduBackground/EduBackground2.vue'

defineProps<{
  modelData: IEDUBACKGROUND
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .edu-background-12-box {
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-top: v-bind('modelStyle.mTop');
  margin-bottom: v-bind('modelStyle.mBottom');
  box-sizing: border-box;
  .edubackground-11-content-box {
    display: flex;
    margin-top: 15px;
    justify-content: space-between;

    :deep(.edu-background-content) {
      flex: 1;
    }
    .left {
      width: 74px;
      margin-top: 12px;
      position: relative;
      .moduleborder {
        position: absolute;
        top: 3px;
        left: 22px;
        height: 100%;
      }
    }
  }
}
</style>
