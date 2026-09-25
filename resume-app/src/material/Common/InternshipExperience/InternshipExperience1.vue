<!-- 实习经验 -->
<template>
  <div class="internship-experience-content u-tag-div">
    <!-- 校园经历 -->
    <div class="internship-experience-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="list u-tag-div">
        <ul class="u-tag-ul">
          <!-- 经历时间 -->
          <li v-if="modelData.isShow.date" class="list-title u-tag-li">
            {{ formatDate(item.date) }}
          </li>
          <!-- 公司名称 -->
          <li v-if="modelData.isShow.companyName" class="list-title u-tag-li">
            {{ item.companyName }}
          </li>
          <!-- 主要职责 -->
          <li v-if="modelData.isShow.posts" class="list-title u-tag-li">
            {{ item.posts }}
          </li>
        </ul>
        <!-- 简述 -->
        <div class="job-content u-tag-div">
          <p class="left u-tag-p">
            实习内容
          </p>
          <div class="content-list u-tag-div">
            <ul class="u-tag-ul">
              <li v-for="(list, j) in item.jobContent" :key="j" class="u-tag-li">
                <RichTextView :html="list.content" :model-style="modelStyle" extra-style="letter-spacing:2px" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IINTERNSHIPEXPERIENCE } from '@/interface/model'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IINTERNSHIPEXPERIENCE
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .internship-experience-content {
  box-sizing: border-box;
  .internship-experience-list {
    padding-top: 15px;
    .list {
      display: flex;
      flex-direction: column;
      &:not(:last-child) {
        margin-bottom: 25px;
      }
      .u-tag-ul {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        & :first-child {
          min-width: 165px;
        }
        .list-title {
          list-style: none;
          font-size: v-bind('modelStyle.titleFontSize');
          color: v-bind('modelStyle.titleColor');
          font-weight: v-bind('modelStyle.titleFontWeight');
          letter-spacing: 2px;
        }
      }
      .job-content {
        display: flex;
        .left {
          width: 20%;
          letter-spacing: 2px;
          font-size: v-bind('modelStyle.titleFontSize');
          color: v-bind('modelStyle.titleColor');
          font-weight: v-bind('modelStyle.titleFontWeight');
        }
        .content-list {
          flex: 1;
          .u-tag-ul {
            display: flex;
            flex-direction: column;
            .u-tag-li {
              letter-spacing: 2px;
              font-size: v-bind('modelStyle.textFontSize');
              color: v-bind('modelStyle.textColor');
              font-weight: v-bind('modelStyle.textFontWeight');
              line-height: 1.5;
              text-align: justify;
              &:not(:last-child) {
                margin-bottom: 6px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
