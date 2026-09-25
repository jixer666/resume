<template>
  <div class="user-info u-tag-div">
    <div class="head u-tag-div">
      <h1 class="u-tag-h1">
        {{ modelData.name }}
      </h1>
      <p v-show="isShow.abstract" class="u-tag-p">
        <RichTextView :html="modelData.abstract" :model-style="modelStyle" />
      </p>
    </div>
    <div class="detail u-tag-div">
      <ul class="u-tag-ul">
        <li v-show="isShow.age" class="li-border u-tag-li">
          {{ modelData.age }}岁
        </li>
        <li v-show="isShow.address" class="li-border u-tag-li">
          {{ modelData.address }}
        </li>
        <li v-show="isShow.workService" class="li-border u-tag-li">
          {{ modelData.workService }}年经验
        </li>
        <li v-show="isShow.phoneNumber" class="li-border u-tag-li">
          {{ modelData.phoneNumber }}
        </li>
        <li v-show="isShow.email" class="u-tag-li">
          {{ modelData.email }}
        </li>
      </ul>
    </div>
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .head {
    display: flex;
    justify-content: center;
    flex-direction: column;
    .u-tag-h1 {
      font-size: v-bind('modelStyle.titleFontSize');
      color: v-bind('modelStyle.titleColor');
      font-weight: v-bind('modelStyle.titleFontWeight');
      margin-bottom: 10px;
    }
    .u-tag-p {
      font-size: v-bind('modelStyle.textFontSize');
      color: v-bind('modelStyle.titleColor');
      font-weight: v-bind('modelStyle.titleFontWeight');
    }
  }
  .detail {
    .u-tag-ul {
      display: flex;
      .u-tag-li {
        list-style: none;
        font-size: v-bind('modelStyle.textFontSize');
        font-weight: v-bind('modelStyle.textFontWeight');
        padding-right: 24px;
        height: 18px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: v-bind('modelStyle.textColor');
      }
      .li-border {
        border-right: 2px solid #b4b4b4;
      }
    }
  }
}
</style>
