<script setup lang="ts">
import type { IBaseInfoData, IModelStyle } from '@/schema/types'
import MaterialShell from '../../shared/MaterialShell.vue'

/** 基本信息 2：纯文本信息条，字段以「标签 值」竖排 */
const props = defineProps<{ modelData: IBaseInfoData, modelStyle: IModelStyle }>()

const fields = computed(() => {
  const { modelData: data } = props
  const show = data.isShow
  return [
    { key: 'gender', label: '性别', value: data.gender, visible: show.gender },
    { key: 'age', label: '年龄', value: data.age, visible: show.age },
    { key: 'phoneNumber', label: '电话', value: data.phoneNumber, visible: show.phoneNumber },
    { key: 'email', label: '邮箱', value: data.email, visible: show.email },
    { key: 'address', label: '地址', value: data.address, visible: show.address },
    { key: 'workService', label: '工龄', value: data.workService, visible: show.workService },
    { key: 'degree', label: '学历', value: data.degree, visible: show.degree },
    { key: 'intention', label: '意向', value: data.intention, visible: true },
  ].filter(item => item.visible && item.value)
})
</script>

<template>
  <MaterialShell :model-style="props.modelStyle">
    <text v-if="props.modelData.name" class="name">{{ props.modelData.name }}</text>
    <view v-if="fields.length" class="fields">
      <view v-for="item in fields" :key="item.key" class="field">
        <text class="field__label">{{ item.label }}</text>
        <text class="field__value">{{ item.value }}</text>
      </view>
    </view>
  </MaterialShell>
</template>

<style scoped lang="scss">
.name {
  display: block;
  margin-bottom: calc(var(--rs-text-size) * 0.75);
  color: var(--rs-title-color);
  font-size: var(--rs-2title-size);
  font-weight: var(--rs-title-weight);
  letter-spacing: 0.06em;
}

.fields {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

/* 信息条：字段之间用一个细圆点分隔，比纯空格更能看出边界 */
.field {
  display: flex;
  align-items: baseline;
  margin-right: calc(var(--rs-text-size) * 0.8);
  margin-bottom: calc(var(--rs-text-size) * 0.4);
}

.field + .field::before {
  width: calc(var(--rs-text-size) * 0.18);
  height: calc(var(--rs-text-size) * 0.18);
  margin-right: calc(var(--rs-text-size) * 0.8);
  border-radius: 50%;
  background-color: var(--rs-divider);
  content: '';
  transform: translateY(calc(var(--rs-text-size) * -0.15));
}

.field__label {
  margin-right: calc(var(--rs-text-size) * 0.4);
  color: var(--rs-subtle);
}

.field__value {
  color: var(--rs-text-color);
  font-weight: 600;
}
</style>
