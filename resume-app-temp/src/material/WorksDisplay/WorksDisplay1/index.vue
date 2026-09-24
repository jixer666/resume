<script setup lang="ts">
import type { IModelStyle, IWorksDisplayData } from '@/schema/types'
import MaterialShell from '../../shared/MaterialShell.vue'
import SectionTitle from '../../shared/SectionTitle.vue'

/** 作品展示 1：条目式，作品名 + 链接 + 说明 */
const props = defineProps<{ modelData: IWorksDisplayData, modelStyle: IModelStyle }>()

const list = computed(() => props.modelData.LIST.filter(item => item.worksName))
</script>

<template>
  <MaterialShell :model-style="props.modelStyle">
    <SectionTitle v-if="props.modelData.title" :title="props.modelData.title" :model-style="props.modelStyle" />
    <view v-for="(item, i) in list" :key="i" class="entry">
      <view class="entry__head">
        <text class="entry__name">{{ item.worksName }}</text>
        <text v-if="item.worksLink" class="entry__link">{{ item.worksLink }}</text>
      </view>
      <text v-if="item.worksIntroduce" class="entry__desc">{{ item.worksIntroduce }}</text>
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

.entry__link {
  flex: none;
  margin-left: calc(var(--rs-text-size) * 0.8);
  color: var(--rs-mark);
  font-size: calc(var(--rs-text-size) * 0.9);
  word-break: break-all;
}

.entry__desc {
  display: block;
  margin-top: calc(var(--rs-text-size) * 0.3);
  color: var(--rs-muted);
}
</style>
