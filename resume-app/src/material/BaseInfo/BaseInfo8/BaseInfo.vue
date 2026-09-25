<template>
  <div class="base-info-8-box u-tag-div">
    <image class="base-info-8-bg" src="/static/images/china-head_bg.png" mode="scaleToFill" />
    <div class="base-info-8-content">
      <base-info1-vue :model-data="modelData" :model-style="modelStyle" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import BaseInfo1Vue from '@/material/Common/BaseInfo/BaseInfo1.vue'

defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .base-info-8-box {
  position: relative;
  height: 236px;
  // 小程序 wxss 不支持本地路径 background-image，改用绝对定位的 <image> 铺底
  .base-info-8-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .base-info-8-content {
    position: relative;
    z-index: 1;
  }
}
</style>
