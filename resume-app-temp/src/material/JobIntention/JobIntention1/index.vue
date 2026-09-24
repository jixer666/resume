<script setup lang="ts">
import type { IJobIntentionData, IModelStyle } from '@/schema/types'
import MaterialShell from '../../shared/MaterialShell.vue'
import SectionTitle from '../../shared/SectionTitle.vue'

/** 求职意向：标签网格 */
const props = defineProps<{ modelData: IJobIntentionData, modelStyle: IModelStyle }>()

const fields = computed(() => {
  const { modelData: data } = props
  const show = data.isShow
  return [
    { key: 'intendedPositions', label: '期望职位', value: data.intendedPositions, visible: show.intendedPositions },
    { key: 'intendedCity', label: '期望城市', value: data.intendedCity, visible: show.intendedCity },
    { key: 'expectSalary', label: '期望薪资', value: data.expectSalary, visible: show.expectSalary },
    { key: 'jobStatus', label: '求职状态', value: data.jobStatus, visible: show.jobStatus },
    { key: 'jobSearchType', label: '求职类型', value: data.jobSearchType, visible: show.jobSearchType },
  ].filter(item => item.visible && item.value)
})
</script>

<template>
  <MaterialShell :model-style="props.modelStyle">
    <SectionTitle v-if="props.modelData.title" :title="props.modelData.title" :model-style="props.modelStyle" />
    <view v-if="fields.length" class="grid">
      <view v-for="item in fields" :key="item.key" class="cell">
        <text class="cell__label">{{ item.label }}</text>
        <text class="cell__value">{{ item.value }}</text>
      </view>
    </view>
  </MaterialShell>
</template>

<style scoped lang="scss">
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--rs-text-size) * 0.6);
}

/* 意向单元格：描边 + 极浅底，比实心浅底块更轻，不与标题软标签撞视觉 */
.cell {
  display: flex;
  align-items: baseline;
  padding: calc(var(--rs-text-size) * 0.3) calc(var(--rs-text-size) * 0.85);
  border: 1px solid var(--rs-accent-line);
  border-radius: var(--rs-radius-sm);
  background-color: var(--rs-card-bg);
}

.cell__label {
  margin-right: calc(var(--rs-text-size) * 0.45);
  color: var(--rs-subtle);
}

.cell__value {
  color: var(--rs-title-color);
  font-weight: 600;
}
</style>
