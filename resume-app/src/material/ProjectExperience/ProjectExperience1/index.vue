<!-- 项目经验 -->
<template>
  <div class="project-experience u-tag-div">
    <!-- 标题 -->
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <!-- 校园经历 -->
    <div class="project-experience-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="list u-tag-div">
        <ul class="u-tag-ul">
          <!-- 经历时间 -->
          <li v-if="modelData.isShow.date" class="list-title u-tag-li">
            {{ formatDate(item.date) }}
          </li>
          <!-- 公司名称 -->
          <li v-if="modelData.isShow.projectName" class="list-title u-tag-li">
            {{ item.projectName }}
          </li>
          <!-- 主要职责 -->
          <li v-if="modelData.isShow.posts" class="list-title u-tag-li">
            {{ item.posts }}
          </li>
        </ul>
        <!-- 简述 -->
        <div class="job-content u-tag-div">
          <div class="content-list u-tag-div">
            <ul class="u-tag-ul">
              <li v-if="item.projectContent" class="u-tag-li">
                <RichTextView :html="item.projectContent" :model-style="modelStyle" extra-style="letter-spacing:2px" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IPROJECTEXPERIENCE } from '@/interface/model'
import ModelTitle from '../../ModelTitle/ModelTitle1/ModelTitle1.vue'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IPROJECTEXPERIENCE
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .project-experience {
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  box-sizing: border-box;
  margin-bottom: v-bind('modelStyle.mBottom');
  margin-top: v-bind('modelStyle.mTop');
  .project-experience-list {
    margin-top: 25px;
    .list {
      display: flex;
      flex-direction: column;
      &:not(:last-child) {
        margin-bottom: var(--entry-mb, 25px);
      }
      .u-tag-ul {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
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
          font-weight: bold;
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
