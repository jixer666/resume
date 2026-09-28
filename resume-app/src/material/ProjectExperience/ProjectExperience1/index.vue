<!-- 项目经验：项目名 / 职责 / 时间同行，正文富文本 -->
<template>
  <view class="project-experience u-tag-div">
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <view class="project-experience__list u-tag-div">
      <view v-for="(item, index) in modelData.LIST" :key="index" class="project-experience__item">
        <view class="project-experience__head">
          <view class="project-experience__meta">
            <text v-if="modelData.isShow.projectName" class="project-experience__name">
              {{ item.projectName }}
            </text>
            <text v-if="modelData.isShow.posts && item.posts" class="project-experience__posts">
              {{ item.posts }}
            </text>
          </view>
          <text v-if="modelData.isShow.date" class="project-experience__date">
            {{ formatDate(item.date) }}
          </text>
        </view>
        <view v-if="item.projectContent" class="project-experience__content">
          <RichTextView :html="item.projectContent" :model-style="modelStyle" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { IPROJECTEXPERIENCE } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { formatDate } from '@/utils/common'
import ModelTitle from '../../ModelTitle/ModelTitle1/ModelTitle1.vue'

defineProps<{
  modelData: IPROJECTEXPERIENCE
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
.project-experience {
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

  &__content {
    margin-top: var(--rs-gap-body, 8px);
  }
}
</style>
