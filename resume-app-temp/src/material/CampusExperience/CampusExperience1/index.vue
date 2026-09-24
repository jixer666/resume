<script setup lang="ts">
import type { ICampusExperienceData, IModelStyle } from '@/schema/types'
import MaterialShell from '../../shared/MaterialShell.vue'
import SectionTitle from '../../shared/SectionTitle.vue'

/** 校园经历 1：条目式，简述 + 职务 + 内容 */
const props = defineProps<{ modelData: ICampusExperienceData, modelStyle: IModelStyle }>()

const list = computed(() => props.modelData.LIST.filter(item => item.campusBriefly || item.campusContent))
const show = computed(() => props.modelData.isShow)
</script>

<template>
  <MaterialShell :model-style="props.modelStyle">
    <SectionTitle v-if="props.modelData.title" :title="props.modelData.title" :model-style="props.modelStyle" />
    <view v-for="(item, i) in list" :key="i" class="entry">
      <view class="entry__head">
        <view class="entry__left">
          <text v-if="show.campusBriefly" class="entry__briefly">{{ item.campusBriefly }}</text>
          <text v-if="show.campusDuty && item.campusDuty" class="entry__duty">{{ item.campusDuty }}</text>
        </view>
        <text v-if="show.date" class="entry__date">{{ item.date }}</text>
      </view>
      <text v-if="show.campusContent && item.campusContent" class="entry__content">{{ item.campusContent }}</text>
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

.entry__briefly {
  color: var(--rs-title-color);
  font-size: var(--rs-2title-size);
  font-weight: var(--rs-title-weight);
  letter-spacing: 0.01em;
}

/* 职务跟在活动名后面，用主题色区分层级，前面加一条细竖线做分隔 */
.entry__duty {
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

.entry__content {
  display: block;
  margin-top: calc(var(--rs-text-size) * 0.35);
  color: var(--rs-muted);
}
</style>
