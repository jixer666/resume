<!-- 基础资料文字块：姓名在侧栏居中，联系方式小标题 / 电话邮箱靠左，白字（蓝色侧栏样式） -->
<template>
  <view class="user-info-3-box">
    <text class="user-info-3-box__name">
      {{ modelData.name }}
    </text>
    <!-- 侧栏的联系方式块自带小标题：模块标题「基本资料」在侧栏里换成「联系方式」 -->
    <text class="user-info-3-box__heading">
      联系方式
    </text>
    <view class="user-info-3-box__contacts u-tag-div">
      <view v-if="isShow.phoneNumber && modelData.phoneNumber" class="user-info-3-box__row">
        <text class="user-info-3-box__label">
          电话：
        </text>
        <text class="user-info-3-box__value">
          {{ modelData.phoneNumber }}
        </text>
      </view>
      <view v-if="isShow.email && modelData.email" class="user-info-3-box__row">
        <text class="user-info-3-box__label">
          邮箱：
        </text>
        <text class="user-info-3-box__value">
          {{ modelData.email }}
        </text>
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
.user-info-3-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  width: 100%;

  /* 照片 → 姓名：按版式图（照片 100 x 120）量出来的 19px */
  &__name {
    /* 姓名与侧栏中线对齐（头像的居中见 BaseInfo3）；联系方式整宽，行内仍靠左 */
    align-self: center;
    margin-top: 19px;
    font-size: 18px;
    font-weight: 400;
    color: #ffffff;
  }

  /* 姓名 → 联系方式小标题：按版式图量出来的 37px */
  &__heading {
    margin-top: 37px;
    font-size: v-bind('modelStyle.firstTitleFontSize');
    font-weight: 700;
    color: #ffffff;
  }

  &__contacts {
    display: flex;
    flex-direction: column;
    width: 100%;
    /* 小标题 → 首个联系方式：版式图约 6px，侧栏不参与整页压缩，写死 */
    margin-top: 6px;
  }

  &__row {
    display: flex;
    align-items: baseline;
    line-height: 1.7;

    &:not(:first-child) {
      /* 联系方式行距：版式图约 6px，邮箱这类长串换行后两行不会挤在一起 */
      margin-top: 6px;
    }
  }

  &__label {
    flex: none;
    font-size: v-bind('modelStyle.textFontSize');
    font-weight: v-bind('modelStyle.textFontWeight');
    color: rgb(255 255 255 / 72%);
  }

  &__value {
    min-width: 0;
    font-size: v-bind('modelStyle.textFontSize');
    font-weight: v-bind('modelStyle.textFontWeight');
    color: #ffffff;
    /* 侧栏只有 150px 宽，邮箱这类长串要能断行，不能撑破侧栏 */
    word-break: break-all;
  }
}
</style>
