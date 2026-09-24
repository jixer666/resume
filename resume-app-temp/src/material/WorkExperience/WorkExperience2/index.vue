<script setup lang="ts">
import type { IExperienceData, IModelStyle } from '@/schema/types'
import { plainToHtml } from '@/schema/modelData'
import MaterialShell from '../../shared/MaterialShell.vue'
import SectionTitle from '../../shared/SectionTitle.vue'

/** 工作经历 2：时间轴式，左侧竖线串起每段经历 */
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
    <view class="track">
      <view v-for="(item, i) in list" :key="i" class="node">
        <view class="node__dot" />
        <view class="node__body">
          <view class="node__head">
            <text v-if="show.companyName" class="node__org">{{ item.companyName }}</text>
            <text v-if="show.date" class="node__date">{{ item.date }}</text>
          </view>
          <text v-if="show.posts && item.posts" class="node__post">{{ item.posts }}</text>
          <view v-if="item.points.length" class="node__points">
            <view v-for="(point, j) in item.points" :key="j" class="point">
              <text class="point__dot">•</text>
              <text class="point__text">{{ point }}</text>
            </view>
          </view>
          <fg-rich-view v-else-if="item.rich" class="node__rich" :html="item.rich" />
        </view>
      </view>
    </view>
  </MaterialShell>
</template>

<style scoped lang="scss">
.track {
  padding-left: calc(var(--rs-text-size) * 0.2);
}

.node {
  position: relative;
  padding-left: calc(var(--rs-text-size) * 1.4);
  padding-bottom: calc(var(--rs-text-size) * 0.65);
  border-left: 1px solid var(--rs-divider);
}

.node:last-child {
  padding-bottom: 0;
  border-left-color: transparent;
}

.node__dot {
  position: absolute;
  top: calc(var(--rs-text-size) * 0.32);
  left: calc(var(--rs-text-size) * -0.34);
  width: calc(var(--rs-text-size) * 0.68);
  height: calc(var(--rs-text-size) * 0.68);
  border: 2px solid var(--rs-mark);
  border-radius: 50%;
  background-color: var(--rs-bg);
}

.node__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.node__org {
  color: var(--rs-title-color);
  font-size: var(--rs-2title-size);
  font-weight: var(--rs-title-weight);
  letter-spacing: 0.01em;
}

.node__date {
  flex: none;
  margin-left: calc(var(--rs-text-size) * 0.8);
  color: var(--rs-muted);
  font-size: calc(var(--rs-text-size) * 0.92);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.node__post {
  display: block;
  margin-top: calc(var(--rs-text-size) * 0.25);
  color: var(--rs-theme);
  font-weight: 600;
}

.node__points {
  margin-top: calc(var(--rs-text-size) * 0.45);
}

.node__rich {
  margin-top: calc(var(--rs-text-size) * 0.45);
}

.point {
  display: flex;
  align-items: flex-start;
}

.point + .point {
  margin-top: calc(var(--rs-text-size) * 0.28);
}

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
