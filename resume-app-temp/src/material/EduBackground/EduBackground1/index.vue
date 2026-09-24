<script setup lang="ts">
import type { IEduBackgroundData, IModelStyle } from '@/schema/types'
import MaterialShell from '../../shared/MaterialShell.vue'
import SectionTitle from '../../shared/SectionTitle.vue'

/** 教育经历 1：条目式，学校 + 专业居左，时间居右 */
const props = defineProps<{ modelData: IEduBackgroundData, modelStyle: IModelStyle }>()

const list = computed(() => props.modelData.LIST.filter(item => item.schoolName || item.specialized))
const show = computed(() => props.modelData.isShow)
</script>

<template>
  <MaterialShell :model-style="props.modelStyle">
    <SectionTitle v-if="props.modelData.title" :title="props.modelData.title" :model-style="props.modelStyle" />
    <view v-for="(item, i) in list" :key="i" class="entry">
      <view class="entry__head">
        <view class="entry__left">
          <text v-if="show.schoolName" class="entry__school">{{ item.schoolName }}</text>
          <text v-if="show.specialized" class="entry__major">{{ item.specialized }}</text>
          <text v-if="show.degree && item.degree" class="entry__degree">{{ item.degree }}</text>
        </view>
        <text v-if="show.date" class="entry__date">{{ item.date }}</text>
      </view>
      <text v-if="show.majorCourse && item.majorCourse" class="entry__course">主修课程：{{ item.majorCourse }}</text>
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

.entry__school {
  color: var(--rs-title-color);
  font-size: var(--rs-2title-size);
  font-weight: var(--rs-title-weight);
  letter-spacing: 0.01em;
}

.entry__major {
  margin-left: calc(var(--rs-text-size) * 0.5);
  color: var(--rs-text-color);
}

/* 学历标签：描边式，比实心浅底更轻，且不与软标签标题撞视觉 */
.entry__degree {
  flex: none;
  margin-left: calc(var(--rs-text-size) * 0.5);
  padding: calc(var(--rs-text-size) * 0.05) calc(var(--rs-text-size) * 0.4);
  border: 1px solid var(--rs-accent-line);
  border-radius: var(--rs-radius-xs);
  color: var(--rs-theme);
  font-size: calc(var(--rs-text-size) * 0.85);
  line-height: 1.5;
}

.entry__date {
  flex: none;
  margin-left: calc(var(--rs-text-size) * 0.8);
  color: var(--rs-muted);
  font-size: calc(var(--rs-text-size) * 0.92);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.entry__course {
  display: block;
  margin-top: calc(var(--rs-text-size) * 0.35);
  color: var(--rs-muted);
}
</style>
