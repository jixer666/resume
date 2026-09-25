<template>
  <div class="model-title-box u-tag-div">
    <div class="title-box u-tag-div">
      <h1 class="u-tag-h1">
        {{ title }}
      </h1>
      <image class="u-tag-img" src="/static/images/j1_span.png" mode="scaleToFill" style="width: 20px; height: 13px" />
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
  .model-title-box {
  width: 100%;
  height: 36px;

  .title-box {
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    padding-right: 15px;
    display: flex;
    align-items: center;
    .u-tag-h1 {
      font-size: v-bind('modelStyle.firstTitleFontSize');
      color: v-bind('modelStyle.themeColor');
      font-weight: 600;

      letter-spacing: 2px;
    }
    .u-tag-img {
      margin-left: 10px;
    }
  }

  .lozenge-1 {
    width: 5px;
    height: 100%;
    background-color: v-bind('modelStyle.themeColor');
    transform: skewX(45deg);
    margin-left: -10px;
  }
  .lozenge-2 {
    width: 10px;
    height: 100%;
    background-color: v-bind('modelStyle.themeColor');
    transform: skewX(45deg);
    margin-left: 5px;
  }
}
</style>
