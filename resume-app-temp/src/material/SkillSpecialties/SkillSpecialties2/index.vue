<script setup lang="ts">
import type { IModelStyle, ISkillSpecialtiesData } from '@/schema/types'
import MaterialShell from '../../shared/MaterialShell.vue'
import SectionTitle from '../../shared/SectionTitle.vue'

/** 技能特长 2：标签墙 */
const props = defineProps<{ modelData: ISkillSpecialtiesData, modelStyle: IModelStyle }>()

const list = computed(() => props.modelData.LIST.filter(item => item.skillName))
</script>

<template>
  <MaterialShell :model-style="props.modelStyle">
    <SectionTitle v-if="props.modelData.title" :title="props.modelData.title" :model-style="props.modelStyle" />
    <view class="wall">
      <view v-for="(item, i) in list" :key="i" class="tag">
        <text class="tag__name">{{ item.skillName }}</text>
        <text v-if="item.proficiency" class="tag__level">{{ item.proficiency }}</text>
      </view>
    </view>
  </MaterialShell>
</template>

<style scoped lang="scss">
.wall {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--rs-text-size) * 0.5);
}

/* 标签墙：浅底 + 细描边，比整圈实心主题色描边更透气 */
.tag {
  display: flex;
  align-items: baseline;
  padding: calc(var(--rs-text-size) * 0.25) calc(var(--rs-text-size) * 0.85);
  border: 1px solid var(--rs-accent-line);
  border-radius: var(--rs-radius-pill);
  background-color: var(--rs-card-bg);
}

.tag__name {
  color: var(--rs-title-color);
  font-weight: 600;
}

.tag__level {
  margin-left: calc(var(--rs-text-size) * 0.4);
  color: var(--rs-muted);
  font-size: calc(var(--rs-text-size) * 0.85);
}
</style>
