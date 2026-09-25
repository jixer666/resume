<template>
  <div class="base-info-common-2-box u-tag-div">
    <!-- 个人头像 -->
    <div class="avatar-wrapper u-tag-div">
      <avatar1 :model-data="modelData" :model-style="modelStyle" />
    </div>
    <!-- 个人信息 -->
    <user-info2-vue :model-data="modelData" :model-style="modelStyle" />
  </div>
</template>

<script lang="ts" setup>
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import avatar1 from './components/avatar/avatar1.vue'
import UserInfo2Vue from './components/userInfo/UserInfo2.vue'

defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .base-info-common-2-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-bottom: v-bind('modelStyle.mBottom');
  margin-top: v-bind('modelStyle.mTop');

  .avatar-wrapper {
    margin-bottom: 30px;
    :deep(.avatar-box) {
      margin-right: 0;
    }
  }
}
</style>
