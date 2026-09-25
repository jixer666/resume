<!-- 模块公共标题 -->
<template>
  <div class="template2-model-title u-tag-div">
    <div class="icon-box u-tag-div">
      <mp-icon :name="iconfont" color="#fff" size="15px" />
    </div>
    <div class="right-title u-tag-div">
      <h1 class="u-tag-h1">
        {{ title }}
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  title: string
  iconfont: string
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .template2-model-title {
  width: 100%;
  display: flex;
  align-items: center;
  .icon-box {
    width: 26px;
    height: 26px;
    background-color: v-bind('modelStyle.themeColor');
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    .mp-icon {
      font-size: 14px;
    }
  }
  .right-title {
    width: 100%;
    border-bottom: 1px solid v-bind('modelStyle.themeColor');
    height: 30px;
    display: flex;
    .u-tag-h1 {
      font-size: v-bind('modelStyle.firstTitleFontSize');
      color: v-bind('modelStyle.themeColor');
    }
  }
}
</style>
