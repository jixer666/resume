<!-- 求职意向·左侧栏版式：白色标题 + 逐行白字「标签：值」 -->
<template>
  <div class="job-intention-11-box u-tag-div">
    <h2 class="side-title u-tag-h2">
      {{ modelData.title }}
    </h2>
    <p v-show="modelData.isShow.intendedPositions" class="side-line u-tag-p">
      期望职位：{{ modelData.intendedPositions }}
    </p>
    <p v-show="modelData.isShow.intendedCity" class="side-line u-tag-p">
      期望城市：{{ modelData.intendedCity }}
    </p>
    <p v-show="modelData.isShow.expectSalary" class="side-line u-tag-p">
      期望薪资：{{ modelData.expectSalary }}
    </p>
    <p v-show="modelData.isShow.jobSearchType" class="side-line u-tag-p">
      求职类型：{{ modelData.jobSearchType }}
    </p>
    <p v-show="modelData.isShow.jobStatus" class="side-line u-tag-p">
      求职状态：{{ modelData.jobStatus }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { IJOBINTENTION } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IJOBINTENTION // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .job-intention-11-box {
  width: 100%;
  box-sizing: border-box;
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-top: v-bind('modelStyle.mTop');
  margin-bottom: v-bind('modelStyle.mBottom');

  .side-title {
    font-size: v-bind('modelStyle.firstTitleFontSize');
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: 1px;
    color: #fff;
  }
  .side-line {
    margin-top: 13px;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.6;
    color: #fff;
    word-break: break-all;
  }
}
</style>
