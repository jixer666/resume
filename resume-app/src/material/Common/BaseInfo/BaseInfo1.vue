<!-- 基础资料：姓名 / 联系方式居中，头像靠右（经典模板样式） -->
<template>
  <view class="base-info-common-1-box u-tag-div">
    <view class="user-info u-tag-div">
      <view class="user-info__avatar u-tag-div">
        <avatar1 :model-data="modelData" :model-style="modelStyle" />
      </view>
      <view class="user-info__main u-tag-div">
        <user-info1-vue :model-data="modelData" :model-style="modelStyle" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { pxTonumber } from '@/utils/common'
import UserInfo1Vue from './components/userInfo/UserInfo1.vue'
import avatar1 from './components/avatar/avatar1.vue'

const props = defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 头像默认宽（与 avatar1.vue 的兜底值一致）：模块没设过头像尺寸时文字块按它留位 */
const AVATAR_DEFAULT_WIDTH = 84
/** 文字块与头像之间的间隙 */
const AVATAR_GAP = 28

/**
 * 头部最小高度：头像打开时按头像高度留白，头像关掉后回到文字块自身高度。
 *
 * 头像绝对定位靠右（姓名才能始终落在纸张中线上），不占文档流；这里不留高度的话，
 * 头像会越过模块下边界，压到下一个模块的小标题条上。
 */
const headerMinHeight = computed(() => (props.modelData.isShow?.avatar ? (props.modelStyle?.avatarHeight || '100px') : '0px'))

/**
 * 文字块左右内边距：左右对称留出头像的位置（头像宽 + 间隙），姓名始终落在纸张中线上。
 *
 * 头像尺寸进了「整理成一页」的压缩字段（见 store.FIT_MODULE_KEYS），
 * 这里跟着一起收，否则头像压小了、文字块还窄着，两边会空出一大块。
 */
const sidePadding = computed(() => `${(pxTonumber(props.modelStyle?.avatarWidth) || AVATAR_DEFAULT_WIDTH) + AVATAR_GAP}px`)
</script>

<style lang="scss" scoped>
.base-info-common-1-box {
  box-sizing: border-box;
  width: 100%;
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-top: v-bind('modelStyle.mTop');
  margin-bottom: v-bind('modelStyle.mBottom');

  .user-info {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    /* 头部高度跟着头像走，头像不再压到下一个模块的小标题条 */
    min-height: v-bind(headerMinHeight);

    /* 头像绝对定位靠右，文字块整宽居中，姓名始终落在纸张中线上 */
    &__avatar {
      position: absolute;
      top: 0;
      right: 0;
    }

    &__main {
      box-sizing: border-box;
      width: 100%;
      /* 左右对称留出头像的位置，文字块整体仍然居中 */
      padding-right: v-bind('sidePadding');
      padding-left: v-bind('sidePadding');
    }
  }
}
</style>
