<template>
  <div class="model-title-9-box u-tag-div">
    <div class="title-box u-tag-div">
      <image class="title-bg" src="/static/images/title_bg.png" mode="scaleToFill" />
      <h1 class="u-tag-h1">
        {{ title }}
      </h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  title: string
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .model-title-9-box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
  .title-box {
    width: 200px;
    height: 30px;
    position: relative;
    overflow: hidden;
    display: flex;
    padding-left: 22px;
    align-items: center;
    // 小程序 wxss 不支持本地路径 background-image，改用绝对定位的 <image> 铺底
    .title-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 202px;
      height: 37px;
    }
    .u-tag-h1 {
      position: relative;
      z-index: 1;
      font-size: v-bind('modelStyle.firstTitleFontSize');
      color: v-bind('modelStyle.themeColor');
      font-weight: 600;
      letter-spacing: 2px;
    }
  }
}
</style>
