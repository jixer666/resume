<script setup lang="ts">
import type { IModelStyle, ISkillSpecialtiesData } from '@/schema/types'
import { isEmptyHtml, plainToHtml } from '@/schema/modelData'
import MaterialShell from '../../shared/MaterialShell.vue'
import SectionTitle from '../../shared/SectionTitle.vue'

/** 技能特长 1：熟练度进度条 */
const props = defineProps<{ modelData: ISkillSpecialtiesData, modelStyle: IModelStyle }>()

/** 把「精通 / 熟练 / 了解」等描述归一成 0~100 的百分比 */
function toPercent(proficiency: string): number {
  const text = String(proficiency || '').trim()
  const num = Number.parseFloat(text)
  if (!Number.isNaN(num))
    return Math.max(0, Math.min(100, num))
  if (/精通|专家|expert/i.test(text))
    return 95
  if (/熟练|proficient/i.test(text))
    return 80
  if (/掌握|良好|熟悉|familiar/i.test(text))
    return 65
  if (/了解|基础|入门|basic/i.test(text))
    return 45
  return 70
}

const list = computed(() => props.modelData.LIST.filter(item => item.skillName))
</script>

<template>
  <MaterialShell :model-style="props.modelStyle">
    <SectionTitle v-if="props.modelData.title" :title="props.modelData.title" :model-style="props.modelStyle" />
    <view v-for="(item, i) in list" :key="i" class="skill">
      <view class="skill__head">
        <text class="skill__name">{{ item.skillName }}</text>
        <text v-if="item.proficiency" class="skill__level">{{ item.proficiency }}</text>
      </view>
      <view class="skill__bar">
        <view class="skill__fill" :style="{ width: `${toPercent(item.proficiency)}%` }" />
      </view>
      <fg-rich-view v-if="item.introduce && !isEmptyHtml(item.introduce)" class="skill__desc" :html="plainToHtml(item.introduce)" />
    </view>
  </MaterialShell>
</template>

<style scoped lang="scss">
.skill {
  padding: var(--rs-entry-pad);
  border: var(--rs-entry-border);
  border-left: var(--rs-entry-accent);
  border-radius: var(--rs-entry-radius);
  background-color: var(--rs-entry-bg);
}

.skill + .skill {
  margin-top: var(--rs-entry-gap);
  padding-top: var(--rs-entry-pad-top);
  border-top: var(--rs-entry-line);
}

.skill__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.skill__name {
  color: var(--rs-title-color);
  font-weight: 600;
}

.skill__level {
  flex: none;
  margin-left: calc(var(--rs-text-size) * 0.6);
  color: var(--rs-theme);
  font-size: calc(var(--rs-text-size) * 0.9);
}

/* 进度轨道用极浅主题底，填充用实心主题色，一眼能读出熟练度落差 */
.skill__bar {
  height: calc(var(--rs-text-size) * 0.3);
  margin-top: calc(var(--rs-text-size) * 0.4);
  border-radius: var(--rs-radius-pill);
  background-color: var(--rs-accent-soft);
}

.skill__fill {
  height: 100%;
  border-radius: var(--rs-radius-pill);
  background-color: var(--rs-mark);
}

.skill__desc {
  display: block;
  margin-top: calc(var(--rs-text-size) * 0.35);
  color: var(--rs-muted);
}
</style>
