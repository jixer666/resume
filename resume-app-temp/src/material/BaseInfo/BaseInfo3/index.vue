<script setup lang="ts">
import type { IBaseInfoData, IModelStyle } from '@/schema/types'
import MaterialShell from '../../shared/MaterialShell.vue'

/**
 * 基本信息 3：居中名片。头像、姓名居中，字段摘要压成一行副标题，
 * 对应 classic / formal / minimal 等封面里「居中头像 + 居中姓名」的头部版式。
 */
const props = defineProps<{ modelData: IBaseInfoData, modelStyle: IModelStyle }>()

/** 副标题摘要：意向优先，其余按 isShow 拼接，与封面里的居中副标题对应 */
const summary = computed(() => {
  const { modelData: data, modelData: { isShow: show } } = props
  return [
    data.intention,
    show.phoneNumber ? data.phoneNumber : '',
    show.email ? data.email : '',
    show.address ? data.address : '',
    show.gender ? data.gender : '',
    show.age ? data.age : '',
  ].filter(Boolean).join(' · ')
})

const hasAvatar = computed(() => props.modelData.isShow.avatar && !!props.modelData.avatar)
</script>

<template>
  <MaterialShell :model-style="props.modelStyle">
    <view class="centered">
      <image v-if="hasAvatar" class="centered__avatar" :src="props.modelData.avatar" mode="aspectFill" />
      <text v-if="props.modelData.name" class="centered__name">{{ props.modelData.name }}</text>
      <text v-if="summary" class="centered__summary">{{ summary }}</text>
      <view class="centered__rule" />
    </view>
  </MaterialShell>
</template>

<style scoped lang="scss">
.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.centered__avatar {
  width: calc(var(--rs-text-size) * 6.2);
  height: calc(var(--rs-text-size) * 6.2);
  border: 1px solid var(--rs-divider);
  border-radius: var(--rs-avatar-radius);
  background-color: var(--rs-card-bg);
}

.centered__name {
  margin-top: calc(var(--rs-text-size) * 0.9);
  color: var(--rs-title-color);
  font-size: var(--rs-hero-size);
  font-weight: var(--rs-title-weight);
  letter-spacing: 0.14em;
  /* 字距会在末字后留白，补一个等量左缩进让姓名视觉居中 */
  text-indent: 0.14em;
  line-height: 1.25;
}

.centered__summary {
  margin-top: calc(var(--rs-text-size) * 0.55);
  color: var(--rs-theme);
  letter-spacing: 0.02em;
}

.centered__rule {
  width: calc(var(--rs-text-size) * 12);
  height: calc(var(--rs-text-size) * 0.55);
  min-height: 3px;
  margin-top: calc(var(--rs-text-size) * 0.75);
  border-radius: var(--rs-radius-pill);
  background-color: var(--rs-accent-soft);
}
</style>
