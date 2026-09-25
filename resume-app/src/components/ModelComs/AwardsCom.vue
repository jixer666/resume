<!-- 荣誉奖项 -->
<template>
  <div class="awards u-tag-div">
    <!-- 标题 -->
    <slot name="model-title" />
    <!-- 荣誉奖项 -->
    <div class="awards-list u-tag-div">
      <ul v-for="(item, index) in modelData.LIST" :key="index" class="u-tag-ul">
        <!-- 获奖日期 -->
        <li v-show="modelData.isShow.date" class="u-tag-li">
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
import useGetLineLeft from '@/hooks/material/useTemplate3LeftLine'
import type { IAWARDS } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { formatDate } from '@/utils/common'

const props = defineProps<{
  modelData: IAWARDS
  modelStyle: IMODELSTYLE // 模块样式
}>()
// 模板3左侧竖线
const { left } = useGetLineLeft(props.modelStyle)
</script>

<style lang="scss" scoped>
  .awards {
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-bottom: v-bind('modelStyle.mBottom');
  margin-top: v-bind('modelStyle.mTop');
  box-sizing: border-box;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 1px;
    height: 100%;
    background-color: v-bind('modelStyle.themeColor');
    left: v-bind('left');
    top: 5px;
  }
  .awards-list {
    display: flex;
    width: 100%;
    flex-direction: column;
    margin-top: 25px;

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
