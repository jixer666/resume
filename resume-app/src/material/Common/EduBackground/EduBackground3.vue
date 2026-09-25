<!-- 教育背景 -->
<template>
  <div class="edu-background-content u-tag-div">
    <!-- 教育背景 -->
    <div class="edu-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="u-tag-div list-item">
        <!-- 日期和学校 -->
        <li class="date-school-box u-tag-li">
          <span v-if="modelData.isShow.date" class="start-end-date u-tag-span">
            {{ formatDate(item.date) }}
          </span>
          <span v-if="modelData.isShow.schoolName" class="school-name u-tag-span">
            {{ item.schoolName }}
          </span>
          <!-- 专业 -->
          <span v-if="modelData.isShow.specialized" class="specialized-name u-tag-span">{{
            item.specialized
          }}</span>
          <span v-if="modelData.isShow.degree" class="u-tag-span">
            {{ item.degree }}
          </span>
        </li>
        <!-- 教学经历 -->
        <p v-if="modelData.isShow.majorCourse" class="majorCourse u-tag-p">
          <RichTextView :html="item.majorCourse" :model-style="modelStyle" extra-style="letter-spacing:2px" />
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IEDUBACKGROUND } from '@/interface/model'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IEDUBACKGROUND
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .edu-background-content {
  box-sizing: border-box;
  .edu-list {
    display: flex;
    width: 100%;
    flex-direction: column;

    .list-item {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      padding: 0;
      padding-bottom: 10px;
      margin-bottom: 15px;
      .date-school-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: v-bind('modelStyle.titleFontSize');
        color: v-bind('modelStyle.titleColor');
        font-weight: v-bind('modelStyle.titleFontWeight');
        letter-spacing: 2px;
        margin-bottom: 10px;
        & :first-child {
          min-width: 165px;
        }
        & :last-child {
          width: 100px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .school-name {
          min-width: 165px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .specialized-name {
          min-width: 165px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
      }
      .majorCourse {
        width: 100%;
        /* display: flex;*/
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.textColor');
        font-weight: v-bind('modelStyle.textFontWeight');
        line-height: 18px;
        text-align: justify;
      }
      .special {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
