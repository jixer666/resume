<!-- 基础资料：姓名 / 联系方式靠左，头像靠右（名片式头部） -->
<template>
  <view class="base-info-common-2-box u-tag-div">
    <view class="user-info u-tag-div">
      <view class="user-info__main u-tag-div">
        <user-info2-vue :model-data="modelData" :model-style="modelStyle" />
      </view>
      <view class="user-info__avatar u-tag-div">
        <avatar1 :model-data="modelData" :model-style="modelStyle" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import UserInfo2Vue from './components/userInfo/UserInfo2.vue'
import avatar1 from './components/avatar/avatar1.vue'

defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()

/**
 * 文字块与头像之间的最小间隙：文字块吃掉剩余宽度，姓名短的时候不至于贴到照片上。
 *
 * 头像尺寸不在「整理成一页」的压缩字段里，这里给固定值，压缩时只收纵向留白。
 */
const AVATAR_GAP = 24

/** 间隙值：SCSS 的 v-bind 只认响应式引用，这里包一层 computed */
const avatarGap = computed(() => `${AVATAR_GAP}px`)
</script>

<style lang="scss" scoped>
.base-info-common-2-box {
  box-sizing: border-box;
  width: 100%;
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-top: v-bind('modelStyle.mTop');
  margin-bottom: v-bind('modelStyle.mBottom');

  .user-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    /* 文字块整宽靠左，头像靠右顶到版心边缘（与经典皮肤的头像落点一致） */
    &__main {
      min-width: 0;
      flex: 1;
    }

    /* 头像在文档流里，头部高度自然取文字块与头像的较高者，不用再补最小高度 */
    &__avatar {
      margin-left: v-bind(avatarGap);
      flex: none;
    }
  }
}
</style>
