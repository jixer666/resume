<!-- 基础资料文字块：姓名 / 联系方式整块靠左（名片式头部） -->
<template>
  <view class="user-info-2-box">
    <text class="user-info-2-box__name">
      {{ modelData.name }}
    </text>
    <text v-if="metaText" class="user-info-2-box__meta">
      {{ metaText }}
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

/**
 * 联系方式行：只拼接打开的项，用竖线分隔（与版式图一致：电话 | 邮箱）。
 *
 * 与经典皮肤同一条规则 —— 名片皮肤只把文字块整体靠左，行内拼接顺序不变。
 */
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
.user-info-2-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  text-align: left;

  /*
   * 姓名字号沿用经典皮肤的整页节奏变量（默认 26px），
   * 由 ResumeRender 按「整理成一页」的压缩比例下发，两套皮肤压紧时观感一致。
   */
  &__name {
    font-size: var(--rs-name-size, 26px);
    font-weight: 700;
    color: v-bind('modelStyle.titleColor');
  }

  &__meta {
    /* 姓名 → 联系方式：并入模块内统一节奏（见 RenderItem） */
    margin-top: var(--rs-gap-body, 8px);
    font-size: v-bind('modelStyle.textFontSize');
    font-weight: v-bind('modelStyle.textFontWeight');
    color: v-bind('modelStyle.textColor');
  }
}
</style>
