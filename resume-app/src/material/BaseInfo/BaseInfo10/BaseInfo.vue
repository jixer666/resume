<!-- 基础资料·通栏名片带：顶部细主题色线 + 浅主题色渐变底，头像与姓名居中 -->
<template>
  <div class="base-info-10-box u-tag-div">
    <div class="banner u-tag-div">
      <div class="banner-texture u-tag-div" />
      <div class="banner-content u-tag-div">
        <div v-show="isShow.avatar" class="banner-avatar u-tag-div">
          <circle-avatar
            :model-data="modelData"
            :width="modelStyle?.avatarWidth || '104px'"
            :height="modelStyle?.avatarHeight || '104px'"
          />
        </div>
        <h1 class="banner-name u-tag-h1">
          {{ modelData.name }}
        </h1>
        <div v-show="isShow.phoneNumber || isShow.email" class="banner-contact u-tag-div">
          <span v-show="isShow.phoneNumber" class="u-tag-span">{{ modelData.phoneNumber }}</span>
          <span v-show="isShow.phoneNumber && isShow.email" class="contact-sep u-tag-span">|</span>
          <span v-show="isShow.email" class="u-tag-span">{{ modelData.email }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed, reactive } from 'vue'
import CircleAvatar from '@/material/Avatar/CircleAvatar.vue'
import { lightenColor } from '@/schema/templates'

const props = defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()

const isShow = reactive(props.modelData.isShow)

/**
 * 底色用「主题色兑白」而不是半透明：小程序端不支持本地图片背景，
 * 纯 CSS 渐变是唯一能落地的浅色衬底，兑白出来的色值不带逗号，也免去 var 传 rgba 的兼容风险。
 */
const bannerFrom = computed(() => lightenColor(props.modelStyle.themeColor, 0.86))
const bannerTo = computed(() => lightenColor(props.modelStyle.themeColor, 0.98))
const textureDot = computed(() => lightenColor(props.modelStyle.themeColor, 0.6))
</script>

<style lang="scss" scoped>
  .base-info-10-box {
  width: 100%;
  box-sizing: border-box;
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-top: v-bind('modelStyle.mTop');
  margin-bottom: v-bind('modelStyle.mBottom');

  .banner {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    border-top: 3px solid v-bind('modelStyle.themeColor');
    background: linear-gradient(170deg, v-bind('bannerFrom') 0%, v-bind('bannerTo') 70%, #fff 100%);
  }
  /* 顶部圆点纹理：纯装饰层，径向渐变不被支持时只会不显示，不破坏布局 */
  .banner-texture {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 96px;
    background-image: radial-gradient(circle, v-bind('textureDot') 1.5px, transparent 1.5px);
    background-size: 16px 16px;
  }
  .banner-content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 26px 24px 24px;
  }
  .banner-avatar {
    margin-bottom: 14px;
  }
  .banner-name {
    /* 姓名字号在全局面板里没有对应项（一级标题只有 20px 上下），按横幅比例固定 */
    font-size: 26px;
    font-weight: 700;
    color: v-bind('modelStyle.titleColor');
    letter-spacing: 1px;
    margin-bottom: 10px;
  }
  .banner-contact {
    display: flex;
    align-items: center;
    font-size: v-bind('modelStyle.textFontSize');
    color: v-bind('modelStyle.textColor');
    .contact-sep {
      margin: 0 10px;
      color: v-bind('modelStyle.themeColor');
    }
  }
}
</style>
