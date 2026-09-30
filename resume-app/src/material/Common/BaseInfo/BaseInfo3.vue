<!-- 基础资料：头像与姓名在侧栏居中，联系方式靠左，白字（蓝色侧栏样式） -->
<template>
  <view class="base-info-common-3-box u-tag-div">
    <view class="user-info u-tag-div">
      <view v-show="isShow.avatar" class="user-info__avatar u-tag-div">
        <avatar1 :model-data="modelData" :model-style="modelStyle" />
      </view>
      <user-info3-vue :model-data="modelData" :model-style="modelStyle" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import UserInfo3Vue from './components/userInfo/UserInfo3.vue'
import avatar1 from './components/avatar/avatar1.vue'

const props = defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()
const isShow = reactive(props.modelData.isShow)
</script>

<style lang="scss" scoped>
.base-info-common-3-box {
  box-sizing: border-box;
  width: 100%;
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-top: v-bind('modelStyle.mTop');
  margin-bottom: v-bind('modelStyle.mBottom');

  .user-info {
    display: flex;
    flex-direction: column;
    /* 头像在侧栏里左右居中（姓名见 UserInfo3），不居中会显得整块贴着侧栏左边 */
    align-items: center;
    box-sizing: border-box;
    width: 100%;

    /*
     * 头像与侧栏顶边的留白：模块上内边距与模板一统一成 12px 后，这里补到 62px，
     * 头像与侧栏顶边仍是版式图的约 74px（12 + 62），侧栏版面不跟着模板预设变小。
     *
     * 侧栏是模板的固定版面：照片 / 姓名 / 联系方式的纵向排布按版式图定死，
     * 不参与「整理成一页」的纵向压缩。
     */
    &__avatar {
      margin-top: 62px;
    }
  }
}
</style>
