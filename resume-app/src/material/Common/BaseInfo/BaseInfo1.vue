<!-- 基础资料：姓名 / 联系方式 / 简介居中，头像靠右（经典模板样式） -->
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
import UserInfo1Vue from './components/userInfo/UserInfo1.vue'
import avatar1 from './components/avatar/avatar1.vue'

defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()
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
    width: 100%;

    /* 头像绝对定位靠右，文字块整宽居中，姓名始终落在纸张中线上 */
    &__avatar {
      position: absolute;
      top: 0;
      right: 0;
    }

    &__main {
      box-sizing: border-box;
      width: 100%;
      padding-right: 130px;
      padding-left: 130px;
    }
  }
}
</style>
