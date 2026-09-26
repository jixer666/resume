<!-- 教育背景 -->
<template>
  <div class="edu-background u-tag-div">
    <!-- 标题 -->
    <model-title
      :title="modelData.title"
      :iconfont="modelData.iconfont"
      :model-style="modelStyle"
    />
    <!-- 教育背景 -->
    <div class="edu-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="u-tag-div list-item">
        <!-- 日期和学校 -->
        <div class="date-school-box u-tag-div">
          <span v-if="modelData.isShow.date" class="u-tag-span">
            {{ formatDate(item.date) }}
          </span>
          <span v-if="modelData.isShow.schoolName" class="u-tag-span">
            {{ item.schoolName }}
          </span>
          <span v-if="modelData.isShow.degree" class="u-tag-span">
            {{ item.degree }}
          </span>
        </div>
        <!-- 专业 -->
        <p v-if="modelData.isShow.specialized" class="special u-tag-p">
          {{ item.specialized }}
        </p>
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
import ModelTitle from '@/material/ModelTitle/ModelTitle2/ModelTitle.vue'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IEDUBACKGROUND
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .edu-background {
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-bottom: v-bind('modelStyle.mBottom');
  margin-top: v-bind('modelStyle.mTop');
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
      margin-top: var(--entry-mb, 20px);
      .date-school-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: v-bind('modelStyle.titleFontSize');
        color: v-bind('modelStyle.titleColor');
        font-weight: v-bind('modelStyle.titleFontWeight');
        letter-spacing: 2px;
        margin-bottom: 5px;
        & :first-child {
          min-width: 165px;
        }
      }
      .special,
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
