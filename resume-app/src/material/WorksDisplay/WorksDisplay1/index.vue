<!-- 作品展示：作品名 + 链接（小程序没有 a 标签，点击复制） -->
<template>
  <view class="works-display u-tag-div">
    <model-title :title="modelData.title" :model-style="modelStyle" :icon="modelData.iconfont" />
    <view class="works-display__list u-tag-div">
      <view v-for="(item, index) in modelData.LIST" :key="index" class="works-display__item">
        <text class="works-display__name">
          {{ item.worksName }}
        </text>
        <text class="works-display__link" @click="copyWorksLink(item.worksLink)">
          {{ item.worksLink }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { IWORKSDISPLAY } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import ModelTitle from '../../ModelTitle/ModelTitle1/ModelTitle1.vue'

defineProps<{
  modelData: IWORKSDISPLAY
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 小程序没有 `<a>`，点击复制链接（H5 端同样可用，不影响导出 PDF） */
function copyWorksLink(link?: string) {
  if (!link)
    return
  uni.setClipboardData({
    data: link,
    success: () => uni.showToast({ title: '链接已复制', icon: 'none' }),
  })
}
</script>

<style lang="scss" scoped>
.works-display {
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
    display: flex;
    flex-direction: column;

    &:not(:last-child) {
      margin-bottom: var(--entry-mb, var(--rs-gap-entry));
    }
  }

  &__name {
    font-size: v-bind('modelStyle.titleFontSize');
    font-weight: v-bind('modelStyle.titleFontWeight');
    color: v-bind('modelStyle.titleColor');
  }

  &__link {
    margin-top: var(--rs-gap-line, 6px);
    font-size: v-bind('modelStyle.textFontSize');
    color: v-bind('modelStyle.textColor');
  }
}
</style>
