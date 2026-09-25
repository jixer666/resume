<!-- 荣誉奖项 -->
<template>
  <div class="awards-content u-tag-div">
    <!-- 荣誉奖项 -->
    <div class="awards-list u-tag-div">
      <ul v-for="(item, index) in modelData.LIST" :key="index" class="u-tag-ul">
        <!-- 获奖日期 -->
        <li v-show="modelData.isShow.date" class="start-end-date u-tag-li">
          {{ formatDate(item.date) }}
        </li>
        <!-- 奖项名称 -->
        <li v-show="modelData.isShow.awardsName" class="u-tag-li">
          {{ item.awardsName }}
        </li>
        <!-- 奖项等级 -->
        <li v-show="modelData.isShow.awardsGrade" class="u-tag-li">
          {{ item.awardsGrade }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAWARDS } from '@/interface/model'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IAWARDS
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .awards-content {
  box-sizing: border-box;
  .awards-list {
    display: flex;
    width: 100%;
    flex-direction: column;
    padding-top: 15px;
    box-sizing: border-box;

    .u-tag-ul {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .u-tag-li {
        list-style: none;
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.textColor');
        font-weight: v-bind('modelStyle.textFontWeight');
        letter-spacing: 2px;
      }
      &:not(:last-child) {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
