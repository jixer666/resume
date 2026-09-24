<script setup lang="ts">
import type { IEduBackgroundData, IModelStyle } from '@/schema/types'
import MaterialShell from '../../shared/MaterialShell.vue'
import SectionTitle from '../../shared/SectionTitle.vue'

/** 教育经历 2：时间轴式，左侧竖线串起条目 */
const props = defineProps<{ modelData: IEduBackgroundData, modelStyle: IModelStyle }>()

const list = computed(() => props.modelData.LIST.filter(item => item.schoolName || item.specialized))
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
            <text v-if="show.schoolName" class="node__school">{{ item.schoolName }}</text>
            <text v-if="show.date" class="node__date">{{ item.date }}</text>
          </view>
          <text v-if="show.specialized" class="node__major">
            {{ item.specialized }}<text v-if="show.degree && item.degree" class="node__degree"> · {{ item.degree }}</text>
          </text>
          <text v-if="show.majorCourse && item.majorCourse" class="node__course">主修课程：{{ item.majorCourse }}</text>
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
  padding-bottom: calc(var(--rs-text-size) * 0.6);
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

.node__school {
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

.node__major {
  display: block;
  margin-top: calc(var(--rs-text-size) * 0.3);
}

.node__degree {
  color: var(--rs-theme);
  font-weight: 600;
}

.node__course {
  display: block;
  margin-top: calc(var(--rs-text-size) * 0.3);
  color: var(--rs-muted);
}
</style>
