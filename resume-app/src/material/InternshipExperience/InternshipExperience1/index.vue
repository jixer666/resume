<!-- 实习经验：公司 / 时间一行，职位 / 部门一行，正文富文本 -->
<template>
  <view class="internship-experience u-tag-div">
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <view class="internship-experience__list u-tag-div">
      <view v-for="(item, index) in modelData.LIST" :key="index" class="internship-experience__item">
        <view class="internship-experience__head">
          <text v-if="modelData.isShow.companyName" class="internship-experience__name">
            {{ item.companyName }}
          </text>
          <text v-if="modelData.isShow.date" class="internship-experience__date">
            {{ formatDate(item.date) }}
          </text>
        </view>
        <view v-if="modelData.isShow.posts || modelData.isShow.department" class="internship-experience__meta">
          <text v-if="modelData.isShow.posts" class="internship-experience__posts">
            {{ item.posts }}
          </text>
          <text v-if="modelData.isShow.department" class="internship-experience__department">
            {{ item.department }}
          </text>
        </view>
        <view v-if="item.jobContent" class="internship-experience__content">
          <RichTextView :html="item.jobContent" :model-style="modelStyle" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { IINTERNSHIPEXPERIENCE } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { formatDate } from '@/utils/common'
import ModelTitle from '../../ModelTitle/ModelTitle1/ModelTitle1.vue'

defineProps<{
  modelData: IINTERNSHIPEXPERIENCE
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
.internship-experience {
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
      margin-bottom: var(--entry-mb, 24px);
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

  &__posts {
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
    margin-top: 10px;
  }
}
</style>
