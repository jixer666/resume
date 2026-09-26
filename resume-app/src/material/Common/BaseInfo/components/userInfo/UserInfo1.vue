<template>
  <view class="user-info-1-box">
    <text class="user-name">{{ modelData.name }}</text>
    <text v-show="isShow.abstract" class="user-abstract">{{ modelData.abstract }}</text>
    <view class="bottom">
      <view class="meta-list">
        <view v-show="isShow.age" class="meta-item li-border">
          {{ modelData.age }}岁
        </view>
        <view v-show="isShow.address" class="meta-item li-border">
          {{ modelData.address }}
        </view>
        <view v-show="isShow.workService" class="meta-item li-border">
          {{ modelData.workService }}年经验
        </view>
        <view v-show="isShow.phoneNumber" class="meta-item li-border">
          {{ modelData.phoneNumber }}
        </view>
        <view v-show="isShow.email" class="meta-item">
          {{ modelData.email }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

const props = defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()
const isShow = reactive(props.modelData.isShow)
</script>

<style lang="scss" scoped>
  .user-info-1-box {
  .user-name {
    display: block;
    font-size: v-bind('modelStyle.titleFontSize');
    color: v-bind('modelStyle.titleColor');
    font-weight: v-bind('modelStyle.titleFontWeight');
  }
  .user-abstract {
    display: block;
    color: v-bind('modelStyle.textColor');
    font-size: v-bind('modelStyle.textFontSize');
    font-weight: v-bind('modelStyle.textFontWeight');
  }
  .bottom {
    height: 45px;
    display: flex;
    align-items: flex-end;
    .meta-list {
      display: flex;
      .meta-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 20px;
        padding-right: 12px;
        margin-right: 20px;
        font-size: v-bind('modelStyle.textFontSize');
        font-weight: v-bind('modelStyle.textFontWeight');
        color: v-bind('modelStyle.textColor');
      }
      .li-border {
        border-right: 2px solid #b4b4b4;
      }
    }
  }
}
</style>
