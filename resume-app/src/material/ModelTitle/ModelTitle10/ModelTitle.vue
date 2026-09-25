<template>
  <div class="model-title-9-box u-tag-div">
    <!-- 图标 -->
    <div class="title-icon-box u-tag-div">
      <mp-icon :name="iconfont" :color="modelStyle.titleColor" size="30px" />
    </div>
    <div class="title-box u-tag-div">
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
  iconfont: string
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .model-title-9-box {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 10px;
  width: 100%;
  .title-icon-box {
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    position: relative;
    width: 100%;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 35%;
      height: 0;
      border-bottom: 1px dashed #b4b4b4;
      transform: translate(0, -50%);
    }
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 0;
      width: 35%;
      height: 0;
      border-bottom: 1px dashed #b4b4b4;
      transform: translate(0, -50%);
    }
  }
  .title-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .u-tag-h1 {
      font-size: v-bind('modelStyle.firstTitleFontSize');
      color: v-bind('modelStyle.titleColor');
      font-weight: 600;
      letter-spacing: 2px;
    }
  }
}
</style>
