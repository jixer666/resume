<!-- 荣誉奖项：奖项名称 / 时间一行，等级一行 -->
<template>
  <view class="awards u-tag-div">
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <view class="awards__list u-tag-div">
      <view v-for="(item, index) in modelData.LIST" :key="index" class="awards__item">
        <view class="awards__head">
          <text v-if="modelData.isShow.awardsName" class="awards__name">
            {{ item.awardsName }}
          </text>
          <text v-if="modelData.isShow.date" class="awards__date">
            {{ formatDate(item.date) }}
          </text>
        </view>
        <view v-if="modelData.isShow.awardsGrade" class="awards__meta">
          <text class="awards__grade">
            {{ item.awardsGrade }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { IAWARDS } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { formatDate } from '@/utils/common'
import ModelTitle from '../../ModelTitle/ModelTitle1/ModelTitle1.vue'

defineProps<{
  modelData: IAWARDS
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
.awards {
  box-sizing: border-box;
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-top: v-bind('modelStyle.mTop');
  margin-bottom: v-bind('modelStyle.mBottom');

  &__list {
    /* 小标题条 → 首个条目：与模块间距同源，条上下留白一致（见 RenderItem） */
    margin-top: var(--rs-gap-title, 18px);
  }

  &__item {
    &:not(:last-child) {
      margin-bottom: var(--entry-mb, var(--rs-gap-entry));
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
    margin-top: var(--rs-gap-line, 6px);
  }

  &__grade {
    font-size: v-bind('modelStyle.textFontSize');
    font-weight: v-bind('modelStyle.textFontWeight');
    color: v-bind('modelStyle.textColor');
  }
}
</style>
