<!-- 求职意向：侧栏版，标题与条目全白、条目带「标签： 值」（蓝色侧栏样式） -->
<template>
  <view class="job-intention u-tag-div">
    <!-- 侧栏小标题不走 ModelTitle 分发：侧栏里的小标题没有下划线，也不跟正文标题换形态 -->
    <text class="job-intention__title">
      {{ modelData.title }}
    </text>
    <view class="job-intention__list u-tag-div">
      <view v-if="modelData.isShow.jobSearchType" class="job-intention__row">
        <text class="job-intention__label">
          求职类型：
        </text>
        <text class="job-intention__value">
          {{ modelData.jobSearchType }}
        </text>
      </view>
      <view v-if="modelData.isShow.intendedPositions" class="job-intention__row">
        <text class="job-intention__label">
          意向岗位：
        </text>
        <text class="job-intention__value">
          {{ modelData.intendedPositions }}
        </text>
      </view>
      <view v-if="modelData.isShow.intendedCity" class="job-intention__row">
        <text class="job-intention__label">
          意向城市：
        </text>
        <text class="job-intention__value">
          {{ modelData.intendedCity }}
        </text>
      </view>
      <view v-if="modelData.isShow.expectSalary" class="job-intention__row">
        <text class="job-intention__label">
          期望薪资：
        </text>
        <text class="job-intention__value">
          {{ modelData.expectSalary }}
        </text>
      </view>
      <view v-if="modelData.isShow.jobStatus" class="job-intention__row">
        <text class="job-intention__label">
          求职状态：
        </text>
        <text class="job-intention__value">
          {{ modelData.jobStatus }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { IJOBINTENTION } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IJOBINTENTION
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
.job-intention {
  box-sizing: border-box;
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-top: v-bind('modelStyle.mTop');
  margin-bottom: v-bind('modelStyle.mBottom');

  &__title {
    /* 模块上内边距与模板一统一成 12px 后，这里补到 26px，侧栏小标题间距保持版式图不变 */
    margin-top: 14px;
    font-size: v-bind('modelStyle.firstTitleFontSize');
    font-weight: 700;
    color: #ffffff;
  }

  &__list {
    display: flex;
    flex-direction: column;
    width: 100%;
    /* 小标题 → 首个条目：版式图约 6px，侧栏不参与整页压缩，写死 */
    margin-top: 6px;
  }

  &__row {
    display: flex;
    align-items: baseline;
    line-height: 1.7;

    &:not(:first-child) {
      margin-top: 6px;
    }
  }

  &__label {
    flex: none;
    font-size: v-bind('modelStyle.textFontSize');
    font-weight: v-bind('modelStyle.textFontWeight');
    color: rgb(255 255 255 / 72%);
  }

  &__value {
    min-width: 0;
    font-size: v-bind('modelStyle.textFontSize');
    font-weight: v-bind('modelStyle.textFontWeight');
    color: #ffffff;
    word-break: break-all;
  }
}
</style>
