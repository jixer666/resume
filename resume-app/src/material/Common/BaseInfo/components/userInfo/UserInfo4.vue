<template>
  <div class="user-info u-tag-div">
    <div class="detail u-tag-div">
      <ul class="u-tag-ul">
        <li v-show="isShow.age" class="u-tag-li">
          {{ modelData.age }}岁
        </li>
        <li v-show="isShow.address" class="u-tag-li">
          {{ modelData.address }}
        </li>
        <li v-show="isShow.workService" class="u-tag-li">
          {{ modelData.workService }}年经验
        </li>
        <li v-show="isShow.phoneNumber" class="u-tag-li">
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
  margin-top: 15px;
  .detail {
    .u-tag-ul {
      display: flex;
      flex-direction: column;
      align-items: center;
      .u-tag-li {
        list-style: none;
        font-size: v-bind('modelStyle.textFontSize');
        font-weight: v-bind('modelStyle.textFontWeight');
        height: 18px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: v-bind('modelStyle.textColor');
        margin-bottom: 10px;
      }
    }
  }
}
</style>
