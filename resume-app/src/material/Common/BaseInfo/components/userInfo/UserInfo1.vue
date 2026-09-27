<!-- 基础资料文字块：姓名 / 联系方式 / 简介整块居中（经典模板样式） -->
<template>
  <view class="user-info-1-box">
    <text class="user-info-1-box__name">
      {{ modelData.name }}
    </text>
    <text v-if="metaText" class="user-info-1-box__meta">
      {{ metaText }}
    </text>
    <text v-if="isShow.abstract" class="user-info-1-box__abstract">
      {{ modelData.abstract }}
    </text>
  </view>
</template>

<script lang="ts" setup>
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

const props = defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()
const isShow = reactive(props.modelData.isShow)

/** 联系方式行：只拼接打开的项，用竖线分隔（与版式图一致：电话 | 邮箱） */
const metaText = computed(() => {
  const data = props.modelData
  const show = data.isShow || ({} as IBASEINFO['isShow'])
  const parts: string[] = []
  if (show.phoneNumber && data.phoneNumber)
    parts.push(String(data.phoneNumber))
  if (show.email && data.email)
    parts.push(String(data.email))
  if (show.age && data.age)
    parts.push(`${data.age}岁`)
  if (show.address && data.address)
    parts.push(String(data.address))
  if (show.workService && data.workService)
    parts.push(`${data.workService}年经验`)
  return parts.join(' | ')
})
</script>

<style lang="scss" scoped>
.user-info-1-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  /* 姓名字号是本套皮肤的固定值（版式图约 26px），不跟随正文 / 小标题档位 */
  &__name {
    font-size: 26px;
    font-weight: 700;
    color: v-bind('modelStyle.titleColor');
  }

  &__meta {
    margin-top: 10px;
    font-size: v-bind('modelStyle.textFontSize');
    font-weight: v-bind('modelStyle.textFontWeight');
    color: v-bind('modelStyle.textColor');
  }

  &__abstract {
    margin-top: 6px;
    font-size: v-bind('modelStyle.textFontSize');
    font-weight: v-bind('modelStyle.textFontWeight');
    color: v-bind('modelStyle.textColor');
  }
}
</style>
