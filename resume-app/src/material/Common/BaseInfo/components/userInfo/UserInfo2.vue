<template>
  <div class="user-info u-tag-div">
    <ul class="u-tag-ul">
      <li v-show="isShow.age" class="li-border u-tag-li">
        <mp-icon name="icon-renwu-ren" color="#fff" />
        <span class="u-tag-span">{{ modelData.age }}岁</span>
      </li>
      <li v-show="isShow.address" class="li-border u-tag-li">
        <mp-icon name="icon-dizhi" color="#fff" size="16px" />
        <span class="u-tag-span">{{ modelData.address }}</span>
      </li>
      <li v-show="isShow.workService" class="li-border u-tag-li">
        <mp-icon name="icon-gongzuojingyan" color="#fff" />
        <span class="u-tag-span">{{ modelData.workService }}年经验</span>
      </li>
      <li v-show="isShow.phoneNumber" class="li-border u-tag-li">
        <mp-icon name="icon-dianhua1" color="#fff" />
        <span class="u-tag-span">{{ modelData.phoneNumber }}</span>
      </li>
      <li v-show="isShow.email" class="u-tag-li">
        <mp-icon name="icon-youxiang" color="#fff" />
        <span class="u-tag-span">{{ modelData.email }}</span>
      </li>
    </ul>
  </div>
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
  .user-info {
  width: 100%;
  .u-tag-ul {
    display: flex;
    flex-direction: column;
    .u-tag-li {
      height: 35px;
      display: flex;
      align-items: center;
      list-style: none;
      color: v-bind('modelStyle.textColor');
      font-size: v-bind('modelStyle.textFontSize');
      font-weight: v-bind('modelStyle.textFontWeight');
      & :first-child {
        margin-right: 10px;
      }
      .u-tag-span {
        letter-spacing: 2px;
      }
    }
  }
}
</style>
