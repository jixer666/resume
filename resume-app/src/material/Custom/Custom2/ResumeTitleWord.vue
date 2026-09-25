<template>
  <div class="resume-title-word-box u-tag-div">
    <div class="top u-tag-div">
      <div class="left u-tag-div">
        <h1 class="u-tag-h1">
          {{ modelData.name }}
        </h1>
        <p class="u-tag-p">
          <RichTextView :html="modelData.abstract" :model-style="modelStyle" />
        </p>
      </div>
      <div class="right u-tag-div">
        <div class="icon-box u-tag-div">
          <mp-icon
            name="icon-education-1-copy"
            class="icon"
            color="#fff"
            size="22px"
          />
        </div>
        <div class="icon-box u-tag-div">
          <mp-icon name="icon-rongyu" class="icon" color="#fff" size="22px" />
        </div>
        <div class="icon-box u-tag-div">
          <mp-icon
            name="icon-ziwopingjia"
            class="icon"
            color="#fff"
            size="22px"
          />
        </div>
      </div>
    </div>
    <div class="bottom u-tag-div">
      <div class="left u-tag-div" />
      <div class="right u-tag-div" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ICUSTOM2 } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: ICUSTOM2
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .resume-title-word-box {
  box-sizing: border-box;
  margin-bottom: v-bind('modelStyle.mBottom');
  margin-top: v-bind('modelStyle.mTop');
  display: flex;
  flex-direction: column;
  .top {
    width: 100%;
    cursor: pointer;
    padding-top: v-bind('modelStyle.pTop');
    padding-bottom: v-bind('modelStyle.pBottom');
    padding-left: v-bind('modelStyle.pLeftRight');
    padding-right: v-bind('modelStyle.pLeftRight');
    display: flex;
    box-sizing: border-box;
    flex: 1;
    .left {
      display: flex;
      align-items: center;
      .u-tag-h1 {
        font-size: v-bind('modelStyle.titleFontSize');
        font-weight: v-bind('modelStyle.titleFontWeight');
        color: v-bind('modelStyle.titleColor');
        padding: 0 15px 0 0;
        position: relative;
        border-right: 4px solid v-bind('modelStyle.titleColor');
        display: flex;
        align-items: center;
        font-family: monospace;
        margin-right: 15px;
      }
      .u-tag-p {
        font-size: v-bind('modelStyle.textFontSize');
        font-weight: v-bind('modelStyle.textFontWeight');
        color: v-bind('modelStyle.textColor');
        font-family: monospace;
      }
    }
    .right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .icon-box {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: v-bind('modelStyle.themeColor');
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 20px;
      }
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      height: 30px;
      width: 60%;
      background-color: v-bind('modelStyle.themeColor');
      background: linear-gradient(-45deg, transparent 20px, v-bind('modelStyle.themeColor') 0) top right;
    }
    .right {
      height: 25px;
      flex: 1;
      background-color: #74a274;
      background: linear-gradient(135deg, transparent 18px, #74a274 0) top left;
    }
  }
}
</style>
