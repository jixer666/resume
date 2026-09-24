<script setup lang="ts">
import type { IAwardsData, IModelStyle } from '@/schema/types'
import MaterialShell from '../../shared/MaterialShell.vue'
import SectionTitle from '../../shared/SectionTitle.vue'

/** 荣誉奖项 1：条目式，奖项名居左、等级与时间居右 */
const props = defineProps<{ modelData: IAwardsData, modelStyle: IModelStyle }>()

const list = computed(() => props.modelData.LIST.filter(item => item.awardsName))
const show = computed(() => props.modelData.isShow)
</script>

<template>
  <MaterialShell :model-style="props.modelStyle">
    <SectionTitle v-if="props.modelData.title" :title="props.modelData.title" :model-style="props.modelStyle" />
    <view v-for="(item, i) in list" :key="i" class="entry">
      <view class="entry__head">
        <text class="entry__name">{{ item.awardsName }}</text>
        <view class="entry__right">
          <text v-if="show.awardsGrade && item.awardsGrade" class="entry__grade">{{ item.awardsGrade }}</text>
          <text v-if="show.date && item.date" class="entry__date">{{ item.date }}</text>
        </view>
      </view>
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

.entry__name {
  min-width: 0;
  flex: 1;
  color: var(--rs-title-color);
  font-weight: 600;
}

.entry__right {
  display: flex;
  align-items: baseline;
  flex: none;
  margin-left: calc(var(--rs-text-size) * 0.8);
}

.entry__grade {
  color: var(--rs-mark);
  font-size: calc(var(--rs-text-size) * 0.92);
  font-weight: 600;
}

.entry__date {
  margin-left: calc(var(--rs-text-size) * 0.6);
  color: var(--rs-muted);
  font-size: calc(var(--rs-text-size) * 0.92);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
</style>
