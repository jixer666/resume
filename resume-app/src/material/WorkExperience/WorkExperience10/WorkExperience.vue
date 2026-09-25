<!-- 工作经验 -->
<template>
  <div class="work-experience u-tag-div">
    <!-- 标题 -->
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <!-- 内容区域 -->
    <div class="work-experience-10-content-box u-tag-div">
      <!-- 左侧 -->
      <div class="left u-tag-div">
        <image class="u-tag-img" src="/static/images/modulelist.png" mode="scaleToFill" style="width: 45px; height: 44px" />
        <image class="moduleborder u-tag-img" src="/static/images/moduleborder.png" mode="scaleToFill" style="width: 6px" />
      </div>
      <work-experience1-vue
        :model-data="modelData"
        :model-style="modelStyle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IWORKEXPERIENCE } from '@/interface/model'
import ModelTitle from '@/material/ModelTitle/ModelTitle9/ModelTitle.vue'
import WorkExperience1Vue from '@/material/Common/WorkExperience/WorkExperience1.vue'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IWORKEXPERIENCE
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .work-experience {
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  box-sizing: border-box;
  margin-bottom: v-bind('modelStyle.mBottom');
  margin-top: v-bind('modelStyle.mTop');
  .work-experience-10-content-box {
    display: flex;
    margin-top: 25px;
    justify-content: space-between;
    .left {
      width: 74px;
      position: relative;
      .moduleborder {
        position: absolute;
        top: 3px;
        left: 22px;
        height: 100%;
      }
    }
    :deep(.work-experience-content) {
      flex: 1;
      .work-experience-list {
        padding: 0;
      }
    }
  }
}
</style>
