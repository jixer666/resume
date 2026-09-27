<!-- 教育背景：学校 / 时间一行，专业 / 学历一行 -->
<template>
  <view class="edu-background u-tag-div">
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <view class="edu-background__list u-tag-div">
      <view v-for="(item, index) in modelData.LIST" :key="index" class="edu-background__item">
        <view class="edu-background__head">
          <text v-if="modelData.isShow.schoolName" class="edu-background__name">
            {{ item.schoolName }}
          </text>
          <text v-if="modelData.isShow.date" class="edu-background__date">
            {{ formatDate(item.date) }}
          </text>
        </view>
        <view class="edu-background__meta">
          <text v-if="modelData.isShow.specialized" class="edu-background__specialized">
            {{ item.specialized }}
          </text>
          <text v-if="modelData.isShow.degree" class="edu-background__degree">
            {{ item.degree }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { IEDUBACKGROUND } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { formatDate } from '@/utils/common'
import ModelTitle from '../../ModelTitle/ModelTitle1/ModelTitle1.vue'

defineProps<{
  modelData: IEDUBACKGROUND
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
.edu-background {
  box-sizing: border-box;
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-top: v-bind('modelStyle.mTop');
  margin-bottom: v-bind('modelStyle.mBottom');

  &__list {
    margin-top: 18px;
  }

  &__item {
    &:not(:last-child) {
      margin-bottom: var(--entry-mb, 18px);
    }
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__name {
    font-size: v-bind('modelStyle.titleFontSize');
    font-weight: v-bind('modelStyle.titleFontWeight');
    color: v-bind('modelStyle.titleColor');
  }

  &__date {
    font-size: v-bind('modelStyle.textFontSize');
    font-weight: v-bind('modelStyle.textFontWeight');
    color: v-bind('modelStyle.textColor');
  }

  &__meta {
    display: flex;
    align-items: center;
    margin-top: 8px;
  }

  &__specialized {
    font-size: v-bind('modelStyle.textFontSize');
    font-weight: v-bind('modelStyle.textFontWeight');
    color: v-bind('modelStyle.textColor');
  }

  &__degree {
    margin-left: 8px;
    font-size: v-bind('modelStyle.textFontSize');
    font-weight: v-bind('modelStyle.textFontWeight');
    color: v-bind('modelStyle.textColor');
  }
}
</style>
