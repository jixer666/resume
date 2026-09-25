<template>
  <view class="model-title-box">
    <view class="icon-box">
      <mp-icon :name="iconfont" color="#fff" size="18px" />
    </view>
    <view class="right-title">
      <text class="title">{{ title }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type IMODELSTYLE from '@/interface/modelStyle'
import RESUME_JSON from '@/schema/resume'

// 皮肤只传 title / iconfont，主题色与字号由父级把 modelStyle 透传进来；
// 未透传时回退到默认主题，避免硬编码颜色散落在组件里。
const props = withDefaults(
  defineProps<{
    title?: string
    iconfont?: string
    modelStyle?: IMODELSTYLE
  }>(),
  {
    title: '',
    iconfont: '',
    modelStyle: undefined,
  },
)

const themeColor = computed(() => props.modelStyle?.themeColor || RESUME_JSON.GLOBAL_STYLE.themeColor)
const firstTitleFontSize = computed(
  () => props.modelStyle?.firstTitleFontSize || RESUME_JSON.GLOBAL_STYLE.firstTitleFontSize,
)
</script>

<style lang="scss" scoped>
  .model-title-box {
  display: flex;
  align-items: center;
  position: relative;
  left: -30px;
  .icon-box {
    background: v-bind('themeColor');
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }
  .right-title {
    .title {
      font-size: v-bind('firstTitleFontSize');
      color: v-bind('themeColor');
    }
  }
}
</style>
