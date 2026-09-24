<script setup lang="ts">
import type { IBaseInfoData, IModelStyle } from '@/schema/types'
import MaterialShell from '../../shared/MaterialShell.vue'

/** 基本信息 1：左头像 + 右字段网格，只渲染 isShow 打开的字段 */
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

const hasAvatar = computed(() => props.modelData.isShow.avatar && !!props.modelData.avatar)
const hasAbstract = computed(() => props.modelData.isShow.abstract && !!props.modelData.abstract)
</script>

<template>
  <MaterialShell :model-style="props.modelStyle">
    <view class="base" :class="{ 'base--no-avatar': !hasAvatar }">
      <image v-if="hasAvatar" class="base__avatar" :src="props.modelData.avatar" mode="aspectFill" />
      <view class="base__body">
        <text v-if="props.modelData.name" class="base__name">{{ props.modelData.name }}</text>
        <view v-if="fields.length" class="base__fields">
          <view v-for="item in fields" :key="item.key" class="base__field">
            <text class="base__label">{{ item.label }}</text>
            <text class="base__value">{{ item.value }}</text>
          </view>
        </view>
        <text v-if="hasAbstract" class="base__abstract">{{ props.modelData.abstract }}</text>
      </view>
    </view>
  </MaterialShell>
</template>

<style scoped lang="scss">
.base {
  display: flex;
  align-items: flex-start;
}

/* 头像：底色用极浅的主题色，边界交给分隔线，避免与下方字段底块撞色 */
.base__avatar {
  width: calc(var(--rs-text-size) * 5.6);
  height: calc(var(--rs-text-size) * 5.6);
  flex: none;
  margin-right: calc(var(--rs-text-size) * 1.15);
  border: 1px solid var(--rs-divider);
  border-radius: var(--rs-avatar-radius);
  background-color: var(--rs-card-bg);
}

.base__body {
  min-width: 0;
  flex: 1;
}

.base__name {
  display: block;
  color: var(--rs-title-color);
  font-size: var(--rs-2title-size);
  font-weight: var(--rs-title-weight);
  letter-spacing: 0.06em;
}

.base__fields {
  display: flex;
  flex-wrap: wrap;
  margin-top: calc(var(--rs-text-size) * 0.6);
}

.base__field {
  display: flex;
  align-items: baseline;
  min-width: 50%;
  margin-bottom: calc(var(--rs-text-size) * 0.35);
}

/* 字段标签用弱化色 + 固定宽度，让同一列的冒号后内容对齐 */
.base__label {
  flex: none;
  width: calc(var(--rs-text-size) * 2.6);
  margin-right: calc(var(--rs-text-size) * 0.2);
  color: var(--rs-subtle);
}

.base__value {
  color: var(--rs-text-color);
  word-break: break-all;
}

.base__abstract {
  display: block;
  margin-top: calc(var(--rs-text-size) * 0.6);
  color: var(--rs-muted);
}
</style>
