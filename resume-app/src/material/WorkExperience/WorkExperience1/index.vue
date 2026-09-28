<!-- 工作经历：公司 / 部门 / 职位 / 时间同行，正文富文本 -->
<template>
  <view class="work-experience u-tag-div">
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <view class="work-experience__list u-tag-div">
      <view v-for="(item, index) in modelData.LIST" :key="index" class="work-experience__item">
        <view class="work-experience__head">
          <view class="work-experience__meta">
            <text v-if="modelData.isShow.companyName" class="work-experience__name">
              {{ item.companyName }}
            </text>
            <text v-if="modelData.isShow.department && item.department" class="work-experience__department">
              {{ item.department }}
            </text>
            <text v-if="modelData.isShow.posts && item.posts" class="work-experience__posts">
              {{ item.posts }}
            </text>
          </view>
          <text v-if="modelData.isShow.date" class="work-experience__date">
            {{ formatDate(item.date) }}
          </text>
        </view>
        <view v-if="item.jobContent" class="work-experience__content">
          <RichTextView :html="item.jobContent" :model-style="modelStyle" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { IWORKEXPERIENCE } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { formatDate } from '@/utils/common'
import ModelTitle from '../../ModelTitle/ModelTitle1/ModelTitle1.vue'

defineProps<{
  modelData: IWORKEXPERIENCE
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
.work-experience {
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
    align-items: baseline;
    justify-content: space-between;
  }

  &__meta {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    align-items: baseline;
    min-width: 0;
  }

  &__name {
    font-size: v-bind('modelStyle.titleFontSize');
    font-weight: v-bind('modelStyle.titleFontWeight');
    color: v-bind('modelStyle.titleColor');
  }

  &__date {
    flex: none;
    margin-left: 12px;
    font-size: v-bind('modelStyle.textFontSize');
    font-weight: v-bind('modelStyle.textFontWeight');
    color: v-bind('modelStyle.textColor');
    white-space: nowrap;
  }

  &__posts {
    margin-left: 8px;
    font-size: v-bind('modelStyle.textFontSize');
    font-weight: v-bind('modelStyle.textFontWeight');
    color: v-bind('modelStyle.textColor');
  }

  &__department {
    margin-left: 8px;
    font-size: v-bind('modelStyle.textFontSize');
    font-weight: v-bind('modelStyle.textFontWeight');
    color: v-bind('modelStyle.textColor');
  }

  &__content {
    margin-top: var(--rs-gap-body, 8px);
  }
}
</style>
