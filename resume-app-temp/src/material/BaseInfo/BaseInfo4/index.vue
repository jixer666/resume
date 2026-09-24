<script setup lang="ts">
import type { IBaseInfoData, IModelStyle } from '@/schema/types'
import MaterialShell from '../../shared/MaterialShell.vue'

/**
 * 基本信息 4：横幅名片。整块主题色横幅铺满纸张宽度，头像 + 反白姓名 + 浅色摘要，
 * 对应 banner / split 封面里「顶部大色带承载身份信息」的版式。
 *
 * 页面留白在容器上，这里用负 margin 抵消上下与左右留白实现满铺出血，
 * 横幅自己的内边距承担内容与纸张边缘的呼吸感。
 */
const props = defineProps<{ modelData: IBaseInfoData, modelStyle: IModelStyle }>()

const hasAvatar = computed(() => props.modelData.isShow.avatar && !!props.modelData.avatar)

/** 横幅摘要：意向在前，其余按 isShow 拼接 */
const summary = computed(() => {
  const { modelData: data, modelData: { isShow: show } } = props
  return [
    data.intention,
    show.phoneNumber ? data.phoneNumber : '',
    show.email ? data.email : '',
    show.address ? data.address : '',
  ].filter(Boolean).join(' · ')
})
</script>

<template>
  <MaterialShell
    :model-style="props.modelStyle"
    :style="{
      marginTop: 'calc(var(--rs-pt) * -1)',
      marginLeft: 'calc(var(--rs-px) * -1)',
      marginRight: 'calc(var(--rs-px) * -1)',
    }"
  >
    <view class="banner">
      <image v-if="hasAvatar" class="banner__avatar" :src="props.modelData.avatar" mode="aspectFill" />
      <view class="banner__body">
        <text v-if="props.modelData.name" class="banner__name">{{ props.modelData.name }}</text>
        <text v-if="summary" class="banner__summary">{{ summary }}</text>
      </view>
    </view>
  </MaterialShell>
</template>

<style scoped lang="scss">
.banner {
  display: flex;
  align-items: center;
  padding: calc(var(--rs-text-size) * 1.7) var(--rs-px);
  background-color: var(--rs-theme);
}

.banner__avatar {
  width: calc(var(--rs-text-size) * 5.8);
  height: calc(var(--rs-text-size) * 5.8);
  flex: none;
  margin-right: calc(var(--rs-text-size) * 1.4);
  border: calc(var(--rs-text-size) * 0.18) solid rgb(255 255 255 / 35%);
  border-radius: 50%;
  background-color: rgb(255 255 255 / 25%);
}

.banner__body {
  min-width: 0;
  flex: 1;
}

.banner__name {
  display: block;
  color: #ffffff;
  font-size: calc(var(--rs-2title-size) * 1.7);
  font-weight: var(--rs-title-weight);
  letter-spacing: 0.08em;
  line-height: 1.3;
}

.banner__summary {
  display: block;
  margin-top: calc(var(--rs-text-size) * 0.45);
  color: rgb(255 255 255 / 78%);
  letter-spacing: 0.02em;
}
</style>
