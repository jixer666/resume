<!-- 基础资料·左侧栏名片：白框竖版头像 + 白色姓名 + 联系方式，白字直接压在栏底色上 -->
<template>
  <div class="base-info-11-box u-tag-div">
    <div v-show="modelData.isShow.avatar" class="side-avatar u-tag-div" :style="avatarStyle">
      <image class="side-avatar__pic" :src="modelData.avatar || defaultImg" mode="aspectFill" />
    </div>
    <h1 class="side-name u-tag-h1">
      {{ modelData.name }}
    </h1>
    <div v-show="modelData.isShow.phoneNumber || modelData.isShow.email" class="side-block u-tag-div">
      <!-- 数据里的 title 是「基本资料」，而侧栏版式的这一段承载的是联系方式，按版式写死 -->
      <h2 class="side-block__title u-tag-h2">
        联系方式
      </h2>
      <p v-show="modelData.isShow.phoneNumber" class="side-block__line u-tag-p">
        电话：{{ modelData.phoneNumber }}
      </p>
      <p v-show="modelData.isShow.email" class="side-block__line u-tag-p">
        邮箱：{{ modelData.email }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import defaultImg from '@img/people.jpg'

const props = defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()

const avatarStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.modelStyle?.avatarWidth)
    style.width = props.modelStyle.avatarWidth
  if (props.modelStyle?.avatarHeight)
    style.height = props.modelStyle.avatarHeight
  return style
})
</script>

<style lang="scss" scoped>
  .base-info-11-box {
  width: 100%;
  box-sizing: border-box;
  /* 栏顶这块留白只有左栏第一名片需要，写死在这里而不是借全局 pTop：
     pTop 会同时把右栏每个章节一起顶下去 */
  padding-top: 74px;
  padding-bottom: 8px;
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-top: v-bind('modelStyle.mTop');
  margin-bottom: v-bind('modelStyle.mBottom');

  .side-avatar {
    width: 102px;
    height: 121px;
    box-sizing: border-box;
    border: 3px solid #fff;
    border-radius: 4px;
    overflow: hidden;
    background-color: rgb(255 255 255 / 25%);
  }
  .side-avatar__pic {
    width: 100%;
    height: 100%;
    display: block;
  }
  .side-name {
    margin-top: 25px;
    /* 姓名字号在全局面板里没有对应项，按侧栏比例固定 */
    font-size: 22px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: 1px;
    color: #fff;
  }
  .side-block {
    margin-top: 41px;
    &__title {
      font-size: v-bind('modelStyle.firstTitleFontSize');
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: 1px;
      color: #fff;
    }
    &__line {
      margin-top: 13px;
      font-size: 13px;
      font-weight: 400;
      line-height: 1.6;
      color: #fff;
      word-break: break-all;
    }
  }
}
</style>
