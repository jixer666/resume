<template>
  <div class="job-intention u-tag-div">
    <!-- 标题 -->
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <slot name="model-title" />
    <!-- 求职意向 -->
    <ul class="u-tag-ul">
      <!-- 求职类型 -->
      <li v-show="modelData.isShow.jobSearchType" class="u-tag-li">
        <mp-icon name="icon-gongzuoleixing" class="icon" color="#757575" />
        {{ modelData.jobSearchType }}
      </li>
      <!-- 意向岗位 -->
      <li v-show="modelData.isShow.intendedPositions" class="u-tag-li">
        <mp-icon name="icon-yixianggangwei" class="icon" color="#757575" />{{ modelData.intendedPositions }}
      </li>
      <!-- 意向城市 -->
      <li v-show="modelData.isShow.intendedCity" class="u-tag-li">
        <mp-icon name="icon-didiandingwei" class="icon" color="#757575" />{{ modelData.intendedCity }}
      </li>
      <!-- 期望薪资 -->
      <li v-show="modelData.isShow.expectSalary" class="u-tag-li">
        <mp-icon name="icon-nianduxinchou" class="icon" color="#757575" />{{ modelData.expectSalary }}
      </li>
      <!-- 求职状态 -->
      <li v-show="modelData.isShow.jobStatus" class="u-tag-li">
        <mp-icon name="icon-ruzhiriqi" class="icon" color="#757575" />{{ modelData.jobStatus }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import ModelTitle from '../../ModelTitle/ModelTitle1/ModelTitle1.vue'
import type { IJOBINTENTION } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IJOBINTENTION
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .job-intention {
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-top: v-bind('modelStyle.mTop');
  margin-bottom: v-bind('modelStyle.mBottom');
  box-sizing: border-box;
  .u-tag-ul {
    display: flex;
    margin-top: 25px;
    justify-content: space-between;
    .u-tag-li {
      list-style: none;
      font-size: v-bind('modelStyle.textFontSize');
      color: v-bind('modelStyle.textColor');
      font-weight: v-bind('modelStyle.textFontWeight');
      letter-spacing: 2px;
      display: flex;
      align-items: center;
      .icon {
        margin-right: 8px;
        font-size: 17px;
      }
    }
  }
}
</style>
