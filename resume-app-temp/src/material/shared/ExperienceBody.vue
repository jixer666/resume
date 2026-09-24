<script setup lang="ts">
import type { IExperienceData, IModelStyle } from '@/schema/types'
import { plainToHtml } from '@/schema/modelData'
import MaterialShell from './MaterialShell.vue'
import SectionTitle from './SectionTitle.vue'

/**
 * 工作 / 项目 / 实习经历的共用正文：三种模块的业务数据结构一致，只是标题不同。
 * 变体组件传入自己的 modelData / modelStyle 即可复用。
 *
 * 条目外观（无框 / 分隔线 / 卡片 / 衬底条）不在这里写死，
 * 而是消费 --rs-entry-* 变量，由 GLOBAL_STYLE.entryStyle 决定。
 */
const props = defineProps<{ modelData: IExperienceData, modelStyle: IModelStyle }>()

const list = computed(() =>
  props.modelData.LIST
    .filter(item => item.companyName || item.posts)
    .map(item => ({
      ...item,
      // 兼容旧数据：jobContent 曾是按行拆分的数组（圆点列表），新数据为富文本 HTML
      points: Array.isArray(item.jobContent) ? item.jobContent.filter(Boolean) : [],
      rich: Array.isArray(item.jobContent) ? '' : plainToHtml(item.jobContent),
    })),
)
const show = computed(() => props.modelData.isShow)
</script>

<template>
  <MaterialShell :model-style="props.modelStyle">
    <SectionTitle v-if="props.modelData.title" :title="props.modelData.title" :model-style="props.modelStyle" />
    <view v-for="(item, i) in list" :key="i" class="entry">
      <view class="entry__head">
        <view class="entry__left">
          <text v-if="show.companyName" class="entry__org">{{ item.companyName }}</text>
          <text v-if="show.posts && item.posts" class="entry__post">{{ item.posts }}</text>
        </view>
        <text v-if="show.date" class="entry__date">{{ item.date }}</text>
      </view>
      <view v-if="item.points.length" class="entry__points">
        <view v-for="(point, j) in item.points" :key="j" class="point">
          <text class="point__dot">•</text>
          <text class="point__text">{{ point }}</text>
        </view>
      </view>
      <fg-rich-view v-else-if="item.rich" class="entry__rich" :html="item.rich" />
    </view>
  </MaterialShell>
</template>

<style scoped lang="scss">
.entry {
  padding: var(--rs-entry-pad);
  border: var(--rs-entry-border);
  border-left: var(--rs-entry-accent);
  border-radius: var(--rs-entry-radius);
  background-color: var(--rs-entry-bg);
}

.entry + .entry {
  margin-top: var(--rs-entry-gap);
  padding-top: var(--rs-entry-pad-top);
  border-top: var(--rs-entry-line);
}

.entry__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.entry__left {
  display: flex;
  align-items: baseline;
  min-width: 0;
  flex: 1;
}

.entry__org {
  color: var(--rs-title-color);
  font-size: var(--rs-2title-size);
  font-weight: var(--rs-title-weight);
  letter-spacing: 0.01em;
}

/* 职位跟在机构后面，用主题色区分层级，前面加一个细竖线做分隔 */
.entry__post {
  flex: none;
  margin-left: calc(var(--rs-text-size) * 0.6);
  padding-left: calc(var(--rs-text-size) * 0.6);
  border-left: 1px solid var(--rs-divider);
  color: var(--rs-theme);
  font-weight: 600;
}

.entry__date {
  flex: none;
  margin-left: calc(var(--rs-text-size) * 0.8);
  color: var(--rs-muted);
  font-size: calc(var(--rs-text-size) * 0.92);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.entry__points {
  margin-top: calc(var(--rs-text-size) * 0.45);
}

.entry__rich {
  margin-top: calc(var(--rs-text-size) * 0.45);
}

.point {
  display: flex;
  align-items: flex-start;
}

.point + .point {
  margin-top: calc(var(--rs-text-size) * 0.28);
}

/* 圆点用行高把基线压到与首行文字齐平，避免小圆点浮在行首上方 */
.point__dot {
  flex: none;
  margin-right: calc(var(--rs-text-size) * 0.5);
  color: var(--rs-mark);
  font-size: calc(var(--rs-text-size) * 0.9);
  line-height: var(--rs-lh);
}

.point__text {
  min-width: 0;
  flex: 1;
}
</style>
