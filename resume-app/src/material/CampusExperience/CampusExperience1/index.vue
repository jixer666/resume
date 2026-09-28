<!-- 校园经历：社团名 / 时间一行，职务一行，正文富文本 -->
<template>
  <view class="campus-experience u-tag-div">
    <model-title :title="modelData.title" :model-style="modelStyle" :icon="modelData.iconfont" />
    <view class="campus-experience__list u-tag-div">
      <view v-for="(item, index) in modelData.LIST" :key="index" class="campus-experience__item">
        <view class="campus-experience__head">
          <text v-if="modelData.isShow.campusBriefly" class="campus-experience__name">
            {{ item.campusBriefly }}
          </text>
          <text v-if="modelData.isShow.date" class="campus-experience__date">
            {{ formatDate(item.date) }}
          </text>
        </view>
        <view v-if="modelData.isShow.campusDuty" class="campus-experience__meta">
          <text class="campus-experience__duty">
            {{ item.campusDuty }}
          </text>
        </view>
        <view v-if="item.campusContent" class="campus-experience__content">
          <RichTextView :html="item.campusContent" :model-style="modelStyle" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { ICAMPUSEXPERIENCE } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { formatDate } from '@/utils/common'
import ModelTitle from '../../ModelTitle/ModelTitle1/ModelTitle1.vue'

defineProps<{
  modelData: ICAMPUSEXPERIENCE
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
.campus-experience {
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

  &__duty {
    font-size: v-bind('modelStyle.textFontSize');
    font-weight: v-bind('modelStyle.textFontWeight');
    color: v-bind('modelStyle.textColor');
  }

  &__content {
    margin-top: var(--rs-gap-body, 8px);
  }
}
</style>
